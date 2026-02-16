import supabase from "../supabase";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config";

export interface ChatMessage {
  id?: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  title: string;
  created_at: string;
}

async function getAuthInfo(): Promise<{ token: string; userId: string }> {
  // getUser() forces a server call and refreshes the token if expired
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Please sign in to use the chat.");
  }
  // Now getSession() will have the refreshed token
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  if (!session) {
    throw new Error("Please sign in to use the chat.");
  }
  return { token: session.access_token, userId: user.id };
}

// ── Conversation CRUD ────────────────────────────────────────────────

export async function createConversation(title = "New conversation"): Promise<Conversation> {
  const { userId } = await getAuthInfo();

  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_id: userId, title })
    .select("id, title, created_at, updated_at")
    .single();

  if (error || !data) {
    throw new Error("Failed to create conversation.");
  }
  return data;
}

export async function listConversations(): Promise<Conversation[]> {
  const { userId } = await getAuthInfo();

  const { data, error } = await supabase
    .from("conversations")
    .select("id, title, created_at, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error listing conversations:", error);
    return [];
  }
  return data || [];
}

export async function loadConversationMessages(conversationId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from("chat_history")
    .select("id, role, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error loading conversation messages:", error);
    return [];
  }

  return (data || []).map((msg) => ({
    id: msg.id,
    text: msg.content,
    isUser: msg.role === "user",
    timestamp: new Date(msg.created_at),
  }));
}

export async function deleteConversation(conversationId: string): Promise<void> {
  const { error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", conversationId);

  if (error) {
    throw new Error("Failed to delete conversation.");
  }
}

export async function renameConversation(conversationId: string, title: string): Promise<void> {
  const { error } = await supabase
    .from("conversations")
    .update({ title })
    .eq("id", conversationId);

  if (error) {
    throw new Error("Failed to rename conversation.");
  }
}

// ── Chat messaging ───────────────────────────────────────────────────

export async function sendChatMessage(question: string, conversationId: string): Promise<string> {
  const { token, userId } = await getAuthInfo();

  const res = await fetch(`${SUPABASE_URL}/functions/v1/chat-response`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ question, user_id: userId, conversation_id: conversationId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `Request failed (${res.status})`);
  }

  const data = await res.json();
  return data.answer;
}

// ── Stats ────────────────────────────────────────────────────────────

export async function getChatStats(): Promise<{ messageCount: number; lastActivity: string | null }> {
  const { userId } = await getAuthInfo();

  const { data, error } = await supabase
    .from("chat_history")
    .select("created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    return { messageCount: 0, lastActivity: null };
  }

  const { count } = await supabase
    .from("chat_history")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  return {
    messageCount: count || 0,
    lastActivity: data?.[0]?.created_at || null,
  };
}

// ── Public chat (no auth, landing page context) ─────────────────────

export async function sendPublicChatMessage(question: string): Promise<string> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/chat-public`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `Request failed (${res.status})`);
  }

  const data = await res.json();
  return data.answer;
}

// ── Knowledge base ───────────────────────────────────────────────────

export async function uploadDocumentToKnowledgeBase(
  title: string,
  content: string
): Promise<void> {
  const { token, userId } = await getAuthInfo();

  const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ title, content, uploaded_by: userId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `Upload failed (${res.status})`);
  }
}

// ── Documents management ─────────────────────────────────────────────

export async function listDocuments(): Promise<Document[]> {
  const { userId } = await getAuthInfo();

  const { data, error } = await supabase
    .from("documents")
    .select("id, title, created_at")
    .eq("uploaded_by", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error listing documents:", error);
    return [];
  }
  return data || [];
}

export async function deleteDocument(documentId: string): Promise<void> {
  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", documentId);

  if (error) {
    throw new Error("Failed to delete document.");
  }
}
