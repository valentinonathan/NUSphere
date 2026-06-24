"use client"

import { useRouter } from "next/navigation"
import { useCallback, useRef, useState } from "react"
import Cropper from "react-easy-crop"
import { IoChevronBack } from "react-icons/io5"
import { fetchBackendClient } from "@/utils/fetch-backend-client"
import { Event } from "../page"

type ApiResponse<T> = {
  data?: T
  message?: T
}

interface Area {
  x: number
  y: number
  width: number
  height: number
}

const page = () => {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [startTime, setStartTime] = useState("")
  const [error, setError] = useState("")

  const [imagePreview, setImagePreview] = useState("")
  const [loading, setLoading] = useState(false)

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const exportWidth = 768
  const exportHeight = 300

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (
      !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)
    ) {
      setError("Only image files are allowed (jpeg, png, webp, gif)")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large (max 5MB)")
      return
    }

    setError("")

    const reader = new FileReader()
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string)
      setZoom(1)
      setCrop({ x: 0, y: 0 })
      setCroppedAreaPixels(null)
    }
    reader.readAsDataURL(file)

    e.target.value = ""
  }

  const onCropComplete = useCallback((_: Area, cropped: Area) => {
    setCroppedAreaPixels(cropped)
  }, [])

  const generateCroppedBlob = async (): Promise<Blob | null> => {
    if (!imagePreview || !croppedAreaPixels) return null

    const image = new Image()
    image.src = imagePreview

    await new Promise<void>((resolve) => {
      image.onload = () => resolve()
    })

    const canvas = canvasRef.current
    if (!canvas) return null

    

    canvas.width = exportWidth
    canvas.height = exportHeight

    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    ctx.clearRect(0, 0, exportWidth, exportHeight)

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      exportWidth,
      exportHeight
    )

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.95)
    })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault()

      if (!title || !description || !location || !startTime) {
        setError("Please fill in every field before creating the event.")
        return
      }

      if (!imagePreview) {
        setError("Please select an image for the event.")
        return
      }

      setLoading(true)
      setError("")

      const croppedBlob = await generateCroppedBlob()
      if (!croppedBlob) {
        throw new Error("Failed to crop image")
      }

      const formData = new FormData()
      formData.append("image", croppedBlob, "event-image.jpg")
      formData.append("title", title)
      formData.append("description", description)
      formData.append("location", location)
      formData.append("start_time", new Date(startTime).toISOString())

      // const response = await fetchBackendClient<{ message: string }>("/events", "POST", formData)
      const response = await fetch("/api/events", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create event");
      }

      router.push("/events")
    } catch (error) {
      console.log(error)
      setError(
        error instanceof Error ? error.message : "Failed to create event"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="mx-auto flex min-h-screen max-w-4xl items-center justify-center p-4 text-black"
      style={{ minHeight: "calc(100vh - 6.25rem)" }}
    >
      <div className="w-full rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md p-2 hover:bg-slate-100"
            title="Go back"
          >
            <IoChevronBack className="text-2xl" />
          </button>
          <h1 className="text-2xl font-semibold">Create Event</h1>
        </div>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Event image</span>

            {!imagePreview ? (
              <div className="mt-1">
                <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 px-6 py-10 hover:border-slate-400">
                  <p className="mb-1 text-sm font-medium text-slate-700">
                    Click to upload an image
                  </p>
                  <p className="text-xs text-slate-500">JPEG, PNG, WebP, GIF • max 5MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="mt-2 space-y-3">
                <div
                  className="relative overflow-hidden rounded-md border border-slate-300 bg-black"
                  style={{ aspectRatio: exportWidth/exportHeight }}
                >
                  <Cropper
                    image={imagePreview}
                    crop={crop}
                    zoom={zoom}
                    aspect={exportWidth / exportHeight}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    minZoom={1}
                    maxZoom={3}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="min-w-14 text-sm font-medium text-slate-700">
                    Zoom:
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="h-2 flex-1 cursor-pointer rounded-lg bg-slate-200"
                  />
                  <span className="min-w-12 text-right text-sm text-slate-600">
                    {zoom.toFixed(1)}x
                  </span>
                </div>

                <label className="inline-flex w-fit cursor-pointer items-center rounded-md bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600">
                  Change Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </label>

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
            <span className="block text-sm font-medium text-slate-700">
              Start Time
            </span>
            <input
              id="start_time"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="rounded border px-3 py-2"
            />
          </label>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading || !imagePreview}
              className="rounded-md bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-pink-300"
            >
              {loading ? "Creating..." : "Create Event"}
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

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}

export default page