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
      <div className="min-w-[50%] flex-1 flex flex-col">
        <div className="min-h-[75%] min-w-full shadow-black/10 shadow-md rounded-md bg-gradient-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100%">

        </div>
      </div>
    </div>
  );
}
