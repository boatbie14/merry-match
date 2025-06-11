import React from "react";

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-lg"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-3">Delete Confirmation</h2>
        <p className="text-sm text-gray-600 mb-5">Do you sure to delete this Package?</p>
        <div className="flex justify-center space-x-3">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#FF1659]/20 text-[#FF1659] font-semibold rounded-full hover:bg-[#FF1659]/30"
          >
            Yes, I want to delete
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#C7013F] text-white font-semibold rounded-full hover:bg-[#a80137]"
          >
            No, I don’t want
          </button>
        </div>
      </div>
    </div>
  );
}
