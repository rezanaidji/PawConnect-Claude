import { Link } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import supabase from "../../supabase";
import { Container } from "../../components/common/Container";
import { Button } from "../../components/common/Button";

const UserDashboard = () => {
  const { session, role } = useSession();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <main className="min-h-screen bg-base-200">
      <nav className="bg-base-100 shadow-sm border-b border-base-300">
        <Container className="flex items-center justify-between py-4">
          <Link to="/" className="text-xl font-bold gradient-text">
            PawConnect AI
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/settings/profile">
              <Button variant="ghost" size="sm">Settings</Button>
            </Link>
            <span className="text-sm text-base-content/70">{session?.user.email}</span>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary capitalize">
              {role?.replace("_", " ")}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </Container>
      </nav>

      <Container className="py-10">
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-base-content/60 mb-8">Here's your dashboard overview.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stat-card">
            <p className="text-sm text-base-content/60 mb-1">Role</p>
            <p className="text-2xl font-bold capitalize">{role?.replace("_", " ")}</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-base-content/60 mb-1">Email</p>
            <p className="text-lg font-medium truncate">{session?.user.email}</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-base-content/60 mb-1">Member Since</p>
            <p className="text-lg font-medium">
              {session?.user.created_at
                ? new Date(session.user.created_at).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="feature-card">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/ai-chat">
              <Button variant="primary" size="sm">AI Chat</Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="sm">Home</Button>
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
};

export default UserDashboard;
