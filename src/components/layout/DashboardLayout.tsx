import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSession, UserRole } from "../../context/SessionContext";
import supabase from "../../supabase";
import {
  LayoutDashboard,
  MessageSquare,
  User,
  Dog,
  Users,
  Shield,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  PawPrint,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/dashboard",
    roles: ["user", "admin", "super_admin"],
  },
  {
    label: "AI Chat",
    icon: <MessageSquare size={20} />,
    path: "/ai-chat",
    roles: ["user", "admin", "super_admin"],
  },
  {
    label: "Profile",
    icon: <User size={20} />,
    path: "/settings/profile",
    roles: ["user", "admin", "super_admin"],
  },
  {
    label: "My Dogs",
    icon: <Dog size={20} />,
    path: "/settings/my-dogs",
    roles: ["user", "admin", "super_admin"],
  },
  {
    label: "User Management",
    icon: <Users size={20} />,
    path: "/admin/dashboard",
    roles: ["admin", "super_admin"],
  },
  {
    label: "Role & Access Control",
    icon: <Shield size={20} />,
    path: "/super-admin/dashboard",
    roles: ["super_admin"],
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { session, role } = useSession();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const filteredItems = navItems.filter(
    (item) => role && item.roles.includes(role)
  );

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-base-200 flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-base-100 border-r border-base-300 flex flex-col z-40 transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-base-300">
          <PawPrint size={28} className="text-primary flex-shrink-0" />
          {!collapsed && (
            <span className="text-lg font-bold gradient-text truncate">
              PawConnect AI
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-base-content/60 hover:bg-base-200 hover:text-base-content"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-base-300 p-3 space-y-2">
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-base-content/60 hover:bg-base-200 hover:text-base-content transition-all duration-200 w-full"
          >
            {collapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
            {!collapsed && <span>Collapse</span>}
          </button>

          {/* User info */}
          {!collapsed && (
            <div className="px-3 py-2">
              <p className="text-sm font-medium truncate">
                {session?.user.email}
              </p>
              <span className="text-xs text-base-content/50 capitalize">
                {role?.replace("_", " ")}
              </span>
            </div>
          )}

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-error/70 hover:bg-error/10 hover:text-error transition-all duration-200 w-full"
            title={collapsed ? "Sign Out" : undefined}
          >
            <LogOut size={20} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "ml-[72px]" : "ml-64"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
