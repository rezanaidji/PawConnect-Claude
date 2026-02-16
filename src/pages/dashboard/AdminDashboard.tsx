import { useEffect, useState } from "react";
import supabase from "../../supabase";
import { Container } from "../../components/common/Container";
import DashboardLayout from "../../components/layout/DashboardLayout";
import UserDataTable from "../../components/ui/UserDataTable";

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

        {loading ? (
          <div className="p-8 text-center">
            <span className="loading loading-spinner loading-md" />
          </div>
        ) : (
          <UserDataTable profiles={profiles} />
        )}
      </Container>
    </DashboardLayout>
  );
};

export default AdminDashboard;
