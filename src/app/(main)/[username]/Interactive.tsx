"use client";
import { TabGroup } from "@/components/tabgroup";
import { Button } from "@/components/ui/button";
import { fetchBackendClient } from "@/utils/fetch-backend-client";
import { useEffect, useState } from "react";

export default function Interactive({friendStatus, friendId}: {friendStatus: {status: string}, friendId: number}) {
    // Request Sent, Unfriend
    function matchStatusToButtonText(status: string): string {
        if (status == "isFriend") {
            return "Unfriend";
        } else if (status == "requestSuccess") {
            return "Request Sent";
        } else if (status == "hasBeenRequested") {
            return "Accept Request";
        } else if (status == "hasNotBeenRequested") {
            return "Add Friend";
        } else if (status == "isNotFriend") {
            return "Add Friend";
        } else if (status == "requestSuccess") {
            return "Unfriend";
        } else if (status == "sameAccount") {
            return "";
        } else {
            return "";
        }
    }
    async function handleFriendRequest() {
        if (buttonText == "Accept Request") { // Request
            setButtonText("Unfriend");
            const requestData = await fetchBackendClient<{status: string}>(`/friend-requests/${friendId}`, "POST", {action: "Request"});
            
            if (requestData?.status === undefined) {
                setButtonText("Accept Request");
            } else {
                setButtonText(matchStatusToButtonText(requestData?.status));
            }
        }
        if (buttonText == "Add Friend") { // Request
            setButtonText("Request Sent");
            const requestData = await fetchBackendClient<{status: string}>(`/friend-requests/${friendId}`, "POST", {action: "Request"});
            
            if (requestData?.status === undefined) {
                setButtonText("Add Friend");
            } else {
                setButtonText(matchStatusToButtonText(requestData?.status));
            }
        }
        if (buttonText == "Unfriend") { // Unfriend
            setButtonText("Add Friend");
            const requestData = await fetchBackendClient<{status: string}>(`/friend-requests/${friendId}`, "POST", {action: "Unfriend"});
            
            if (requestData?.status === undefined) {
                setButtonText("Unfriend");
            } else {
                setButtonText(matchStatusToButtonText(requestData?.status));
            }
        }
        if (buttonText == "Request Sent") { // Unsend request
            setButtonText("Add Friend");
            const requestData = await fetchBackendClient<{status: string}>(`/friend-requests/${friendId}`, "POST", {action: "Unsend Request"});
            
            if (requestData?.status === undefined) {
                setButtonText("Request Sent");
            } else {
                setButtonText(matchStatusToButtonText(requestData?.status));
            }
        }
    }
    const [buttonText, setButtonText] = useState(matchStatusToButtonText(friendStatus?.status));
    return (
        <div className="flex gap-4">
            {
                buttonText == ""
                    ? null
                    : <Button onClick={handleFriendRequest} className="text-black rounded-md max-h-8.5 border-none font-roboto bg-white hover:bg-white/70 backdrop-blur-3xl hover:cursor-pointer">{buttonText}</Button>
            }
            <TabGroup options={["Posts", "Events", "Market"]}/>
        </div>
    );
}