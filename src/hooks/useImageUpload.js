// hooks/useImageUpload.js
import { useState, useCallback } from "react";

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  // 🔍 Client-side file validation
  const validateImageFile = useCallback((file) => {
    const maxSize = 2 * 1024 * 1024; // 2MB (ให้น้อยกว่า server limit)
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!file) {
      return { valid: false, message: "No file selected" };
    }

    if (file.size > maxSize) {
      return { valid: false, message: "Image too large. Maximum size is 2MB" };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, message: "Invalid file type. Allowed: JPG, PNG, WebP" };
    }

    return { valid: true };
  }, []);

  // 🖼️ Image compression/resize utility
  const compressImage = useCallback((file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = document.createElement("img");

      img.onload = () => {
        try {
          // Calculate new dimensions
          const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
          const newWidth = img.width * ratio;
          const newHeight = img.height * ratio;

          canvas.width = newWidth;
          canvas.height = newHeight;

          // Draw resized image
          ctx.drawImage(img, 0, 0, newWidth, newHeight);

          // Convert to blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Failed to compress image"));
              }
            },
            "image/jpeg",
            quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  // 🚀 Main upload function
  const uploadImage = useCallback(
    async (file, userId) => {
      try {
        setUploading(true);
        setProgress(0);
        setError(null);

        // ✅ Client-side validation
        const validation = validateImageFile(file);
        if (!validation.valid) {
          throw new Error(validation.message);
        }

        setProgress(25);

        // ✅ Compress image
        const compressedFile = await compressImage(file);
        setProgress(50);

        // ✅ Upload to server
        const formData = new FormData();
        formData.append("image", compressedFile);
        formData.append("userId", userId);

        setProgress(75);

        const response = await fetch("/api/chat/upload-image", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Upload failed");
        }

        const data = await response.json();
        setProgress(100);

        if (!data.success) {
          throw new Error(data.message || "Upload failed");
        }

        return {
          success: true,
          imageUrl: data.imageUrl,
          filename: data.filename,
          size: data.size,
        };
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setUploading(false);
        // Reset progress after a delay
        setTimeout(() => setProgress(0), 1000);
      }
    },
    [validateImageFile, compressImage]
  );

  // 🧹 Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 🔄 Reset state function
  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    // State
    uploading,
    progress,
    uploadError: error,

    // Functions
    uploadImage,
    validateImageFile,
    compressImage,
    clearUploadError: clearError,
    reset,
  };
};
