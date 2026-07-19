"use client";

import AvatarWithOnline from "@/components/avatarWithOnline";
import postDummy from "../../../../public/post-dummy.png"
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import Reply from "./Reply";
import { formatNumber } from "@/utils/valueConverter";
import { useRef, useState } from "react";
import { fetchBackendClient } from "@/utils/fetch-backend-client";
import { BiComment } from "react-icons/bi";
import Link from "next/link";

type thread = {
    id: number,
    user_id: number,
    username: string,
    module_id: number,
    title: string,
    image_url: string,
    body: string,
    upvote: number,
    downvote: number,
    replies: number,
    category: string,
    week: number,
    created_at: string,
    first_name: string,
    last_name: string,
    module_title: string
}

export default function Thread({thread}: {thread: thread}) {
    type reply = {
        id: number,
        user_id: number,
        username: string
        module_id: number,
        thread_id: number,
        parent_reply_id: number,
        body: string,
        upvote: number,
        downvote: number,
        created_at: string,
        first_name: string,
        last_name: string,
        replies: reply[]
    }

    const [replyButton, setReplyButton] = useState(false);
    const [isTextbox, setIsTextbox] = useState(false);
    const textboxRef = useRef<HTMLTextAreaElement | null>(null);
    const [replies, setReplies] = useState<reply[]>([]);
    
    async function handleReplyButton() {
        const replies = await fetchBackendClient<reply[]>(`/modules/${thread?.module_title}/threads/${thread?.id}/replies`, "GET");
        console.log(replies);
        setReplies(replies);
        setReplyButton(true);
    }

    function handleTextbox() {
        setIsTextbox(t => !t);
        textboxRef?.current?.focus()
    }

    return (
        <div className="w-200 h-auto px-4 py-2 flex flex-col gap-2 shadow-md rounded-md bg-gradient-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100%">
            <div className="w-200 h-auto flex flex-col gap-2">
                <Link href={`/${thread?.username}`}>
                    <div className="flex gap-2">
                            <AvatarWithOnline size="2" />
                            <h3 className="w-full flex items-center font-semibold">{thread?.first_name} {thread?.last_name}</h3>
                    </div>
                </Link>
                <h2 className="text-2xl font-semibold">{thread?.title}</h2>
                <div className="w-192 h-108">
                    <img src={postDummy.src} className="w-full h-full object-cover rounded-md" />
                </div>
                <p className="">{thread?.body}</p>
            </div>
            <div className="flex gap-3 h-8">
                <div className="flex w-max py-1.5 px-2 bg-black/20 rounded-full text-[80%] gap-2">
                    <div className="flex gap-1">
                        <FaChevronUp className="text-white text-xl" />
                        <h3 className="font-semibold">{formatNumber(thread?.upvote)}</h3>
                    </div>
                    <div className="flex gap-1">
                        <FaChevronDown className="text-white text-xl" />
                        <h3 className="font-semibold">{formatNumber(thread?.downvote)}</h3>
                    </div>
                </div>
                <div className="flex items-center">
                    {
                        !replyButton && thread?.replies > 0 ? <p onClick={handleReplyButton} className="text-gray-200 hover:cursor-pointer">{`See ${formatNumber(thread?.replies)} Replies...`}</p> : null
                    }
                    {
                        replyButton || thread?.replies == 0
                            ? (
                                <div onClick={handleTextbox} className="hover:cursor-pointer flex items-center jusitfy-center w-max h-full py-1.5 px-2 bg-black/20 rounded-full text-[80%] gap-1.5">
                                    <BiComment className="text-lg" />
                                    <h3 className="font-semibold">{isTextbox ? "Send" : "Reply"}</h3>
                                </div>
                            )
                            : null
                    }
                </div>
            </div>
            {
                isTextbox 
                    ? <textarea ref={textboxRef} placeholder="Type your reply..." className="resize-none border-white/70 border-1 rounded-md p-1.5"/>
                    :null
            }
            {
                replyButton 
                    ? (<div className="w-full">{replies?.map(r => <Reply key={r?.id} reply={r} />)}</div>)
                    : null
            }
        </div>
    );
}