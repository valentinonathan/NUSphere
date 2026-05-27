import { Message } from "./page"

type MessageBubbleProps = {
    message: Message
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
    const isMine = message.sender === "me"

    return (
        <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm shadow-sm ${isMine
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground border border-border"
                    }`}
            >
                <div className="font-medium leading-6">{message.text}</div>
                <div className="mt-2 text-right text-[0.72rem] text-muted-foreground">
                    {message.timestamp}
                </div>
            </div>
        </div>
    )
}

export default MessageBubble