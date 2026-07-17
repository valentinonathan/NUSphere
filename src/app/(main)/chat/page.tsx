"use client";

import { useEffect, useState } from "react";
import socket from "@/lib/socket";
import { fetchBackendClient } from "@/utils/fetch-backend-client";

type ErrorMessage = {
    message: string
}

type ConversationResponse = {
    conversationId: number
    messages: Message[]
}

type Message = {
    id: number
    conversation_id: number
    sender_id: number
    content: string
    created_at: string
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [receiver, setReceiver] = useState("");
    const [text, setText] = useState("");
    const [conversationId, setConversationId] = useState<null | Number>(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected:", socket.id);
        });

        socket.on("chat:message", (message) => {
            setMessages((prev) => [...prev, message.text]);
        });

        socket.on("room:joined", ({ conversationId }) => {
            console.log(`Joined Conversation${conversationId}`);
        })

        socket.on("connect_error", (err) => {
            console.log("connect_error:", err.message);
        });

        socket.on("error", ({ message }) => {
            console.log(`Error Message: ${message}`)
        })

        socket.on("room:left", ({ conversationId }) => {
            console.log(`Left Conversation${conversationId}`)
        })

        socket.connect();

        return () => {
            socket.off("connect");
            socket.off("chat:message");
            socket.disconnect();
        };
    }, []);

    const startConversation = async () => {
        try {
            const response = await fetchBackendClient<ConversationResponse | ErrorMessage>("/conversations", "POST", { receiverUsername: receiver });

            if ("message" in response) {
                setErrorMessage(response.message);
                setConversationId(null);
            } else {
                
                setConversationId(response.conversationId);
                setMessages((prev) => [...response.messages, ...prev])
                setErrorMessage("");

                socket.emit("join-conversation", { conversationId: response.conversationId });
            }
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : "Failed to start conversation");
            setConversationId(null);
        }

    }

    const sendMessage = () => {
        socket.emit("chat:message", {
            conversationId,
            text,
        });
        setText("");
    };

    return (
        <div>
            {errorMessage != "" && <h2>Error Message: {errorMessage} </h2>}
            {conversationId && <h1>Conversation ID: {conversationId?.toString()}</h1>}
            <input
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                placeholder="Start conversation with..."
            />
            <button onClick={startConversation}>Start</button>
            <div>
                {messages.map((msg) => (
                    <p key={msg.created_at}>{msg.content}</p>
                ))}
            </div>



            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}