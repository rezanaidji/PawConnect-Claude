import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import supabase from "../../supabase";
import { Container } from "../../components/common/Container";
import { Button } from "../../components/common/Button";

interface ProfileForm {
  display_name: string;
  bio: string;
  avatar_url: string;
  phone_number: string;
  location: string;
  dog_name: string;
  dog_breed: string;
  years_as_owner: number;
}

const initialForm: ProfileForm = {
  display_name: "",
  bio: "",
  avatar_url: "",
  phone_number: "",
  location: "",
  dog_name: "",
  dog_breed: "",
  years_as_owner: 0,
};

const ProfileSettingsPage = () => {
  const { session, role } = useSession();
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session?.user?.id]);

  // Auto-dismiss toast after 4 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("display_name, bio, avatar_url, phone_number, location, dog_name, dog_breed, years_as_owner")
      .eq("id", session!.user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    } else if (data) {
      setForm({
        display_name: data.display_name || "",
        bio: data.bio || "",
        avatar_url: data.avatar_url || "",
        phone_number: data.phone_number || "",
        location: data.location || "",
        dog_name: data.dog_name || "",
        dog_breed: data.dog_breed || "",
        years_as_owner: data.years_as_owner ?? 0,
      });
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "years_as_owner" ? parseInt(value) || 0 : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: form.display_name,
        bio: form.bio,
        avatar_url: form.avatar_url,
        phone_number: form.phone_number,
        location: form.location,
        dog_name: form.dog_name,
        dog_breed: form.dog_breed,
        years_as_owner: form.years_as_owner,
      })
      .eq("id", session!.user.id);

    if (error) {
      console.error("Error saving profile:", error);
      setToast({ type: "error", message: "Failed to save profile: " + error.message });
    } else {
      setToast({ type: "success", message: "Profile saved successfully!" });
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const dashboardPath =
    role === "super_admin" ? "/super-admin/dashboard" :
    role === "admin" ? "/admin/dashboard" : "/dashboard";

  return (
    <main className="min-h-screen bg-base-200">
      {/* Nav */}
      <nav className="bg-base-100 shadow-sm border-b border-base-300">
        <Container className="flex items-center justify-between py-4">
          <Link to="/" className="text-xl font-bold gradient-text">
            PawConnect AI
          </Link>
          <div className="flex items-center gap-4">
            <Link to={dashboardPath}>
              <Button variant="ghost" size="sm">Dashboard</Button>
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

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-2">
          <div className={`px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 ${
            toast.type === "success"
              ? "bg-success text-success-content"
              : "bg-error text-error-content"
          }`}>
            {toast.type === "success" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {toast.message}
          </div>
        </div>
      )}

      {/* Content */}
      <Container size="md" className="py-10">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-base-content/60 mb-8">Update your personal information and dog details.</p>

        {loading ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="bg-base-100 rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-base-content/70 mb-1.5">
                    Display Name
                  </label>
                  <input
                    name="display_name"
                    value={form.display_name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-base-content/70 mb-1.5">
                    Phone Number <span className="text-error">*</span>
                  </label>
                  <input
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className={`input-field ${errors.phone_number ? "border-error focus:border-error focus:ring-error/20" : ""}`}
                  />
                  {errors.phone_number && (
                    <p className="text-error text-sm mt-1">{errors.phone_number}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-base-content/70 mb-1.5">
                    Location / City
                  </label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Miami, FL"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-base-content/70 mb-1.5">
                    Avatar URL
                  </label>
                  <input
                    name="avatar_url"
                    value={form.avatar_url}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.jpg"
                    className="input-field"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-base-content/70 mb-1.5">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Tell us a little about yourself..."
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Dog Information */}
            <div className="bg-base-100 rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6">Dog Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-base-content/70 mb-1.5">
                    Dog's Name
                  </label>
                  <input
                    name="dog_name"
                    value={form.dog_name}
                    onChange={handleChange}
                    placeholder="Buddy"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-base-content/70 mb-1.5">
                    Dog's Breed
                  </label>
                  <input
                    name="dog_breed"
                    value={form.dog_breed}
                    onChange={handleChange}
                    placeholder="Golden Retriever"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-base-content/70 mb-1.5">
                    Years as Dog Owner
                  </label>
                  <input
                    name="years_as_owner"
                    type="number"
                    min={0}
                    value={form.years_as_owner}
                    onChange={handleChange}
                    placeholder="0"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Link to={dashboardPath}>
                <Button variant="ghost" size="md">Cancel</Button>
              </Link>
              <Button variant="primary" size="md" type="submit" isLoading={saving}>
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Container>
    </main>
  );
};

export default ProfileSettingsPage;
