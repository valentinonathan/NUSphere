"use client";

import { useParams } from "next/navigation";
import Thread from "../../Thread"
import { useEffect, useState } from "react";
import { fetchBackendClient } from "@/utils/fetch-backend-client";

export default function ModuleCategory() {
    type thread = {
        id: number,
        user_id: number,
        username: string,
        module_id: number,
        title: string,
        image_url: string,
        body: string,
        upvote: number,
        downvote: number,
        replies: number,
        category: string,
        week: number,
        created_at: string,
        first_name: string,
        last_name: string,
        module_title: string,
        has_upvoted: boolean,
        has_downvoted: boolean
    }
    type threads = {0: thread[], 1: thread[], 2: thread[], 3: thread[], 4: thread[], 5: thread[], 6: thread[], 7: thread[], 8: thread[], 9: thread[], 10: thread[], 11: thread[], 12: thread[], 13: thread[]}
    
    const params = useParams();
    const moduleCode = params.module;
    const category = params.category;
    const [threads, setThreads] = useState<threads>();
    const weeks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

    useEffect(() => {
        async function fetchThreads() {
            const fetchResult = await fetchBackendClient<threads>(`/modules/${moduleCode}/threads/?category=${category}`, "GET");
            console.log(fetchResult);
            setThreads(fetchResult);
        }
        fetchThreads();
    }, [moduleCode, category]);

    if (params.category == "Lecture" || params.category == "Tutorial" || params.category == "Assignment" || params.category == "Exam") {
        return (
            <div className="py-4 flex flex-col gap-8 items-center bg-black/15 rounded-bl-md" style={{width:"calc(100% - 13.75rem)"}}>
                {   
                   
                    weeks.map(w => 
                         // @ts-ignore
                        threads?.[w]?.length > 0
                            ? (
                                <div key={w} className="flex flex-col gap-2">
                                    <h2 className="text-xl font-semibold">Week {w}</h2>
                                    <div className="flex flex-col gap-4">
                                        {
                                            // @ts-ignore
                                            threads?.[w]?.map(t => <Thread thread={t} key={t?.id} />)
                                        }
                                    </div>
                                </div>
                            )
                            : null
                    )
                }
            </div>
        );
    } else {
        return (
            <div className="py-4 flex justify-center bg-black/15 rounded-bl-md" style={{width:"calc(100% - 13.75rem)"}}>
                404 Not Found: Category {params.category} does not exist
            </div>
        );
    }
}