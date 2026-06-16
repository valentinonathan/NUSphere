import AvatarWithOnline from "@/components/avatarWithOnline";
import { MdOutlineHomeWork } from "react-icons/md";
import { IoGlobeOutline } from "react-icons/io5";
import { TabGroup } from "@/components/tabgroup";
import post from "../../../../public/post-dummy.png";
import { fetchBackendServer } from "@/utils/fetch-backend-server";

export default async function ProfileLayout({
  children, 
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}>) {

    const { username } = await params;

    type userDetails = {
      id: number,
      username: string,
      firstName: string,
      lastName: string,
      nationality: string,
      year: string,
      faculty: string,
      major: string,
      residence: string,
      bio: string
      message: string
    }
    const userDetails = await fetchBackendServer<userDetails>(`/users/username/${username}`, "GET");

    console.log(userDetails);
    
    if (userDetails?.message != undefined && userDetails.message == "Username not found") {
      return (<h1>Username {username} not found </h1>);
    }

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
              <h1 className="text-3xl font-semibold">{userDetails.firstName} {userDetails.lastName} <span className="text-sm">@{username}</span></h1>
              <h2>{userDetails.major} {userDetails.year}</h2>
              <div className="flex gap-8">
                <div className="flex gap-2 text-sm">
                  <div className="min-h-4 min-w-4 flex justify-center items-center">
                    <MdOutlineHomeWork className="text-lg" />
                  </div>
                  {userDetails.residence}
                </div>
                <div className="flex gap-2 text-sm">
                  <div className="min-h-4 min-w-4 flex justify-center items-center">
                    <IoGlobeOutline className="text-lg" />
                  </div>
                  {userDetails.nationality == "Singapore Citizen" || userDetails.nationality == "Singapore PR" ? userDetails.nationality : "International, " + userDetails.nationality}
                </div>
              </div>
              <p className="break-words">{userDetails.bio}</p>
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