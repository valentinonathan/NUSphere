import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import profile from "../../public/Profile.png";

export default function AvatarWithOnline({size,}: Readonly<{size: string}>) {
    return (
        <Avatar className="w-auto" style={{height: `${size}rem`, width: `${size}rem`}}>
            <AvatarImage src={profile.src} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
            <AvatarBadge className="bg-green-600 dark:bg-green-800" />
        </Avatar>
    );
}