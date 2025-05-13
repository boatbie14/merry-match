import { GoHeartFill } from 'react-icons/go';
import { useMerryLike } from '../../context/MerryLikeContext';

const LikeButton = ({ userId }) => {
  const { isLiked, toggleLike, loading } = useMerryLike();
  const liked = isLiked(userId);
  return (
    <button
      className={`gray-icon-btn ${liked ? "active" : ""}`}
      onClick={() => toggleLike(userId)}
      disabled={loading} 
    >
      <GoHeartFill className={liked ? "" : "text-[#C70039]"} />
      <span className="tooltip">Merry</span>
    </button>
  );
};

export default LikeButton;