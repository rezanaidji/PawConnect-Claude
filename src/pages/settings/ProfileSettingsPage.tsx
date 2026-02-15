import { useEffect, useRef, useState } from "react";
import { useSession } from "../../context/SessionContext";
import supabase from "../../supabase";
import { Button } from "../../components/common/Button";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { ImagePlus, X } from "lucide-react";

interface ProfileForm {
  display_name: string;
  bio: string;
  avatar_url: string;
  phone_number: string;
  location: string;
}

const initialForm: ProfileForm = {
  display_name: "",
  bio: "",
  avatar_url: "",
  phone_number: "",
  location: "",
};

const ProfileSettingsPage = () => {
  const { session } = useSession();
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("display_name, bio, avatar_url, phone_number, location")
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
      });
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setToast({ type: "error", message: "Please upload a JPG, PNG, WebP, or GIF image." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setToast({ type: "error", message: "Image must be less than 5MB." });
      return;
    }

    setUploading(true);
    const userId = session!.user.id;
    const ext = file.name.split(".").pop();
    const filePath = `${userId}/avatar.${ext}`;

    // Upload to Supabase Storage (upsert to overwrite previous)
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setToast({ type: "error", message: "Upload failed: " + uploadError.message });
      setUploading(false);
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const publicUrl = urlData.publicUrl + "?t=" + Date.now(); // cache-bust

    // Save to profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", userId);

    if (updateError) {
      setToast({ type: "error", message: "Failed to save avatar: " + updateError.message });
    } else {
      setForm((prev) => ({ ...prev, avatar_url: publicUrl }));
      setToast({ type: "success", message: "Profile photo updated!" });
    }
    setUploading(false);
  };

  const handleRemoveAvatar = async () => {
    const userId = session!.user.id;

    // List and delete all files in the user's avatar folder
    const { data: files } = await supabase.storage.from("avatars").list(userId);
    if (files && files.length > 0) {
      await supabase.storage
        .from("avatars")
        .remove(files.map((f) => `${userId}/${f.name}`));
    }

    // Clear avatar_url in profile
    await supabase.from("profiles").update({ avatar_url: "" }).eq("id", userId);
    setForm((prev) => ({ ...prev, avatar_url: "" }));
    setToast({ type: "success", message: "Profile photo removed." });
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

  const initials = form.display_name
    ? form.display_name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : session?.user.email?.charAt(0).toUpperCase() || "?";

  return (
    <DashboardLayout>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50">
          <div
            className={`px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 ${
              toast.type === "success"
                ? "bg-success text-success-content"
                : "bg-error text-error-content"
            }`}
          >
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

      <div className="min-h-screen flex items-start justify-center py-10 px-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : (
          <div className="w-full max-w-lg bg-base-100 rounded-xl border border-base-300 shadow-lg shadow-black/5 overflow-hidden">
            {/* Header with title */}
            <div className="border-b border-base-300 px-6 py-4">
              <h1 className="text-base font-semibold leading-none tracking-tight">
                Edit profile
              </h1>
            </div>

            {/* Profile banner */}
            <div
              className="h-32 relative"
              style={{
                background:
                  "linear-gradient(135deg, rgba(168,85,247,0.7) 0%, rgba(59,130,246,0.7) 50%, rgba(16,185,129,0.6) 100%)",
              }}
            />

            {/* Avatar */}
            <div className="-mt-12 px-6">
              <div className="relative inline-flex size-24 items-center justify-center overflow-hidden rounded-full border-4 border-base-100 bg-base-200 shadow-sm shadow-black/10">
                {form.avatar_url ? (
                  <img
                    src={form.avatar_url}
                    className="h-full w-full object-cover"
                    alt="Profile"
                  />
                ) : (
                  <span className="text-2xl font-bold text-base-content/60">
                    {initials}
                  </span>
                )}

                {/* Upload overlay button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-colors group cursor-pointer"
                  aria-label="Change profile picture"
                >
                  <ImagePlus
                    size={20}
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </button>

                {/* Loading spinner during upload */}
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <span className="loading loading-spinner loading-sm text-white" />
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                />
              </div>

              {/* Remove button */}
              {form.avatar_url && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="ml-3 inline-flex items-center gap-1 text-xs text-error/70 hover:text-error transition-colors"
                >
                  <X size={14} /> Remove photo
                </button>
              )}
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-6 space-y-4">
                {/* Display Name */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-1.5">
                    <label htmlFor="display_name" className="text-sm font-medium">
                      Name
                    </label>
                    <input
                      id="display_name"
                      name="display_name"
                      value={form.display_name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="h-10 w-full rounded-lg border border-base-300 bg-base-100 px-3 py-2 text-sm placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label htmlFor="phone_number" className="text-sm font-medium">
                      Phone <span className="text-error">*</span>
                    </label>
                    <input
                      id="phone_number"
                      name="phone_number"
                      value={form.phone_number}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className={`h-10 w-full rounded-lg border bg-base-100 px-3 py-2 text-sm placeholder:text-base-content/40 focus:outline-none focus:ring-2 transition ${
                        errors.phone_number
                          ? "border-error focus:ring-error/30 focus:border-error"
                          : "border-base-300 focus:ring-primary/30 focus:border-primary"
                      }`}
                    />
                    {errors.phone_number && (
                      <p className="text-error text-xs mt-1">{errors.phone_number}</p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label htmlFor="location" className="text-sm font-medium">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Miami, FL"
                    className="h-10 w-full rounded-lg border border-base-300 bg-base-100 px-3 py-2 text-sm placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <label htmlFor="bio" className="text-sm font-medium">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Tell us a little about yourself..."
                    rows={3}
                    maxLength={180}
                    className="w-full rounded-lg border border-base-300 bg-base-100 px-3 py-2 text-sm placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                  />
                  <p className="text-xs text-base-content/40 text-right">
                    {180 - form.bio.length} characters left
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-base-300 px-6 py-4 flex justify-end gap-3">
                <button
                  type="reset"
                  onClick={() => setForm(initialForm)}
                  className="h-9 px-4 rounded-lg border border-base-300 bg-base-100 text-sm font-medium text-base-content/70 shadow-sm shadow-black/5 hover:bg-base-200 transition"
                >
                  Cancel
                </button>
                <Button variant="primary" size="sm" type="submit" isLoading={saving}>
                  Save changes
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProfileSettingsPage;
