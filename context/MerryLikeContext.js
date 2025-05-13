import { createContext, useContext, useState, useEffect } from 'react';
import { getMerriedLike, postMerriedLike, deleteMerriedLike } from '@/services/merryServices'

const MerryLikeContext = createContext();

export const MerryLikeProvider = ({ children }) => {
  const [likedUsers, setLikedUsers] = useState([]); // เก็บ users ที่เรากด like แล้ว
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLiked = async () => {
      const res = await getMerriedLike();
      setLikedUsers(res.data);
    };
    if(loading === false){fetchLiked()}
  }, [loading]);

  const isLiked = (userId) =>{
    return likedUsers.some((user) => user.id === userId)};
  const toggleLike = async (userId) => {
    setLoading(true);
    try {
      if (isLiked(userId)) {
        await deleteMerriedLike(userId);
        setLikedUsers((prev) => prev.filter((user) => user.id !== userId));
      } else {
        const newUser = await postMerriedLike(userId);
        setLikedUsers((prev) => [...prev, newUser]);
      }
    } catch (err) {
      console.error('Toggle Like Failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MerryLikeContext.Provider value={{ likedUsers, isLiked, toggleLike, loading }}>
      {children}
    </MerryLikeContext.Provider>
  );
};

export const useMerryLike = () => useContext(MerryLikeContext);