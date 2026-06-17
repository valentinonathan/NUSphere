import AvatarWithOnline from "@/components/avatarWithOnline"

export default function Comment({firstName, lastName, caption}: {firstName: string, lastName:string, caption: string}) {
    return (
        <div className="flex min-w-full w-full items-center pb-2">
            <AvatarWithOnline size="2" />
            <div className="px-2 max-w-full">
                <h3 className="font-semibold inline">{firstName} {lastName}</h3>
                <p className="inline">&nbsp;&nbsp;</p>
                <p className="break-words inline">{caption}</p>
            </div>
        </div>
    )
}