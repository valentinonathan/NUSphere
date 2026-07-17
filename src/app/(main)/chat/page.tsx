"use client";

import { useEffect, useState } from "react";
import socket from "@/lib/socket";
import { fetchBackendClient } from "@/utils/fetch-backend-client";

type ErrorMessage = {
    message: string
}

type ConversationResponse = {
    myUserId: number
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
    const [myUserId, setMyUserId] = useState<null | Number>(null);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected:", socket.id);
        });

        socket.on("chat:message", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        socket.on("room:joined", ({ conversationId }) => {
            console.log(`Joined Conversation${conversationId}`);
        })

        socket.on("connect_error", (err) => {
            console.log("connect_error:", err.message);
        });

        socket.on("chat:error", ({ message }) => {
            console.log("chat:error : ", message)
        })

        socket.on("error", ({ message }) => {
            console.log(`Error Message: ${message}`)
        })

        socket.on("room:left", ({ conversationId }) => {
            console.log(`Left Conversation${conversationId}`)
        })

        

        return () => {
            socket.off("connect");
            socket.off("chat:message");
            if (!conversationId) {
                socket.emit("roof:left", conversationId);
            }
            socket.disconnect();
        };
    }, []);

    const startConversation = async () => {
        try {
            let tokenData = await fetch("api/socket-token")
            const tokenData2: {token : string} = await tokenData.json();

            socket.auth = {
                token : tokenData2.token
            }

            socket.connect();

            const response = await fetchBackendClient<ConversationResponse | ErrorMessage>("/conversations", "POST", { receiverUsername: receiver });

            if ("message" in response) {
                setErrorMessage(response.message);
                setConversationId(null);
            } else {

                setConversationId(response.conversationId);
                setMyUserId(response.myUserId);
                setMessages(response.messages)
                setErrorMessage("");

                socket.emit("join-conversation", { conversationId: response.conversationId });
            }
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : "Failed to start conversation");
            setConversationId(null);
            setMyUserId(null);
        }

    }

    const sendMessage = () => {
        try {
            if (!conversationId) {
                throw new Error("You have not started a conversation");
            }
            socket.emit("chat:message", {
                conversationId,
                text,
            });
            setText("");
        } catch (error) {
            error instanceof Error ? setErrorMessage(error.message) : "Failed to send message";
        }


    };

    // <div className="w-full max-w-200 shadow-black/10 shadow-md bg-linear-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100% rounded-md p-4">

    return (
        <div className="h-[calc(100vh-100px)] w-[calc(100vw-200px)] bg-white/20 flex flex-row p-3 gap-2">
            <div className="flex flex-col">
                <div>
                    {errorMessage != "" && <h2>Error Message: {errorMessage} </h2>}
                    {conversationId && <h1>Conversation ID: {conversationId?.toString()}</h1>}
                </div>
                <div className="flex">
                    <input
                        className="w-fit"
                        value={receiver}
                        onChange={(e) => setReceiver(e.target.value)}
                        placeholder="Start conversation with..."
                    />
                    <button className="flex-1" onClick={startConversation}>Start</button>
                </div>

            </div>


            <div className="flex flex-1 flex-col h-full ">
                <div className="flex gap-0.5 flex-1 flex-col overflow-y-auto">
                    {messages.map((msg) => (
                        msg.sender_id == myUserId ?
                            <p className="self-end w-fit h-fit shadow-black/10 shadow-md bg-linear-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100% rounded-md p-2" key={msg.created_at}>{msg.content}</p>
                            :
                            <p className="self-start w-fit h-fit shadow-black/10 shadow-md bg-linear-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100% rounded-md p-2" key={msg.created_at}>{msg.content}</p>

                    ))}
                </div>
                <div className="flex flex-row w-full">
                    <input
                        className="flex-1"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type message..."
                    />
                    <button className="p-3" onClick={sendMessage}>Send</button>
                </div>
            </div>

        </div>
    );
}