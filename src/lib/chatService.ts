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

export async function sendChatMessage(question: string): Promise<string> {
  const { token, userId } = await getAuthInfo();

  const res = await fetch(`${SUPABASE_URL}/functions/v1/chat-response`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ question, user_id: userId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `Request failed (${res.status})`);
  }

  const data = await res.json();
  return data.answer;
}

export async function loadChatHistory(): Promise<ChatMessage[]> {
  const { userId } = await getAuthInfo();

  const { data, error } = await supabase
    .from("chat_history")
    .select("id, role, content, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error loading chat history:", error);
    return [];
  }

  return (data || []).map((msg) => ({
    id: msg.id,
    text: msg.content,
    isUser: msg.role === "user",
    timestamp: new Date(msg.created_at),
  }));
}

export async function clearChatHistory(): Promise<void> {
  const { userId } = await getAuthInfo();

  const { error } = await supabase
    .from("chat_history")
    .delete()
    .eq("user_id", userId);

  if (error) {
    throw new Error("Failed to clear chat history.");
  }
}

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

export async function uploadDocumentToKnowledgeBase(
  title: string,
  content: string
): Promise<void> {
  const { token } = await getAuthInfo();

  const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ title, content }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `Upload failed (${res.status})`);
  }
}
