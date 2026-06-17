import { fetchBackendServer } from "@/utils/fetch-backend-server";
import { cookies } from "next/headers";
import "../../globals.css";


export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  type data = {
    message: string,
    loggedIn: boolean,
    username: string,
    userId: number
  }
  const data: data = await fetchBackendServer<data>("", "GET");

  return (
    <div className="flex min-h-full min-w-full w-full">
      {children}
      <div className="z-1 fixed top-21 right-4" style={{minWidth:"calc((100vw - 12.5rem)/2)", width:"calc((100vw - 12.5rem)/2)", maxWidth:"calc((100vw - 12.5rem)/2)", minHeight:"calc(100vh - 6.25rem)", maxHeight:"calc(100vh - 6.25rem)", height: "calc(100vh - 6.25rem)"}}>
        {data?.message}
      </div>
    </div>
  );
}

