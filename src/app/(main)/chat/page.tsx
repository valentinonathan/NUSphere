"use client";

import { useEffect, useState, useRef } from "react";
import socket from "@/lib/socket";
import { fetchBackendClient } from "@/utils/fetch-backend-client";
import { ApiResponse } from "../market/page";

type ErrorMessage = {
    message: string;
};

type ConversationResponse = {
    myUserId: number;
    conversationId: number;
    messages: Message[];
};

type Message = {
    id: number;
    conversation_id: number;
    sender_id: number;
    content: string;
    created_at: string;
    is_system_message?: boolean;
};

type MarketConversation = {
    conversation_id: number
    listing_id: number
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [receiver, setReceiver] = useState("");
    const [text, setText] = useState("");
    const [conversationId, setConversationId] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [myUserId, setMyUserId] = useState<number | null>(null);
    const [listingId, setListingId] = useState<number | null>(null);
    const [sellerId, setSellerId] = useState<number | null>(null);
    const [reservationStatus, setReservationStatus] = useState<"idle" | "requested" | "reserved" | "expired" | "sold">("idle");
    const [reservationExpiresAt, setReservationExpiresAt] = useState<string | null>(null);
    const [hasAutoStarted, setHasAutoStarted] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const receiverFromQuery = params.get("receiver") ?? "";
        const listingIdFromQuery = params.get("listingId");
        const sellerIdFromQuery = params.get("sellerId");

        if (receiverFromQuery) {
            setReceiver(receiverFromQuery);
            setHasAutoStarted(true);
        }
        if (listingIdFromQuery) {
            setListingId(Number(listingIdFromQuery));
        }
        if (sellerIdFromQuery) {
            setSellerId(Number(sellerIdFromQuery));
        }
    }, []);

    useEffect(() => {
        if (!hasAutoStarted) {
            return;
        }

        void startConversation();
        setHasAutoStarted(true);
    }, [hasAutoStarted]);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected:", socket.id);
        });

        socket.on("chat:message", (message: Message) => {
            setMessages((prev) => [...prev, message]);
        });

        socket.on("room:joined", ({ conversationId }: { conversationId: number }) => {
            console.log(`Joined Conversation${conversationId}`);
        });

        socket.on("connect_error", (err: Error) => {
            console.log("connect_error:", err.message);
        });

        socket.on("chat:error", ({ message }: { message: string }) => {
            console.log("chat:error : ", message);
        });

        socket.on("error", ({ message }: { message: string }) => {
            console.log(`Error Message: ${message}`);
        });

        socket.on("room:left", ({ conversationId }: { conversationId: number }) => {
            console.log(`Left Conversation${conversationId}`);
        });

        return () => {
            socket.off("connect");
            socket.off("chat:message");
            socket.off("room:joined");
            socket.off("connect_error");
            socket.off("chat:error");
            socket.off("error");
            socket.off("room:left");
            if (!conversationId) {
                socket.emit("room:left", { conversationId });
            }
            socket.disconnect();
        };
    }, []);

    const startConversation = async () => {
        try {
            async function connectSocket() {
                if (socket.connected) {
                    return;
                }

                const tokenResponse = await fetch("/api/socket-token");
                const tokenData: { token: string } = await tokenResponse.json();

                socket.auth = {
                    token: tokenData.token,
                };

                await new Promise<void>((resolve, reject) => {
                    socket.once("connect", () => {
                        console.log("Socket connected");
                        resolve();
                    });

                    socket.once("connect_error", (err) => {
                        reject(err);
                    });

                    socket.connect();
                });
            }


            const tokenResponse = await fetch("/api/socket-token");
            const tokenData: { token: string } = await tokenResponse.json();

            socket.auth = {
                token: tokenData.token,
            };

            await connectSocket();

            const response = await fetchBackendClient<ConversationResponse | ErrorMessage>("/conversations", "POST", { receiverUsername: receiver });

            if ("message" in response) {
                setErrorMessage(response.message);
                setConversationId(null);
            } else {
                setConversationId(response.conversationId);
                setMyUserId(response.myUserId);
                setMessages(response.messages);
                setErrorMessage("");
                setReservationStatus("idle");
                setReservationExpiresAt(null);
                console.log("socket.connected:" + socket.connected)
                socket.emit("join-conversation", { conversationId: response.conversationId });
            }
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : "Failed to start conversation");
            setConversationId(null);
            setMyUserId(null);
        }
    };

    const sendMessage = () => {
        try {
            if (hasAutoStarted) {
                void createMessageConversation();
            }

            if (!conversationId) {
                throw new Error("You have not started a conversation");
            }
            if (!text.trim()) {
                return;
            }
            socket.emit("chat:message", {
                conversationId,
                text,
            });
            setText("");
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Failed to send message");
        }
    };

    const createMessageConversation = async () => {
        try {
            const res = await fetchBackendClient<ApiResponse<MarketConversation>>(
                "/market/conversation",
                "POST",
                {
                    conversationId,
                    listingId
                }
            );

            if ("message" in res) {
                if (res.message == "Market conversation already exists") {
                    return 
                } else {
                    throw new Error(res.message);
                }
            } 
            setHasAutoStarted(false)

        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Faied to create marketConversation")
        }
               
    }

    // const requestReservation = () => {
    //     if (!conversationId || !listingId) {
    //         setErrorMessage("Start a conversation for a listing before requesting a reservation.");
    //         return;
    //     }

    //     socket.emit("chat:message", {
    //         conversationId,
    //         text: "Buyer requested reservation for this item.",
    //     });
    //     setReservationStatus("requested");
    //     setText("");
    // };

    // const reserveItem = async () => {
    //     if (!conversationId || !listingId) {
    //         setErrorMessage("No listing is attached to this conversation.");
    //         return;
    //     }

    //     try {
    //         const response = await fetch(`/api/market/${listingId}/reserve`, {
    //             method: "POST",
    //             credentials: "include",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({ conversationId, receiverUsername: receiver }),
    //         });
    //         const payload = await response.json() as { message?: string; data?: { expires_at?: string } };

    //         const expiresAt = payload?.data?.expires_at ?? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    //         const message = `Item reserved until ${expiresAt}.`;

    //         socket.emit("chat:message", {
    //             conversationId,
    //             text: message,
    //             isSystemMessage: true,
    //         });

    //         setReservationStatus("reserved");
    //         setReservationExpiresAt(expiresAt);
    //         setErrorMessage("");

    //         const timeout = new Date(expiresAt).getTime() - Date.now();
    //         if (timeout > 0) {
    //             window.setTimeout(() => {
    //                 socket.emit("chat:message", {
    //                     conversationId,
    //                     text: "Reservation expired.",
    //                     isSystemMessage: true,
    //                 });
    //                 setReservationStatus("expired");
    //                 setReservationExpiresAt(null);
    //             }, timeout);
    //         }
    //     } catch (error) {
    //         setErrorMessage(error instanceof Error ? error.message : "Failed to create reservation");
    //     }
    // };

    // const confirmPayment = () => {
    //     if (!conversationId) {
    //         setErrorMessage("Start a conversation before confirming payment.");
    //         return;
    //     }

    //     socket.emit("chat:message", {
    //         conversationId,
    //         text: "Seller confirmed payment. Listing marked as Sold.",
    //         isSystemMessage: true,
    //     });
    //     setReservationStatus("sold");
    // };

    const isSeller = myUserId !== null && sellerId !== null && myUserId === sellerId;

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

                {/* {conversationId && listingId && !isSeller && reservationStatus === "idle" && (
                    <button className="mt-3 rounded-md bg-black/10 px-3 py-2 text-sm text-white" onClick={requestReservation}>
                        Request Reservation
                    </button>
                )}

                {conversationId && listingId && isSeller && reservationStatus === "requested" && (
                    <button className="mt-3 rounded-md bg-black/10 px-3 py-2 text-sm text-white" onClick={reserveItem}>
                        Reserve Item
                    </button>
                )}

                {conversationId && listingId && isSeller && reservationStatus === "reserved" && (
                    <button className="mt-3 rounded-md bg-black/10 px-3 py-2 text-sm text-white" onClick={confirmPayment}>
                        Confirm Payment
                    </button>
                )}

                {reservationExpiresAt && (
                    <p className="mt-3 text-sm text-white/80">
                        Reservation expires {new Date(reservationExpiresAt).toLocaleString()}
                    </p>
                )} */}
            </div>

            <div className="flex flex-1 flex-col h-full ">
                <div className="flex gap-0.5 flex-1 flex-col overflow-y-auto">
                    {messages.map((msg) => {
                        const isSystemMessage = msg.is_system_message === true;
                        const isMine = msg.sender_id === myUserId;

                        return (
                            <div
                                className={`w-fit max-w-[80%] rounded-md p-2 shadow-black/10 shadow-md ${isSystemMessage
                                    ? "self-center bg-black/10 text-sm italic text-white/80"
                                    : isMine
                                        ? "self-end bg-linear-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100%"
                                        : "self-start bg-linear-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100%"
                                    }`}
                                key={msg.id || msg.created_at}
                            >
                                {msg.content}
                            </div>
                        );
                    })}
                    <div ref={bottomRef} />
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