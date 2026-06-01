import AvatarWithOnline from "@/components/avatarWithOnline";
import { MdOutlineHomeWork } from "react-icons/md";
import { IoGlobeOutline } from "react-icons/io5";
import { TabGroup } from "@/components/tabgroup";
import post from "../../../../public/post-dummy.png";

export default async function ProfileLayout({
  children, 
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}>) {

    const { username } = await params;

    return (
        <div className="flex justify-center min-w-full pt-10">
        <div className="flex flex-col gap-10 justify-center items-center">

          <div className="flex gap-10 min-h-max max-w-180">
            <div className="min-h-full min-w-max flex flex-col justify-between">
              <AvatarWithOnline size="8"/>
              <p>
                <span className="font-semibold">1k</span> friends <br />
                <span className="font-semibold">53</span> posts
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold">Valentino Nathan <span className="text-sm">@{username}</span></h1>
              <h2>Year 1 Computer Science Undergraduate</h2>
              <div className="flex gap-8">
                <div className="flex gap-2 text-sm">
                  <div className="min-h-4 min-w-4 flex justify-center items-center">
                    <MdOutlineHomeWork className="text-lg" />
                  </div>
                  PGPR Residences
                </div>
                <div className="flex gap-2 text-sm">
                  <div className="min-h-4 min-w-4 flex justify-center items-center">
                    <IoGlobeOutline className="text-lg" />
                  </div>
                  International, Indonesia
                </div>
              </div>
              <p className="break-words">"I have been crucified with Christ, and it is no longer I who live, but Christ lives in me." ~Galatians 2:20</p>
              <TabGroup options={["Posts", "Events", "Market"]}/>
            </div>
          </div>

          <div className="grid grid-cols-3 max-w-200 gap-1">
            <a href="/post">
            <img src={post.src} className="aspect-[4/5] w-full object-cover" />
            </a>
            <a href="/post">
            <img src={post.src} className="aspect-[4/5] w-full object-cover" />
            </a>
            <a href="/post">
            <img src={post.src} className="aspect-[4/5] w-full object-cover" />
            </a>
            <a href="/post">
            <img src={post.src} className="aspect-[4/5] w-full object-cover" />
            </a>
            <a href="/post">
            <img src={post.src} className="aspect-[4/5] w-full object-cover" />
            </a>
            <a href="/post">
            <img src={post.src} className="aspect-[4/5] w-full object-cover" />
            </a>
          </div>

        </div>
        </div>
    );
}