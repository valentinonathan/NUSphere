import { fetchBackendServer } from "@/utils/fetch-backend-server";
import PeopleBadge from "./PeopleBadge"

export default async function PeopleCarousel({heading, query}: {heading: string, query: string}) {
    type userData = {id: number, username: string, first_name: string, last_name: string, nationality: string, year: string, faculty: string, major: string, residence: string, bio: string, friends: number};
    type usersData = {message: string, users: userData[], page: number, total: number};

    const usersData = await fetchBackendServer<usersData>("/users" + (query === undefined ? "" : query), "GET");
    const usersResult = usersData?.users;
    if (usersData?.message != undefined && usersData.message == "Query successful") {
        return (
            <div className="flex flex-col gap-2 min-w-full max-w-full">
                <h1 className="text-3xl font-semibold">{heading}</h1>
                <div className="flex flex-wrap gap-4">
                {usersResult?.length == undefined || usersResult?.length == 0 
                        ? null 
                        : usersResult.map(u => <PeopleBadge key={u?.id} username={u?.username} first_name={u?.first_name} last_name={u?.last_name} year={u?.year} residence={u?.residence} nationality={u?.nationality} major={u?.major} />)
                }
                </div>
            </div>
        );
    } else {
        return (
            <></>
        );
    }
}