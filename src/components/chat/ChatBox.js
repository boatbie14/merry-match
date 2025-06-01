// components/ChatBox.js
import { useState, useRef } from "react";
import { useChatMessages } from "@/hooks/useChatMessages";
import { HiPaperAirplane } from "react-icons/hi2";
import { HiX } from "react-icons/hi";
import { PiImageFill } from "react-icons/pi";

// 🚀 UPDATED: เพิ่ม onMessageSent prop
export default function Chat({ chatData, currentUser, onMessageSent }) {
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // State สำหรับ Image Modal
  const [modalImage, setModalImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fileInputRef = useRef(null);

  // ดึงข้อมูลจาก props
  const senderId = currentUser?.id;
  const receiverId = chatData?.targetUser?.id;
  const username = currentUser?.name || "Unknown";
  const roomId = chatData?.chatRoom?.id;

  // ใช้ custom hook สำหรับจัดการ chat (กลับไปใช้ไฟล์เก่า)
  const { messages, loading, error, sending, sendMessage, isOwnMessage, messagesEndRef, clearError } = useChatMessages(
    senderId,
    receiverId,
    username,
    roomId
  );

  // ตรวจสอบว่ามีข้อมูลครบหรือไม่
  if (!senderId || !receiverId || !roomId) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // เปิด Image Modal
  const openImageModal = (imageUrl) => {
    setModalImage(imageUrl);
    setIsModalOpen(true);
  };

  // ปิด Image Modal
  const closeImageModal = () => {
    setModalImage(null);
    setIsModalOpen(false);
  };

  // Resize และ compress รูปภาพ
  const resizeAndCompressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // คำนวณขนาดใหม่
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        const newWidth = img.width * ratio;
        const newHeight = img.height * ratio;

        canvas.width = newWidth;
        canvas.height = newHeight;

        // วาดรูปใหม่
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // แปลงเป็น blob
        canvas.toBlob(resolve, "image/jpeg", quality);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // จัดการเลือกไฟล์
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // เช็คประเภทไฟล์
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please select an image file. (JPG, PNG, WebP)");
      return;
    }

    // เช็คขนาดไฟล์ (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("The image file must not exceed the size limit. 5MB");
      return;
    }

    try {
      // Resize และ compress
      const compressedFile = await resizeAndCompressImage(file);
      setSelectedImage(compressedFile);

      // สร้าง preview
      const previewUrl = URL.createObjectURL(compressedFile);
      setImagePreview(previewUrl);
    } catch (error) {
      console.error("Error processing image:", error);
      alert("An error occurred while processing the image.");
    }

    // Reset file input
    e.target.value = "";
  };

  // ลบรูปที่เลือก
  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  // อัพโหลดรูปภาพ
  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("userId", senderId);

    const response = await fetch("/api/chat/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.imageUrl;
  };

  // Handle form submission
  const handleSendMessage = async (e) => {
    e.preventDefault();

    // ถ้าไม่มีข้อความและรูป ก็ไม่ส่ง
    if (!newMessage.trim() && !selectedImage) return;

    try {
      setIsUploading(true);
      let imageUrl = null;

      // อัพโหลดรูปถ้ามี
      if (selectedImage) {
        setUploadProgress(50);
        imageUrl = await uploadImage(selectedImage);
        setUploadProgress(100);
      }

      // ส่งข้อความ
      const success = await sendMessage(newMessage, imageUrl);

      if (success) {
        setNewMessage("");
        handleRemoveImage();

        // 🎉 NEW: เรียก callback เมื่อส่งสำเร็จ
        if (onMessageSent && typeof onMessageSent === "function") {
          onMessageSent();
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("An error occurred while processing the image.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // เปิด file picker
  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  // ฟังก์ชันจัดรูปแบบเวลา
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // แสดงข้อความตามประเภท
  const renderMessage = (message) => {
    if (message.message_type === "image") {
      return (
        <div className="flex flex-col gap-2">
          {/* รูปภาพ - แยกออกจาก bubble */}
          <img
            src={message.image_url}
            alt="Shared image"
            className="max-w-[250px] max-h-[200px] object-cover rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-shadow"
            onClick={() => openImageModal(message.image_url)}
          />
          {/* Caption ถ้ามี - อยู่ใน bubble แยก */}
          {message.content && message.content.trim() && (
            <span
              className={`inline-block px-6 py-4 ${
                isOwnMessage(message)
                  ? "bg-[#7D2262] text-white rounded-tl-[24px] rounded-tr-[24px] rounded-bl-[24px] rounded-br-none"
                  : "bg-[#EFC4E2] text-black rounded-tl-[24px] rounded-tr-[24px] rounded-br-[24px] rounded-bl-none"
              }`}
            >
              {message.content}
            </span>
          )}
        </div>
      );
    }
    return <div>{message.content}</div>;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Image Modal */}
      {isModalOpen && modalImage && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-75 flex items-center justify-center z-50" onClick={closeImageModal}>
          <div className="relative max-w-4xl max-h-4xl p-6 lg:p-3">
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute top-[4px] right-[4px] lg:top-[-4px] lg:right-[-4px] text-white bg-[#C70039] bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all z-10"
            >
              <HiX size={20} />
            </button>

            {/* Modal Image */}
            <img
              src={modalImage}
              alt="Full size view"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* แสดงข้อผิดพลาด (ถ้ามี) */}
      {error && (
        <div className="bg-red-100 text-red-700 p-2 m-4 rounded flex justify-between items-center">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-500 hover:text-red-700 ml-2">
            ✕
          </button>
        </div>
      )}

      {/* กล่องข้อความ */}
      <div className="flex-1 p-4 overflow-y-auto px-4 lg:px-24">
        {loading ? (
          <div className="text-center text-gray-500 py-4">Loading...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 py-4">No Message</div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`mb-3 ${isOwnMessage(message) ? "text-right" : "text-left"}`}>
              {isOwnMessage(message) ? (
                // ข้อความของเรา
                <div className="flex flex-col items-end gap-1">
                  {message.message_type === "image" ? (
                    <div className="flex flex-col items-end gap-2">
                      <img
                        src={message.image_url}
                        alt="Shared image"
                        className="max-w-[200px] max-h-[200px] lg:max-w-[300px] lg:max-h-[300px] object-cover rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                        onClick={() => openImageModal(message.image_url)}
                      />
                      {message.content && message.content.trim() && (
                        <span className="inline-block px-6 py-4 bg-[#7D2262] text-white rounded-tl-[24px] rounded-tr-[24px] rounded-bl-[24px] rounded-br-none">
                          {message.content}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="inline-block px-6 py-4 rounded-tl-[24px] rounded-tr-[24px] rounded-br-none rounded-bl-[24px] bg-[#7D2262] text-white">
                      {renderMessage(message)}
                    </span>
                  )}
                </div>
              ) : (
                // ข้อความของคนอื่น
                <div className="flex items-start gap-3">
                  {message.sender?.profile_image_url && (
                    <img
                      src={message.sender.profile_image_url}
                      className="rounded-full w-10 h-10 object-cover flex-shrink-0"
                      alt={message.sender.username}
                    />
                  )}
                  <div className="flex flex-col items-start gap-1">
                    {message.message_type === "image" ? (
                      <div className="flex flex-col items-start gap-2">
                        <img
                          src={message.image_url}
                          alt="Shared image"
                          className="max-w-[200px] max-h-[200px] lg:max-w-[300px] lg:max-h-[300px] object-cover rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                          onClick={() => openImageModal(message.image_url)}
                        />
                        {message.content && message.content.trim() && (
                          <span className="inline-block px-6 py-4 bg-[#EFC4E2] text-black rounded-tl-[24px] rounded-tr-[24px] rounded-br-[24px] rounded-bl-none">
                            {message.content}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="inline-block px-6 py-4 rounded-tl-[24px] rounded-tr-[24px] rounded-br-[24px] rounded-bl-none bg-[#EFC4E2] text-black">
                        {message.content}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ฟอร์มส่งข้อความ */}
      <div className="p-4 border-t border-t-[#424C6B] px-4 lg:px-24">
        {/* แสดง preview รูป */}
        {imagePreview && (
          <div className="mb-3 flex items-center gap-2 p-2 bg-[#200009] border-1 border-[#FF1659] rounded-lg">
            <img src={imagePreview} alt="Preview" className="w-12 h-12 object-cover rounded" />
            <span className="text-sm text-gray-600 flex-1">Select Image</span>
            <button type="button" onClick={handleRemoveImage} className="text-red-500 hover:text-red-700">
              <HiX size={20} />
            </button>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="mb-3">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div className="bg-[#C70039] h-1 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Uploading... {uploadProgress}%</p>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex gap-4">
          {/* Hidden file input */}
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />

          {/* Attach button */}
          <button
            type="button"
            onClick={handleAttachClick}
            className="flex bg-[#F6F7FC] w-12 h-12 justify-center items-center rounded-full hover:bg-gray-200 transition-colors"
            disabled={isUploading}
          >
            <PiImageFill size={20} color="#9AA1B9" />
          </button>

          {/* Text input */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Message..."
            className="flex-1 p-2 border-none rounded text-[#9B9EAD] outline-none focus:outline-none"
            disabled={loading || sending || isUploading}
          />

          {/* Send button */}
          <button
            type="submit"
            className="bg-[#C70039] text-white w-12 h-12 pl-1 flex justify-center items-center rounded-full hover:bg-[#95002B] transition-colors"
            disabled={loading || sending || isUploading || (!newMessage.trim() && !selectedImage)}
          >
            <HiPaperAirplane size={24} color="#fff" />
          </button>
        </form>
      </div>
    </div>
  );
}
