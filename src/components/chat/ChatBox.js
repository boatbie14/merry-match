// components/ChatBox.js
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useImageUpload } from "@/hooks/useImageUpload";
import StatusModal from "@/components/popup/StatusModal";
import { HiPaperAirplane } from "react-icons/hi2";
import { HiX } from "react-icons/hi";
import { PiImageFill } from "react-icons/pi";

export default function Chat({ chatData, currentUser, onMessageSent }) {
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // State สำหรับ Image Modal
  const [modalImage, setModalImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State สำหรับ Status Modal
  const [modalType, setModalType] = useState("success");
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fileInputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Upload image hook
  const {
    uploading: isUploading,
    progress: uploadProgress,
    uploadError,
    uploadImage,
    validateImageFile,
    clearUploadError,
    reset: resetUpload,
  } = useImageUpload();

  // ดึงข้อมูลจาก props
  const senderId = currentUser?.id;
  const receiverId = chatData?.targetUser?.id;
  const username = currentUser?.name || "Unknown";
  const roomId = chatData?.chatRoom?.id;

  // ใช้ custom hook สำหรับจัดการ chat
  const {
    messages,
    loading,
    error: chatError,
    sending,
    sendMessage,
    isOwnMessage,
    clearError: clearChatError,
  } = useChatMessages(senderId, receiverId, username, roomId);

  // Combine errors
  const combinedError = chatError || uploadError;
  const clearAllErrors = () => {
    clearChatError();
    clearUploadError();
  };

  // ปิดการใช้ auto scroll ของ hook โดยการ override useEffect
  useEffect(() => {
    // ไม่ทำอะไร - ให้เราจัดการ scroll เอง
  }, [messages]);

  // State สำหรับติดตามการโหลดรูป
  const [loadingImages, setLoadingImages] = useState(new Set());

  // ฟังก์ชันสำหรับ scroll ไปล่าสุด
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // ฟังก์ชันจัดการเมื่อรูปเริ่มโหลด
  const handleImageLoadStart = (imageUrl) => {
    setLoadingImages((prev) => new Set([...prev, imageUrl]));
  };

  // ฟังก์ชันจัดการเมื่อรูปโหลดเสร็จ
  const handleImageLoaded = (imageUrl) => {
    setLoadingImages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(imageUrl);
      return newSet;
    });
    // รอสักหน่อยเพื่อให้แน่ใจว่ารูปอื่นๆ โหลดเสร็จด้วย
    setTimeout(() => {
      if (loadingImages.size <= 1) {
        scrollToBottom();
      }
    }, 100);
  };

  // Auto scroll เมื่อ messages เปลี่ยน (รอให้รูปทั้งหมดโหลดเสร็จ)
  useEffect(() => {
    // ถ้าไม่มีรูปที่กำลังโหลดอยู่เลย ให้ scroll ได้
    if (loadingImages.size === 0) {
      setTimeout(scrollToBottom, 50);
    }
  }, [messages, loadingImages]);

  // เพิ่ม useEffect เพื่อ scroll เมื่อรูปทั้งหมดโหลดเสร็จ
  useEffect(() => {
    if (loadingImages.size === 0 && messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [loadingImages.size, messages.length]);

  // Auto scroll เมื่อ component mount
  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, []);

  // ตรวจสอบว่ามีข้อมูลครบหรือไม่
  if (!senderId || !receiverId || !roomId) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  function handleCloseModal() {
    setShowModal(false);
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

  // จัดการเลือกไฟล์
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // ใช้ validation จาก Hook
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setModalType("error");
        setModalMessage(validation.message);
        setShowModal(true);
        return;
      }

      // สร้าง preview (ไม่ต้อง compress ก่อน preview)
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } catch (error) {
      setModalType("error");
      setModalMessage("An error occurred while processing the image.");
      setShowModal(true);
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
    resetUpload();
  };

  // Handle form submission
  const handleSendMessage = async (e) => {
    e.preventDefault();

    // ถ้าไม่มีข้อความและรูป ก็ไม่ส่ง
    if (!newMessage.trim() && !selectedImage) return;

    try {
      let imageUrl = null;

      // อัพโหลดรูปถ้ามี
      if (selectedImage) {
        const uploadResult = await uploadImage(selectedImage, senderId);
        imageUrl = uploadResult.imageUrl;
      }

      // ส่งข้อความ
      const success = await sendMessage(newMessage, imageUrl);

      if (success) {
        setNewMessage("");
        handleRemoveImage();

        // Scroll ไปล่าสุดหลังส่งข้อความ
        setTimeout(() => {
          scrollToBottom();
        }, 100);

        // เรียก callback เมื่อส่งสำเร็จ
        if (onMessageSent && typeof onMessageSent === "function") {
          onMessageSent();
        }
      }
    } catch (error) {
      setModalType("error");
      setModalMessage(error.message || "An error occurred while sending the message.");
      setShowModal(true);
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
          <div className="relative max-w-[250px] max-h-[200px] overflow-hidden rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-shadow">
            <Image
              src={message.image_url}
              alt="Shared image"
              width={250}
              height={200}
              className="object-cover w-full h-full"
              onClick={() => openImageModal(message.image_url)}
              onLoadStart={() => handleImageLoadStart(message.image_url)}
              onLoad={() => handleImageLoaded(message.image_url)}
              unoptimized={message.image_url?.startsWith("blob:") || message.image_url?.startsWith("data:")}
            />
          </div>
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
    <>
      <div className="h-full flex flex-col">
        {/* Image Modal */}
        {isModalOpen && modalImage && (
          <div className="fixed inset-0 bg-black/70 bg-opacity-75 flex items-center justify-center z-9999" onClick={closeImageModal}>
            <div className="relative max-w-4xl max-h-4xl p-6 lg:p-3">
              {/* Close Button */}
              <button
                onClick={closeImageModal}
                className="absolute top-[4px] right-[4px] lg:top-[-4px] lg:right-[-4px] text-white bg-[#C70039] bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all z-99991 cursor-pointer"
              >
                <HiX size={20} />
              </button>

              {/* Modal Image */}
              <div className="relative max-w-[300px] lg:max-w-[500px]">
                <Image
                  src={modalImage}
                  alt="Full size view"
                  width={800}
                  height={600}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                  unoptimized={modalImage?.startsWith("blob:") || modalImage?.startsWith("data:")}
                />
              </div>
            </div>
          </div>
        )}

        {/* แสดงข้อผิดพลาด (ถ้ามี) */}
        {combinedError && (
          <div className="bg-red-100 text-red-700 p-2 m-4 rounded flex justify-between items-center">
            <span>{combinedError}</span>
            <button onClick={clearAllErrors} className="text-red-500 hover:text-red-700 ml-2">
              ✕
            </button>
          </div>
        )}

        {/* กล่องข้อความ */}
        <div ref={messagesContainerRef} className="flex-1 p-4 overflow-y-auto px-4 lg:px-24">
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
                        <div className="relative max-w-[200px] max-h-[200px] lg:max-w-[300px] lg:max-h-[300px] overflow-hidden rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-shadow">
                          <Image
                            src={message.image_url}
                            alt="Shared image"
                            width={300}
                            height={300}
                            className="object-cover w-full h-full"
                            onClick={() => openImageModal(message.image_url)}
                            onLoadStart={() => handleImageLoadStart(message.image_url)}
                            onLoad={() => handleImageLoaded(message.image_url)}
                            unoptimized={message.image_url?.startsWith("blob:") || message.image_url?.startsWith("data:")}
                          />
                        </div>
                        {message.content && message.content.trim() && (
                          <span className="inline-block text-[16px] px-6 py-3 border-1 border-[#7D2262] rounded-tl-[24px] rounded-tr-[24px] rounded-br-none rounded-bl-[24px] bg-[#7D2262] text-white">
                            {message.content}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="inline-block text-[16px] px-6 py-3 border-1 border-[#7D2262] rounded-tl-[24px] rounded-tr-[24px] rounded-br-none rounded-bl-[24px] bg-[#7D2262] text-white">
                        {renderMessage(message)}
                      </span>
                    )}
                  </div>
                ) : (
                  // ข้อความของคนอื่น
                  <div className="flex items-end gap-3">
                    {message.sender?.profile_image_url && (
                      <div className="relative w-10 h-10 flex-shrink-0">
                        <Image
                          src={message.sender.profile_image_url}
                          alt={message.sender.username}
                          width={40}
                          height={40}
                          className="rounded-full object-cover w-full h-full"
                          unoptimized={
                            message.sender.profile_image_url?.startsWith("blob:") || message.sender.profile_image_url?.startsWith("data:")
                          }
                        />
                      </div>
                    )}
                    <div className="flex flex-col items-start gap-1">
                      {message.message_type === "image" ? (
                        <div className="flex flex-col items-start gap-2">
                          <div className="relative max-w-[200px] max-h-[200px] lg:max-w-[300px] lg:max-h-[300px] overflow-hidden rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-shadow">
                            <Image
                              src={message.image_url}
                              alt="Shared image"
                              width={300}
                              height={300}
                              className="object-cover w-full h-full"
                              onClick={() => openImageModal(message.image_url)}
                              onLoadStart={() => handleImageLoadStart(message.image_url)}
                              onLoad={() => handleImageLoaded(message.image_url)}
                              unoptimized={message.image_url?.startsWith("blob:") || message.image_url?.startsWith("data:")}
                            />
                          </div>
                          {message.content && message.content.trim() && (
                            <span className="inline-block text-[16px] px-6 py-3 rounded-tl-[24px] border-1 border-[#E4E6ED] rounded-tr-[24px] rounded-br-[24px] rounded-bl-none bg-[#EFC4E2] text-[#31333C]">
                              {message.content}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-block text-[16px] px-6 py-3 rounded-tl-[24px] border-1 border-[#E4E6ED] rounded-tr-[24px] rounded-br-[24px] rounded-bl-none bg-[#EFC4E2] text-[#31333C]">
                          {message.content}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* ฟอร์มส่งข้อความ */}
        <div className="p-4 border-t border-t-[#424C6B] px-4 lg:px-24">
          {/* แสดง preview รูป */}
          {imagePreview && (
            <div className="mb-3 flex items-center gap-2 p-2 bg-[#200009] border-1 border-[#FF1659] rounded-lg">
              <div className="relative w-12 h-12 overflow-hidden rounded">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                  unoptimized={imagePreview?.startsWith("blob:") || imagePreview?.startsWith("data:")}
                />
              </div>
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
              className="flex bg-[#F6F7FC] w-12 h-12 justify-center items-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
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
              className="bg-[#C70039] text-white w-12 h-12 pl-1 flex justify-center items-center rounded-full hover:bg-[#95002B] transition-colors cursor-pointer"
              disabled={loading || sending || isUploading || (!newMessage.trim() && !selectedImage)}
            >
              <HiPaperAirplane size={24} color="#fff" />
            </button>
          </form>
        </div>
      </div>

      <StatusModal isOpen={showModal} onClose={handleCloseModal} type={modalType} message={modalMessage} />
    </>
  );
}
