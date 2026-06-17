import Post from "../post/[postId]/Post";


export default function Home() {
  return (
    <div className="flex justify-center min-h-full min-w-1/2">
      <div className="min-h-full min-w-1/2 flex flex-col items-center gap-10">
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />  
      </div>
    </div>
  );
}
