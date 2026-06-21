import { fetchBackendServer } from "@/utils/fetch-backend-server";
import Post from "../post/[postId]/Post";
import ClientFeed from "./ClientFeed";


export default async function Home() {
  type post = {
    id: string,
    created_at: string
  }
  type feedData = {
    posts: post[]
    page: number,
    total: number
  }
  const feedData = await fetchBackendServer<feedData>(`/posts/feed?page=1`, "GET");

  return (
    <div className="flex justify-center min-h-full min-w-1/2">
      <div className="min-h-full min-w-1/2 flex flex-col items-center gap-10">
          {feedData?.posts?.map(p => <Post key={p.id} postId={p?.id} />)}
          <div className="min-h-[50px]"></div>
      </div>
    </div>
  );
}
