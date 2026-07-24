import { fetchBackendServer } from "@/utils/fetch-backend-server";
import { cookies } from "next/headers";
import "../../globals.css";
import EventPostHome from "./EventPostHome";



export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  type ApiResponse<T> = {
    data: T
  }
  type Event = {
    id: number
    username: string
    title: string
    description: string
    location: string
    start_time: string
    url: string
  }

  const response = await fetchBackendServer<ApiResponse<Event[]>>("/events", "GET");
  const events = response?.data;

  return (
    <div className="flex min-h-full min-w-full w-full">
      {children}
      <div className="overflow-y-scroll no-scrollbar z-1 p-4 px-6 shadow-black/10 shadow-md rounded-md bg-gradient-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100% fixed top-21 right-4" style={{minWidth:"calc((100vw - 12.5rem)/2)", width:"calc((100vw - 12.5rem)/2)", maxWidth:"calc((100vw - 12.5rem)/2)", minHeight:"calc(100vh - 6.25rem)", maxHeight:"calc(100vh - 6.25rem)", height: "calc(100vh - 6.25rem)"}}>
        <h2 className="font-momo text-2xl mb-2">Events Happening Around NUS</h2>
        <div className="flex flex-col gap-3">
          {events?.length !== undefined && events?.length > 0 ? (
            events?.map((post) => <EventPostHome key={post.id} {...post} />)
          ) : (
            <div className="rounded-md border border-dashed border-slate-400 p-6 text-center text-slate-700">
              No events found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

