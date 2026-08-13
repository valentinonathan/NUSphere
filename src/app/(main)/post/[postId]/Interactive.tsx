"use client";
import { IoChatbubble } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import GroupAvatar from "@/components/groupAvatar";
import { useEffect, useRef, useState } from "react";
import { formatNumber } from "@/utils/valueConverter";
import { fetchBackendClient } from "@/utils/fetch-backend-client";
import AvatarWithOnline from "@/components/avatarWithOnline"

type commentData = {
    id: number,
    post_id: number,
    user_id: number,
    content: string,
    first_name: string,
    last_name: string,
    pfp_url: string
}

export default function Interactive({imageUrl, likesCount, commentsCount, postId, hasLiked, firstName, lastName, caption, commentsData}: 
    {imageUrl: string, likesCount: number, commentsCount: number, postId: number, hasLiked: boolean, firstName: string, lastName:string, caption: string, commentsData: commentData[]}) {
    const [likes, setLikes] = useState(likesCount);
    const [likeColor, setLikeColor] = useState(hasLiked ? "red" : "white");
    const [comments, setComments] = useState(commentsCount);
    const [commentsDataState, setCommentsDataState] = useState<commentData[]>(commentsData);

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

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
    function handleCommentClick() {
        textAreaRef?.current?.focus();
    }
    async function handlePostComment() {
        const content = textAreaRef?.current?.value;

        if (content?.length === undefined || content?.length == 0) {
            return;
        }

        type postComment = {
            id: number, 
            post_id: number,
            user_id: number,
            content: string,
            first_name: string,
            last_name: string,
            pfp_url: string
        }
        type postCommentData = {
            message: string,
            comment: postComment;
        }

        // If success
        const postCommentData = await fetchBackendClient<postCommentData>(`/comments/${postId}`, "POST", {comment: content});
        if (postCommentData?.message != undefined && postCommentData.message == "Comment successfully posted") {
            const commentReturn: postComment = postCommentData?.comment;
            const commentState: commentData = {id: commentReturn?.id, post_id: commentReturn?.post_id, 
                user_id: commentReturn?.user_id, content: commentReturn?.content, first_name: commentReturn?.first_name, last_name: commentReturn?.last_name, pfp_url: commentReturn?.pfp_url};

            if (textAreaRef?.current?.value != undefined) {
                textAreaRef.current.value = "";
            }
            setCommentsDataState(c => [...c, commentState]);
            setComments(c => c + 1);
        }
    }

    return (
        <>
        <div className="flex-1 flex flex-col gap-2 max-h-107 overflow-y-auto p-2 bg-black/10 no-scrollbar">
            {
                caption != null 
                    ? <div className="flex min-w-full w-full items-center pb-2">
                        <AvatarWithOnline imageUrl={imageUrl} size="2" />
                        <div className="px-2 max-w-full">
                            <h3 className="font-semibold inline">{firstName} {lastName}</h3>
                            <p className="inline">&nbsp;&nbsp;</p>
                            <p className="break-words inline">{caption}</p>
                        </div>
                        </div>
                    : null
            }

            {commentsDataState?.map(c => 
                    <div key={c?.id} className="flex min-w-full w-full items-center pb-2">
                        <AvatarWithOnline imageUrl={c?.pfp_url} size="2" />
                        <div className="px-2 max-w-full">
                            <h3 className="font-semibold inline">{c?.first_name} {c?.last_name}</h3>
                            <p className="inline">&nbsp;&nbsp;</p>
                            <p className="break-words inline">{c?.content}</p>
                        </div>
                    </div>
            )}
        </div>
        <div className="min-h-28 max-h-28 rounded-br-md p-2 pr-6 gap-2 flex flex-col bg-gradient-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100%">
            <div className="px-2 min-w-full max-h-max flex">
                <div className="flex gap-2 justify-start items-center min-w-18 max-w-18">
                    <FaHeart onClick={handleLike} className="text-[165%] hover:cursor-pointer" style={{"color": likeColor}}/>
                    {formatNumber(likes == null ? 0 : likes)}
                </div>
                <div className="flex gap-2 justify-start items-center min-w-18 max-w-18">
                    <IoChatbubble onClick={handleCommentClick} className="text-[165%] hover:cursor-pointer"/>
                    {formatNumber(comments == null ? 0 : comments)}
                </div>
                <div className="flex gap-2 justify-start items-center min-w-18 max-w-18">
                    <IoSend className="text-[165%]"/>
                </div>
            </div>
            {/* <div className="ml-2 flex gap-2">
                <GroupAvatar />
                <p className="text-sm">Liked by Calvin Yoel and 100k others</p>
            </div> */}
            <textarea onKeyDown={(e) => {if (e.key === "Enter") {e.preventDefault(); handlePostComment();}}} ref={textAreaRef} placeholder="Add a comment..." className="min-w-full flex-1 ml-2 focus:outline-0 resize-none" />
        </div>
        </>
    );
}