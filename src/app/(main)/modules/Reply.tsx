"use client"

import AvatarWithOnline from "@/components/avatarWithOnline";
import postDummy from "../../../../public/post-dummy.png"
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import ReplyTest from "./ReplyTest";
import { formatNumber } from "@/utils/valueConverter";
import Link from "next/link";
import { useRef, useState } from "react";
import { BiComment } from "react-icons/bi";

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

export default function Reply({reply}: {reply: reply}) {    

    const [isTextbox, setIsTextbox] = useState(false);
    const textboxRef = useRef<HTMLTextAreaElement | null>(null);
    function handleTextbox() {
        setIsTextbox(t => !t);
        textboxRef?.current?.focus()
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
                <div className="flex flex-col gap-2"> 
                    <p className="">{reply?.body}</p>
                    <div className="flex gap-3">
                        <div className="flex w-max py-1.5 px-2 bg-black/20 rounded-full gap-3">
                            <div className="flex gap-1">
                                <FaChevronUp className="text-white text-md" />
                                <h3 className="font-semibold text-[75%]">{formatNumber(reply?.upvote)}</h3>
                            </div>
                            <div className="flex gap-1">
                                <FaChevronDown className="text-white text-md" />
                                <h3 className="font-semibold text-[75%]">{formatNumber(reply?.downvote)}</h3>
                            </div>
                        </div>
                        <div onClick={handleTextbox} className="hover:cursor-pointer flex items-center jusitfy-center w-max h-full py-1.5 px-2 bg-black/20 rounded-full text-[80%] gap-1.5">
                            <BiComment className="text-lg" />
                            <h3 className="font-semibold">{isTextbox ? "Send" : "Reply"}</h3>
                        </div>
                    </div>
                    {
                        isTextbox
                            ? <textarea ref={textboxRef} placeholder="Type your reply..." className="resize-none border-white/70 border-1 rounded-md p-1.5"/>
                            : null
                    }
                    {
                        reply?.replies != undefined && reply?.replies?.length > 0
                            ? (<div className="w-full">{reply?.replies?.map(r => <Reply key={r?.id} reply={r} />)}</div>)
                            : null
                    }
                </div>
            </div>
        </div>
    );
}