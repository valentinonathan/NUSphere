import { fetchBackendServer } from "@/utils/fetch-backend-server";
import FindPeople from "./FindPeople";
import PeopleCarousel from "./PeopleCarousel";

type userDetails = {
  id: number,
  username: string,
  firstName: string,
  lastName: string,
  nationality: string,
  year: string,
  faculty: string,
  major: string,
  residence: string,
  bio: string,
  message: string,
  friends: number
}

export default async function PeopleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  type data = {
    message: string,
    loggedIn: boolean,
    username: string,
    userId: number
  }
  const data: data = await fetchBackendServer<data>("", "GET");
  const userDetails = await fetchBackendServer<userDetails>(`/users/id/${data?.userId}`, "GET");
  const is_display = !(userDetails?.message != undefined && userDetails.message == "Username not found");
  
    return (
        <div className="flex flex-col gap-8 min-w-full w-full p-4 max-w-full items-center">
          <FindPeople />
          {
            is_display 
              ? (
                <>
                <PeopleCarousel heading={`People from ${userDetails?.faculty}`} query={userDetails?.faculty != null ? `?faculty=${userDetails.faculty.replace(/\s+/g, "+")}&is_strict_filter=true` : ""}/>
                <PeopleCarousel heading={`People from ${userDetails?.residence}`} query={userDetails?.residence != null ? `?residence=${userDetails.residence.replace(/\s+/g, "+")}&is_strict_filter=true` : ""}/>
                <PeopleCarousel heading={`People from ${userDetails?.major}`} query={userDetails?.major != null ? `?major=${userDetails.major.replace(/\s+/g, "+")}&is_strict_filter=true` : ""}/>
                <PeopleCarousel heading={userDetails?.year} query={userDetails?.year != null ? `?year=${userDetails.year.replace(/\s+/g, "+")}&is_strict_filter=true` : ""}/>
                <PeopleCarousel heading={userDetails?.nationality + "s"} query={userDetails?.nationality != null ? `?nationality=${userDetails.nationality.replace(/\s+/g, "+")}&is_strict_filter=true` : ""}/>
                </>
              )
              : null 
          }
        </div>
    );
}