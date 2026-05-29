"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

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
  const [title, setTitle] = useState("")
  const [user, setUser] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title || !user || !date || !description) {
      setError("Please fill in every field before creating the event.")
      return
    }

    const stored = localStorage.getItem(STORAGE_KEY)
    const existingEvents = stored ? JSON.parse(stored) : []
    const newEvent = {
      id: Date.now(),
      title,
      user,
      imageURL: "/post-dummy.png",
      date: formatDate(date),
      description,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify([newEvent, ...existingEvents]))
    router.push("/events")
  }

  return (
    <div className="text-black mx-auto max-w-2xl rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-semibold">Create Event</h1>
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
            Create Event
          </button>
          <button
            type="button"
            onClick={() => router.push("/events")}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default page