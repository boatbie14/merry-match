import { GoHeartFill } from 'react-icons/go';
import { useMerryLike } from '../context/MerryLikeContext';

const LikeButton = ({ userId }) => {
  const { isLiked, toggleLike, inProgressIds } = useMerryLike();
  const liked = isLiked(userId);
  const isProcessing = inProgressIds.has(userId);
//TODO 💽 optional lottie file
  return (
    <button
      className={`gray-icon-btn ${liked ? "active" : ""}`}
      onClick={() => toggleLike(userId)}
      disabled={isProcessing} // กันกดซ้ำ
    >
      <GoHeartFill className={liked ? "" : "text-[#C70039]"} />
      <span className="tooltip">Merry</span>
    </button>
  );
};

export default LikeButton;