import PeopleBadge from "./PeopleBadge"

export default function PeopleCarousel() {
    return (
        <div className="flex flex-col gap-2 min-w-full max-w-full">
            <h1 className="text-3xl font-semibold">People you might know</h1>
            <div className="flex flex-wrap gap-4">
                <PeopleBadge />
                <PeopleBadge />
                <PeopleBadge />
                <PeopleBadge />
            </div>
        </div>
    )
}