"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { fetchBackendClient } from "@/utils/fetch-backend-client"

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
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [startTime, setStartTime] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault()
      if (!title || !description || !location || !startTime) {
        setError("Please fill in every field before creating the event.")
        return
      }

      const newEvent = {
        "title": title,
        "description": description,
        "location": location,
        "start_time":  new Date(startTime).toISOString()
      }

      const query = await fetchBackendClient<{ message: string }>("/events/create", "POST", newEvent);

      router.push("/events")
    } catch (error) {
      console.log(error)
    } 
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
            placeholder="Enter title"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Description</span>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2"
            placeholder="Enter description"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Venue</span>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2"
            placeholder="Enter location"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-slate-700">Start Time</span>
          <input
            id="start_time"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border rounded px-3 py-2"
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