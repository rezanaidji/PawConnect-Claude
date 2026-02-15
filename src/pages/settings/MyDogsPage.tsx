import { useEffect, useRef, useState } from "react";
import { useSession } from "../../context/SessionContext";
import supabase from "../../supabase";
import { Container } from "../../components/common/Container";
import { Button } from "../../components/common/Button";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Plus, Pencil, Trash2, X, ImagePlus, PawPrint } from "lucide-react";

interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  notes: string;
  photo_url: string;
}

interface DogForm {
  name: string;
  breed: string;
  age: number;
  notes: string;
}

interface BreedOption {
  id: number;
  name: string;
  group_name: string;
}

const emptyForm: DogForm = { name: "", breed: "", age: 0, notes: "" };

const MyDogsPage = () => {
  const { session } = useSession();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [breeds, setBreeds] = useState<BreedOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingDogId, setUploadingDogId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // null = not editing, "new" = adding, string = editing that dog's id
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DogForm>(emptyForm);

  useEffect(() => {
    fetchBreeds();
    if (session?.user?.id) fetchDogs();
  }, [session?.user?.id]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const fetchDogs = async () => {
    const { data, error } = await supabase
      .from("dogs")
      .select("id, name, breed, age, notes, photo_url")
      .eq("owner_id", session!.user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching dogs:", error);
    } else {
      setDogs(data || []);
    }
    setLoading(false);
  };

  const fetchBreeds = async () => {
    const { data, error } = await supabase
      .from("dog_breeds")
      .select("id, name, group_name")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching breeds:", error);
    } else {
      setBreeds(data || []);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) || 0 : value,
    }));
  };

  const startAdd = () => {
    setEditingId("new");
    setForm(emptyForm);
  };

  const startEdit = (dog: Dog) => {
    setEditingId(dog.id);
    setForm({ name: dog.name, breed: dog.breed, age: dog.age, notes: dog.notes });
  };

  const cancel = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setToast({ type: "error", message: "Dog name is required." });
      return;
    }

    setSaving(true);

    if (editingId === "new") {
      const { error } = await supabase.from("dogs").insert({
        owner_id: session!.user.id,
        name: form.name,
        breed: form.breed,
        age: form.age,
        notes: form.notes,
      });
      if (error) {
        setToast({ type: "error", message: "Failed to add dog: " + error.message });
      } else {
        setToast({ type: "success", message: "Dog added successfully!" });
      }
    } else {
      const { error } = await supabase
        .from("dogs")
        .update({ name: form.name, breed: form.breed, age: form.age, notes: form.notes })
        .eq("id", editingId!);
      if (error) {
        setToast({ type: "error", message: "Failed to update dog: " + error.message });
      } else {
        setToast({ type: "success", message: "Dog updated successfully!" });
      }
    }

    setSaving(false);
    setEditingId(null);
    setForm(emptyForm);
    fetchDogs();
  };

  const handleDelete = async (dog: Dog) => {
    if (!confirm(`Are you sure you want to remove ${dog.name}?`)) return;

    // Delete photo from storage if exists
    if (dog.photo_url) {
      const userId = session!.user.id;
      const { data: files } = await supabase.storage.from("dog-photos").list(`${userId}/${dog.id}`);
      if (files && files.length > 0) {
        await supabase.storage
          .from("dog-photos")
          .remove(files.map((f) => `${userId}/${dog.id}/${f.name}`));
      }
    }

    const { error } = await supabase.from("dogs").delete().eq("id", dog.id);
    if (error) {
      setToast({ type: "error", message: "Failed to delete dog: " + error.message });
    } else {
      setToast({ type: "success", message: "Dog removed." });
      fetchDogs();
    }
  };

  const handlePhotoUpload = async (dogId: string, e: React.ChangeEvent<HTMLInputElement>) => {
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

    setUploadingDogId(dogId);
    const userId = session!.user.id;
    const ext = file.name.split(".").pop();
    const filePath = `${userId}/${dogId}/photo.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("dog-photos")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setToast({ type: "error", message: "Upload failed: " + uploadError.message });
      setUploadingDogId(null);
      return;
    }

    const { data: urlData } = supabase.storage.from("dog-photos").getPublicUrl(filePath);
    const publicUrl = urlData.publicUrl + "?t=" + Date.now();

    const { error: updateError } = await supabase
      .from("dogs")
      .update({ photo_url: publicUrl })
      .eq("id", dogId);

    if (updateError) {
      setToast({ type: "error", message: "Failed to save photo: " + updateError.message });
    } else {
      setToast({ type: "success", message: "Photo updated!" });
      fetchDogs();
    }
    setUploadingDogId(null);
  };

  const handleRemovePhoto = async (dog: Dog) => {
    const userId = session!.user.id;
    const { data: files } = await supabase.storage.from("dog-photos").list(`${userId}/${dog.id}`);
    if (files && files.length > 0) {
      await supabase.storage
        .from("dog-photos")
        .remove(files.map((f) => `${userId}/${dog.id}/${f.name}`));
    }
    await supabase.from("dogs").update({ photo_url: "" }).eq("id", dog.id);
    setToast({ type: "success", message: "Photo removed." });
    fetchDogs();
  };

  const renderForm = () => (
    <div className="w-full bg-base-100 rounded-xl border border-base-300 shadow-lg shadow-black/5 overflow-hidden">
      {/* Header */}
      <div className="border-b border-base-300 px-6 py-4">
        <h2 className="text-base font-semibold leading-none tracking-tight">
          {editingId === "new" ? "Add a new dog" : "Edit dog"}
        </h2>
        <p className="text-sm text-base-content/50 mt-1.5">
          {editingId === "new"
            ? "Fill in your dog's details. You can add a photo after saving."
            : "Update your dog's information."}
        </p>
      </div>

      {/* Body */}
      <div className="px-6 py-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-1.5">
            <label htmlFor="dog-name" className="text-sm font-medium">
              Name <span className="text-error">*</span>
            </label>
            <input
              id="dog-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Buddy"
              className="h-10 w-full rounded-lg border border-base-300 bg-base-100 px-3 py-2 text-sm placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>
          <div className="flex-1 space-y-1.5">
            <label htmlFor="dog-breed" className="text-sm font-medium">Breed</label>
            <select
              id="dog-breed"
              name="breed"
              value={form.breed}
              onChange={handleChange}
              className="h-10 w-full rounded-lg border border-base-300 bg-base-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            >
              <option value="">-- Select a breed --</option>
              {(() => {
                const groups = [...new Set(breeds.map((b) => b.group_name))];
                return groups.map((group) => (
                  <optgroup key={group} label={group || "Other"}>
                    {breeds
                      .filter((b) => b.group_name === group)
                      .map((b) => (
                        <option key={b.id} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                  </optgroup>
                ));
              })()}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-1.5">
            <label htmlFor="dog-age" className="text-sm font-medium">Age</label>
            <input
              id="dog-age"
              name="age"
              type="number"
              min={0}
              value={form.age}
              onChange={handleChange}
              placeholder="0"
              className="h-10 w-full rounded-lg border border-base-300 bg-base-100 px-3 py-2 text-sm placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>
          <div className="flex-1 space-y-1.5">
            <label htmlFor="dog-notes" className="text-sm font-medium">Notes</label>
            <input
              id="dog-notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Any special notes..."
              className="h-10 w-full rounded-lg border border-base-300 bg-base-100 px-3 py-2 text-sm placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-base-300 px-6 py-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={cancel}
          className="h-9 px-4 rounded-lg border border-base-300 bg-base-100 text-sm font-medium text-base-content/70 shadow-sm shadow-black/5 hover:bg-base-200 transition"
        >
          Cancel
        </button>
        <Button variant="primary" size="sm" onClick={handleSave} isLoading={saving}>
          {editingId === "new" ? "Add Dog" : "Save Changes"}
        </Button>
      </div>
    </div>
  );

  const renderDogCard = (dog: Dog) => {
    const isUploading = uploadingDogId === dog.id;

    return (
      <div
        key={dog.id}
        className="w-full bg-base-100 rounded-xl border border-base-300 shadow-lg shadow-black/5 overflow-hidden"
      >
        {/* Gradient banner */}
        <div
          className="h-24 relative"
          style={{
            background:
              "linear-gradient(135deg, rgba(251,146,60,0.7) 0%, rgba(244,114,182,0.7) 50%, rgba(168,85,247,0.6) 100%)",
          }}
        />

        {/* Avatar */}
        <div className="-mt-10 px-6">
          <div className="relative inline-flex size-20 items-center justify-center overflow-hidden rounded-full border-4 border-base-100 bg-base-200 shadow-sm shadow-black/10">
            {dog.photo_url ? (
              <img
                src={dog.photo_url}
                className="h-full w-full object-cover"
                alt={dog.name}
              />
            ) : (
              <PawPrint size={28} className="text-base-content/40" />
            )}

            {/* Upload overlay */}
            <button
              type="button"
              onClick={() => fileInputRefs.current[dog.id]?.click()}
              disabled={isUploading}
              className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-colors group cursor-pointer"
              aria-label="Change dog photo"
            >
              <ImagePlus
                size={18}
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </button>

            {/* Loading spinner */}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="loading loading-spinner loading-sm text-white" />
              </div>
            )}

            <input
              type="file"
              ref={(el) => { fileInputRefs.current[dog.id] = el; }}
              onChange={(e) => handlePhotoUpload(dog.id, e)}
              className="hidden"
              accept="image/jpeg,image/png,image/webp,image/gif"
            />
          </div>

          {/* Remove photo link */}
          {dog.photo_url && (
            <button
              type="button"
              onClick={() => handleRemovePhoto(dog)}
              className="ml-3 inline-flex items-center gap-1 text-xs text-error/70 hover:text-error transition-colors"
            >
              <X size={14} /> Remove photo
            </button>
          )}
        </div>

        {/* Dog info */}
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold">{dog.name}</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-base-content/50 mt-1">
            {dog.breed && <span>Breed: {dog.breed}</span>}
            <span>Age: {dog.age}</span>
            {dog.notes && <span>Notes: {dog.notes}</span>}
          </div>
        </div>

        {/* Actions footer */}
        <div className="border-t border-base-300 px-6 py-3 flex justify-end gap-2">
          <button
            onClick={() => startEdit(dog)}
            className="h-8 px-3 rounded-lg border border-base-300 bg-base-100 text-xs font-medium text-base-content/70 shadow-sm shadow-black/5 hover:bg-base-200 transition inline-flex items-center gap-1"
          >
            <Pencil size={14} /> Edit
          </button>
          <button
            onClick={() => handleDelete(dog)}
            className="h-8 px-3 rounded-lg border border-error/30 bg-base-100 text-xs font-medium text-error/70 shadow-sm shadow-black/5 hover:bg-error/10 hover:text-error transition inline-flex items-center gap-1"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    );
  };

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

      <Container size="md" className="py-10">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">My Dogs</h1>
          {editingId === null && (
            <Button variant="primary" size="sm" onClick={startAdd} leftIcon={<Plus size={18} />}>
              Add Dog
            </Button>
          )}
        </div>
        <p className="text-base-content/60 mb-8">Manage your dogs' information and photos.</p>

        {loading ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Add / Edit form */}
            {editingId !== null && renderForm()}

            {/* Dog cards */}
            {dogs.length === 0 && editingId === null && (
              <div className="bg-base-100 rounded-xl border border-base-300 shadow-lg p-10 text-center">
                <PawPrint size={40} className="mx-auto text-base-content/30 mb-3" />
                <p className="text-base-content/50 text-lg">No dogs yet. Add your first dog!</p>
              </div>
            )}

            {dogs.map((dog) => (editingId === dog.id ? null : renderDogCard(dog)))}
          </div>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default MyDogsPage;
