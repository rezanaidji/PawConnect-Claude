import { useEffect, useState } from "react";
import { useSession, UserRole } from "../../context/SessionContext";
import supabase from "../../supabase";
import { Container } from "../../components/common/Container";
import { Button } from "../../components/common/Button";
import DashboardLayout from "../../components/layout/DashboardLayout";

interface Profile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

const ROLES: UserRole[] = ["user", "admin", "super_admin"];

const SuperAdminDashboard = () => {
  const { session } = useSession();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching profiles:", error);
    } else {
      setProfiles(data || []);
    }
    setLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role: " + error.message);
    } else {
      setProfiles((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, role: newRole } : p))
      );
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete ${email}? This cannot be undone.`)) {
      return;
    }

    const { error } = await supabase.from("profiles").delete().eq("id", userId);

    if (error) {
      console.error("Error deleting profile:", error);
      alert("Failed to delete user: " + error.message);
    } else {
      setProfiles((prev) => prev.filter((p) => p.id !== userId));
    }
  };

  return (
    <DashboardLayout>
      <Container className="py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Role & Access Control</h1>
          <p className="text-base-content/60">Full system control. Manage users, roles, and more.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <p className="text-sm text-base-content/60 mb-1">Total Users</p>
            <p className="text-3xl font-bold">{profiles.length}</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-base-content/60 mb-1">Super Admins</p>
            <p className="text-3xl font-bold">
              {profiles.filter((p) => p.role === "super_admin").length}
            </p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-base-content/60 mb-1">Admins</p>
            <p className="text-3xl font-bold">
              {profiles.filter((p) => p.role === "admin").length}
            </p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-base-content/60 mb-1">Regular Users</p>
            <p className="text-3xl font-bold">
              {profiles.filter((p) => p.role === "user").length}
            </p>
          </div>
        </div>

        <div className="bg-base-100 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-base-300 flex items-center justify-between">
            <h2 className="text-xl font-bold">User Management</h2>
            <Button variant="ghost" size="sm" onClick={fetchProfiles}>
              Refresh
            </Button>
          </div>
          {loading ? (
            <div className="p-8 text-center">
              <span className="loading loading-spinner loading-md" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-base-200/50">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-base-content/60">Email</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-base-content/60">Role</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-base-content/60">Joined</th>
                    <th className="text-right px-6 py-3 text-sm font-medium text-base-content/60">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200">
                  {profiles.map((profile) => (
                    <tr key={profile.id} className="hover:bg-base-200/30 transition-colors">
                      <td className="px-6 py-4 text-sm">{profile.email}</td>
                      <td className="px-6 py-4">
                        <select
                          value={profile.role}
                          onChange={(e) => handleRoleChange(profile.id, e.target.value as UserRole)}
                          disabled={profile.id === session?.user.id}
                          className="px-2 py-1 text-sm rounded-lg border border-base-300 bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r.replace("_", " ")}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-base-content/60">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {profile.id !== session?.user.id && (
                          <button
                            onClick={() => handleDeleteUser(profile.id, profile.email)}
                            className="px-3 py-1 text-sm text-error hover:bg-error/10 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Container>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
