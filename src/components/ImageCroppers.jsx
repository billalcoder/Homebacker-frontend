import React, { useState, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, Check, ZoomIn, Minus, Plus } from 'lucide-react'; 

// Helper: Start with 100% width crop
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      { unit: '%', width: 100 },
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
  const [zoom, setZoom] = useState(1); 
  const imgRef = useRef(null); 

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    const initialCrop = centerAspectCrop(width, height, aspect);
    setCrop(initialCrop);
  }

  const handleCropComplete = () => {
    if (!imgRef.current || !crop) {
      onCancel(); 
      return;
    }
    const image = imgRef.current;
    
    // Scale Calculation
    // Since we are changing the IMAGE dimensions directly with CSS (maxWidth/maxHeight),
    // image.width will change, so this math automatically stays correct.
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const finalCrop = {
      x: crop.x * scaleX,
      y: crop.y * scaleY,
      width: crop.width * scaleX,
      height: crop.height * scaleY,
      unit: 'px' 
    };

    onDone(finalCrop);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      <div className="relative bg-white rounded-xl overflow-hidden shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b flex justify-between items-center z-10 shrink-0">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <ZoomIn size={20} className="text-blue-600"/> Adjust Image
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Cropper Area */}
        <div className="flex-1 bg-gray-900 overflow-auto relative flex items-center justify-center p-4">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCrop(c)}
            aspect={aspect}
            style={{
               // Ensure the crop container grows with the image
               minWidth: 'fit-content',
               minHeight: 'fit-content',
            }}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop me"
              onLoad={onImageLoad}
              style={{
                // === THE FIX ===
                // Instead of "scale()", we strictly control the dimensions.
                // 1. Initial size (Zoom 1): Max Width 100%, Max Height 65vh (Fits screen)
                // 2. Zoomed (Zoom 1.5): Max Width 150%, Max Height 97.5vh (Grows proportionally)
                maxWidth: `${100 * zoom}%`,
                maxHeight: `calc((85vh - 160px) * ${zoom})`, 
                
                // Ensure image maintains aspect ratio and doesn't distort
                width: 'auto', 
                height: 'auto',
                display: 'block'
              }}
            />
          </ReactCrop>
        </div>

        {/* Footer */}
        <div className="bg-white border-t px-6 py-3 z-10 shrink-0">
          
          <div className="flex items-center justify-center gap-4 mb-3">
             <button onClick={() => setZoom(Math.max(1, zoom - 0.05))} className="p-1 text-gray-500 hover:bg-gray-100 rounded">
                <Minus size={16} />
             </button>
             
             <input 
               type="range" 
               min="1" 
               max="1.5" 
               step="0.01" 
               value={zoom} 
               onChange={(e) => setZoom(parseFloat(e.target.value))}
               className="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
             />

             <button onClick={() => setZoom(Math.min(1.5, zoom + 0.05))} className="p-1 text-gray-500 hover:bg-gray-100 rounded">
                <Plus size={16} />
             </button>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
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
    </div>
  );
};

export default ImageCropper;