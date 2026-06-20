"use client";

import { IoChatbubble } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import GroupAvatar from "@/components/groupAvatar";
import { useState } from "react";
import { fetchBackendClient } from "@/utils/fetch-backend-client";
import { formatNumber } from "@/utils/valueConverter";
import Link from "next/link";

export default function PostInteractive({likesCount, commentsCount, postId, hasLiked, firstName, lastName, caption}: 
    {likesCount: number, commentsCount: number, postId: number, hasLiked: boolean, firstName: string, lastName:string, caption: string}) {
    const [likes, setLikes] = useState(likesCount);
    const [likeColor, setLikeColor] = useState(hasLiked ? "red" : "white");
    const [comments, setComments] = useState(commentsCount);

    async function handleLike() {
        if (likeColor == "white") {
            setLikeColor("red");
            setLikes(l => l + 1);
            const data = await fetchBackendClient<{message: string}>(`/posts/${postId}/likes`, "POST", {like: true});

            if (data?.message != "Post successfully liked") {
                setLikeColor("white");
                setLikes(l => l - 1);
            }
        } else {
            setLikeColor("white");
            setLikes(l => l - 1);
            const data = await fetchBackendClient<{message: string}>(`/posts/${postId}/likes`, "POST", {like: false});

            if (data?.message != "Post successfully unliked") {
                setLikeColor("red");
                setLikes(l => l + 1);
            }
        }
    }

    return (
        <>
        <div className="px-2 min-w-full flex max-h-max">
            <div className="flex gap-2 justify-start items-center min-w-18 max-w-18">
                <FaHeart onClick={handleLike} className="text-[165%] hover:cursor-pointer" style={{"color": likeColor}}/>
                {formatNumber(likes == null ? 0 : likes)}
            </div>
            <Link href={`/post/${postId}`}>
            <div className="flex gap-2 justify-start items-center min-w-18 max-w-18">
                <IoChatbubble className="text-[165%] hover:cursor-pointer"/>
                {formatNumber(comments == null ? 0 : comments)}
            </div>
            </Link>
            <div className="flex gap-2 justify-start items-center min-w-18 max-w-18">
                <IoSend className="text-[165%]"/>
            </div>
        </div>
        
        <div className="ml-2 flex gap-2">
            <GroupAvatar />
            <p className="text-sm">Liked by Calvin Yoel and 100k others</p>
        </div>

        <div className="px-2 max-w-full">
            <h3 className="font-semibold inline">{firstName} {lastName}</h3>
            <p className="inline">&nbsp;&nbsp;</p>
            <p className="break-words inline">{caption == null ? null : caption}</p>
        </div>
        </>
    );
}