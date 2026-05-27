"use client"

import { useMemo, useState } from "react"
import ChatSidebar from "./ChatSidebar"
import ChatWindow from "./ChatWindow"
import ChatInput from "./ChatInput"

export type Conversation = {
    id: string;
    name: string;
    lastMessage: string;
    time: string;
    unreadCount?: number;
};

export type Message = {
    id: string;
    sender: string;
    text: string;
    timestamp: string;
};

export type MessageHistory = {
    [conversationId: string]: Message[];
};

const initialConversations: Conversation[] = [
    {
        id: "1",
        name: "Alice Johnson",
        lastMessage: "Hey! Are we still meeting tomorrow?",
        time: "09:15 AM",
        unreadCount: 2,
    },
    {
        id: "2",
        name: "Michael Lee",
        lastMessage: "I'll send the documents tonight.",
        time: "08:42 AM",
    },
    {
        id: "3",
        name: "Emma Wilson",
        lastMessage: "That sounds great 😂",
        time: "Yesterday",
        unreadCount: 5,
    },
    {
        id: "4",
        name: "Team Design",
        lastMessage: "New mockups have been uploaded.",
        time: "Yesterday",
    },
    {
        id: "5",
        name: "David Kim",
        lastMessage: "Can you review my PR?",
        time: "Monday",
        unreadCount: 1,
    },
    {
        id: "6",
        name: "Sophia Martinez",
        lastMessage: "Thanks for your help 🙌",
        time: "Sunday",
    },
    {
        id: "7",
        name: "Family Group",
        lastMessage: "Dinner at 7 PM tonight.",
        time: "Saturday",
        unreadCount: 8,
    },
    {
        id: "8",
        name: "John Carter",
        lastMessage: "See you at the airport.",
        time: "Friday",
    },
     // New Conversations

    {
        id: "9",
        name: "Lucas Brown",
        lastMessage: "Did you finish the assignment?",
        time: "11:24 AM",
        unreadCount: 3,
    },
    {
        id: "10",
        name: "Sarah Chen",
        lastMessage: "Coffee later today?",
        time: "10:17 AM",
    },
    {
        id: "11",
        name: "Frontend Team",
        lastMessage: "Deployment completed successfully.",
        time: "09:50 AM",
    },
    {
        id: "12",
        name: "Olivia Davis",
        lastMessage: "I'll call you tonight.",
        time: "Yesterday",
        unreadCount: 1,
    },
    {
        id: "13",
        name: "Gaming Squad",
        lastMessage: "Who's online right now?",
        time: "Yesterday",
        unreadCount: 6,
    },
    {
        id: "14",
        name: "Daniel Garcia",
        lastMessage: "The API issue is fixed.",
        time: "Tuesday",
    },
    {
        id: "15",
        name: "UI/UX Group",
        lastMessage: "New design system proposal shared.",
        time: "Tuesday",
    },
];

const initialMessages: MessageHistory = {
    "1": [
        {
            id: "m1",
            sender: "Alice Johnson",
            text: "Hey!",
            timestamp: "09:00 AM",
        },
        {
            id: "m2",
            sender: "me",
            text: "Hello 👋",
            timestamp: "09:01 AM",
        },
    ],
    "2": [
        {
            id: "m3",
            sender: "Michael Lee",
            text: "Documents sent.",
            timestamp: "08:40 AM",
        },
    ],
    "3": [
        {
            id: "m4",
            sender: "Emma Wilson",
            text: "That sounds great 😂",
            timestamp: "Yesterday",
        },
    ],
};

const formatTimestamp = (date: Date) => {
    const hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, "0")
    const period = hours >= 12 ? "PM" : "AM"
    const adjusted = hours % 12 || 12
    return `${adjusted}:${minutes} ${period}`
}

const page = () => {
    const [activeConversationId, setActiveConversationId] = useState(initialConversations[0].id)
    const [conversationList, setConversationList] = useState<Conversation[]>(initialConversations)
    const [messageHistory, setMessageHistory] = useState<MessageHistory>(initialMessages)

    const activeConversation = useMemo(
        () => conversationList.find((conversation) => conversation.id === activeConversationId) ?? conversationList[0],
        [activeConversationId, conversationList],
    )

    const activeMessages = messageHistory[activeConversationId] ?? []

    const updateActiveConversation = (conversationId: string) => {
        setActiveConversationId(conversationId)
        setConversationList((current) =>
            current.map((conversation) =>
                conversation.id === conversationId
                    ? { ...conversation, unreadCount: 0 }
                    : conversation,
            ),
        )
    }

    const sendMessage = (text: string) => {
        const trimmed = text.trim()
        if (!trimmed) return

        const timestamp = formatTimestamp(new Date())
        const newMessage: Message = {
            id: `m-${Date.now()}`,
            sender: "me",
            text: trimmed,
            timestamp,
        }

        setMessageHistory((current) => ({
            ...current,
            [activeConversationId]: [...(current[activeConversationId] ?? []), newMessage],
        }))

        setConversationList((current) =>
            current.map((conversation) =>
                conversation.id === activeConversationId
                    ? { ...conversation, lastMessage: trimmed, time: timestamp, unreadCount: 0 }
                    : conversation,
            ),
        )
    }

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <aside className="w-72 shrink-0 border-r border-border bg-card p-4">
                <div className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Conversations
                </div>
                <ChatSidebar
                    conversations={conversationList}
                    activeConversationId={activeConversationId}
                    onSelectConversation={updateActiveConversation}
                />
            </aside>

            <div className="flex flex-1 flex-col">
                <main className="flex-1 overflow-hidden">
                    <ChatWindow conversation={activeConversation} messages={activeMessages} />
                </main>

                <footer className="border-t border-border bg-background px-4 py-3">
                    <ChatInput onSendMessage={sendMessage} />
                </footer>
            </div>
        </div>
    )
}

export default page