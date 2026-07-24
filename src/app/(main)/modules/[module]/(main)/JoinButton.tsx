"use client"
import { Button } from "@/components/ui/button";
import { fetchBackendClient } from "@/utils/fetch-backend-client";
import { useEffect, useState } from "react";

export default function JoinButton({moduleCode}: {moduleCode: string}) {

    const [isAttended, setIsAttended] = useState(false);

    useEffect(() => {
        type result = {message: string};
        async function getAttendance() {
            const result = await fetchBackendClient<result>(`/modules/${moduleCode}/attendance`, "GET");
            if (result?.message != undefined && result.message == "Already attended") {
                setIsAttended(true);
            }
        }
        getAttendance()
    }, [moduleCode]);

    async function handleJoinButton() {
        type result = {message: string};
        if (!isAttended) {
            setIsAttended(true);
            const result = await fetchBackendClient<result>(`/modules/${moduleCode}/attendance`, "POST");
            if (!(result?.message != undefined && result.message == "Post attendance successful")) {
                setIsAttended(false);
            }
        } else {
            setIsAttended(false);
            const result = await fetchBackendClient<result>(`/modules/${moduleCode}/attendance`, "DELETE");
            if (!(result?.message != undefined && result.message == "Delete attendance successful")) {
                setIsAttended(true);
            }
        }
    }

    return (
        <Button onClick={handleJoinButton} className="text-black rounded-md max-h-8 mt-1 border-none font-roboto bg-white hover:bg-white/70 backdrop-blur-3xl hover:cursor-pointer">{isAttended ? "Leave Module" : "Join Module"}</Button>
    );
}