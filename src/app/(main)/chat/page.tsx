"use client";

import { useEffect, useState } from "react";
import { socket } from "@/app/api/socket/route";
import { fetchBackendClient } from "@/utils/fetch-backend-client";

type Message = {
    id?: number;
    sender_id?: number;
    content: string;
    created_at?: string;
};

type ConversationResponseSuccess = {
    userId?: number;
    conversation?: {
        id: number;
    };
    messages?: Message[];
    message?: string;
};

type ErrorResponse = {
    message: string;
}

type ConversationResponse = ConversationResponseSuccess | ErrorResponse


export default function ChatPage() {
    const [conversationId, setConversationId] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [content, setContent] = useState("");
    const [receiverUsername, setReceiverUsername] = useState("");
    const [userId, setUserId] = useState<number>(-1);
    const [error, setError] = useState("");

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

        return () => {
            socket.off("message:receive", handleReceive);
            socket.off("conversation:error", handleConversationError);
            socket.off("message:error", handleMessageError);
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!conversationId) return;
        socket.emit("conversation:join", conversationId);
    }, [conversationId]);

    const startConversation = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const username = receiverUsername.trim();
        if (!username) return;

        try {
            const result: ConversationResponse = await fetchBackendClient<ConversationResponse>(
                "/conversations/direct",
                "POST",
                {
                    receiverUsername: username,
                }
            );

            if ("message" in result) {
                throw new Error(result.message)
            } else {
                setConversationId(result.conversation.id);
                setMessages(result.messages ?? []);
                setUserId(result.userId);
            }



        } catch (error) {
            setError(error);
            alert("User not found or conversation could not be created");
        }
    };

    const sendMessage = () => {
        if (!conversationId) {
            alert("Start a conversation first");
            return;
        }

        if (!content.trim()) return;

        socket.emit("message:send", {
            conversationId,
            content,
        });

        setContent("");
    };

    //   return (
    //     <div className="flex flex-col">
    //       <div className="border-b p-4">
    //         <form onSubmit={startConversation} className="flex gap-2">
    //           <input
    //             placeholder="Start conversation with..."
    //             onChange={(e) => setReceiverUsername(e.target.value)}
    //             value={receiverUsername}
    //             className="rounded border px-3 py-2"
    //           />
    //           <button type="submit" className="rounded bg-black px-4 py-2 text-white">
    //             Start
    //           </button>
    //         </form>
    //       </div>

    //       <div className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 p-6">
    //         <div className="rounded-xl border p-4">
    //           <h1 className="text-xl font-semibold">Chat</h1>
    //           <p className="text-sm text-gray-500">
    //             {conversationId ? `Conversation ${conversationId}` : "No conversation selected"}
    //           </p>
    //         </div>

    //         <div className="flex-1 rounded-xl border p-4">
    //           <div className="mb-4 h-[500px] space-y-2 overflow-y-auto rounded border p-3">
    //             {messages.length === 0 ? (
    //               <p className="text-sm text-gray-500">No messages yet</p>
    //             ) : (
    //               messages.map((msg, index) => (
    //                 <div key={msg.id ?? index} className="rounded bg-gray-100 p-2">
    //                   <p className="text-sm">{msg.content}</p>
    //                   {msg.created_at && (
    //                     <p className="text-xs text-gray-500">{msg.created_at}</p>
    //                   )}
    //                 </div>
    //               ))
    //             )}
    //           </div>

    //           <div className="flex gap-2">
    //             <input
    //               className="flex-1 rounded border px-3 py-2"
    //               placeholder="Type a message..."
    //               value={content}
    //               onChange={(e) => setContent(e.target.value)}
    //               onKeyDown={(e) => {
    //                 if (e.key === "Enter") sendMessage();
    //               }}
    //             />
    //             <button
    //               className="rounded bg-blue-600 px-4 py-2 text-white"
    //               onClick={sendMessage}
    //             >
    //               Send
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   );

    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    return (
        <div className="min-h-[100vh - 6.25rem] max-h-[100vh - 6.25rem] h-[100vh - 6.25rem] m-3 flex flex-col gap-2">
            <div className="p-6 shadow-black/10 shadow-md bg-gradient-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100% rounded-md">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Chat</h1>
                        {error != "" && <p className="text-sm text-red/70"></p>}
                        <p className="text-sm text-white/70">
                            {conversationId ? `Conversation ${conversationId}` : "No conversation selected"}
                        </p>
                    </div>
                </div>

                <div className="space-y-3 text-sm text-white/80">
                    <form onSubmit={startConversation} className="flex gap-2">
                        <input
                            placeholder="Start conversation with..."
                            onChange={(e) => setReceiverUsername(e.target.value)}
                            value={receiverUsername}
                            className="flex-1 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/50 outline-none"
                        />
                        <button type="submit">
                            <div className="w-fit rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white">
                                Start
                            </div>
                        </button>
                    </form>
                </div>
            </div>

            <div className="min-h-0 flex gap-4 flex-col p-6 overflow-y-auto shadow-black/10 shadow-md bg-gradient-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100% rounded-md">
                {messages.map((msg) => {
                    const isMine = msg.sender_id === userId;

                    return (
                        <div
                            key={msg.id}
                            className={`flex ${isMine ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-md ${isMine
                                    ? "bg-pink-500 text-white rounded-br-sm"
                                    : "bg-white/15 text-white rounded-bl-sm"
                                    }`}
                            >
                                <p className="break-words">{msg.content}</p>

                                <p
                                    className={`mt-1 text-right text-[11px] ${isMine
                                        ? "text-white/70"
                                        : "text-white/50"
                                        }`}
                                >
                                    {formatTimestamp(msg.created_at)}
                                </p>
                            </div>
                        </div>
                    );
                })}

                <div className="flex gap-2">
                    <input
                        className="flex-1 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/50 outline-none"
                        placeholder="Type a message..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") sendMessage();
                        }}
                    />
                    <button onClick={sendMessage}>
                        <div className="w-fit rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white">
                            Send
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}