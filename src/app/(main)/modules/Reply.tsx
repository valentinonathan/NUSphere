"use client"

import AvatarWithOnline from "@/components/avatarWithOnline";
import postDummy from "../../../../public/post-dummy.png"
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import ReplyTest from "./ReplyTest";
import { formatNumber } from "@/utils/valueConverter";
import Link from "next/link";
import { useRef, useState } from "react";
import { BiComment } from "react-icons/bi";
import { fetchBackendClient } from "@/utils/fetch-backend-client";

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
    has_downvoted: boolean
}

export default function Reply({reply, moduleCode}: {reply: reply, moduleCode: string}) {    

    const [isTextbox, setIsTextbox] = useState(false);
    const textboxRef = useRef<HTMLTextAreaElement | null>(null);
    const [newReplies, setNewReplies] = useState<reply[]>([]);
    const [upvoteButton, setUpvoteButton] = useState(reply?.has_upvoted);
    const [upvote, setUpvote] = useState(reply?.upvote);
    const [downvote, setDownvote] = useState(reply?.downvote);
    const [downvoteButton, setDownvoteButton] = useState(reply?.has_downvoted);

    async function handlePostReply() {
        type result = {message: string, reply: reply};
        const replyBody = textboxRef?.current?.value;
        const result = await fetchBackendClient<result>(`/modules/${moduleCode}/threads/${reply?.thread_id}/replies`, "POST", {parentReplyId: Number(reply?.id), reply: replyBody});
        
        if (result?.message == "Post thread reply successful") {
            newReplies.push(result.reply);
            console.log(result.reply);
            setIsTextbox(false);
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
            const result = await fetchBackendClient<result>(`/modules/${moduleCode}/threads/${reply?.thread_id}/replies/${reply?.id}/upvote`, "DELETE");
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
                const first = await fetchBackendClient<result>(`/modules/${moduleCode}/threads/${reply?.thread_id}/replies/${reply?.id}/downvote`, "DELETE");
                if (first?.message === undefined || first?.message != "Delete downvote successful") {
                    setDownvoteButton(true);
                    setUpvoteButton(false);
                    setUpvote(u => u - 1);
                    setDownvote(d => d + 1);
                    return;
                }
                const second = await fetchBackendClient<result>(`/modules/${moduleCode}/threads/${reply?.thread_id}/replies/${reply?.id}/upvote`, "POST");
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
                const result = await fetchBackendClient<result>(`/modules/${moduleCode}/threads/${reply?.thread_id}/replies/${reply?.id}/upvote`, "POST");
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
            const result = await fetchBackendClient<result>(`/modules/${moduleCode}/threads/${reply?.thread_id}/replies/${reply?.id}/downvote`, "DELETE");
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
                const first = await fetchBackendClient<result>(`/modules/${moduleCode}/threads/${reply?.thread_id}/replies/${reply?.id}/upvote`, "DELETE");
                if (first?.message === undefined || first?.message != "Delete upvote successful") {
                    setUpvoteButton(true);
                    setDownvoteButton(false);
                    setDownvote(d => d - 1);
                    setUpvote(u => u + 1);
                    return;
                }
                const second = await fetchBackendClient<result>(`/modules/${moduleCode}/threads/${reply?.thread_id}/replies/${reply?.id}/downvote`, "POST");
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
                const result = await fetchBackendClient<result>(`/modules/${moduleCode}/threads/${reply?.thread_id}/replies/${reply?.id}/downvote`, "POST");
                if (result?.message === undefined || result?.message != "Downvote successful") {
                    setDownvoteButton(false);
                    setDownvote(d => d - 1);
                }
            }
        }
    }

    return (
        <div className="flex w-full h-auto gap-2">
            <div className="w-max h-auto flex flex-col">
                <Link href={`/${reply?.username}`}>
                    <AvatarWithOnline size="2" />
                </Link>
                <div className="relative flex-1 w-full">
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 bg-white" style={{width:"1px"}}/>
                </div>
            </div>

            <div className="w-full max-w-full">
                <Link href={`/${reply?.username}`}>
                    <h3 className="w-full flex items-center" style={{height:"2rem"}}>{reply?.first_name} {reply?.last_name}</h3>
                </Link>
                <div className="flex flex-col gap-1"> 
                    <p className="">{reply?.body}</p>
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
                        <div onClick={handleTextbox} className="hover:cursor-pointer flex items-center jusitfy-center w-max h-full py-1.5 px-2 bg-black/20 rounded-full text-[80%] gap-1.5">
                            <BiComment className="text-lg" />
                            <h3 className="font-semibold">{isTextbox ? "Send" : "Reply"}</h3>
                        </div>
                    </div>
                    <div className="min-h-1" />
                    {
                        isTextbox
                            ? <textarea ref={textboxRef} placeholder="Type your reply..." className="resize-none border-white/70 border-1 rounded-md p-1.5"/>
                            : null
                    }
                    {
                        (reply?.replies != undefined && reply?.replies?.length > 0) || newReplies.length > 0 
                            ? (<div className="w-full">
                                {newReplies?.length > 0 ? newReplies?.toReversed().map(r => <Reply key={r?.id} reply={r} moduleCode={moduleCode} />) : null}
                                {reply?.replies?.map(r => <Reply key={r?.id} moduleCode={moduleCode} reply={r} />)}
                                </div>)
                            : null
                    }
                </div>
            </div>
        </div>
    );
}