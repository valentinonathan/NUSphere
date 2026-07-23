"use client"

import EventPost from "./EventPost"
import Link from "next/link"
import { useEffect, useState } from "react"
import { fetchBackendClient } from "@/utils/fetch-backend-client"
import { Timestamp } from "next/dist/server/lib/cache-handlers/types"

export type Event = {
  id: number
  username: string
  title: string
  description: string
  location: string
  start_time: string
  url: string
}

const STORAGE_KEY = "nusphere-events"

type ApiResponse<T> = {
  data: T
}

// const defaultEvents: PostProps[] = [
//   {
//     id: 1,
//     title: "Tech Workshop 2026",
//     user: "Calvin",
//     imageURL: "/post-dummy.png",
//     date: "May 30, 2026",
//     description: "Learn modern web development with Next.js and Prisma.",
//   },
//   {
//     id: 2,
//     title: "Gaming Tournament",
//     user: "Alex",
//     imageURL: "/post-dummy.png",
//     date: "June 5, 2026",
//     description: "Join our weekend Valorant tournament with prizes.",
//   },
//   {
//     id: 3,
//     title: "Music Festival",
//     user: "Sarah",
//     imageURL: "/post-dummy.png",
//     date: "July 12, 2026",
//     description: "Outdoor live music festival featuring local artists.",
//   },
// ]




const page = () => {
  const [search, setSearch] = useState("")
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    // const stored = localStorage.getItem(STORAGE_KEY)
    // if (stored) {
    //   try {
    //     setEvents(JSON.parse(stored))
    //     return
    //   } catch {
    //     // ignore parse errors and reinitialize
    //   }
    // }

    // localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultEvents))
    // setEvents(defaultEvents)
    async function loadEvents() {
      try {
        setLoading(true)
        const response = await fetchBackendClient<ApiResponse<Event[]>>("/events", "GET");
        setEvents(response.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents();

  }, [])

  const filteredEvents = events.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded-md w-full max-w-md bg-black/20 shadow-black/20 shadow-md"
        />
        {/* <Link
          href="/events/create"
          className="inline-flex items-center justify-center rounded-md bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600"
        >
          Create Event
        </Link> */}
      </div>

      <div className="flex flex-col gap-4 flex-1">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((post) => <EventPost key={post.id} {...post} />)
        ) : (
          <div className="rounded-md border border-dashed border-slate-400 p-6 text-center text-slate-700">
            No events found.
          </div>
        )}
      </div>
    </div>
  )
}

export default page