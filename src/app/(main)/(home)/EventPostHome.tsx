import Image from "next/image"
import dummy from "../../../../public/moduledummy.jpg"
import Link from "next/link"
type Event = {
  id: number
  username: string
  title: string
  description: string
  location: string
  start_time: string
  url: string
}


const EventPostHome = ({ id, username, title, description, location, start_time, url }: Event) => {
  function formatEventTime(timestamp: string) {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }
  return (
    <Link href={`events/${id}`}>
    <div className="h-max flex items-start justify-between w-full h-max-w-200 shadow-black/10 shadow-md bg-linear-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100% rounded-md p-4">
      <div className="flex gap-4">
        <img src={url} className="h-[100px] w-[256px] rounded-md object-cover"/>
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <h3 className="text-sm">
            <span className="font-semibold text-white">Date: </span> 
            {formatEventTime(start_time)}
          </h3> 
          <h3 className="text-sm">
            <span className="font-semibold text-white">Venue: </span> 
            {location}
          </h3>
          <h3 className="text-sm">
            <span className="font-semibold text-white">Host: </span> 
            @{username}
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

export default EventPostHome;