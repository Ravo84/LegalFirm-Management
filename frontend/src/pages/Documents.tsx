import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { documentsService } from "../services/documents";
import { casesService } from "../services/cases";
import { Upload, FileText, Download, Trash2, Filter, Search, Image, Video, Music, File } from "lucide-react";

const DocumentsPage = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [caseFilter, setCaseFilter] = useState<string>("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const queryClient = useQueryClient();

  const documentsQuery = useQuery({
    queryKey: ["documents", search, typeFilter, caseFilter],
    queryFn: () =>
      documentsService.list({
        documentType: typeFilter || undefined,
        caseId: caseFilter || undefined,
        take: 100,
      }),
  });

  const casesQuery = useQuery({
    queryKey: ["cases"],
    queryFn: () => casesService.list({ take: 100 }),
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, caseId, description }: { file: File; caseId?: string; description?: string }) =>
      documentsService.upload(file, caseId, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      setShowUploadModal(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: documentsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  const handleFileUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = (formData.get("file") as File) || null;
    const caseId = formData.get("caseId") as string;
    const description = formData.get("description") as string;

    if (file) {
      uploadMutation.mutate({ file, caseId: caseId || undefined, description });
    }
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

  const getDocumentIcon = (type: string) => {
    const iconClass = "w-6 h-6";
    switch (type) {
      case "PDF":
        return <FileText className={`${iconClass} text-red-600`} />;
      case "IMAGE":
        return <Image className={`${iconClass} text-blue-600`} />;
      case "VIDEO":
        return <Video className={`${iconClass} text-purple-600`} />;
      case "AUDIO":
        return <Music className={`${iconClass} text-green-600`} />;
      default:
        return <File className={`${iconClass} text-gray-600`} />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const filteredDocuments = documentsQuery.data?.data.filter((doc) => {
    if (search) {
      return doc.originalName.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-1">Upload and manage all case documents</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Upload className="w-5 h-5" />
          Upload Document
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">All Types</option>
          <option value="PDF">PDF</option>
          <option value="IMAGE">Images</option>
          <option value="VIDEO">Videos</option>
          <option value="AUDIO">Audio</option>
          <option value="DOCUMENT">Documents</option>
          <option value="OTHER">Other</option>
        </select>
        <select
          value={caseFilter}
          onChange={(e) => setCaseFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">All Cases</option>
          {casesQuery.data?.data.map((case_) => (
            <option key={case_.id} value={case_.id}>
              {case_.caseNumber} - {case_.title}
            </option>
          ))}
        </select>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments?.map((doc) => (
          <div key={doc.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {getDocumentIcon(doc.documentType)}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{doc.originalName}</h3>
                  <p className="text-sm text-gray-500">{doc.documentType}</p>
                </div>
              </div>
            </div>
            {doc.description && <p className="text-sm text-gray-600 mb-3">{doc.description}</p>}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>{formatFileSize(doc.fileSize)}</span>
              <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
            </div>
            {doc.case && (
              <div className="mb-4">
                <p className="text-xs text-gray-500">Case:</p>
                <p className="text-sm font-medium text-gray-900">{doc.case.caseNumber}</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownload(doc.id, doc.originalName)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={() => deleteMutation.mutate(doc.id)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDocuments?.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No documents found</p>
        </div>
      )}

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
                <p className="text-xs text-gray-500 mt-1">Supports all file types (PDF, Images, Videos, Audio, etc.)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Associate with Case (optional)</label>
                <select name="caseId" className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">No case association</option>
                  {casesQuery.data?.data.map((case_) => (
                    <option key={case_.id} value={case_.id}>
                      {case_.caseNumber} - {case_.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Add a description for this document..."
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
    </div>
  );
};

export default DocumentsPage;

