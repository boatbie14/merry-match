import { GoHeartFill } from 'react-icons/go';
import { useMerryLike } from '../context/MerryLikeContext';
import { useMerryLimit } from '@/context/MerryLimitContext';
import { AlertPopup } from './popup/AlertPopup';
import { useState } from 'react';
const LikeButton = ({ userId }) => {
  const { isLiked, toggleLike, inProgressIds } = useMerryLike();
  const {merryLimit} = useMerryLimit()
  const liked = isLiked(userId);
  const [isOpenAlert,setIsOpenAlert]=useState(false)
  const isProcessing = inProgressIds.has(userId);
//TODO 💽 optional lottie file
  
return (
  <>
    <button  
      className={`gray-icon-btn ${liked ? "active" : "inactive"}`}
      onClick={() =>(merryLimit.count < merryLimit.merry_per_day || liked)
                    ? toggleLike(userId)
                    : setIsOpenAlert(true)
}
      disabled={isProcessing} // กันกดซ้ำ
    >
      <GoHeartFill className={liked ? "" : "text-[#C70039]"} />
      <span className="tooltip hidden md:inline-block">Merry</span>
    </button>
  
    <AlertPopup isOpen = {isOpenAlert}
                onClose = {()=>setIsOpenAlert(false)}
                title = "Want more limits?"
                description ="Sign up for more Merry Membership"
                buttonLeftText = "Go apply now"
                buttonRightText = "Not now" 
                buttonLeftClick = {()=>{}}
                buttonRightClick = {()=>setIsOpenAlert(false)}
                />
  </>
  );
};

export default LikeButton;