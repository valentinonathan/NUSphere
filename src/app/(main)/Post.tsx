import post from "../../../public/post-dummy.png";
import { IoChatbubble } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import GroupAvatar from "@/components/groupAvatar";
import profile from "../../../public/Profile.png";

export default function Post() {
    return (
        <div className="flex flex-col gap-2 min-w-110 w-110 max-w-110 max-h-500 px-3 pt-3 pb-5 shadow-black/10 shadow-md rounded-md bg-gradient-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100%">
            <div className="flex gap-2 items-center">
                <a href="/_valentino_nathan_">
                <Avatar className="h-9.5 w-auto">
                    <AvatarImage src={profile.src} className=""/>
                </Avatar>
                </a>
                <a href="/_valentino_nathan">
                <h2 className="font-semibold">
                    Valentino Nathan
                </h2>
                </a>
            </div>

            <img src={post.src} className="bg-center bg-cover rounded-sm"></img>

            <div className="px-2 min-w-full flex max-h-max">
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

            <div className="px-2 max-w-full">
                <h3 className="font-semibold inline">Valentino Nathan</h3>
                <p className="inline">&nbsp;&nbsp;</p>
                <p className="break-words inline">Side questing in Gardens by The Bay!</p>
            </div>
        </div>
    );
}