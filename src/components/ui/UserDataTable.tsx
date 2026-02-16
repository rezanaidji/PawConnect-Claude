import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ListFilter, Columns, Search } from "lucide-react";

interface Profile {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

type ColumnKey = "email" | "role" | "created_at";

interface UserDataTableProps {
  profiles: Profile[];
}

const roleColors: Record<string, string> = {
  super_admin: "bg-red-500",
  admin: "bg-yellow-500",
  user: "bg-green-500",
};

const allColumns: { key: ColumnKey; label: string }[] = [
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "created_at", label: "Joined" },
];

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: "easeInOut" as const,
    },
  }),
};

const UserDataTable = ({ profiles }: UserDataTableProps) => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [visibleColumns, setVisibleColumns] = useState<Set<ColumnKey>>(
    new Set(allColumns.map((c) => c.key))
  );
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [colDropdownOpen, setColDropdownOpen] = useState(false);

  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      const searchMatch =
        search === "" ||
        p.email.toLowerCase().includes(search.toLowerCase());
      const roleMatch =
        roleFilter === "all" || p.role === roleFilter;
      return searchMatch && roleMatch;
    });
  }, [profiles, search, roleFilter]);

  const toggleColumn = (key: ColumnKey) => {
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 gap-3">
          {/* Search */}
          <div className="relative max-w-xs flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              placeholder="Filter by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered input-sm w-full pl-9"
            />
          </div>

          {/* Role filter dropdown */}
          <div className="relative">
            <button
              className="btn btn-outline btn-sm gap-2"
              onClick={() => {
                setRoleDropdownOpen((v) => !v);
                setColDropdownOpen(false);
              }}
            >
              <ListFilter size={16} />
              Role
            </button>
            {roleDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setRoleDropdownOpen(false)} />
                <div className="absolute z-20 mt-1 w-44 rounded-lg border border-base-300 bg-base-100 shadow-lg py-1">
                  <p className="px-3 py-1.5 text-xs font-semibold text-base-content/50">Filter by Role</p>
                  <div className="border-t border-base-200 my-1" />
                  {[
                    { value: "all", label: "All" },
                    { value: "super_admin", label: "Super Admin" },
                    { value: "admin", label: "Admin" },
                    { value: "user", label: "User" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      className={`flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-base-200 transition-colors ${
                        roleFilter === opt.value ? "font-semibold" : ""
                      }`}
                      onClick={() => {
                        setRoleFilter(opt.value);
                        setRoleDropdownOpen(false);
                      }}
                    >
                      <span className={`size-3.5 rounded border border-base-300 flex items-center justify-center ${
                        roleFilter === opt.value ? "bg-primary border-primary" : ""
                      }`}>
                        {roleFilter === opt.value && (
                          <svg className="size-2.5 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Column toggle dropdown */}
        <div className="relative">
          <button
            className="btn btn-outline btn-sm gap-2"
            onClick={() => {
              setColDropdownOpen((v) => !v);
              setRoleDropdownOpen(false);
            }}
          >
            <Columns size={16} />
            Columns
          </button>
          {colDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setColDropdownOpen(false)} />
              <div className="absolute right-0 z-20 mt-1 w-44 rounded-lg border border-base-300 bg-base-100 shadow-lg py-1">
                <p className="px-3 py-1.5 text-xs font-semibold text-base-content/50">Toggle Columns</p>
                <div className="border-t border-base-200 my-1" />
                {allColumns.map((col) => (
                  <button
                    key={col.key}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-base-200 transition-colors capitalize"
                    onClick={() => toggleColumn(col.key)}
                  >
                    <span className={`size-3.5 rounded border border-base-300 flex items-center justify-center ${
                      visibleColumns.has(col.key) ? "bg-primary border-primary" : ""
                    }`}>
                      {visibleColumns.has(col.key) && (
                        <svg className="size-2.5 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    {col.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-base-300 bg-base-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200/50">
                {allColumns
                  .filter((col) => visibleColumns.has(col.key))
                  .map((col) => (
                    <th key={col.key} className="text-sm font-medium text-base-content/60">
                      {col.label}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {filteredProfiles.length > 0 ? (
                filteredProfiles.map((profile, index) => (
                  <motion.tr
                    key={profile.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={rowVariants}
                    className="border-b border-base-200 transition-colors hover:bg-base-200/30"
                  >
                    {visibleColumns.has("email") && (
                      <td className="font-medium text-sm">{profile.email}</td>
                    )}
                    {visibleColumns.has("role") && (
                      <td>
                        <span
                          className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full text-white capitalize ${
                            roleColors[profile.role] || "bg-gray-500"
                          }`}
                        >
                          {profile.role.replace("_", " ")}
                        </span>
                      </td>
                    )}
                    {visibleColumns.has("created_at") && (
                      <td className="text-sm text-base-content/60">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </td>
                    )}
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={visibleColumns.size}
                    className="h-24 text-center text-base-content/50"
                  >
                    No results.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDataTable;
