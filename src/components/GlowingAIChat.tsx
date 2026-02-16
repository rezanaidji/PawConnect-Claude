"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Loader2, Bot, Mic, Paperclip } from "lucide-react";
import { cn } from "../lib/utils";
import {
  sendChatMessage,
  loadChatHistory,
  uploadDocumentToKnowledgeBase,
  clearChatHistory,
} from "../lib/chatService";
import ChatSidebar from "./ChatSidebar";

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface GlowingAIChatProps {
  className?: string;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-3 rounded-2xl max-w-[80%] bg-white/5 backdrop-blur-md border border-white/10">
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-violet-400 rounded-full"
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
      <span className="text-sm text-white/60">AI is thinking</span>
    </div>
  );
}

const WELCOME_MESSAGE: Message = {
  text: "\u{1F44B} Hello! I'm your AI assistant. How can I help you today?",
  isUser: false,
  timestamp: new Date(),
};

function GlowingAIChat({ className }: GlowingAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load chat history on mount
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const history = await loadChatHistory();
        if (cancelled || history.length === 0) return;
        setMessages([
          { ...WELCOME_MESSAGE, timestamp: new Date(0) },
          ...history.map((m) => ({
            text: m.text,
            isUser: m.isUser,
            timestamp: m.timestamp,
          })),
        ]);
        setMessageCount(history.length);
      } catch {
        // User not logged in — skip history loading
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const handleAIResponse = async (userMessage: string) => {
    setIsTyping(true);
    try {
      const answer = await sendChatMessage(userMessage);
      setMessages((prev) => [
        ...prev,
        { text: answer, isUser: false, timestamp: new Date() },
      ]);
      setMessageCount((c) => c + 2); // user + ai
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

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    handleAIResponse(userMessage);
  };

  const handleNewChat = async () => {
    try {
      await clearChatHistory();
    } catch {
      // ignore errors — still clear locally
    }
    setMessages([{ ...WELCOME_MESSAGE, timestamp: new Date() }]);
    setMessageCount(0);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setIsUploading(true);
    setMessages((prev) => [
      ...prev,
      { text: `Uploading "${file.name}" to knowledge base...`, isUser: true, timestamp: new Date() },
    ]);

    try {
      const text = await file.text();
      await uploadDocumentToKnowledgeBase(file.name, text);
      setMessages((prev) => [
        ...prev,
        { text: `"${file.name}" has been added to the knowledge base. You can now ask questions about it!`, isUser: false, timestamp: new Date() },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { text: `Failed to upload: ${err.message}`, isUser: false, timestamp: new Date() },
      ]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div
      className={cn(
        "h-screen w-full flex relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900",
        className
      )}
    >
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full mix-blend-normal blur-[128px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-normal blur-[128px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-fuchsia-500/20 rounded-full mix-blend-normal blur-[96px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Sidebar */}
      <ChatSidebar
        messageCount={messageCount}
        onNewChat={handleNewChat}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <motion.div
          className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-white/[0.02] backdrop-blur-xl"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-white/10"
            animate={{
              boxShadow: [
                "0 0 15px rgba(139, 92, 246, 0.3)",
                "0 0 30px rgba(139, 92, 246, 0.5)",
                "0 0 15px rgba(139, 92, 246, 0.3)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Bot className="w-6 h-6 text-violet-400" />
          </motion.div>
          <div>
            <h1 className="text-lg font-semibold text-white">
              AI Chat Assistant
            </h1>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-white/50">
                Powered by advanced AI technology
              </span>
            </div>
          </div>
        </motion.div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex",
                  msg.isUser ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] px-4 py-3 rounded-2xl backdrop-blur-md",
                    msg.isUser
                      ? "bg-gradient-to-br from-violet-600/80 to-indigo-600/80 text-white border border-violet-400/30 shadow-lg shadow-violet-500/20"
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
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <TypingIndicator />
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 p-4 bg-black/20 backdrop-blur-xl">
          <div className="flex items-end gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.csv,.json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-colors disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-colors"
              >
                <Mic className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Type your message..."
                rows={1}
                className={cn(
                  "w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-white/30 resize-none focus:outline-none transition-all",
                  isFocused
                    ? "border-violet-500/50 shadow-lg shadow-violet-500/20"
                    : "border-white/10"
                )}
                style={{ maxHeight: "120px" }}
              />
            </div>

            <motion.button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              whileHover={{ scale: input.trim() ? 1.05 : 1 }}
              whileTap={{ scale: input.trim() ? 0.95 : 1 }}
              className={cn(
                "p-3 rounded-xl transition-all",
                input.trim() && !isTyping
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50"
                  : "bg-white/5 text-white/30 cursor-not-allowed"
              )}
            >
              {isTyping ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </motion.button>
          </div>

          <div className="flex items-center justify-between mt-3 text-xs text-white/40">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              <span>Press Enter to send, Shift + Enter for new line</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GlowingAIChat;
