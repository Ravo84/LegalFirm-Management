import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { casesService } from "../services/cases";
import { documentsService } from "../services/documents";
import { tasksService } from "../services/tasks";
import { ArrowLeft, Upload, FileText, CheckCircle, Clock, AlertCircle, Download, Trash2, Plus } from "lucide-react";
import { useState } from "react";

const CaseDetailPage = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const caseQuery = useQuery({
    queryKey: ["case", caseId],
    queryFn: () => casesService.get(caseId!),
    enabled: !!caseId,
  });

  const documentsQuery = useQuery({
    queryKey: ["documents", caseId],
    queryFn: () => documentsService.list({ caseId }),
    enabled: !!caseId,
  });

  const tasksQuery = useQuery({
    queryKey: ["tasks", caseId],
    queryFn: () => tasksService.list({ caseId }),
    enabled: !!caseId,
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => documentsService.upload(file, caseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", caseId] });
      setShowUploadModal(false);
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: documentsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", caseId] });
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: tasksService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", caseId] });
      setShowTaskModal(false);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => tasksService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", caseId] });
    },
  });

  const handleFileUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = (formData.get("file") as File) || null;
    const description = formData.get("description") as string;

    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const handleCreateTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createTaskMutation.mutate({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      status: (formData.get("status") as any) || "TO_DO",
      priority: (formData.get("priority") as any) || "MEDIUM",
      caseId: caseId!,
    });
  };

  const handleDownload = async (documentId: string, fileName: string) => {
    try {
      const blob = await documentsService.download(documentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DONE":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "IN_PROGRESS":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "BLOCKED":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText className="w-5 h-5 text-red-600" />;
      case "IMAGE":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "VIDEO":
        return <FileText className="w-5 h-5 text-purple-600" />;
      case "AUDIO":
        return <FileText className="w-5 h-5 text-green-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  if (!caseQuery.data) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const case_ = caseQuery.data;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/cases")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Cases
      </button>

      {/* Case Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{case_.title}</h1>
            <p className="text-gray-600 mt-1">Case Number: {case_.caseNumber}</p>
            <p className="text-gray-600">Client: {case_.clientName}</p>
          </div>
          <span
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              case_.status === "OPEN" || case_.status === "IN_PROGRESS"
                ? "bg-blue-100 text-blue-800"
                : case_.status === "CLOSED" || case_.status === "SETTLED"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {case_.status.replace("_", " ")}
          </span>
        </div>
        {case_.description && <p className="text-gray-700">{case_.description}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Documents Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Documents</h2>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </div>
          <div className="space-y-3">
            {documentsQuery.data?.data.map((doc) => (
              <div key={doc.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getDocumentIcon(doc.documentType)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{doc.originalName}</p>
                    <p className="text-sm text-gray-500">
                      {(doc.fileSize / 1024).toFixed(2)} KB • {doc.documentType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(doc.id, doc.originalName)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteDocumentMutation.mutate(doc.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {documentsQuery.data?.data.length === 0 && (
              <p className="text-center text-gray-500 py-8">No documents uploaded yet</p>
            )}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
            <button
              onClick={() => setShowTaskModal(true)}
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
          <div className="space-y-3">
            {tasksQuery.data?.data.map((task) => (
              <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(task.status)}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
                    </div>
                  </div>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      updateTaskMutation.mutate({ id: task.id, data: { status: e.target.value } })
                    }
                    className="text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="TO_DO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                    <option value="BLOCKED">Blocked</option>
                  </select>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                  <span>Priority: {task.priority}</span>
                  {task.assignedTo && <span>Assigned to: {task.assignedTo.fullName}</span>}
                </div>
              </div>
            ))}
            {tasksQuery.data?.data.length === 0 && (
              <p className="text-center text-gray-500 py-8">No tasks created yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                <input
                  name="file"
                  type="file"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  accept="*/*"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadMutation.isPending}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {uploadMutation.isPending ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  name="title"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select name="status" className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="TO_DO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                    <option value="BLOCKED">Blocked</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select name="priority" className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createTaskMutation.isPending}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {createTaskMutation.isPending ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseDetailPage;

