"use client"
import { useState } from "react"

type ChatInputProps = {
    onSendMessage: (message: string) => void
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
    const [draft, setDraft] = useState("")

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const trimmed = draft.trim()
        if (!trimmed) return
        onSendMessage(trimmed)
        setDraft("")
    }

    return (
        <form className="flex gap-3" onSubmit={handleSubmit}>
            <label htmlFor="chat-input" className="sr-only">
                Type a message
            </label>
            <input
                id="chat-input"
                type="text"
                className="min-w-0 flex-1 rounded-2xl border border-border bg-input px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Type your message..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
            />
            <button
                type="submit"
                className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
                Send
            </button>
        </form>
    )
}

export default ChatInput