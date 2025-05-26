//component/MatchingLeftColumn.js
import React, { useEffect } from "react";
import { useMerryLike } from "@/context/MerryLikeContext";
import { useMatchedUsers } from "@/hooks/useMatchedUsers";
import DiscoverMatchIcon from "../icons/DiscoverMatchIcon";
import DoubleHeartsIcon from "../icons/DoubleHeartsIcon";

export default function MatchingLeftColumn() {
  // ใช้ Hook ที่เราสร้างไว้เพื่อดึงข้อมูล matchedUsers
  const { shouldRefreshMatches } = useMerryLike();
  const { matchedUsers, loading, error } = useMatchedUsers(shouldRefreshMatches);

  useEffect(() => {
    console.log("MatchingLeftColumn: shouldRefreshMatches changed to:", shouldRefreshMatches);
  }, [shouldRefreshMatches]);

  console.log("shouldRefreshMatches : " + shouldRefreshMatches);

  return (
    <>
      <div className="px-6 pt-6">
        <div className="flex flex-col items-center gap-1 p-6 bg-[#F6F7FC] border-1 border-[#A62D82] rounded-2xl">
          <DiscoverMatchIcon size={64} primaryColor="#FF1659" secondaryColor="#95002B" />
          <h1 className=" text-2xl text-[#95002B] font-bold ">Discover New Match</h1>
          <p className="text-xm text-center">Start find and Merry to get know and connect with new friend!</p>
        </div>
      </div>

      <hr className="text-[#E4E6ED] my-11" />

      <div className="px-6">
        <h2 className="text-2xl text-[#2A2E3F] font-bold pb-4">Merry Match!</h2>

        {loading && <p>Loading matches...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && matchedUsers && matchedUsers.length === 0 && <p>You don&apos;t have any matches yet</p>}

        {!loading && !error && matchedUsers && matchedUsers.length > 0 && (
          <div className="match-users-container w-full h-32 flex flex-row gap-3 overflow-x-auto whitespace-nowrap">
            {matchedUsers.map((user) => (
              <div key={user.id} className="match-user w-[100px] h-[100px] relative overflow-visible flex-shrink-0">
                <img
                  src={user.profile_image_url || "/default-avatar.png"}
                  alt={user.name}
                  className="rounded-3xl w-full h-full object-cover"
                />
                <DoubleHeartsIcon size={24} color="#FF1659" className="absolute bottom-0 right-2 translate-x-1/4 translate-y-1/4" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-6">
        <h2 className="text-2xl text-[#2A2E3F] font-bold">Chat with Merry Match</h2>
      </div>
    </>
  );
}
