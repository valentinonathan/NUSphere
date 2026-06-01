import Post from "./Post";
import AvatarWithOnline from "@/components/avatarWithOnline";
import postDummy from "../../../../public/post-dummy.png"
import { IoChatbubble } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import GroupAvatar from "@/components/groupAvatar";
import Comment from "./Comment";

export default function PostPage() {
    return (
        <div className="min-w-full flex justify-center items-center" style={{minHeight:"calc(100vh - 6.25rem)", maxHeight:"calc(100vh - 6.25rem)", height: "calc(100vh - 6.25rem)"}}>
            <div className="flex justify-start items-center min-w-250 max-w-250 min-h-150 max-h-150 h-150 shadow-black/10 shadow-md rounded-md">
                <div className="w-120 h-150">
                    <img src={postDummy.src} className="object-cover rounded-l-md"></img>
                </div>
                <div className="flex-1 min-h-full flex flex-col justify-between">
                    <div className="flex gap-2 items-center px-2 min-h-15 max-h-15 min-w-full rounded-tr-md bg-gradient-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100%">
                        <AvatarWithOnline size="2.5"/>
                        <h1>Valentino Nathan</h1>
                    </div>
                    <div className="flex-1 max-h-107 overflow-y-auto p-2 bg-black/10 no-scrollbar">
                        <Comment />
                    </div>
                    <div className="min-h-28 max-h-28 rounded-br-md p-2 pr-6 gap-2 flex flex-col bg-gradient-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100%">
                        <div className="px-2 min-w-full max-h-max flex">
                            <div className="flex gap-2 justify-start items-center min-w-18 max-w-18">
                                <FaHeart className="text-[165%]"/>
                                10k
                            </div>
                            <div className="flex gap-2 justify-start items-center min-w-18 max-w-18">
                                <IoChatbubble className="text-[165%]"/>
                                3k
                            </div>
                            <div className="flex gap-2 justify-start items-center min-w-18 max-w-18">
                                <IoSend className="text-[165%]"/>
                            </div>
                        </div>
                        <div className="ml-2 flex gap-2">
                            <GroupAvatar />
                            <p className="text-sm">Liked by Calvin Yoel and 100k others</p>
                        </div>
                        <textarea placeholder="Add a comment..." className="min-w-full flex-1 ml-2 focus:outline-0 resize-none" />
                    </div>

                </div>
            </div>
        </div>
    );
}