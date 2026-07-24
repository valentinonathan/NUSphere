import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import profile from "../../public/Profile.png";

export default function AvatarWithOnline({size, imageUrl}: Readonly<{size: string, imageUrl: string}>) {
    return (
        // <Avatar className="w-auto" style={{height: `${size}rem`, width: `${size}rem`}}>
        //     <AvatarImage src={profile.src} alt="@shadcn" />
        //     <AvatarFallback>CN</AvatarFallback>
        //     <AvatarBadge className="bg-green-600 dark:bg-green-800" />
        // </Avatar>
        <div className="overflow-hidden rounded-full" style={{height: `${size}rem`, width: `${size}rem`}}>
            <img src={!imageUrl ? profile.src : imageUrl} className="w-full h-full rounded-full" />
        </div>
    );
}