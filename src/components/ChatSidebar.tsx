import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  MessageSquare,
  LayoutDashboard,
  ChevronUp,
  LogOut,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useSession } from "../context/SessionContext";
import supabase from "../supabase";

interface ChatSidebarProps {
  messageCount: number;
  onNewChat: () => void;
  className?: string;
}

function ChatSidebar({ messageCount, onNewChat, className }: ChatSidebarProps) {
  const navigate = useNavigate();
  const { session, role } = useSession();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) return;
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", session.user.id)
        .single();
      if (data) {
        setDisplayName(data.display_name || "");
        setAvatarUrl(data.avatar_url || "");
      }
    };
    fetchProfile();
  }, [session?.user?.id]);

  const initials = displayName
    ? displayName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : session?.user.email?.charAt(0).toUpperCase() || "?";

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <motion.aside
      className={cn(
        "h-full flex flex-col backdrop-blur-2xl bg-white/[0.03] border-r border-white/10",
        collapsed ? "w-[68px]" : "w-72",
        "transition-all duration-300",
        className
      )}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Top: New Chat button + collapse toggle */}
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <motion.button
            onClick={onNewChat}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-violet-600/80 to-indigo-600/80 border border-violet-400/30 text-white text-sm font-medium shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all",
              collapsed ? "p-2.5 justify-center" : "flex-1 px-4 py-2.5"
            )}
            title={collapsed ? "New chat" : undefined}
          >
            <Plus size={18} />
            {!collapsed && <span>New chat</span>}
          </motion.button>

          <motion.button
            onClick={() => setCollapsed(!collapsed)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white/80 transition-colors flex-shrink-0"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
          </motion.button>
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl bg-white/[0.06] border border-white/10 text-white/80 hover:bg-white/[0.1] hover:text-white transition-all",
            collapsed ? "p-2.5 justify-center" : "px-3.5 py-3"
          )}
          title={collapsed ? "Your chat" : undefined}
        >
          <div className="relative flex-shrink-0">
            <MessageSquare size={18} className="text-violet-400" />
            {messageCount > 0 && !collapsed && (
              <span className="absolute -top-1.5 -right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
            )}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium truncate">Your chat</p>
              <p className="text-xs text-white/40 truncate">
                {messageCount > 0
                  ? `${messageCount} message${messageCount !== 1 ? "s" : ""}`
                  : "Full history"}
              </p>
            </div>
          )}
        </motion.button>
      </div>

      {/* Bottom: Profile block */}
      <div className="border-t border-white/10 p-3 relative">
        <AnimatePresence>
          {menuOpen && !collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full left-3 right-3 mb-2 bg-white/[0.08] backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl shadow-black/40 overflow-hidden"
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/dashboard");
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-white/70 hover:bg-white/[0.08] hover:text-white transition-colors"
              >
                <LayoutDashboard size={16} />
                <span>Back to Dashboard</span>
              </button>
              <div className="border-t border-white/10" />
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleSignOut();
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400/80 hover:bg-white/[0.08] hover:text-red-400 transition-colors"
              >
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => {
            if (collapsed) {
              navigate("/dashboard");
            } else {
              setMenuOpen(!menuOpen);
            }
          }}
          whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl p-2 transition-colors",
            collapsed ? "justify-center" : ""
          )}
          title={collapsed ? "Back to Dashboard" : undefined}
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0 w-9 h-9 rounded-full overflow-hidden bg-white/10 border border-white/10 flex items-center justify-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                className="h-full w-full object-cover"
                alt="Profile"
              />
            ) : (
              <span className="text-xs font-bold text-white/60">{initials}</span>
            )}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-900" />
          </div>

          {!collapsed && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-white/90 truncate">
                  {displayName || session?.user.email || "User"}
                </p>
                <p className="text-xs text-white/40 capitalize truncate">
                  {role?.replace("_", " ") || "user"}
                </p>
              </div>
              <ChevronUp
                size={16}
                className={cn(
                  "text-white/40 transition-transform duration-200 flex-shrink-0",
                  menuOpen ? "rotate-0" : "rotate-180"
                )}
              />
            </>
          )}
        </motion.button>
      </div>
    </motion.aside>
  );
}

export default ChatSidebar;
