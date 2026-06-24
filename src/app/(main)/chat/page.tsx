"use client";

import { useEffect, useState } from "react";
import { socket } from "@/app/api/socket/route";

type Message = {
  id?: string;
  sender_id?: number;
  content: string;
  created_at?: string;
};

export default function ChatPage() {
  const [conversationId] = useState("1");
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    const handleReceive = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleConversationError = (err: { message: string }) => {
      alert(err.message);
    };

    const handleMessageError = (err: { message: string }) => {
      alert(err.message);
    };

    socket.on("message:receive", handleReceive);
    socket.on("conversation:error", handleConversationError);
    socket.on("message:error", handleMessageError);

    socket.connect();

    socket.once("connect", () => {
      socket.emit("conversation:join", Number(conversationId));
    });

    return () => {
      socket.off("message:receive", handleReceive);
      socket.off("conversation:error", handleConversationError);
      socket.off("message:error", handleMessageError);
      socket.disconnect();
    };
  }, [conversationId]);

  const sendMessage = () => {
    if (!content.trim()) return;

    socket.emit("message:send", {
      conversationId: Number(conversationId),
      content,
    });

    setContent("");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 p-6">
      <div className="rounded-xl border p-4">
        <h1 className="text-xl font-semibold">Chat</h1>
        <p className="text-sm text-gray-500">Conversation {conversationId}</p>
      </div>

      <div className="flex-1 rounded-xl border p-4">
        <div className="mb-4 h-[500px] space-y-2 overflow-y-auto rounded border p-3">
          {messages.length === 0 ? (
            <p className="text-sm text-gray-500">No messages yet</p>
          ) : (
            messages.map((msg, index) => (
              <div key={msg.id ?? index} className="rounded bg-gray-100 p-2">
                <p className="text-sm">{msg.content}</p>
                {msg.created_at && (
                  <p className="text-xs text-gray-500">{msg.created_at}</p>
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 rounded border px-3 py-2"
            placeholder="Type a message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button
            className="rounded bg-blue-600 px-4 py-2 text-white"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}