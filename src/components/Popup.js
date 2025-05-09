import Image from 'next/image';
import { motion, AnimatePresence } from "framer-motion";
import { IoMdArrowBack } from "react-icons/io";
import { IoMdArrowForward } from "react-icons/io";
import { IoCloseOutline,IoLocationSharp,IoClose  } from "react-icons/io5";
import { GoHeartFill } from "react-icons/go";
import React from 'react';
import { useState } from 'react';

export function ProfilePopup({ isOpen, onClose, profile }) {
  const {
    name = 'Daeny',
    age = 24,
    location = 'Bangkok, Thailand',
    sexualIdentities = 'Female',
    sexualPreferences = 'Male',
    racialPreferences = 'Indefinite',
    meetingInterests = 'commitment',
    aboutMe = 'I know nothing... but you',
    hobbiesAndInterests = ['dragon', 'romantic relationship', 'political', 'black hair', 'friendly', 'fire'],
    images = [
        'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRzJJs4LstMWjBaZZmBAzZblKia3j7spKC_nGMi2FvVJpi2-MTpJwz_RL9THDrG',
        'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRzJJs4LstMWjBaZZmBAzZblKia3j7spKC_nGMi2FvVJpi2-MTpJwz_RL9THDrG',],
  } = profile || {};
  const [imageIndex, setImageIndex] = useState(0);

  const clickClose = () => {
    
  };
  const clickHeart = () => {
    
  };
  const handlePrevImage = () => {
    setImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
  const handleNextImage = () => {
    setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

const currentImage = images[imageIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-4xl shadow-lg w-full h-full max-w-[1140px] max-h-[760px] md:w-[90%] lg:w-[80%] xl:w-[55%] md:h-auto"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col md:flex-row md:gap-8 md:pr-8 md:pl-14 md:py-10 relative md:mt-3 ">
              <IoCloseOutline onClick={onClose} className="hidden md:flex text-gray-600 text-2xl absolute top-0 right-5" />
              <IoMdArrowBack onClick={onClose} className="md:hidden text-white hover:text-gray-600 text-2xl absolute top-4 left-5 z-20" />

              {/* Image Section */}
                <div className="md:w-1/2 w-full h-auto relative">
                    <div className="h-[478px] w-full relative max-h-[320px] ">
                      <Image
                        src={currentImage}
                        alt={name}
                        className="object-cover rounded-b-4xl rounded-t-4xl md:rounded-l-3xl md:rounded-3xl w-full h-full "
                        fill
                         sizes="w-full"
                        //  priority 
                      />
                        <div className="absolute bottom-[-24px]  left-1/2 transform -translate-x-1/2 flex gap-4 z-10 ">
                            <button className={`gray-icon-btn `} onClick={() =>clickClose()}>
                                <IoClose className="text-gray-600 " size={36} />
                                <span className="tooltip">Merry</span>
                            </button>
                            <button className={`gray-icon-btn`} onClick={() =>clickHeart() }>
                                <GoHeartFill color='#C70039' className={{} ? '' : 'text-[#C70039]'} />
                                <span className="tooltip">Merry</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between px-6 items-center py-2 relative md:px-3">
                      <h5 className="text-gray-400 text-sm">
                        <span className="text-gray-600">{imageIndex + 1}</span>/{images.length}
                      </h5>
                      <div className=" flex gap-4 text-2xl">
                        <IoMdArrowBack color="gray" size={20} onClick={()=>handlePrevImage()}/>
                        <IoMdArrowForward color="gray" size={20} onClick={()=>handleNextImage()}/>
                      </div>
                    </div>
                </div>
                
              {/* Info Section */}
                <div className="pb-8 px-6 md:py-3 md:w-1/2 w-full max-h-[375px] md:max-h-[500px] overflow-y-auto ">
                    <div className="flex justify-between items-start ">
                        <div>
                            <h2 className="text-4xl md:text-4xl font-bold text-[#2A2E3F]">
                            {name} <span className="text-gray-500">{age}</span>
                            </h2>
                            <div className="flex items-center gap-1 text-gray-500 text-md md:text-sm lg:text-sm pt-2 md:pt-1 md:pb-2">
                                <IoLocationSharp color="#FFB1C8" />
                                <span>{location}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 text-md md:text-xs">
                        <table className="w-full md:w-[240px] md:max-w-none text-[#2A2E3F]">
                            <tbody>
                                <tr>
                                    <td className="pr-4">Sexual identities</td>
                                    <td className="py-1 text-[16px] text-[#646D89]">{sexualIdentities}</td>
                                </tr>
                                    <tr>
                                    <td className="pr-4">Sexual preferences</td>
                                    <td className="py-1 text-[16px] text-[#646D89]">{sexualPreferences}</td>
                                </tr>
                                <tr>
                                    <td className="pr-4">Racial preferences</td>
                                    <td className="py-1 text-[16px] text-[#646D89]">{racialPreferences}</td>
                                </tr>
                                <tr>
                                    <td className="pr-4">Meeting interests</td>
                                    <td className="py-1 text-[16px] text-[#646D89]">{meetingInterests}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4">
                        <h3 className="font-semibold text-xl">About me</h3>
                        <p className="text-gray-600 pt-2 text-md md:text-sm">{aboutMe}</p>
                    </div>

                    <div className="mt-4">
                        <h3 className="font-semibold text-xl">Hobbies and Interests</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {hobbiesAndInterests.map((tag) => (
                            <span
                                key={tag}
                                className="border-1 border-pink-600 text-[#7D2262] text-sm px-4 py-1 rounded-lg">
                            {tag}
                            </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

//
export function AlertPopup({ isOpen, onClose, title, description, buttonLeftText, buttonRightText, buttonLeftClick, buttonRightClick }) {
  const dialogVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl shadow-lg overflow-hidden w-full max-w-md"
            variants={dialogVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-4">
                <IoCloseOutline size={25} onClick={onClose} className="absolute top-4 right-4 text-gray-400 cursor-pointer"/>
                {title && <h2 className="text-xl font-semibold">{title}</h2>}
            </div>
            <hr className="border-t border-gray-200" />
            <div className="p-4">
                {description && <p className="text-gray-600">{description}</p>}
            </div>
            <div className="p-4 pt-0 justify-start flex flex-col gap-4
             md:flex-row md:pt-1 ">
              {buttonLeftText && 
                    (<button onClick={buttonLeftClick} className="secondary-btn"> {buttonLeftText} </button>)}
              {buttonRightText && (
                    <button
                    onClick={buttonRightClick}
                  className="primary-btn"
                >
                  {buttonRightText}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}