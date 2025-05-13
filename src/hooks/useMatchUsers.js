// hooks/useMatchUsers.js
import { useState, useEffect } from "react";
import axios from "axios";

export function useMatchUsers() {
  // สถานะพื้นฐาน
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // สถานะสำหรับการ swipe
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState(null);
  const [imageIndexes, setImageIndexes] = useState({});

  // เพิ่มการนับ swipe
  const [swipeCount, setSwipeCount] = useState(0);
  const [leftSwipes, setLeftSwipes] = useState(0);
  const [rightSwipes, setRightSwipes] = useState(0);

  // เพิ่ม state สำหรับ pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(5); // ค่าคงที่สำหรับจำนวนรายการต่อหน้า

  // โหลดข้อมูลเริ่มต้นเมื่อ component mount
  useEffect(() => {
    // เรียกฟังก์ชันเพื่อโหลดข้อมูลหน้าแรก
    fetchUsers(1);
    console.log("useEffect in useMatchUsers hook executed");
  }, []); // ทำงานเพียงครั้งเดียวเมื่อ mount

  // ฟังก์ชันโหลดข้อมูลจาก API
  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const currentUserId = "bfd42907-62fa-44c9-bf18-38ac7478ac35";
      const url = `/api/users?page=${page}&limit=${limit}&currentUserId=${currentUserId}`;

      console.log("Fetching data from:", url);
      const response = await axios.get(url);
      console.log("API Response:", response.data);

      // บันทึกข้อมูลเข้า state
      if (response.data && response.data.users) {
        // ถ้าเป็นหน้าแรก ให้เริ่มต้นใหม่ ถ้าไม่ใช่ให้เพิ่มต่อจากข้อมูลเดิม
        if (page === 1) {
          setUsers(response.data.users);
        } else {
          setUsers((prevUsers) => [...prevUsers, ...response.data.users]);
        }

        // บันทึกข้อมูล metadata
        if (response.data.meta) {
          setTotalCount(response.data.meta.totalCount);
          setTotalPages(response.data.meta.totalPages);
          setCurrentPage(response.data.meta.page);
        }

        // ถ้าเป็นหน้าแรกและมีข้อมูล ให้แสดงผู้ใช้คนแรก
        if (page === 1 && response.data.users.length > 0) {
          const firstUser = response.data.users[0];
          if (firstUser) {
            const newPerson = {
              name: firstUser.name,
              age: calculateAge(firstUser.date_of_birth),
              picture: firstUser.profile_image_url,
              city: firstUser.city,
              country: firstUser.location,
              bio: firstUser.bio,
              isMatch: firstUser.isMatch || false,
              originalProfile: firstUser,
            };
            setDisplayedUsers([newPerson]);
            setCurrentIndex(0);
          }
        }

        console.log("Users set to:", response.data.users);
      } else {
        console.log("No users data in response");
        if (page === 1) {
          setUsers([]);
          setDisplayedUsers([]);
        }
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันคำนวณอายุจากวันเกิด
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;

    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  // ฟังก์ชันโหลดผู้ใช้คนถัดไป
  const loadNextUser = () => {
    if (!users || users.length === 0) {
      console.log("No users available");
      return;
    }

    const nextIndex = currentIndex + 1;

    // ถ้า index เกินจำนวนผู้ใช้ที่มีอยู่
    if (nextIndex >= users.length) {
      console.log("Need to load more users");

      // ตรวจสอบว่าควรโหลดหน้าถัดไปหรือไม่
      if (currentPage < totalPages) {
        // ยังมีหน้าถัดไปให้โหลด
        console.log(`Loading next page: ${currentPage + 1}`);
        fetchUsers(currentPage + 1);
        return;
      } else {
        // ถ้าถึงหน้าสุดท้ายแล้ว และ swipeCount เท่ากับ totalCount
        if (swipeCount >= totalCount - 1) {
          console.log("Reached the end, restarting from page 1");
          // รีเซ็ตการนับ swipe และกลับไปโหลดหน้าแรกใหม่
          setSwipeCount(0);
          setLeftSwipes(0);
          setRightSwipes(0);
          fetchUsers(1);
          return;
        }

        // ถ้ายังไม่ครบ totalCount แต่หมดหน้าแล้ว (กรณีพิเศษ)
        console.log("No more users to display");
        return;
      }
    }

    // มีผู้ใช้พร้อมแสดง
    const user = users[nextIndex];
    console.log("Loading next user:", user);

    // คำนวณอายุและสร้างข้อมูลสำหรับแสดงผล
    const age = calculateAge(user.date_of_birth);
    const newPerson = {
      name: user.name,
      age: age,
      picture: user.profile_image_url,
      city: user.city,
      country: user.location,
      bio: user.bio,
      isMatch: user.isMatch || false,
      originalProfile: user,
    };

    setDisplayedUsers((prev) => [...prev, newPerson]);
    setCurrentIndex(nextIndex);
  };

  // ฟังก์ชันจัดการเมื่อการ์ดหายไปจากหน้าจอ
  const handleOutOfFrame = () => {
    console.log("Card out of frame");
    // เราไม่ต้องทำอะไรเพิ่มเติม เพราะเราจัดการใน handleSwipe แล้ว
  };

  // ฟังก์ชันจัดการการคลิกปุ่มเปลี่ยนรูปภาพ
  const handleButtonClick = (e, userName, direction) => {
    e.stopPropagation();

    // เรียกฟังก์ชันเปลี่ยนรูปภาพ
    handleImageChange(userName, direction);
  };

  // ฟังก์ชันเปลี่ยนรูปภาพ
  const handleImageChange = (userName, direction) => {
    const user = users.find((u) => u.name === userName);
    if (!user) return;

    const newImageIndexes = { ...imageIndexes };

    if (!newImageIndexes[userName]) {
      newImageIndexes[userName] = 1;
    }

    // สร้างอาร์เรย์ของ URL รูปภาพที่มี
    const imageUrls = [user.profile_image_url, user.image2_url, user.image3_url, user.image4_url, user.image5_url].filter(
      (url) => url !== null && url !== undefined
    );

    if (direction === "next") {
      newImageIndexes[userName] = newImageIndexes[userName] >= imageUrls.length ? 1 : newImageIndexes[userName] + 1;
    } else {
      newImageIndexes[userName] = newImageIndexes[userName] <= 1 ? imageUrls.length : newImageIndexes[userName] - 1;
    }

    setImageIndexes(newImageIndexes);
  };

  // ฟังก์ชันจัดการการคลิกปุ่ม Merry
  const handleHeartButton = (e, user) => {
    e.stopPropagation();
    console.log("Heart button clicked for", user.name);

    // ทำเหมือนกับการ swipe ขวา
    handleSwipe("right", user);
  };

  // ฟังก์ชันจัดการการ swipe
  const handleSwipe = (direction, user) => {
    setLastDirection(direction);
    console.log(`User swiped ${direction} for ${user.name}`);

    // เพิ่มการนับ swipe
    setSwipeCount((prev) => prev + 1);

    // นับแยกตามทิศทาง
    if (direction === "left") {
      setLeftSwipes((prev) => prev + 1);
    } else if (direction === "right") {
      setRightSwipes((prev) => prev + 1);
    }

    // ลบการ์ดผู้ใช้ที่ถูก swipe
    setDisplayedUsers((prevUsers) => {
      const remaining = prevUsers.filter((item) => item.name !== user.name);
      console.log("Remaining users after swipe:", remaining);
      return remaining;
    });

    // ถ้า swipe ขวา (Like) ให้บันทึกการ Merry
    if (direction === "right") {
      // ส่วนนี้จะเพิ่มการเรียก API ต่อไป
      console.log("Would record Merry for:", user.name);
    }

    // ถ้าไม่มีการ์ดแสดงเหลือแล้ว ให้โหลดผู้ใช้คนถัดไป
    setTimeout(() => {
      if (displayedUsers.length <= 1) {
        loadNextUser();
      }

      // ตรวจสอบว่าควรโหลดข้อมูลเพิ่มหรือไม่
      // เราควรโหลดล่วงหน้าเมื่อเหลือผู้ใช้น้อยลง (preload)
      if (users.length - currentIndex <= 2) {
        // ถ้าใกล้จะหมดข้อมูลและยังมีหน้าถัดไป
        if (currentPage < totalPages) {
          console.log(`Preloading next page: ${currentPage + 1}`);
          fetchUsers(currentPage + 1);
        }
      }

      // ตรวจสอบว่าควรรีเซ็ตไปหน้าแรกหรือไม่
      if (swipeCount >= totalCount && currentPage >= totalPages) {
        console.log("Reached the end of all users, restarting");
        // รีเซ็ตการนับ swipe และโหลดหน้าแรกใหม่
        setTimeout(() => {
          setSwipeCount(0);
          setLeftSwipes(0);
          setRightSwipes(0);
          fetchUsers(1);
        }, 500);
      }
    }, 300);
  };

  console.log("Current state:", {
    users: users.length,
    displayedUsers: displayedUsers.length,
    currentIndex,
    swipeCount,
    leftSwipes,
    rightSwipes,
    currentPage,
    totalPages,
    totalCount,
  });

  // ส่งค่าต่างๆ ออกไป
  return {
    users,
    displayedUsers,
    currentIndex,
    lastDirection,
    imageIndexes,
    loading,
    error,
    swipeCount,
    leftSwipes,
    rightSwipes,
    currentPage,
    totalPages,
    totalCount,
    handleSwipe,
    handleOutOfFrame,
    handleButtonClick,
    handleHeartButton,
  };
}
