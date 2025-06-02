import { motion, AnimatePresence } from "framer-motion";
import Checkbox from "@mui/material/Checkbox";
import { useState } from "react";

import React from 'react';

export function PdfRequestPopup({ isOpen,onClose,billingData,requsest}) {
  
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const handleCheckboxChange = (invoiceId, checked) => {
    setSelectedInvoices(prev =>
      checked && selectedInvoices.length<10
        ?[...prev, invoiceId] // เพิ่มเข้า array
        : prev.filter(id => id !== invoiceId) // ลบออกจาก array
    );
  };
  
  function requsestPdf(){
    setSelectedInvoices([])
    console.log(selectedInvoices)
    requsest(selectedInvoices)
  }

  const dialogVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-2000 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          
          <motion.div
            className="bg-white rounded-3xl shadow-lg w-full mx-6 max-w-[828px] "
            variants={dialogVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
        <div className="w-full md:max-w-[1246px] md:px-7 mt-1 mb-6">
            <div className="flex justify-center py-4 px-6 text-[24px] ">
              <h2 className="" >Billing History</h2>
            </div>
            <div className="md:border border-[#D6D9E4] md:rounded-4xl bg-[#FFFFFF] md:pb-2  max-w-full mx-auto text-sm text-[#3C3C4399] md:mx-4 max-h-[240px] md:max-h-[400px] overflow-y-auto " >
                <div className="divide-y divide-[#E4E4EB] border-t-1 border-[#E4E6ED] font-normal md:pt-2 md:border-0 md:pb-2">
                  {billingData.map((item, index) => (
                    <div  key={index}
                          className={`flex justify-between items-center py-3 md:py-4 rounded-md px-4 md:px-6 ${
                          index % 2 !== 0 ? "bg-[#F5F5FA]" : ""
                          }`}>
                    <Checkbox
                      checked={selectedInvoices.includes(item.invoice_pdf)}
                      onChange={(e) =>handleCheckboxChange(item.invoice_pdf, e.target.checked)}
                    />
                    <span className="text-[13px] md:text-[16px] md:flex-[0] md:ml-4 pr-2 md:pr-9">{item.created_at}</span>
                    <span className="text-[12px] md:text-[16px] flex-[1] text-left">{item.plan?.charAt(0).toUpperCase() + item.plan?.slice(1)}</span>
                    <span className="text-[12px] md:text-[16px] text-right text-[#424C6B]">THB {item.amount_paid.toFixed(2)}</span>
                </div>
                ))}
            </div>
          </div>
          <div className="flex px-4 w-full justify-between">
            <div>
              <span className={`hidden md:block ${selectedInvoices.length===10?"text-[#f6270c]":"text-[#abaeb7]"} ml-6 mt-2 `}>{selectedInvoices.length}/10</span>
            </div>
            <div className="flex pt-4 justify-end gap-5 border-t border-[#E4E4EB] md:border-0">
              <button 
                onClick={()=>requsestPdf()}
                disabled={selectedInvoices.length===0}
                className="primary-btn rounded-2xl ">
                Request PDF
              </button>
              <button 
                onClick={()=>{onClose();setSelectedInvoices([]);}}
                className="secondary-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
          </motion.div>
          <span className={`md:hidden ${selectedInvoices.length===10?"text-[#a01a08]":"text-[#ffffff]"} mt-2 px-3 `}>{selectedInvoices.length}/10 </span>
          <span className="text-[#ffffff] text-[12px] md:text-[16px] px-3">{selectedInvoices.length>1 && " Turn off pop-up blocked if there are more than 1 files."}</span>
        </motion.div>
      )}
    </AnimatePresence>

    
  );
}