import AvatarWithOnline from "@/components/avatarWithOnline"

type comment = {
        id: number,
        post_id: number,
        user_id: number,
        content: string,
        first_name: string,
        last_name: string
    }

export default function Comment({firstName, lastName, caption, comments}: {firstName: string, lastName:string, caption: string, comments: comment[]}) {
    return (
        <>
        {
            caption != null 
                ? <div className="flex min-w-full w-full items-center pb-2">
                    <AvatarWithOnline size="2" />
                    <div className="px-2 max-w-full">
                        <h3 className="font-semibold inline">{firstName} {lastName}</h3>
                        <p className="inline">&nbsp;&nbsp;</p>
                        <p className="break-words inline">{caption}</p>
                    </div>
                  </div>
                : null
        }

        {comments?.map(c => 
                <div key={c?.id} className="flex min-w-full w-full items-center pb-2">
                    <AvatarWithOnline size="2" />
                    <div className="px-2 max-w-full">
                        <h3 className="font-semibold inline">{c?.first_name} {c?.last_name}</h3>
                        <p className="inline">&nbsp;&nbsp;</p>
                        <p className="break-words inline">{c?.content}</p>
                    </div>
                </div>
        )}
        </>
    )
}