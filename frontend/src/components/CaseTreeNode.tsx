import { useQuery } from "@tanstack/react-query";
import { ChevronRight, ChevronDown, FileText, CheckCircle, Clock, AlertCircle, Folder, File } from "lucide-react";
import { tasksService } from "../services/tasks";
import { documentsService } from "../services/documents";
import type { Case } from "../types";

interface CaseTreeNodeProps {
  case_: Case;
  isExpanded: boolean;
  expandedSections: Set<string>;
  onToggleCase: (caseId: string) => void;
  onToggleSection: (sectionId: string) => void;
}

const CaseTreeNode = ({
  case_,
  isExpanded,
  expandedSections,
  onToggleCase,
  onToggleSection,
}: CaseTreeNodeProps) => {
  const tasksQuery = useQuery({
    queryKey: ["tasks", case_.id],
    queryFn: () => tasksService.list({ caseId: case_.id }),
    enabled: isExpanded,
  });

  const documentsQuery = useQuery({
    queryKey: ["documents", case_.id],
    queryFn: () => documentsService.list({ caseId: case_.id }),
    enabled: isExpanded,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DONE":
      case "CLOSED":
      case "SETTLED":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "IN_PROGRESS":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "BLOCKED":
      case "AT_RISK":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      LOW: "bg-gray-100 text-gray-800",
      MEDIUM: "bg-blue-100 text-blue-800",
      HIGH: "bg-orange-100 text-orange-800",
      CRITICAL: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          colors[priority as keyof typeof colors] || colors.MEDIUM
        }`}
      >
        {priority}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Case Root */}
      <div
        className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => onToggleCase(case_.id)}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          )}
          <Folder className="w-5 h-5 text-primary-600" />
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-gray-900">{case_.title}</h3>
              {getStatusIcon(case_.status)}
              <span className="text-xs text-gray-500">({case_.caseNumber})</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Client: {case_.clientName}</p>
          </div>
          <div className="flex items-center gap-2">
            {getPriorityBadge(case_.priority)}
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
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
        </div>
      </div>

      {/* Case Details (Expanded) */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Case Description */}
          {case_.description && (
            <div className="ml-8 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">{case_.description}</p>
            </div>
          )}

          {/* Documents Section */}
          <div className="ml-8">
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-primary-600"
              onClick={() => onToggleSection(`${case_.id}-documents`)}
            >
              {expandedSections.has(`${case_.id}-documents`) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <FileText className="w-4 h-4" />
              <span className="font-medium text-gray-900">
                Documents ({documentsQuery.data?.pagination.total || 0})
              </span>
            </div>
            {expandedSections.has(`${case_.id}-documents`) && (
              <div className="ml-6 mt-2 space-y-2">
                {documentsQuery.isLoading && (
                  <p className="text-sm text-gray-500">Loading documents...</p>
                )}
                {documentsQuery.data?.data.length === 0 && (
                  <p className="text-sm text-gray-500">No documents</p>
                )}
                {documentsQuery.data?.data.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <File className="w-4 h-4 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{doc.originalName}</p>
                      <p className="text-xs text-gray-500">
                        {doc.documentType} • {(doc.fileSize / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tasks Section */}
          <div className="ml-8">
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-primary-600"
              onClick={() => onToggleSection(`${case_.id}-tasks`)}
            >
              {expandedSections.has(`${case_.id}-tasks`) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium text-gray-900">
                Tasks ({tasksQuery.data?.pagination.total || 0})
              </span>
            </div>
            {expandedSections.has(`${case_.id}-tasks`) && (
              <div className="ml-6 mt-2 space-y-2">
                {tasksQuery.isLoading && (
                  <p className="text-sm text-gray-500">Loading tasks...</p>
                )}
                {tasksQuery.data?.data.length === 0 && (
                  <p className="text-sm text-gray-500">No tasks</p>
                )}
                {tasksQuery.data?.data.map((task) => (
                  <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        {getStatusIcon(task.status)}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{task.title}</p>
                          {task.description && (
                            <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(task.priority)}
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            task.status === "DONE"
                              ? "bg-green-100 text-green-800"
                              : task.status === "IN_PROGRESS"
                              ? "bg-blue-100 text-blue-800"
                              : task.status === "BLOCKED"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {task.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                    {task.dueDate && (
                      <p className="text-xs text-gray-500 mt-2">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseTreeNode;

