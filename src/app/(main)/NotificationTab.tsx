"use client";

import { useEffect, useState, useRef } from "react";
import { IoNotifications } from "react-icons/io5";
import { fetchBackendClient } from "@/utils/fetch-backend-client";

type FriendRequest = {
  sender_id: number;
  created_at: string;
  username: string;
  first_name: string;
  last_name: string;
};

interface NotificationTabProps {
  userId: number;
  loggedIn: boolean;
}

export default function NotificationTab({ userId, loggedIn }: NotificationTabProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loggedIn || !isOpen) return;

    const fetchRequests = async () => {
      setLoading(true);
      try {
        const data = await fetchBackendClient<FriendRequest[]>("/friend-requests/", "GET");
        setFriendRequests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch friend requests:", error);
        setFriendRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [loggedIn, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleAccept = async (senderId: number) => {
    setProcessingId(senderId);
    try {
      const response = await fetchBackendClient<{ status: string }>(
        `/friend-requests/${senderId}`,
        "POST",
        { action: "Request" }
      );

      if (response?.status == "isFriend") {
        // Remove from list on success
        setFriendRequests(friendRequests.filter(req => req.sender_id !== senderId));
      } else {
        console.error("Accept request returned unexpected response:", response);
      }
    } catch (error) {
      console.error("Failed to accept friend request:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (senderId: number) => {
    setProcessingId(senderId);
    try {
      await fetchBackendClient(`/friend-requests/${senderId}`, "DELETE");
      // Remove from list on success
      setFriendRequests(friendRequests.filter(req => req.sender_id !== senderId));
    } catch (error) {
      console.error("Failed to reject friend request:", error);
    } finally {
      setProcessingId(null);
    }
  };

  if (!loggedIn) return null;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:text-white/60 hover:cursor-pointer transition"
        title="Friend Requests"
      >
        <IoNotifications className="text-2xl" />
        {friendRequests.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
            {friendRequests.length > 9 ? "9+" : friendRequests.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 shadow-black/10 shadow-md rounded-md bg-gradient-to-r from-primary/80 from-0% via-secondary/80 via-110% to-secondary/80 to-100% backdrop-blur-md z-50 text-white">
          <div className="px-4 py-3 border-b border-white/20">
            <h3 className="text-white font-semibold">Friend Requests</h3>
          </div>

          {loading ? (
            <div className="px-4 py-8 text-center text-white/60">Loading...</div>
          ) : friendRequests.length === 0 ? (
            <div className="px-4 py-8 text-center text-white/60">No friend requests</div>
          ) : (
            <div className="max-h-96 overflow-y-auto no-scrollbar">
              {friendRequests.map((request) => (
                <div
                  key={request.sender_id}
                  className="px-4 py-3 border-b border-white/10 hover:bg-white/5 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-white font-semibold">
                        {request.first_name} {request.last_name}
                      </p>
                      <p className="text-white/60 text-sm">@{request.username}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleAccept(request.sender_id)}
                      disabled={processingId === request.sender_id}
                      className="flex-1 px-3 py-1.5 bg-secondary/80 hover:bg-secondary/60 disabled:bg-secondary/40 text-white rounded-sm text-sm font-medium transition hover:cursor-pointer disabled:cursor-not-allowed"
                    >
                      {processingId === request.sender_id ? "..." : "Accept"}
                    </button>
                    <button
                      onClick={() => handleReject(request.sender_id)}
                      disabled={processingId === request.sender_id}
                      className="flex-1 px-3 py-1.5 bg-black/30 hover:bg-black/40 disabled:bg-black/20 text-white rounded-sm text-sm font-medium transition hover:cursor-pointer disabled:cursor-not-allowed"
                    >
                      {processingId === request.sender_id ? "..." : "Reject"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
