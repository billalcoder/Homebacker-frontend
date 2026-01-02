import Cropper from "react-easy-crop";
import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

const ImageCropper = ({ imageSrc, aspect = 1, onDone, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState(null);

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedPixels(pixels);
  }, []);

  // 🔒 lock background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-black flex flex-col">
      <div className="relative flex-1">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      <div className="bg-black p-4 flex justify-between items-center">
        <button onClick={onCancel} className="text-white">
          Cancel
        </button>

        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(e.target.value)}
        />

        <button
          onClick={() => onDone(croppedPixels)}
          className="bg-amber-600 text-white px-4 py-2 rounded"
        >
          Crop
        </button>
      </div>
    </div>,
    document.body // 🚀 THIS IS THE MAGIC
  );
};

export default ImageCropper;
