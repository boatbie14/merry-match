import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline} from "react-icons/io5";

import React from 'react';

export function AlertPopup({ isOpen, onClose, title, description, buttonLeftText, buttonRightText, buttonLeftClick, buttonRightClick,switchColor=false }) {
  let buttonColorLeft="secondary-btn"
  let buttonColorRight="primary-btn"
  if(switchColor)buttonColorLeft="primary-btn",buttonColorRight="secondary-btn"
  
  const dialogVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-2000 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl shadow-lg overflow-hidden w-full max-w-[528px]"
            variants={dialogVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-3 pl-6 ">
                <IoCloseOutline size={25} onClick={onClose} className="absolute top-4 right-4 text-gray-400 cursor-pointer"/>
                {title && <h2 className="text-xl font-semibold mt-1">{title}</h2>}
            </div>
            <hr className="border-t border-gray-200" />
            <div className="p-4 pl-6 text-[16px]">
                {description && <p className="text-gray-600">{description}</p>}
            </div>
            <div className="p-4 pl-6 pt-0 pb-4 justify-start flex flex-col gap-4
             md:flex-row md:pt-1 md:pb-6 ">
              {buttonLeftText && 
                    (<button onClick={buttonLeftClick} className={buttonColorLeft}> {buttonLeftText} </button>)}
              {buttonRightText && (
                    <button
                    onClick={buttonRightClick}
                  className={buttonColorRight}
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