import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar"
import profile from "../../public/Profile.png";

export default function GroupAvatar() {
  return (
    <AvatarGroup className="outline-0">
      <Avatar className="h-5 w-auto">
        <AvatarImage src={profile.src} />
      </Avatar>
      <Avatar className="h-5 w-auto">
        <AvatarImage src="https://github.com/maxleiter.png" />
      </Avatar>
      <Avatar className="h-5 w-auto">
        <AvatarImage src="https://github.com/evilrabbit.png" />
      </Avatar>
    </AvatarGroup>
  )
}
