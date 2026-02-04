export const getCroppedImage = (imageSrc, pixelCrop, rotation = 0) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = "anonymous"; // Fixes CORS issues if images are external

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // 1. Set canvas to the exact size of the CUT you want
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      // 2. High-Quality Settings (Crucial for cakes/products)
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // 3. Draw the image
      // We draw the huge original image, but shift it so only the cropped area is visible
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      // 4. SMART FILE TYPE DETECTION
      // If the original name ended in .png, we keep it as PNG to save transparency.
      // Otherwise, we default to JPEG for smaller file size.
      const isPNG = imageSrc.toLowerCase().endsWith(".png");
      const fileType = isPNG ? "image/png" : "image/jpeg";
      const fileName = isPNG ? "product.png" : "product.jpg";

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("Canvas is empty");
            return;
          }
          // Resolve with a real File object
          resolve(
            new File([blob], fileName, {
              type: fileType,
            })
          );
        },
        fileType,
        1 // 1 = 100% Quality (You can lower to 0.9 for compression)
      );
    };
    
    image.onerror = (error) => reject(error);
  });
};