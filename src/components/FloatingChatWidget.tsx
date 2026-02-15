import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Loader2, Bot, X, Mic, Paperclip } from "lucide-react";
import { cn } from "../lib/utils";
import {
  sendChatMessage,
  loadChatHistory,
  uploadDocumentToKnowledgeBase,
} from "../lib/chatService";

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-2xl max-w-[80%] bg-white/5 backdrop-blur-md border border-white/10">
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 bg-violet-400 rounded-full"
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.85, 1.1, 0.85],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <span className="text-xs text-white/60">AI is thinking</span>
    </div>
  );
}

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "\u{1F44B} Hello! I'm your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Load chat history when widget opens for the first time
  useEffect(() => {
    if (!isOpen || historyLoaded) return;
    let cancelled = false;
    const load = async () => {
      try {
        const history = await loadChatHistory();
        if (cancelled) return;
        if (history.length === 0) { setHistoryLoaded(true); return; }
        setMessages([
          {
            text: "\u{1F44B} Hello! I'm your AI assistant. How can I help you today?",
            isUser: false,
            timestamp: new Date(0),
          },
          ...history.map((m) => ({
            text: m.text,
            isUser: m.isUser,
            timestamp: m.timestamp,
          })),
        ]);
        setHistoryLoaded(true);
      } catch {
        // User not logged in — skip history loading
        setHistoryLoaded(true);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [isOpen, historyLoaded]);

  const handleAIResponse = async (userMessage: string) => {
    setIsTyping(true);
    try {
      const answer = await sendChatMessage(userMessage);
      setMessages((prev) => [
        ...prev,
        { text: answer, isUser: false, timestamp: new Date() },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { text: `Error: ${err.message || "Something went wrong."}`, isUser: false, timestamp: new Date() },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setMessages((prev) => [
      ...prev,
      { text: userMessage, isUser: true, timestamp: new Date() },
    ]);
    setInput("");
    handleAIResponse(userMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setIsUploading(true);
    setMessages((prev) => [
      ...prev,
      { text: `Uploading "${file.name}"...`, isUser: true, timestamp: new Date() },
    ]);

    try {
      const text = await file.text();
      await uploadDocumentToKnowledgeBase(file.name, text);
      setMessages((prev) => [
        ...prev,
        { text: `"${file.name}" added to knowledge base! Ask me about it.`, isUser: false, timestamp: new Date() },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { text: `Upload failed: ${err.message}`, isUser: false, timestamp: new Date() },
      ]);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-20 right-0 w-[370px] h-[500px] rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/20 border border-white/10 flex flex-col"
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-white/10"
                  animate={{
                    boxShadow: [
                      "0 0 10px rgba(139, 92, 246, 0.3)",
                      "0 0 20px rgba(139, 92, 246, 0.5)",
                      "0 0 10px rgba(139, 92, 246, 0.3)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Bot className="w-5 h-5 text-violet-400" />
                </motion.div>
                <div>
                  <h3 className="text-sm font-semibold text-white">AI Chat Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-white/50">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence mode="popLayout">
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={cn("flex", msg.isUser ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] px-3 py-2 rounded-2xl",
                        msg.isUser
                          ? "bg-gradient-to-br from-violet-600/80 to-indigo-600/80 text-white border border-violet-400/30 shadow-lg shadow-violet-500/10"
                          : "bg-white/5 text-white border border-white/10"
                      )}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <TypingIndicator />
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/10 p-3 bg-black/20">
              <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.csv,.json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-colors disabled:opacity-50"
                >
                  {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Paperclip className="w-3.5 h-3.5" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-colors"
                >
                  <Mic className="w-3.5 h-3.5" />
                </motion.button>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 focus:shadow-lg focus:shadow-violet-500/10 transition-all"
                />
                <motion.button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  whileHover={{ scale: input.trim() ? 1.05 : 1 }}
                  whileTap={{ scale: input.trim() ? 0.95 : 1 }}
                  className={cn(
                    "p-2.5 rounded-xl transition-all",
                    input.trim() && !isTyping
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30"
                      : "bg-white/5 text-white/30 cursor-not-allowed"
                  )}
                >
                  {isTyping ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </motion.button>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[10px] text-white/30">
                <Sparkles className="w-3 h-3" />
                <span>Powered by AI</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip bubble */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="absolute bottom-4 right-[72px] bg-white text-slate-900 text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg whitespace-nowrap"
          >
            Need help? Chat with AI
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <div className="relative">
        {/* Ping rings */}
        {!isOpen && (
          <>
            <span className="absolute inset-0 rounded-full bg-violet-500/40 animate-ping" />
            <span
              className="absolute -inset-1 rounded-full bg-violet-500/20 animate-pulse"
            />
          </>
        )}

        {/* Green online badge */}
        {!isOpen && (
          <span className="absolute top-0 right-0 z-10 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-white" />
          </span>
        )}

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-xl shadow-violet-500/30 flex items-center justify-center"
          animate={
            isOpen
              ? { boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)" }
              : {
                  boxShadow: [
                    "0 0 20px rgba(139, 92, 246, 0.3)",
                    "0 0 40px rgba(139, 92, 246, 0.6)",
                    "0 0 20px rgba(139, 92, 246, 0.3)",
                  ],
                  y: [0, -6, 0],
                }
          }
          transition={{
            duration: 2,
            repeat: isOpen ? 0 : Infinity,
            ease: "easeInOut",
          }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="bot"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Bot className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
