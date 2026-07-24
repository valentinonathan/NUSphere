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
    module_title: string,
    has_upvoted: boolean,
    has_downvoted: boolean,
    pfp_url: string
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
        replies: reply[],
        has_upvoted: boolean,
        has_downvoted: boolean,
        pfp_url: string
    }

    const [replyButton, setReplyButton] = useState(false);
    const [isTextbox, setIsTextbox] = useState(false);
    const textboxRef = useRef<HTMLTextAreaElement | null>(null);
    const [replies, setReplies] = useState<reply[]>([]);
    const [newReplies, setNewReplies] = useState<reply[]>([]);
    const [upvoteButton, setUpvoteButton] = useState(thread?.has_upvoted);
    const [upvote, setUpvote] = useState(thread?.upvote);
    const [downvote, setDownvote] = useState(thread?.downvote);
    const [downvoteButton, setDownvoteButton] = useState(thread?.has_downvoted);
    
    async function handleReplyButton() {
        const replies = await fetchBackendClient<reply[]>(`/modules/${thread?.module_title}/threads/${thread?.id}/replies`, "GET");
        if (replies?.length != undefined) {
            setReplies(replies);
            setReplyButton(true);
        }
    }

    async function handlePostReply() {
        type result = {message: string, reply: reply};
        const replyBody = textboxRef?.current?.value;
        const result = await fetchBackendClient<result>(`/modules/${thread?.module_title}/threads/${thread?.id}/replies`, "POST", {parentReplyId: -1, reply: replyBody});
        
        if (result?.message == "Post thread reply successful") {
            result.reply.pfp_url = thread?.pfp_url;
            newReplies.push(result.reply);
            setIsTextbox(false);
            if (!replyButton) {
                setReplyButton(true);
            }
        }
    }

    function handleTextbox() {
        if (isTextbox) {
            handlePostReply();
        } else {
            setIsTextbox(true);
            textboxRef?.current?.focus()
        }
    }

    async function handleUpvoteButton() {
        type result = {message: string};
        if (upvoteButton) {
            setUpvoteButton(false);
            setUpvote(u => u - 1);
            const result = await fetchBackendClient<result>(`/modules/${thread?.module_title}/threads/${thread?.id}/upvote`, "DELETE");
            if (result?.message === undefined || result?.message != "Delete upvote successful") {
                setUpvoteButton(true);
                setUpvote(u => u + 1);
            }
        } else {
            if (downvoteButton) {
                setDownvoteButton(false);
                setUpvoteButton(true);
                setUpvote(u => u + 1);
                setDownvote(d => d - 1);
                const first = await fetchBackendClient<result>(`/modules/${thread?.module_title}/threads/${thread?.id}/downvote`, "DELETE");
                if (first?.message === undefined || first?.message != "Delete downvote successful") {
                    setDownvoteButton(true);
                    setUpvoteButton(false);
                    setUpvote(u => u - 1);
                    setDownvote(d => d + 1);
                    return;
                }
                const second = await fetchBackendClient<result>(`/modules/${thread?.module_title}/threads/${thread?.id}/upvote`, "POST");
                if (second?.message === undefined || second?.message != "Upvote successful") {
                    setDownvoteButton(true);
                    setUpvoteButton(false);
                    setUpvote(u => u - 1);
                    setDownvote(d => d + 1);
                    return;
                }
            } else {
                setUpvoteButton(true);
                setUpvote(u => u + 1);
                const result = await fetchBackendClient<result>(`/modules/${thread?.module_title}/threads/${thread?.id}/upvote`, "POST");
                if (result?.message === undefined || result?.message != "Upvote successful") {
                    setUpvoteButton(false);
                    setUpvote(u => u - 1);
                }
            }
        }
    }

    async function handleDownvoteButton() {
        type result = {message: string};
        if (downvoteButton) {
            setDownvoteButton(false);
            setDownvote(d => d - 1);
            const result = await fetchBackendClient<result>(`/modules/${thread?.module_title}/threads/${thread?.id}/downvote`, "DELETE");
            if (result?.message === undefined || result?.message != "Delete downvote successful") {
                setDownvoteButton(true);
                setDownvote(d => d + 1);
            }
        } else {
            if (upvoteButton) {
                setUpvoteButton(false);
                setDownvoteButton(true);
                setDownvote(d => d + 1);
                setUpvote(u => u - 1);
                const first = await fetchBackendClient<result>(`/modules/${thread?.module_title}/threads/${thread?.id}/upvote`, "DELETE");
                if (first?.message === undefined || first?.message != "Delete upvote successful") {
                    setUpvoteButton(true);
                    setDownvoteButton(false);
                    setDownvote(d => d - 1);
                    setUpvote(u => u + 1);
                    return;
                }
                const second = await fetchBackendClient<result>(`/modules/${thread?.module_title}/threads/${thread?.id}/downvote`, "POST");
                if (second?.message === undefined || second?.message != "Downvote successful") {
                    setUpvoteButton(true);
                    setDownvoteButton(false);
                    setDownvote(d => d - 1);
                    setUpvote(u => u + 1);
                    return;
                }
            } else {
                setDownvoteButton(true);
                setDownvote(d => d + 1);
                const result = await fetchBackendClient<result>(`/modules/${thread?.module_title}/threads/${thread?.id}/downvote`, "POST");
                if (result?.message === undefined || result?.message != "Downvote successful") {
                    setDownvoteButton(false);
                    setDownvote(d => d - 1);
                }
            }
        }
    }

    return (
        <div className="w-200 h-auto p-4 flex flex-col gap-2 shadow-md rounded-md bg-gradient-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100%">
            <div className="w-200 h-auto flex flex-col gap-2">
                <Link href={`/${thread?.username}`}>
                    <div className="flex gap-2">
                        <AvatarWithOnline imageUrl={thread?.pfp_url} size="2" />
                        <h3 className="w-full flex items-center font-semibold">{thread?.first_name} {thread?.last_name}</h3>
                    </div>
                </Link>
                <h2 className="text-2xl font-semibold">{thread?.title}</h2>
                {
                    thread?.image_url != undefined && thread.image_url != null
                        ? (
                            <div className="w-192 h-108">
                                <img src={thread?.image_url} className="w-full h-full object-cover rounded-md" />
                            </div>
                        )
                        : null
                }
                <p className="">{thread?.body}</p>
            </div>
            <div className="flex gap-3 h-8">
                <div className="flex w-max py-1.5 px-2 border-1 border-white/40 rounded-full text-[80%] gap-2" 
                    style={upvoteButton 
                            ? {background: "linear-gradient(to right, rgba(140, 82, 255, 0.5) 30%, rgba(255, 87, 87, 0.2) 100%)"}
                            : downvoteButton
                                ? {background: "linear-gradient(to left, rgba(140, 82, 255, 0.5) 30%, rgba(255, 87, 87, 0.2) 100%)"}
                                : {background: "rgba(0, 0, 0, 0.2)"}
                }>
                    <div onClick={handleUpvoteButton} className="flex gap-1 hover:cursor-pointer"
                        style={upvoteButton 
                                ? {color: "rgba(255, 255, 255, 1)"} 
                                : downvoteButton
                                    ? {color: "rgba(255, 255, 255, 0.6"}
                                    : {color: "rgba(255, 255, 255, 1)"}
                        }>
                        <FaChevronUp className="text-xl" />
                        <h3 className="font-semibold">{formatNumber(upvote)}</h3>
                    </div>
                    <div onClick={handleDownvoteButton} className="flex gap-1 hover:cursor-pointer" 
                        style={upvoteButton 
                                ? {color: "rgba(255, 255, 255, 0.6)"} 
                                : downvoteButton
                                    ? {color: "rgba(255, 255, 255, 1"}
                                    : {color: "rgba(255, 255, 255, 1)"}
                        }>
                        <FaChevronDown className= "text-xl" />
                        <h3 className="font-semibold">{formatNumber(downvote)}</h3>
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
                    ? (<div className="w-full">
                        {newReplies?.length > 0 ? newReplies?.toReversed().map(r => <Reply key={r?.id} reply={r} moduleCode={thread?.module_title} />) : null}
                        {replies?.map(r => <Reply key={r?.id} reply={r} moduleCode={thread?.module_title} />)}
                        </div>)
                    : null
            }
        </div>
    );
}