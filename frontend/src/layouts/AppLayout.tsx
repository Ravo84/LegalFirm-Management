import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LayoutDashboard, Briefcase, FileText, LogOut, User, Users, FileCheck } from "lucide-react";

const AppLayout = () => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const navigation = [
    { label: "Dashboard", to: "/", icon: LayoutDashboard },
    { label: "Cases", to: "/cases", icon: Briefcase },
    { label: "Documents", to: "/documents", icon: FileText },
    ...(isAdmin
      ? [{ label: "Employees", to: "/admin/employees", icon: Users }]
      : [{ label: "Case Reports", to: "/reports", icon: FileCheck }]),
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-primary-600">Legal Firm</h1>
          <p className="text-sm text-gray-500">Case Management System</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary-50 text-primary-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Welcome back, {user?.firstName}</h2>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

