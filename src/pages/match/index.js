// pages/matching.js
import React from "react";
import MatchingLeftColumn from "@/components/match/MatchingLeftColumn";
import MatchingCenter from "@/components/match/MatchingCenter";
import MatchingRightColumn from "@/components/match/MatchingRightColumn";
import { MatchProvider } from "@/context/MatchContext";
import { MerryLimitProvider } from "@/context/MerryLimitContext";

export default function MatchPage() {
  return (
    <MatchProvider>
      <MerryLimitProvider>
        <div className="row">
          <div className="container-full flex">
            <div className="w-3/12">
              <MatchingLeftColumn />
            </div>

            <div className="w-7/12">
              {/* ไม่ต้องส่ง props เพราะ MatchingCenter จะใช้ข้อมูลจาก Context โดยตรง */}
              <MatchingCenter />
            </div>

            <div className="w-2/12">
              <MatchingRightColumn />
            </div>
          </div>
        </div>
      </MerryLimitProvider>
    </MatchProvider>
  );
}
