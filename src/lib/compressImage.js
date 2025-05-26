import imageCompression from 'browser-image-compression';

export async function compressImage(file) {
  const options = {
    maxSizeMB: 0.8,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };

  try {
    let compressedFile
    if (file.size > 2 * 1024 * 1024) {
    compressedFile = await imageCompression(file, options);
} else { compressedFile = file
}
    return compressedFile;
  } catch (error) {
    console.error("Compression failed:", error);
    return file; // fallback
  }
}