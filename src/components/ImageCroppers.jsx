import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, Check, ZoomIn } from 'lucide-react'; // Assuming you use lucide-react like your other files

// Helper to center the crop initially
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      { unit: '%', width: 90 }, // Start with 90% width selection
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

const ImageCropper = ({ imageSrc, onDone, onCancel, aspect = 1 }) => {
  const [crop, setCrop] = useState();
  const imgRef = useRef(null); // Reference to the displayed image

  // Triggered when the image loads on screen
  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    const initialCrop = centerAspectCrop(width, height, aspect);
    setCrop(initialCrop);
  }

  const handleCropComplete = () => {
    // 1. Safety checks
    if (!imgRef.current || !crop) {
      onCancel(); 
      return;
    }

    const image = imgRef.current;
    
    // === THE FIX IS HERE (SCALE CALCULATION) ===
    // We calculate how much the image was shrunk by CSS
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // We convert "Screen Pixels" -> "Real Image Pixels"
    const finalCrop = {
      x: crop.x * scaleX,
      y: crop.y * scaleY,
      width: crop.width * scaleX,
      height: crop.height * scaleY,
      unit: 'px' // Important for your utils/cropImage.js
    };

    // Send the CORRECTED coordinates back to ShopPage
    onDone(finalCrop);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-xl overflow-hidden shadow-2xl max-w-4xl w-full flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b flex justify-between items-center z-10">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <ZoomIn size={20} className="text-blue-600"/> Adjust Image
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Cropper Area */}
        <div className="flex-1 bg-gray-900 overflow-auto flex items-center justify-center p-4">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCrop(c)}
            aspect={aspect}
            className="shadow-2xl"
          >
            {/* max-h-[60vh] ensures the image fits on screen so you can see the handles.
               w-auto maintains aspect ratio.
            */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop me"
              onLoad={onImageLoad}
              className="max-h-[60vh] w-auto object-contain block mx-auto" 
            />
          </ReactCrop>
        </div>

        {/* Footer Actions */}
        <div className="bg-white border-t px-6 py-4 flex justify-end gap-3 z-10">
          <button 
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleCropComplete}
            className="px-6 py-2.5 rounded-lg font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Check size={18} /> Apply Crop
          </button>
        </div>

      </div>
    </div>
  );
};

export default ImageCropper;