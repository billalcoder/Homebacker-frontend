import React from 'react';

const ProductItem = ({ product, onEdit, onDelete }) => {
  // Use first image if available, else a placeholder
  const imageUrl = product.images && product.images.length > 0
    ? product.images[0]
    : 'https://placehold.co/100x100?text=No+Img';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4 flex items-center justify-between mb-4 hover:shadow-md transition-shadow">

      {/* Left: Image & Info */}
      <div className="flex items-center space-x-4">
        <div className="h-16 w-16 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-100">
          <img
            src={imageUrl}
            alt={product.productName}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h3 className="font-bold text-stone-800 text-lg">{product.productName}</h3>
          <div className="flex items-center text-sm text-stone-500 space-x-3">
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-medium">
              {product.category}
            </span>
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-medium">
              {product.unitType === "kg" ? product.unitValue + "" : product.unitValue + "per unit"}
            </span>
          </div>
          <p className="text-amber-600 font-bold mt-1">₹{product.price}</p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onEdit(product)}
          className="p-2 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors"
          title="Edit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          title="Delete"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductItem;