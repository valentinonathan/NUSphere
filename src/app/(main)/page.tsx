import background from "../../public/home_background.png";
import Post from "./Post";


export default function Home() {
  return (
    <div className="flex min-h-full w-full">
      <div className="min-h-full min-w-[50%] flex flex-col items-center gap-10">
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />  
      </div>
      <div className="min-w-[50%] flex-1">
      </div>
    </div>
  );
}
