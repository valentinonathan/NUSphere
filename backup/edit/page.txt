"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const STORAGE_KEY = "nusphere-events"

const formatDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

const page = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const idParam = searchParams.get("id")
  const eventId = idParam ? parseInt(idParam, 10) : null

  const [title, setTitle] = useState("")
  const [user, setUser] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!eventId) {
      setLoaded(true)
      return
    }

    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      setLoaded(true)
      return
    }

    try {
      const events = JSON.parse(stored)
      const existing = events.find((item: any) => item.id === eventId)
      if (existing) {
        setTitle(existing.title)
        setUser(existing.user)
        const parsedDate = new Date(existing.date)
        setDate(Number.isNaN(parsedDate.getTime()) ? "" : parsedDate.toISOString().slice(0, 10))
        setDescription(existing.description)
      }
    } catch {
      // ignore JSON parse errors
    }
    setLoaded(true)
  }, [eventId])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!eventId) {
      setError("No event selected for editing.")
      return
    }

    if (!title || !user || !date || !description) {
      setError("Please fill in every field before saving changes.")
      return
    }

    const stored = localStorage.getItem(STORAGE_KEY)
    const events = stored ? JSON.parse(stored) : []
    const updatedEvents = events.map((item: any) =>
      item.id === eventId
        ? {
            ...item,
            title,
            user,
            date: formatDate(date),
            description,
          }
        : item
    )

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents))
    router.push("/events")
  }

  const handleDelete = () => {
    if (!eventId) {
      setError("No event selected for deletion.")
      return
    }

    // confirm deletion with the user
    const ok = confirm("Are you sure you want to delete this event? This cannot be undone.")
    if (!ok) return

    const stored = localStorage.getItem(STORAGE_KEY)
    const events = stored ? JSON.parse(stored) : []
    const updatedEvents = events.filter((item: any) => item.id !== eventId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents))
    router.push("/events")
  }

  if (!loaded) {
    return <div>Loading event...</div>
  }

  if (!eventId) {
    return (
      <div className="space-y-4 rounded-2xl border border-slate-300 bg-white p-6">
        <p className="text-sm text-slate-700">No event ID specified.</p>
        <Link href="/events" className="text-pink-600 underline">
          Return to events
        </Link>
      </div>
    )
  }

  return (
    <div className="text-black mx-auto max-w-2xl rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-semibold">Edit Event</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Event title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2"
            placeholder="Enter event title"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Hosted by</span>
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2"
            placeholder="Event organizer name"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2"
            rows={5}
            placeholder="Write a brief description of the event"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-md bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.push("/events")}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="ml-auto rounded-md border border-red-400 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  )
}

export default page