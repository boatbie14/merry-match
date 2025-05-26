import Image from 'next/image';
import { motion, AnimatePresence,usePresenceData } from "framer-motion";
import { Skeleton } from '@mui/material';
import { IoMdArrowBack } from "react-icons/io";
import { IoMdArrowForward } from "react-icons/io";
import { IoCloseOutline,IoLocationSharp,IoClose  } from "react-icons/io5";
import { calculateAge } from '@/utils/functionCalculate/calculateAge';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { getUserHobbies } from '@/services/hobbiesServices';
import LikeButton from '../LikeButton';
export function ProfilePopup({ isOpen, onClose, items}) {
const tempImage = [items?.profile_image_url,items?.image2_url,items?.image3_url,items?.image4_url,items?.image5_url,];
const images = tempImage.filter(item => !!item);
const [imageIndex, setImageIndex] = useState(0);
const [isloadingImage,setIsloadingImage] = useState(true)
const [direction, setDirection] = useState(0);
const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
const [loadingHobbies,setLoadingHobbies] = useState(false)
const [hobbies,setHobbies] = useState([])

useEffect(()=>{
    async function hobbiesFetch(id){
        try{
            setLoadingHobbies(true)
            const tempHobbies = await getUserHobbies(id)
            setHobbies(tempHobbies.map(item => item.hobbie_name))
        }catch(e){console.log(e)
        }finally{setLoadingHobbies(false)}
    }
    if(Object.keys(items).length > 0) {
        hobbiesFetch(items.id)}
},[items])

    const handlePrevImage = () => {
        setDirection(-1);
        setImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
        setHasLoadedOnce(true);
        setIsloadingImage(true)
    };
    const handleNextImage = () => {
        setDirection(1);
        setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setHasLoadedOnce(true);
        setIsloadingImage(true)
    };
    const handleClose = ()=>{
        setHasLoadedOnce(false);
        setImageIndex(0)
        setDirection(0)
        onClose()
    }
    
    function ImageSlide({ src, alt }) {
        const direction = usePresenceData();
        return (
            <motion.div
                className="absolute inset-0 w-full h-full"
                initial={hasLoadedOnce ? { x: direction > 0 ? 750 : -750 } : null}
                animate={{ x: 0 }}
                exit={{ x: direction > 0 ? -750 : 750 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                {isloadingImage &&
                <div className='w-full h-full rounded-4xl overflow-hidden'>
                    <Skeleton variant="rounded" style={{ height: '100%'}} />
                </div>}
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(max-width: 768px) 60vw, 40vw"
                    className={`object-cover rounded-b-4xl rounded-t-4xl md:rounded-l-3xl md:rounded-3xl w-full h-full transition-opacity duration-500 `}
                    onLoad={()=>setIsloadingImage(false)}
                />
            </motion.div>
            );
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                className="fixed inset-0 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm mt-[88px] md:mt-0 z-900 md:z-1000 "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                >
                    <motion.div
                        className="bg-white rounded-t-4xl md:rounded-4xl shadow-lg w-full h-full max-h-[760px] max-w-[840px] md:max-h-full md:w-[90%] lg:w-[70%] xl:w-[55%] md:h-auto "
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col md:flex-row md:gap-8 lg:gap-12 2xl:gap-14  md:pr-8 md:pl-14 md:py-10 relative md:mt-3 ">
                            <IoCloseOutline onClick={()=>{handleClose()}} className="hidden md:flex text-gray-600 text-2xl absolute top-0 right-5" />
                            <IoMdArrowBack onClick={()=>{handleClose()}} className="md:hidden text-white hover:text-gray-600 text-2xl absolute top-4 left-5 z-20" />

                            <div className="md:w-1/2 w-full h-auto relative  overflow-hidden ">
                                <div className="w-full h-[320px] relative md:max-w-[468px] md:aspect-square md:mx-auto md:h-auto ">

                                {/* <div className="w-full md:max-w-[468px] md:aspect-square md:relative md:mx-auto"    > */}
                                    <AnimatePresence custom={direction} mode="popLayout">
                                        <ImageSlide
                                        key={imageIndex}
                                        src={images[imageIndex]}
                                        alt={items?.name}
                                        />
                                    </AnimatePresence>
                                    <div className="absolute bottom-[-24px]  left-1/2 transform -translate-x-1/2 flex gap-4 z-10 ">
                                        <button className={`gray-icon-btn `} onClick={() =>handleClose()}>
                                            <IoClose className="text-gray-600 " size={36} />
                                            <span className="tooltip">close</span>
                                        </button>
                                        <LikeButton userId={items?.id}/>
                                    </div>
                                </div>

                                <div className="flex justify-between px-6 items-center py-2 relative md:px-3">
                                    <h5 className="text-gray-400 text-sm">
                                        <span className="text-gray-600">{imageIndex + 1}</span>/{images.length}
                                    </h5>
                                    <div className=" flex gap-4 text-2xl">
                                        <IoMdArrowBack className='cursor-pointer' color="gray" size={20} onClick={()=>handlePrevImage()}/>
                                        <IoMdArrowForward className='cursor-pointer' color="gray" size={20} onClick={()=>handleNextImage()}/>
                                    </div>
                                </div>
                            </div>

                            <div className="pb-8 px-6 pt-6 md:px-3 md:py-2 md:w-1/2 w-full max-h-[375px] md:max-h-[min(80vh,740px)] overflow-y-auto flex flex-col gap-5.5">

                                <div className="flex justify-between items-start mt-2 md:mt-0">
                                    <div>
                                        <h2 className="text-4xl md:text-4xl font-bold text-[#2A2E3F]">
                                            {items?.name} <span className="text-gray-500">{calculateAge(new Date(items?.date_of_birth))}</span>
                                        </h2>
                                        <div className="flex items-center gap-1 text-gray-500 text-md md:text-sm lg:text-sm pt-2 ">
                                            <IoLocationSharp color="#FFB1C8" />
                                            <span>{items?.city}, {items?.location}</span>
                                        </div>
                                    </div>
                                </div>  

                                <div className=" text-md md:text-xs xl:text-lg">
                                <table className="w-full  md:w-full md:text-[14px] text-[#2A2E3F] table-fixed ">
                                    <tbody>
                                    <tr>
                                        <td className=" w-3/5 md:w-2/5 xs:w-1/2 py-1.5  md:py-1 lg:py-2 xl:py-2  text-[#2A2E3F] ">Sexual identities</td>
                                        <td className="w-2/5 xs:w-1/2 text-[16px]   text-[#646D89]">{items?.sexual_identity}</td>
                                    </tr>
                                    <tr>
                                        <td className="w-2/5 xs:w-1/2 py-1.5 md:py-1 lg:py-2 xl:py-2 text-[#2A2E3F] ">Sexual preferences</td>
                                        <td className="w-2/5 xs:w-1/2 text-[16px]  text-[#646D89]">{items?.sexual_preference}</td> 
                                    </tr>
                                    <tr>
                                        <td className="w-2/5 xs:w-1/2 py-1.5 md:py-1 lg:py-2 xl:py-2 text-[#2A2E3F] ">Racial preferences</td>
                                        <td className="w-2/5 xs:w-1/2 text-[16px]  text-[#646D89]">{items?.racial_preference}</td>
                                    </tr>
                                    <tr>
                                        <td className="w-2/5 xs:w-1/2 py-1.5 md:py-1 lg:py-2 xl:py-2     text-[#2A2E3F]">Meeting interests</td>
                                        <td className="w-2/5 xs:w-1/2 text-[16px]  text-[#646D89] ">{items?.meeting_interest}</td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>

                            <div className=" w-full">
                                <h3 className="font-bold text-xl md:font-semibold lg:pb-1 xl:pb-1.5">About me</h3>
                                <p className="text-gray-600 pt-2 break-words text-md md:text-sm w-full">{items?.bio}</p>
                            </div>

                            <div className="">
                                <h3 className="text-xl font-bold md:font-semibold ">Hobbies and Interests</h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {loadingHobbies ? (
                                        <>
                                        {[74,94,62,94,60,100,80,50].map((value,i)=>
                                            <Skeleton variant="rounded" width={value} height={28} animation="wave" key={i}/>
                                        )}
                                        </>) : (
                                    hobbies.map((tag) => (
                                        <span
                                            key={tag}
                                            className="break-words border-1 border-pink-600 text-[#7D2262] text-sm px-4 py-1 rounded-lg">
                                            {tag}
                                        </span>)
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