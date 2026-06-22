// app/events/[id]/page.tsx
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { fetchBackendClient } from "@/utils/fetch-backend-client"
import { IndividualEvent } from "./IndividualEvent"
import { useRouter } from "next/navigation"

type Event = {
    id: number
    username: string
    title: string
    description: string
    location: string
    start_time: string
}

type Attendee = {
    id: number
    username: string
}

type ApiResponse<T> = {
    data: T
}

type AttendanceResponse = {
    containUser: true
    rows: Attendee[]
    count: number
}

export default function EventDetailPage() {
    const router = useRouter()
    const params = useParams()
    const rawId = params?.id
    const eventId = Array.isArray(rawId) ? rawId[0] : rawId

    
    const [event, setEvent] = useState<Event | null>(null)
    const [attendees, setAttendees] = useState<Attendee[]>([])
    const [attendanceCount, setAttendanceCount] = useState(0)
    const [myAttendance, setMyAttendance] = useState<boolean>(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const handleSubmit = async () => {
        try {
            setLoading(true)
            setError("")
            const attendanceResponse = await fetchBackendClient<ApiResponse<Event>>(
                `/events/${eventId}/attendance`,
                "POST"
            )
            setMyAttendance(true)
            // router.push("/events")
        } catch (err) {
            console.log(err)
            setError("Failed to submit attendance.")
        } finally {
            setLoading(false)
        }
    }

    const handleUnsubmit = async () => {
        try {
            setLoading(true)
            setError("")
            const attendanceResponse = await fetchBackendClient<ApiResponse<Event>>(
                `/events/${eventId}/attendance`,
                "DELETE"
            )
            setMyAttendance(false)
            // router.push("/events")
        } catch (err) {
            console.log(err)
            setError("Failed to unsubmit attendance.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!eventId) return

        async function loadEvent() {
            try {
                setLoading(true)
                setError("")

                const eventResponse = await fetchBackendClient<ApiResponse<Event>>(
                    `/events/${eventId}`,
                    "GET"
                )
                setEvent(eventResponse.data)

                try {
                    const attendanceResponse =
                        await fetchBackendClient<ApiResponse<AttendanceResponse>>(
                            `/events/${eventId}/attendance`,
                            "GET"
                        )

                    setAttendees(attendanceResponse.data.rows ?? [])
                    setAttendanceCount(attendanceResponse.data.count ?? 0)
                    setMyAttendance(attendanceResponse.data.containUser ?? false)
                } catch {
                    setAttendees([])
                    setAttendanceCount(0)
                    setMyAttendance(false)
                }
            } catch (err) {
                console.log(err)
                setError("Failed to load event.")
            } finally {
                setLoading(false)
            }
        }

        loadEvent()
    }, [myAttendance])

    if (loading) {
        return (
            <div className="rounded-md border border-slate-400 p-6 text-center text-slate-700">
                Loading event...
            </div>
        )
    }

    if (error || !event) {
        return (
            <div className="rounded-md border border-red-300 bg-red-50 p-6 text-center text-red-700">
                {error || "Event not found."}
            </div>
        )
    }

    const formattedDate = new Date(event.start_time).toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    })

    // return (
    //     <div className="flex justify-center min-w-full pt-10">
    //         <IndividualEvent />
    //     </div>
    // )

    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
            <Link href="/events">
                <div className="w-fit rounded-md bg-pink-500 px-3 py-2 text-sm font-semibold text-white">
                    Back to events
                </div>
            </Link>


            {/* <div className="min-w-80 min-h-32 flex gap-4 p-5 shadow-black/10 shadow-md bg-gradient-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100% rounded-md"> */}


            <div className="p-6 shadow-black/10 shadow-md bg-gradient-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100% rounded-md">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">{event.title}</h1>
                        <p className="text-sm text-white/70">By {event.username}</p>
                    </div>
                </div>

                <div className="space-y-3 text-sm text-white/80">
                    <p>
                        <span className="font-semibold text-white">Date:</span>{" "}
                        {formattedDate}
                    </p>
                    <p>
                        <span className="font-semibold text-white">Location:</span>{" "}
                        {event.location}
                    </p>
                    <p className="leading-6">
                        <span className="font-semibold text-white">Description:</span>{" "}
                        {event.description}
                    </p>
                    <p>
                        <span className="font-semibold text-white">My Attendance Status:</span>{" "}
                        {myAttendance ? "I'm attending the event" : "I'm not attending the event"}
                    </p>
                    {!myAttendance ? (
                        <form onSubmit={handleSubmit}>
                            <button type="submit">
                            <div className="w-fit rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white">
                                Submit
                            </div>
                            </button>
                        </form>)
                        :
                        (<form onSubmit={handleUnsubmit}>
                            <button type="submit">
                            <div className="w-fit rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white">
                                Unsubmit
                            </div>
                            </button>
                        </form>
                    )}


                </div>
            </div>

            <div className="p-6 shadow-black/10 shadow-md bg-gradient-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100% rounded-md">
                <details open>
                    <summary className="cursor-pointer text-lg font-semibold">
                        Attendance list ({attendanceCount})
                    </summary>

                    <div className="mt-4 space-y-2">
                        {attendees.length > 0 ? (
                            attendees.map((person) => (
                                <div
                                    key={person.id}
                                    className="rounded-md bg-white/10 px-4 py-3 text-sm"
                                >
                                    {person.username}
                                </div>
                            ))
                        ) : (
                            <div className="rounded-md border border-dashed border-slate-400 p-4 text-sm text-slate-300">
                                No attendees yet.
                            </div>
                        )}
                    </div>
                </details>
            </div>

        </div>
    )

}