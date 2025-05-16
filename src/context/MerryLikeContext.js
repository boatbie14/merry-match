import { createContext, useContext, useState, useEffect } from 'react';
import { getMerriedLike, postMerriedLike, deleteMerriedLike } from '@/services/merryServices';
import { useAuth } from './AuthContext';

const MerryLikeContext = createContext();

export const MerryLikeProvider = ({ children }) => {
  const [likedUsers, setLikedUsers] = useState([]); // เก็บ user ที่ถูก Like
  const [inProgressIds, setInProgressIds] = useState(new Set()); // userId ที่กำลังประมวลผล
  const { isLoggedIn, checkingLogin } = useAuth();

  // โหลดข้อมูล Like เมื่อ login เสร็จ
  useEffect(() => {
    const fetchLiked = async () => {
      try {
        const res = await getMerriedLike();
        setLikedUsers(res.data); // [{id: 1}, {id: 2}, ...]
      } catch (err) {
        console.error('Fetch Liked Users Failed:', err);
      }
    };

    if (isLoggedIn && !checkingLogin) {
      fetchLiked();
    }
  }, [isLoggedIn, checkingLogin]);

  const isLiked = (userId) => likedUsers.some((user) => user.id === userId);

  const toggleLike = async (userId) => {
    if (!isLoggedIn || checkingLogin || inProgressIds.has(userId)) return;

    // Mark this userId as "in progress"
    setInProgressIds((prev) => new Set(prev).add(userId));

    const alreadyLiked = isLiked(userId);

    // Optimistic update
    setLikedUsers((prev) =>
      alreadyLiked
        ? prev.filter((user) => user.id !== userId)
        : [...prev, { id: userId }]
    );

    try {
      if (alreadyLiked) {
        await deleteMerriedLike(userId);
      } else {
        await postMerriedLike(userId);
      }
    } catch (err) {
      console.error('Toggle Like Failed:', err);
      // Rollback UI
      setLikedUsers((prev) =>
        alreadyLiked
          ? [...prev, { id: userId }]
          : prev.filter((user) => user.id !== userId)
      );
    } finally {
      // Remove from "in progress"
      setInProgressIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  return (
    <MerryLikeContext.Provider value={{ likedUsers, isLiked, toggleLike, inProgressIds }}>
      {children}
    </MerryLikeContext.Provider>
  );
};

export const useMerryLike = () => useContext(MerryLikeContext);