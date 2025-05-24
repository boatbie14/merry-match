import React from "react";
import MatchingLeftColumn from "@/components/match/MatchingLeftColumn";

export default function MatchPage() {
  return (
    <div className="row pt-[52px] md:pt-[88px]">
      <div className="container-full flex flex-col xl:flex-row">
        <div id="match-chat" className="w-full xl:w-3/12 xl:block">
          <MatchingLeftColumn />
        </div>

        <div id="chat-container" className="w-full xl:w-9/12 relative bg-amber-950">
          Chat
        </div>
      </div>
    </div>
  );
}
