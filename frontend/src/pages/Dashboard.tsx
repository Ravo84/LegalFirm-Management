import { useQuery } from "@tanstack/react-query";
import { casesService } from "../services/cases";
import { tasksService } from "../services/tasks";
import { documentsService } from "../services/documents";
import { usersService } from "../services/users";
import { useAuth } from "../hooks/useAuth";
import { Briefcase, FileText, CheckCircle, Users, TrendingUp, Clock } from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const casesQuery = useQuery({
    queryKey: ["cases"],
    queryFn: () => casesService.list({ take: 100 }),
  });

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: () => tasksService.list({ take: 100 }),
  });

  const documentsQuery = useQuery({
    queryKey: ["documents"],
    queryFn: () => documentsService.list({ take: 100 }),
  });

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => usersService.list({ take: 100 }),
    enabled: isAdmin,
  });

  const stats = {
    totalCases: casesQuery.data?.pagination?.total || 0,
    activeCases:
      casesQuery.data?.data?.filter((c) => c.status === "IN_PROGRESS" || c.status === "OPEN").length || 0,
    totalTasks: tasksQuery.data?.pagination?.total || 0,
    completedTasks:
      tasksQuery.data?.data?.filter((t) => t.status === "DONE").length || 0,
    totalDocuments: documentsQuery.data?.pagination?.total || 0,
    totalEmployees: usersQuery.data?.pagination?.total || 0,
  };

  const myTasks =
    tasksQuery.data?.data?.filter((t) => t.assignedToId === user?.id) || [];
  const myCases =
    casesQuery.data?.data?.filter(
      (c) => c.assignments?.some((a) => a.userId === user?.id) || c.managerId === user?.id
    ) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your legal cases and tasks</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Briefcase}
          label="Total Cases"
          value={isAdmin ? stats.totalCases : myCases.length}
          color="blue"
        />
        <StatCard
          icon={TrendingUp}
          label="Active Cases"
          value={
            isAdmin
              ? stats.activeCases
              : myCases.filter((c) => c.status === "IN_PROGRESS" || c.status === "OPEN").length
          }
          color="green"
        />
        <StatCard icon={CheckCircle} label="My Tasks" value={myTasks.length} color="purple" />
        <StatCard icon={FileText} label="Documents" value={stats.totalDocuments} color="orange" />
      </div>

      {isAdmin && (
        <>
          {/* Admin Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard icon={Users} label="Total Employees" value={stats.totalEmployees} color="indigo" />
            <StatCard icon={Clock} label="Completed Tasks" value={stats.completedTasks} color="teal" />
          </div>

          {/* Employee Task Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Employee Task Overview</h2>
            <div className="space-y-4">
              {usersQuery.data?.data?.map((employee) => {
                const employeeTasks =
                  tasksQuery.data?.data?.filter((t) => t.assignedToId === employee.id) || [];
                const completed = employeeTasks.filter((t) => t.status === "DONE").length;
                const inProgress = employeeTasks.filter((t) => t.status === "IN_PROGRESS").length;
                const todo = employeeTasks.filter((t) => t.status === "TO_DO").length;

                return (
                  <div key={employee.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{employee.fullName}</h3>
                      <span className="text-sm text-gray-500">{employeeTasks.length} tasks</span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-blue-600">{todo} To Do</span>
                      <span className="text-yellow-600">{inProgress} In Progress</span>
                      <span className="text-green-600">{completed} Done</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Recent Cases */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isAdmin ? "Recent Cases" : "My Cases"}
        </h2>
        <div className="space-y-3">
          {(isAdmin ? casesQuery.data?.data ?? [] : myCases ?? [])
            .slice(0, 5)
            .map((case_) => (
              <div key={case_.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{case_.title}</h3>
                    <p className="text-sm text-gray-600">{case_.clientName}</p>
                  </div>
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
            ))}
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
}

const StatCard = ({ icon: Icon, label, value, color }: StatCardProps) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    indigo: "bg-indigo-100 text-indigo-600",
    teal: "bg-teal-100 text-teal-600",
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-lg ${
            colorClasses[color as keyof typeof colorClasses]
          } flex items-center justify-center`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
