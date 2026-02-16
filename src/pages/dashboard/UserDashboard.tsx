import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import supabase from "../../supabase";
import { Container } from "../../components/common/Container";
import { Button } from "../../components/common/Button";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { PawPrint, MapPin, Phone, Mail, Calendar, Pencil } from "lucide-react";
import ChromaGrid from "../../components/ui/ChromaGrid";

interface Profile {
  display_name: string;
  bio: string;
  avatar_url: string;
  phone_number: string;
  location: string;
}

interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  notes: string;
  photo_url: string;
}

const UserDashboard = () => {
  const { session, role } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      Promise.all([fetchProfile(), fetchDogs()]).then(() => setLoading(false));
    }
  }, [session?.user?.id]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, bio, avatar_url, phone_number, location")
      .eq("id", session!.user.id)
      .single();
    if (data) setProfile(data);
  };

  const fetchDogs = async () => {
    const { data } = await supabase
      .from("dogs")
      .select("id, name, breed, age, notes, photo_url")
      .eq("owner_id", session!.user.id)
      .order("created_at", { ascending: true });
    if (data) setDogs(data);
  };

  const initials = profile?.display_name
    ? profile.display_name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : session?.user.email?.charAt(0).toUpperCase() || "?";

  const memberSince = session?.user.created_at
    ? new Date(session.user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "N/A";

  return (
    <DashboardLayout>
      <Container className="py-10">
        <h1 className="text-3xl font-bold mb-2">Welcome back{profile?.display_name ? `, ${profile.display_name}` : ""}!</h1>
        <p className="text-base-content/60 mb-8">Here's your dashboard overview.</p>

        {loading ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Profile Card */}
            <div className="bg-base-100 rounded-xl border border-base-300 shadow-lg shadow-black/5 overflow-hidden">
              {/* Banner */}
              <div
                className="h-32"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(168,85,247,0.7) 0%, rgba(59,130,246,0.7) 50%, rgba(16,185,129,0.6) 100%)",
                }}
              />

              <div className="px-6 pb-6">
                {/* Avatar + name row */}
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
                  <div className="relative inline-flex size-24 items-center justify-center overflow-hidden rounded-full border-4 border-base-100 bg-base-200 shadow-sm shadow-black/10 flex-shrink-0">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        className="h-full w-full object-cover"
                        alt="Profile"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-base-content/60">{initials}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 sm:pb-1">
                    <h2 className="text-xl font-bold truncate">
                      {profile?.display_name || session?.user.email}
                    </h2>
                    <span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary capitalize">
                      {role?.replace("_", " ")}
                    </span>
                  </div>

                  <Link to="/settings/profile" className="flex-shrink-0 sm:pb-1">
                    <Button variant="outline" size="sm" leftIcon={<Pencil size={14} />}>
                      Edit Profile
                    </Button>
                  </Link>
                </div>

                {/* Bio */}
                {profile?.bio && (
                  <p className="mt-4 text-sm text-base-content/70 leading-relaxed">
                    {profile.bio}
                  </p>
                )}

                {/* Info grid */}
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-base-content/60">
                  <div className="flex items-center gap-1.5">
                    <Mail size={14} className="flex-shrink-0" />
                    <span className="truncate">{session?.user.email}</span>
                  </div>
                  {profile?.phone_number && (
                    <div className="flex items-center gap-1.5">
                      <Phone size={14} className="flex-shrink-0" />
                      <span>{profile.phone_number}</span>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="flex-shrink-0" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="flex-shrink-0" />
                    <span>Member since {memberSince}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* My Dogs Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <PawPrint size={22} className="text-primary" />
                  My Dogs
                  <span className="text-sm font-normal text-base-content/50">({dogs.length})</span>
                </h2>
                <Link to="/settings/my-dogs">
                  <Button variant="outline" size="sm">Manage Dogs</Button>
                </Link>
              </div>

              {dogs.length === 0 ? (
                <div className="bg-base-100 rounded-xl border border-base-300 shadow-lg p-10 text-center">
                  <PawPrint size={40} className="mx-auto text-base-content/20 mb-3" />
                  <p className="text-base-content/50">No dogs registered yet.</p>
                  <Link to="/settings/my-dogs" className="inline-block mt-3">
                    <Button variant="primary" size="sm">Add Your First Dog</Button>
                  </Link>
                </div>
              ) : (
                <ChromaGrid
                  items={dogs.map((dog, i) => {
                    const gradients = [
                      { border: "#F59E0B", gradient: "linear-gradient(145deg, #F59E0B, #000)" },
                      { border: "#EF4444", gradient: "linear-gradient(210deg, #EF4444, #000)" },
                      { border: "#8B5CF6", gradient: "linear-gradient(165deg, #8B5CF6, #000)" },
                      { border: "#10B981", gradient: "linear-gradient(195deg, #10B981, #000)" },
                      { border: "#06B6D4", gradient: "linear-gradient(225deg, #06B6D4, #000)" },
                      { border: "#EC4899", gradient: "linear-gradient(135deg, #EC4899, #000)" },
                    ];
                    const style = gradients[i % gradients.length];
                    return {
                      image: dog.photo_url || "",
                      title: dog.name,
                      subtitle: dog.breed || "Unknown breed",
                      handle: `${dog.age} ${dog.age === 1 ? "year" : "years"} old`,
                      notes: dog.notes || undefined,
                      borderColor: style.border,
                      gradient: style.gradient,
                    };
                  })}
                  columns={dogs.length <= 2 ? dogs.length : 3}
                  radius={250}
                />
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-base-100 rounded-xl border border-base-300 shadow-lg shadow-black/5 p-6">
              <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                <Link to="/ai-chat">
                  <Button variant="primary" size="sm">AI Chat</Button>
                </Link>
                <Link to="/settings/profile">
                  <Button variant="outline" size="sm">Edit Profile</Button>
                </Link>
                <Link to="/settings/my-dogs">
                  <Button variant="outline" size="sm">Manage Dogs</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default UserDashboard;
