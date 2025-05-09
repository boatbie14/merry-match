import Image from 'next/image';
import { IoLocationSharp } from "react-icons/io5";
import { BsChatDotsFill } from "react-icons/bs";
import { GoHeartFill } from "react-icons/go";
import { AiFillEye } from "react-icons/ai";
import DoubleHeartsIcon from "./icons";

const MarryListCard = ({
  image,
  name,
  age,
  location,
  sexualIdentity,
  sexualPreferences,
  romanticPreferences,
  meetingInterests,
  isMatched,
  isMerry,
  matchToday = false,
  clickHeart,
  clickEye,
  clickChat,
}) => {
  const thempId = "12312312"

  const MatchStatus = () => {
    const baseClass = "text-md border border-1 py-1 rounded-full w-[160px]";
    const matchClass = isMatched
      ? "text-[#C70039] font-extrabold flex items-center justify-center gap-1"
      : "text-gray-500";
    return (
      <button className={`${baseClass} ${matchClass}`}>
        {isMatched ? (
          <>
            <DoubleHeartsIcon size={14} className="text-[#ee2961]" />
            Merry Match!
          </>
        ) : (
          "Not Match yet"
        )}
      </button>
    );
  };

  const ActionButtons = () => (
    <div className="flex gap-3 lg:gap-4 text-xl text-gray-600 md:mt-8 mt-6">
      {isMatched && (
        <button className="gray-icon-btn" onClick={()=>clickChat()}>
          <BsChatDotsFill />
          <span className="tooltip">Go to chat</span>
        </button>
      )}
      <button className="gray-icon-btn" onClick={()=>clickEye(thempId)}>
        <AiFillEye />
        <span className="tooltip">See profile</span>
      </button>
      <button className={`gray-icon-btn ${isMerry ? "active" : ""}`}  onClick={()=>clickHeart()}>
        <GoHeartFill className={isMerry ? "" : "text-[#C70039]"} />
        <span className="tooltip">Merry</span>
      </button>
    </div>
  );

  const MatchTodayTag = () =>
    matchToday && (
      <div className="hidden md:flex absolute px-2 bottom-0 left-0 h-6 pt-1 font-semibold rounded-bl-3xl rounded-tr-xl overflow-hidden bg-[#F4EBF2]">
        <span className="text-xs relative text-[#7D2262]">Merry today</span>
      </div>
    );

  return (
    <div className="flex flex-col border-b border-gray-200 pb-8 md:pb-12 md:max-w-[933px] md:flex-row gap-4 md:gap-1.5 pt-4 w-full">
      <div className='flex flex-row justify-between'>
        <div className="relative w-[114px] h-[114px] sm:w-[164px] sm:h-[164px] md:w-[200px] md:h-[200px] mb-4">
          <Image
            src={image}
            alt={name}
            className="object-cover rounded-2xl md:rounded-3xl"
            fill
            sizes='w-full'
            // priority 
          />
        <MatchTodayTag />
        </div>
        
        <div className="md:hidden  flex flex-col items-end ">
          <MatchStatus />
          <ActionButtons />
        </div>
      </div>

      <div className="flex-1 text-sm text-[#2A2E3F] md:ml-4 xl:ml-8 md:mt-1">
        <div className="flex items-center gap-3 md:gap-6">
          <h2 className="text-2xl md:text-lg lg:text-2xl font-bold">
            {name} <span className="text-gray-500 font-semibold">{age}</span>
          </h2>
          <div className="flex items-center gap-1 text-gray-500 text-lg sm:text-md lg:text-lg">
            <IoLocationSharp color="#FFB1C8" />
            <span>{location}</span>
          </div>
        </div>

        <div className="mt-2 md:mt-5 lg:mt-7 text-[#646D89] w-full">
          <table className="w-full text-[17px] md:text-[16px] md:w-[320px] lg:w-[400px] lg:text-[18px]">
            <tbody>
              <tr>
                <td className="py-1.5 md:py-1 text-[#2A2E3F]">Sexual identities</td>
                <td>{sexualIdentity}</td>
              </tr>
              <tr>
                <td className="py-1.5 md:py-1 text-[#2A2E3F]">Sexual preferences</td>
                <td>{sexualPreferences}</td>
              </tr>
              <tr>
                <td className="py-1.5 md:py-1 text-[#2A2E3F]">Racial preferences</td>
                <td>{romanticPreferences}</td>
              </tr>
              <tr>
                <td className="py-1.5 md:py-1 text-[#2A2E3F]">Meeting interests</td>
                <td>{meetingInterests}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="hidden md:flex flex-col items-end min-w-[160px]">
        <MatchStatus />
        <ActionButtons />
      </div>
    </div>
  );
};

export default MarryListCard;