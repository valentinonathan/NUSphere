
import { IoChatbubble } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import GroupAvatar from "@/components/groupAvatar";
import profile from "../../../../../public/Profile.png";
import { fetchBackendServer } from "@/utils/fetch-backend-server";
import postDummy from "../../../../../public/post-dummy.png";
import PostInteractive from "./PostInteractive";
import Link from "next/link";

export default async function Post({postId}: {postId: string}) {
    type post = {
        id: number,
        user_id: number,
        url: string,
        caption: string,
        likes: number,
        comments: number,
        username: string,
        first_name: string,
        last_name: string,
        message: string
    }
    const post = await fetchBackendServer<post>(`/posts/${postId}`, "GET");

    if (post?.message != undefined && post.message == "Post not found") {
        return (<p>Post not found</p>);
    }

    const likesCount = post?.likes;
    const commentsCount = post?.comments;
    
    type hasLiked = {
        hasLiked: boolean
    }
    const hasLikedData = await fetchBackendServer<hasLiked>(`/posts/${postId}/likes`, "GET");
    let hasLiked: boolean;
    if (hasLikedData?.hasLiked == undefined) {
        hasLiked = false;
    } else {
        hasLiked = hasLikedData.hasLiked;
    }

    return (
        <div className="flex flex-col gap-2 min-w-110 w-110 max-w-110 max-h-500 px-3 pt-3 pb-5 shadow-black/10 shadow-md rounded-md bg-gradient-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100%">
            <div className="flex gap-2 items-center">
                <Link href={`/${post.username}`}>
                <Avatar className="h-9.5 w-auto">
                    <AvatarImage src={profile.src} className=""/>
                </Avatar>
                </Link>
                <Link href={`/${post.username}`}>
                <h2 className="font-semibold">
                    {post?.first_name} {post?.last_name}
                </h2>
                </Link>
            </div>

            <img src={post?.url} className="bg-center bg-cover rounded-sm"></img>

            <PostInteractive likesCount={likesCount} commentsCount={commentsCount} postId={Number(postId)} hasLiked={hasLiked} firstName={post?.first_name} lastName={post?.last_name} caption={post?.caption}/>
        </div>
    );
}