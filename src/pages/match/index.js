import React, { useState, useEffect } from "react";
import Head from "next/head";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { GoHeartFill } from "react-icons/go";
import { IoCloseOutline } from "react-icons/io5";

// สร้าง TinderCard แบบง่ายที่ไม่ต้องพึ่ง react-spring
const SimpleCard = ({ children, onSwipe, onCardLeftScreen }) => {
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [transform, setTransform] = useState("");

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleMouseDown = (e) => {
    setStartX(e.clientX);
    setStartY(e.clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - startX;
    const diffY = currentY - startY;
    const rotation = diffX / 10;

    setTransform(`translate(${diffX}px, ${diffY}px) rotate(${rotation}deg)`);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const currentY = e.clientY;
    const diffX = currentX - startX;
    const diffY = currentY - startY;
    const rotation = diffX / 10;

    setTransform(`translate(${diffX}px, ${diffY}px) rotate(${rotation}deg)`);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const transformStyle = transform;
    const match = transformStyle.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);

    if (match) {
      const diffX = parseFloat(match[1]);
      if (diffX > 100) {
        onSwipe("right");
        setTimeout(() => onCardLeftScreen(), 300);
      } else if (diffX < -100) {
        onSwipe("left");
        setTimeout(() => onCardLeftScreen(), 300);
      }
    }

    setIsDragging(false);
    setTransform("");
  };

  const handleMouseUp = handleTouchEnd;

  return (
    <div
      style={{
        transform,
        transition: isDragging ? "none" : "transform 0.3s",
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 1,
        touchAction: "none",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {children}
    </div>
  );
};

// API URL สำหรับข้อมูลจาก yala.dev
const URL = "https://yala.dev/api/merry-match.php";

export default function MatchPage() {
  const [loading, setLoading] = useState(true);
  const [characters, setCharacters] = useState([]);
  const [lastDirection, setLastDirection] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allProfiles, setAllProfiles] = useState([]);
  const [imageIndexes, setImageIndexes] = useState({});

  // โหลดข้อมูลทั้งหมดครั้งแรก
  useEffect(() => {
    const fetchAllProfiles = async () => {
      try {
        const response = await fetch(URL);
        const data = await response.json();

        // เก็บข้อมูลทั้งหมดไว้ใน state
        setAllProfiles(data);

        // โหลดโปรไฟล์แรก
        loadNextProfile(data, 0);
      } catch (error) {
        console.error("Error fetching profiles:", error);
        setLoading(false);
      }
    };

    fetchAllProfiles();
  }, []);

  // เปลี่ยนรูปภาพของโปรไฟล์
  const changeImage = (personName, direction) => {
    // หาโปรไฟล์จากชื่อ
    const profile = allProfiles.find((p) => p.name === personName);
    if (!profile) return;

    // คัดลอก state ปัจจุบัน
    const newImageIndexes = { ...imageIndexes };

    // ถ้ายังไม่มี index สำหรับโปรไฟล์นี้ ให้ตั้งค่าเริ่มต้นเป็น 1
    if (!newImageIndexes[personName]) {
      newImageIndexes[personName] = 1;
    }

    // หาจำนวนรูปภาพที่มีในโปรไฟล์นี้
    let maxImages = 1;
    for (let i = 1; i <= 5; i++) {
      if (profile[`image_${i}`]) maxImages = i;
    }

    // คำนวณ index ใหม่ตามทิศทาง
    if (direction === "next") {
      newImageIndexes[personName] = newImageIndexes[personName] >= maxImages ? 1 : newImageIndexes[personName] + 1;
    } else {
      newImageIndexes[personName] = newImageIndexes[personName] <= 1 ? maxImages : newImageIndexes[personName] - 1;
    }

    // อัปเดต state
    setImageIndexes(newImageIndexes);
  };

  // โหลดโปรไฟล์ถัดไปจากอาร์เรย์
  const loadNextProfile = (profiles, index) => {
    if (!profiles || profiles.length === 0) {
      console.log("No profiles available");
      setLoading(false);
      return;
    }

    // ถ้า index เกินจำนวนโปรไฟล์ให้วนกลับไปเริ่มที่ 0 ใหม่
    const nextIndex = index >= profiles.length ? 0 : index;

    const profile = profiles[nextIndex];

    const newPerson = {
      name: profile.name,
      age: profile.age,
      picture: profile.image_1, // ใช้รูปภาพแรกเป็นรูปเริ่มต้น
      city: profile.city,
      country: profile.country,
      hobbies: profile.hobbies,
      originalProfile: profile, // เก็บข้อมูลโปรไฟล์ต้นฉบับไว้เพื่อเข้าถึงรูปภาพอื่น ๆ
    };

    setCharacters((prevCharacters) => [...prevCharacters, newPerson]);
    setCurrentIndex(nextIndex + 1);
    setLoading(false);
  };

  // Handle swipe event
  const swiped = (direction, person) => {
    setLastDirection(direction);
    // Remove the swiped card
    setCharacters((prevCharacters) => prevCharacters.filter((char) => char.name !== person.name));
  };

  // Handle card leaving the screen
  const outOfFrame = () => {
    // โหลดโปรไฟล์ถัดไป
    loadNextProfile(allProfiles, currentIndex);
  };

  // หยุดการแพร่กระจายเหตุการณ์ (จำเป็นสำหรับปุ่มลูกศร)
  const handleButtonClick = (e, personName, direction) => {
    e.stopPropagation();
    changeImage(personName, direction);
  };

  // จัดการเมื่อกดปุ่มหัวใจ
  const handleHeartClick = (e, personName) => {
    e.stopPropagation();
    console.log("Heart button clicked for", personName);
    // เพิ่มโค้ดดำเนินการเมื่อกดปุ่มหัวใจตรงนี้
  };

  return (
    <>
      <div className="row">
        <div className="container-full flex">
          <div className="w-3/12">left col</div>
          <div className="w-8/12 bg-[#160404] flex flex-col items-center justify-center h-screen overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="relative mx-auto" style={{ height: "640px", width: "620px", maxWidth: "100%" }}>
                {characters.map((character) => (
                  <div key={character.name} className="relative" style={{ height: "100%", width: "100%" }}>
                    <SimpleCard onSwipe={(dir) => swiped(dir, character)} onCardLeftScreen={outOfFrame}>
                      <div className="bg-transparent rounded-lg overflow-hidden h-full" style={{ maxWidth: "620px", maxHeight: "640px" }}>
                        {/* รูปภาพที่มี Linear Gradient */}
                        <div className="relative w-full h-full overflow-visible rounded-lg">
                          <img
                            src={character.originalProfile[`image_${imageIndexes[character.name] || 1}`] || character.picture}
                            className="w-full h-full object-cover pointer-events-none"
                            alt={`Photo of ${character.name}`}
                            style={{ pointerEvents: "none" }}
                          />

                          {/* Linear Gradient Layer ทับรูป */}
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: "linear-gradient(to bottom, #07094100 70%, #390741 100%)",
                              pointerEvents: "none",
                            }}
                          ></div>

                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <div className="flex justify-between items-center">
                              <h5 className="text-2xl font-semibold">{character.name}</h5>
                              <span className="text-xl font-medium">{character.age}</span>
                            </div>
                            <p className="text-white text-opacity-80 mt-1">
                              {character.city}, {character.country}
                            </p>

                            {/* ลูกศรซ้าย-ขวาสำหรับเปลี่ยนรูปภาพ */}
                            <div className="flex justify-between mt-4">
                              <button
                                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
                                onClick={(e) => handleButtonClick(e, character.name, "prev")}
                              >
                                <FiArrowLeft size={16} color="#ffffff" />
                              </button>
                              <button
                                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
                                onClick={(e) => handleButtonClick(e, character.name, "next")}
                              >
                                <FiArrowRight size={16} color="#ffffff" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SimpleCard>

                    {/* ปุ่มหัวใจที่อยู่ด้านล่างของรูป ให้อยู่นอก SimpleCard เพื่อไม่ให้โดน overflow:hidden ตัด */}
                    <div
                      className="absolute flex justify-center w-full"
                      style={{
                        bottom: "-24px",
                        zIndex: 100, // ใช้ z-index สูงเพื่อให้อยู่เหนือทุกชั้น
                      }}
                    >
                      <button
                        className="gray-icon-btn mx-4"
                        style={{ width: "80px", height: "80px" }}
                        onClick={(e) => alert("You hate " + character.name)}
                      >
                        <IoCloseOutline size={40} color="#646D89" />
                        <span className="tooltip">Merry</span>
                      </button>

                      <button
                        className="gray-icon-btn mx-4"
                        style={{ width: "80px", height: "80px" }}
                        onClick={(e) => alert("You like " + character.name)}
                      >
                        <GoHeartFill size={40} color="#C70039" />
                        <span className="tooltip">Merry</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {lastDirection && (
              <div className="text-center mt-4 text-white">
                <p>Last swipe: {lastDirection}</p>
              </div>
            )}
          </div>
          <div className="w-2/12">right col</div>
        </div>
      </div>
    </>
  );
}
