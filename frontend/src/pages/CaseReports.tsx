import { useQuery } from "@tanstack/react-query";
import { casesService } from "../services/cases";
import { useAuth } from "../hooks/useAuth";
import { Folder } from "lucide-react";
import { useState } from "react";
import CaseTreeNode from "../components/CaseTreeNode";

const CaseReportsPage = () => {
  const { user } = useAuth();
  const [expandedCases, setExpandedCases] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const casesQuery = useQuery({
    queryKey: ["cases", "reports"],
    queryFn: () => casesService.list({ userId: user?.id, take: 100 }),
  });

  const toggleCase = (caseId: string) => {
    const newExpanded = new Set(expandedCases);
    if (newExpanded.has(caseId)) {
      newExpanded.delete(caseId);
    } else {
      newExpanded.add(caseId);
    }
    setExpandedCases(newExpanded);
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Case Reports</h1>
        <p className="text-gray-600 mt-1">View your assigned cases in tree structure</p>
      </div>

      {casesQuery.isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading cases...</p>
        </div>
      )}

      {casesQuery.data?.data.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No cases assigned</p>
        </div>
      )}

      {/* Tree Structure */}
      <div className="space-y-2">
        {casesQuery.data?.data.map((case_) => (
          <CaseTreeNode
            key={case_.id}
            case_={case_}
            isExpanded={expandedCases.has(case_.id)}
            expandedSections={expandedSections}
            onToggleCase={toggleCase}
            onToggleSection={toggleSection}
          />
        ))}
      </div>
    </div>
  );
};

export default CaseReportsPage;

