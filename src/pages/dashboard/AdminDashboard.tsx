import { useEffect, useState } from "react";
import { useSession } from "../../context/SessionContext";
import supabase from "../../supabase";
import { Container } from "../../components/common/Container";
import DashboardLayout from "../../components/layout/DashboardLayout";

interface Profile {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

const AdminDashboard = () => {
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

  return (
    <DashboardLayout>
      <Container className="py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-base-content/60">View all registered users.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stat-card">
            <p className="text-sm text-base-content/60 mb-1">Total Users</p>
            <p className="text-3xl font-bold">{profiles.length}</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-base-content/60 mb-1">Admins</p>
            <p className="text-3xl font-bold">
              {profiles.filter((p) => p.role === "admin" || p.role === "super_admin").length}
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
          <div className="p-6 border-b border-base-300">
            <h2 className="text-xl font-bold">All Users</h2>
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200">
                  {profiles.map((profile) => (
                    <tr key={profile.id} className="hover:bg-base-200/30 transition-colors">
                      <td className="px-6 py-4 text-sm">{profile.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                          profile.role === "super_admin"
                            ? "bg-error/10 text-error"
                            : profile.role === "admin"
                            ? "bg-warning/10 text-warning"
                            : "bg-primary/10 text-primary"
                        }`}>
                          {profile.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-base-content/60">
                        {new Date(profile.created_at).toLocaleDateString()}
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

export default AdminDashboard;
