import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline} from "react-icons/io5";

import React from 'react';

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


  //  const [isAlertPopup,setIsAlertPopup] =useState(false)
  //  retrun(
  //   <AlertPopup isOpen={isAlertPopup} 
  //               onClose={()=>setIsAlertPopup(false)} 
  //               title={"วันจัทย์"} 
  //               description={"เป็นวันน่านอน"} 
  //               buttonLeftText={"กดฉันสิ"} 
  //               buttonRightText={"กดฉันดีกว่า"}
  //               buttonLeftClick={()=>console.log("Left")} 
  //               buttonRightClick={()=>console.log("Right")}/>
  //           <button onClick={()=>setIsAlertPopup(true)}>gggg</button>
  //   )