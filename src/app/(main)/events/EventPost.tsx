import Image from "next/image"
import Link from "next/link"
import type { Event } from "./page"

const EventPost = ({ id, username, title, description, location, start_time, url }: Event) => {
  function formatEventTime(timestamp: string) {
    return new Date(timestamp).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }
  return (
    <Link href={`events/${id}`}>
    <div className="w-full max-w-200 shadow-black/10 shadow-md bg-linear-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100% rounded-md p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <img src={url} className="mb-3 h-75 w-3xl rounded-md object-cover"/>
          <h3>
            <span className="font-semibold text-white">Date: </span> 
            {formatEventTime(start_time)}
          </h3> 
          <h3>
            <span className="font-semibold text-white">Venue: </span> 
            {location}
          </h3>
          <h3>
            <span className="font-semibold text-white">Host: </span> 
            @{username}
          </h3>
          <h3>
            <span className="font-semibold text-white">Description: </span> 
            {description}
          </h3>
        </div>
        {/* <Link
          href={`/events/edit?id=${id}`}
          className="rounded-md bg-pink-500 px-3 py-2 text-sm font-medium text-white hover:bg-pink-600"
        >
          Edit
        </Link> */}
      </div>
      {/* <Image
        height={100}
        width={200}
        src={imageURL}
        alt={title}
        className="mb-3 h-100 w-200 rounded-md object-cover"
      /> */}
      
    </div>
    </Link>
  )
}

export default EventPost