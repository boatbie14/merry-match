import React, { useState, useRef } from "react";
import MatchingLeftColumn from "@/components/match/MatchingLeftColumn";
import MatchingCenter from "@/components/match/MatchingCenter";
import MatchingRightColumn from "@/components/match/MatchingRightColumn";
import { SwipeProvider } from "@/context/SwipeContext";
import { MerryLikeProvider } from "@/context/MerryLikeContext";
import { MerryLimitProvider } from "@/context/MerryLimitContext";
import { IoCloseOutline } from "react-icons/io5";

export default function MatchPage() {
  const [showFilter, setShowFilter] = useState(false);
  const rightColumnRef = useRef(null);

  const handleClearClick = () => {
    console.log("Trying to clear directly using ref");
    // เรียกใช้ method handleClear ของ MatchingRightColumn โดยตรงผ่าน ref
    if (rightColumnRef.current && rightColumnRef.current.handleClear) {
      rightColumnRef.current.handleClear();
    }
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  return (
    <SwipeProvider>
      <MerryLimitProvider>
        <MerryLikeProvider>
          <div className="row pt-[88px]">
            <div className="container-full flex flex-col xl:flex-row">
              <div id="match-chat" className="w-full hidden xl:w-3/12 xl:block">
                <MatchingLeftColumn />
              </div>

              <div id="match-card" className="w-full xl:w-7/12 relative">
                <MatchingCenter onToggleFilter={toggleFilter} />

                {/* พื้นหลังทึบแสง - แสดงตลอดเวลาแต่ซ่อนเมื่อไม่ active */}
                <div className={`filter-backdrop ${showFilter ? "active" : ""}`} onClick={toggleFilter}></div>

                {/* Filter Panel - แสดงตลอดเวลาแต่เลื่อนลงเมื่อไม่ active */}
                <div className={`filter-panel ${showFilter ? "active" : ""}`}>
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <button onClick={toggleFilter} className="p-2 rounded-full hover:bg-gray-100">
                        <IoCloseOutline size={24} />
                      </button>
                      <h3 className="text-lg font-bold">Filter</h3>
                      <button onClick={handleClearClick}>Clear</button>
                    </div>
                    <MatchingRightColumn ref={rightColumnRef} onSearch={toggleFilter} />
                  </div>
                </div>
              </div>

              <div id="match-filter" className="w-full hidden xl:w-2/12 xl:block">
                <MatchingRightColumn />
              </div>
            </div>
          </div>
        </MerryLikeProvider>
      </MerryLimitProvider>
    </SwipeProvider>
  );
}
