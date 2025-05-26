// context/MerryLikeContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { getMerriedLike, postMerriedLike, deleteMerriedLike } from "@/services/merryServices";
import { useAuth } from "./AuthContext";
import { useMerryLimit } from "@/context/MerryLimitContext";
import { useMerryLimit } from "@/context/MerryLimitContext";

const MerryLikeContext = createContext();

export const MerryLikeProvider = ({ children }) => {
  const { refreshMerryLimit,setMerryLimit } = useMerryLimit();
  const [likedUsers, setLikedUsers] = useState([]);
  const [inProgressIds, setInProgressIds] = useState(new Set());
  const { isLoggedIn, checkingLogin } = useAuth();
  const [limitReached, setLimitReached] = useState(false);

  //Check Match
  const [matchedUser, setMatchedUser] = useState(false);

  const [shouldRefreshMatches, setShouldRefreshMatches] = useState(0);

  // โหลดข้อมูล Like เมื่อ login เสร็จ
  useEffect(() => {
    const fetchLiked = async () => {
      try {
        const res = await getMerriedLike();
        setLikedUsers(res.data); // [{id: 1}, {id: 2}, ...]
      } catch (err) {
        console.error("Fetch Liked Users Failed:", err);
      }
    };

    if (isLoggedIn && !checkingLogin) {
      fetchLiked();
    }
  }, [isLoggedIn, checkingLogin]);

  const isLiked = (userId) => likedUsers.some((user) => user.id === userId);

  const toggleLike = async (userId, shouldRefresh = true) => {
    if (!isLoggedIn || checkingLogin || inProgressIds.has(userId)) return;
    // Mark this userId as "in progress"
    setInProgressIds((prev) => new Set(prev).add(userId));

    setLimitReached(false);

    const alreadyLiked = isLiked(userId);

    // Optimistic update
    setLikedUsers((prev) => (alreadyLiked ? prev.filter((user) => user.id !== userId) : [...prev, { id: userId }]));

    try {
      if (alreadyLiked) {
        await deleteMerriedLike(userId);
      } else {
        setMerryLimit((prev) => ({...prev,count: prev.count + 1,}));
        const result = await postMerriedLike(userId);
        refreshMerryLimit();
        if (result && result.isLimitReached) {
          setLimitReached(true);
          setLikedUsers((prev) => prev.filter((user) => user.id !== userId));        
        }

        setMatchedUser(result.checkMatchUser);

        console.log("Match or Not : " + result?.checkMatchUser);

        if (result?.checkMatchUser) {
          setShouldRefreshMatches(Date.now());
        }

        if (shouldRefresh) {
          refreshMerryLimit();
        }

        return result;
      }
    } catch (err) {
      console.error("Toggle Like Failed:", err);
      // Rollback UI
      setLikedUsers((prev) => (alreadyLiked ? [...prev, { id: userId }] : prev.filter((user) => user.id !== userId)));
    } finally {
      // Remove from "in progress"
      setInProgressIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  console.log("shouldRefreshMatches in MerryLikeContext:" + shouldRefreshMatches);

  return (
    <MerryLikeContext.Provider value={{ likedUsers, isLiked, toggleLike, inProgressIds, limitReached, matchedUser, shouldRefreshMatches }}>
      {children}
    </MerryLikeContext.Provider>
  );
};

export const useMerryLike = () => useContext(MerryLikeContext);
