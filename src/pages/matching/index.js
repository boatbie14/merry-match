// pages/matching.js
import React from "react";
import MatchingLeftColumn from "@/components/match/MatchingLeftColumn";
import MatchingCenter from "@/components/match/MatchingCenter";
import MatchingRightColumn from "@/components/match/MatchingRightColumn";
import { SwipeProvider } from "@/context/SwipeContext";
import { MerryLimitProvider } from "@/context/MerryLimitContext";

export default function MatchPage() {
  return (
    <SwipeProvider>
      <MerryLimitProvider>
        <div className="row">
          <div className="container-full flex flex-col xl:flex-row">
            <div className="w-full md:w-3/12">
              <MatchingLeftColumn />
            </div>

            <div className="w-full md:w-7/12">
              <MatchingCenter />
            </div>

            <div className="w-full md:w-2/12">
              <MatchingRightColumn />
            </div>
          </div>
        </div>
      </MerryLimitProvider>
    </SwipeProvider>
  );
}
