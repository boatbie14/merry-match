// components/complaint/StatusModal.js
import { useEffect } from "react";
import { IoClose } from "react-icons/io5";

export default function StatusModal({
  isOpen,
  onClose,
  type = "success", // "success" หรือ "error"
  title,
  message,
}) {
  // ปิด modal เมื่อกด ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // ป้องกันการ scroll หลัง modal
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // กำหนดสี icon และ title ตาม type
  const isSuccess = type === "success";
  const defaultTitle = isSuccess ? "Complete" : "Error";
  const iconBgColor = isSuccess ? "bg-green-100" : "bg-red-100";
  const iconColor = isSuccess ? "text-green-600" : "text-red-600";

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-9999 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-10000 flex items-center justify-center">
        <div className="bg-white rounded-4xl shadow-xl max-w-md w-full mx-auto transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#E4E6ED]">
            <h2 className="text-xl font-semibold text-black">{title || defaultTitle}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close modal">
              <IoClose color="#C8CCDB" size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 flex-1">
            <p className="text-[#646D89]">
              {message ||
                (isSuccess
                  ? "Your complaint has been submitted successfully. We will review it and get back to you as soon as possible."
                  : "There was an error processing your request. Please try again or contact support if the problem persists.")}
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <button onClick={onClose} className="primary-btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
