// pages/matching.js
import React from "react";
import MatchingCenter from "@/components/match/MatchingCenter";
import { MatchProvider } from "@/context/MatchContext";

export default function MatchPage() {
  return (
    <MatchProvider>
      <div className="row">
        <div className="container-full flex">
          <div className="w-12/12">
            {/* ไม่ต้องส่ง props เพราะ MatchingCenter จะใช้ข้อมูลจาก Context โดยตรง */}
            <MatchingCenter />
          </div>
        </div>
      </div>
    </MatchProvider>
  );
}
