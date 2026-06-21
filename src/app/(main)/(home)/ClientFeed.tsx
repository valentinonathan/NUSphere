import Post from "../post/[postId]/Post";

type post = {
    id: string,
    created_at: string
}
type feedData = {
    posts: post[]
    page: number,
    total: number
}

export default function ClientFeed({feedData}: {feedData: feedData}) {
    return (
        <div className="min-h-full min-w-1/2 flex flex-col items-center gap-10">
            {feedData?.posts?.map(p => <Post key={p.id} postId={p?.id} />)}
            <div className="min-h-[50px]"></div>
        </div>
    );
}