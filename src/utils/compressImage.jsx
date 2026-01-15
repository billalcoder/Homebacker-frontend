import imageCompression from "browser-image-compression";

export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 0.5,          // 500 KB
    maxWidthOrHeight: 1024,  // Resize
    useWebWorker: true
  };

  try {
    const compressedFile = await imageCompression(file, options);

    // Preserve filename (important for Multer)
    return new File([compressedFile], file.name, {
      type: compressedFile.type
    });
  } catch (err) {
    console.error("Image compression failed:", err);
    return file; // fallback
  }
};
