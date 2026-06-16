import Image from "next/image"
import Link from "next/link"
import type { Event } from "./page"

const EventPost = ({ id, username, title, description, location, start_time }: Event) => {
  return (
    <div className="max-w-200 shadow-black/10 shadow-md bg-linear-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100% rounded-md p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-slate-600">{start_time}</p>
          <p className="text-sm text-slate-500">created by {username}</p>
        </div>
        <Link
          href={`/events/edit?id=${id}`}
          className="rounded-md bg-pink-500 px-3 py-2 text-sm font-medium text-white hover:bg-pink-600"
        >
          Edit
        </Link>
      </div>
      {/* <Image
        height={100}
        width={200}
        src={imageURL}
        alt={title}
        className="mb-3 h-100 w-200 rounded-md object-cover"
      /> */}
      <p>{description}</p>
    </div>
  )
}

export default EventPost