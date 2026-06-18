import Post from "./Post";
import AvatarWithOnline from "@/components/avatarWithOnline";
import postDummy from "../../../../../public/post-dummy.png"
import { IoChatbubble } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import GroupAvatar from "@/components/groupAvatar";
import Comment from "./Comment";
import { fetchBackendServer } from "@/utils/fetch-backend-server";
import Link from "next/link";
import { formatNumber } from "@/utils/valueConverter";
import Interactive from "./Interactive";
import { fetchBackendClient } from "@/utils/fetch-backend-client";

export default async function PostPage({params}: {params: Promise<{ postId: string }>}) {
    const { postId } = await params;
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

    type comment = {
        id: number,
        post_id: number,
        user_id: number,
        content: string,
        first_name: string,
        last_name: string
    }
    type commentData = {
        comments: comment[],
        count: number
    }
    const commentData = await fetchBackendServer<commentData>(`/comments/${postId}`, "GET");
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
        <div className="min-w-full flex justify-center items-center" style={{minHeight:"calc(100vh - 6.25rem)", maxHeight:"calc(100vh - 6.25rem)", height: "calc(100vh - 6.25rem)"}}>
            <div className="flex justify-start items-center min-w-250 max-w-250 min-h-150 max-h-150 h-150 shadow-black/10 shadow-md rounded-md">
                <div className="w-120 h-150">
                    <img src={postDummy.src} className="object-cover rounded-l-md"></img>
                </div>
                <div className="flex-1 min-h-full flex flex-col justify-between">
                    <div className="flex gap-2 items-center px-2 min-h-15 max-h-15 min-w-full rounded-tr-md bg-gradient-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100%">
                        <Link href={`/${post?.username}`}>
                        <AvatarWithOnline size="2.5"/>
                        </Link>
                        <Link href={`/${post?.username}`}>
                        <h1>{post?.first_name} {post?.last_name}</h1>
                        </Link>
                    </div>
                    {/* <Interactive likesCount={likesCount} commentsCount={commentsCount} postId={Number(postId)} hasLiked={hasLiked} firstName={post?.first_name} lastName={post?.last_name} caption={post?.caption} commentsData={commentData?.comments}/> */}
                </div>
            </div>
        </div>
    );
}