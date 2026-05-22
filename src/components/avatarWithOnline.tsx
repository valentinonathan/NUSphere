import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import profile from "../../public/Profile.png";

export default function AvatarWithOnline() {
    return (
        <Avatar className="h-10 w-auto">
            <AvatarImage src={profile.src} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
            <AvatarBadge className="bg-green-600 dark:bg-green-800" />
        </Avatar>
    );
}