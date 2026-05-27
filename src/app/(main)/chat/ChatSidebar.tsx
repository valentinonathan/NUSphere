"use client"

import { Conversation } from "./page";

type ChatSidebarProps = {
    conversations: Conversation[];
    activeConversationId: string;
    onSelectConversation: (id: string) => void;
};

const ChatSidebar = ({ conversations, activeConversationId, onSelectConversation }: ChatSidebarProps) => {
    return (
        <div className="space-y-2">
            {conversations.map((conversation) => {
                const isActive = conversation.id === activeConversationId
                return (
                    <button
                        key={conversation.id}
                        type="button"
                        onClick={() => onSelectConversation(conversation.id)}
                        className={`w-full rounded-3xl px-4 py-3 text-left transition hover:bg-primary/10 ${isActive ? "bg-primary/10 text-primary" : "bg-card"}`}
                    >
                        <div className="flex items-center justify-between gap-3">
                            <span className="font-medium">{conversation.name}</span>
                            {conversation.unreadCount ? (
                                <span className="rounded-full bg-primary px-2 py-0.5 text-[0.7rem] font-semibold text-primary-foreground">
                                    {conversation.unreadCount}
                                </span>
                            ) : (
                                <span className="text-xs text-muted-foreground">{conversation.time}</span>
                            )}
                        </div>
                        <p className="mt-1 truncate text-sm text-muted-foreground">{conversation.lastMessage}</p>
                    </button>
                )
            })}
        </div>
    )
}

export default ChatSidebar