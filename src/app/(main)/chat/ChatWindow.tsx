import { Conversation, Message } from "./page"
import MessageBubble from "./MessageBubble"

type ChatWindowProps = {
    conversation: Conversation
    messages: Message[]
}

const ChatWindow = ({ conversation, messages }: ChatWindowProps) => {
    return (
        <div className="flex h-full flex-col">
            <div className="border-b border-border px-6 py-4">
                <div className="text-lg font-semibold">{conversation.name}</div>
                <div className="mt-1 text-sm text-muted-foreground">{conversation.lastMessage}</div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
                {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        No messages yet. Start the conversation.
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {messages.map((message) => (
                            <MessageBubble key={message.id} message={message} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatWindow