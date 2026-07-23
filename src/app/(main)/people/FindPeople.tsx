"use client";

import { useState } from "react";
import FilterPeople from "./FilterPeople";
import { IoAdd } from "react-icons/io5";
import { fetchBackendClient } from "@/utils/fetch-backend-client";
import PeopleBadge from "./PeopleBadge";

export default function FindPeople() {
    type userData = {id: number, username: string, first_name: string, last_name: string, nationality: string, year: string, faculty: string, major: string, residence: string, bio: string, friends: number, pfp_url: string};
    type usersData = {message: string, users: userData[], page: number, total: number};

    const options: string[] = ["Faculty", "Major", "Residence", "Year", "Nationality"];
    const [filters, setFilters] = useState<string[][]>([[crypto.randomUUID(), "", ""], [crypto.randomUUID(), "", ""], [crypto.randomUUID(), "", ""]]);
    const [isFind, setIsFind] = useState(false);
    const [usersResult, setUsersResult] = useState<userData[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    function callbackFilters(filters: string[][]): void {
        setFilters(filters);
        console.log(filters);
    }
    function addFilters() {
        setFilters(f => [...f, [crypto.randomUUID(), "", ""]]);
    }
    
    async function handleSubmit(e: React.MouseEvent) {
        e.preventDefault();
        const filtersClone = structuredClone(filters);
        filtersClone.map(f => {
            f[1] = f[1].toLowerCase(); 
            f[2] = f[2].replace(/\s+/g, "+");
            return f;
        });

        const filterMap:string[] = ["", "", "", "", ""];

        for (let i = 0; i < filtersClone.length; ++i) {
            if (filtersClone[i][1] == "faculty") {
                if (filterMap[0].length == 0) {
                    filterMap[0] = filtersClone[i][2];
                } else {
                    filterMap[0] = filterMap[0] + "," + filtersClone[i][2];
                }
            }
            if (filtersClone[i][1] == "major") {
                if (filterMap[1].length == 0) {
                    filterMap[1] = filtersClone[i][2];
                } else {
                    filterMap[1] = filterMap[1] + "," + filtersClone[i][2];
                }
            }
            if (filtersClone[i][1] == "residence") {
                if (filterMap[2].length == 0) {
                    filterMap[2] = filtersClone[i][2];
                } else {
                    filterMap[2] = filterMap[2] + "," + filtersClone[i][2];
                }
            }
            if (filtersClone[i][1] == "year") {
                if (filterMap[3].length == 0) {
                    filterMap[3] = filtersClone[i][2];
                } else {
                    filterMap[3] = filterMap[3] + "," + filtersClone[i][2];
                }
            }
            if (filtersClone[i][1] == "nationality") {
                if (filterMap[4].length == 0) {
                    filterMap[4] = filtersClone[i][2];
                } else {
                    filterMap[4] = filterMap[4] + "," + filtersClone[i][2];
                }
            }
        }

        let query:string = "";
        let firstQuery = true;
        
        for (let i = 0; i < filterMap.length; ++i) {
            if (i == 0) {
                if (filterMap[i].length != 0) {
                    if (firstQuery) {
                        query = query + "?faculty=" + filterMap[i];
                        firstQuery = false;
                    } else {
                        query = query + "&faculty=" + filterMap[i];
                    }
                }
            }
            if (i == 1) {
                if (filterMap[i].length != 0) {
                    if (firstQuery) {
                        query = query + "?major=" + filterMap[i];
                        firstQuery = false;
                    } else {
                        query = query + "&major=" + filterMap[i];
                    }
                }
            }
            if (i == 2) {
                if (filterMap[i].length != 0) {
                    if (firstQuery) {
                        query = query + "?residence=" + filterMap[i];
                        firstQuery = false;
                    } else {
                        query = query + "&residence=" + filterMap[i];
                    }
                } 
            }
            if (i == 3) {
                if (filterMap[i].length != 0) {
                    if (firstQuery) {
                        query = query + "?year=" + filterMap[i];
                        firstQuery = false;
                    } else {
                        query = query + "&year=" + filterMap[i];
                    }
                }
            }
            if (i == 4) {
                if (filterMap[i].length != 0) {
                    if (firstQuery) {
                        query = query + "?nationality=" + filterMap[i];
                        firstQuery = false;
                    } else {
                        query = query + "&nationality=" + filterMap[i];
                    }
                }
            }
        }

        const usersData = await fetchBackendClient<usersData>("/users" + query, "GET");
        if (usersData?.message != undefined && usersData.message == "Query successful") {
            setIsFind(true);
            setUsersResult(usersData.users);
        } else {
            setErrorMessage(usersData?.message != undefined ? usersData.message : "Find people unsuccessful");
        }
    }

    return (
        <div className="min-w-full flex flex-col items-center gap-4 max-w-full  ">
            <h1 className="text-4xl font-momo">Discover Your People:</h1>
            <div className="min-w-full flex gap-4 flex-wrap justify-center">
                {filters.map(f => <FilterPeople key={f[0]} identifier={f[0]} options={options} filters={filters} callback={callbackFilters} />)}
                <div className="flex justify-center items-center min-w-20 min-h-32 max-h-32">
                    <button onClick={addFilters} className="p-0 m-0">
                        <IoAdd className="text-4xl text-white/80 hover:cursor-pointer"/>
                    </button>
                </div>
            </div>
            <button type="submit" onClick={e => handleSubmit(e)} className="min-w-20 bg-pink-500 p-2 rounded-sm shadow-md shadow-black/10 hover:cursor-pointer hover:bg-secondary/80 transition duration-100 hover:shadow-lg">Find</button>
            {isFind ? <h1 className="text-3xl font-momo mt-4">Results:</h1> : null}
            <div className="flex flex-wrap gap-4 justify-center">
                {usersResult?.length == undefined || usersResult?.length == 0 
                    ? null 
                    : usersResult.map(u => <PeopleBadge imageUrl={u?.pfp_url} key={u?.id} username={u?.username} first_name={u?.first_name} last_name={u?.last_name} year={u?.year} residence={u?.residence} nationality={u?.nationality} major={u?.major} />)
                }
                {errorMessage}
            </div>
        </div>
    );
}