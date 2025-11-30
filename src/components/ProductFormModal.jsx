import React, { useState, useEffect } from 'react';
import Button from './Button'; // Reusing your existing button
import FormInput from './FormInput'; // Reusing your input

const ProductFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    category: "Cake",
    productDescription: "",
    unitType: "kg", // DEFAULT
    unitValue: "250", // DEFAULT for kg
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Reset or Pre-fill form when modal opens
  useEffect(() => {
    if (initialData) {
      setFormData({
        productName: initialData.productName,
        price: initialData.price,
        category: initialData.category,
        productDescription: initialData.productDescription || "",
        unitType: initialData.unitType,
        unitValue: initialData.unitValue,
      });

      if (initialData.images && initialData.images.length > 0) {
        setPreviewUrl(initialData.images[0]);
      }
    } else {
      setFormData({
        productName: "",
        price: "",
        category: "Cake",
        productDescription: "",
        unitType: "kg",
        unitValue: "250",
      });
      setImageFile(null);
      setPreviewUrl("");
    }
  }, [initialData, isOpen]);

 const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => {
    let updated = { ...prev, [name]: value };

    // Only auto-change when user selects unitType
    if (name === "unitType") {
      updated.unitValue = value === "kg" ? "250" : "1"; 
    }

    return updated;
  });
};

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("productName", formData.productName);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("productDescription", formData.productDescription);
    data.append("unitType", formData.unitType);
    data.append("unitValue", formData.unitValue);

    if (imageFile) {
      data.append("productImages", imageFile);
    }

    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="bg-amber-600 p-4 text-white flex justify-between items-center">
          <h2 className="font-bold text-lg">{initialData ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} className="text-amber-100 hover:text-white">&times;</button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit}>

            {/* Image Upload */}
            <div className="mb-6 flex justify-center">
              <div className="relative group cursor-pointer w-32 h-32 rounded-xl border-2 border-dashed border-stone-300 flex items-center justify-center bg-stone-50 overflow-hidden hover:border-amber-500 transition-colors">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-stone-400">
                    <span className="text-2xl block">+</span>
                    <span className="text-xs">Upload Image</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <FormInput label="Product Name" name="productName" value={formData.productName} onChange={handleChange} required />

            <FormInput label="Price (₹)" type="number" name="price" value={formData.price} onChange={handleChange} required />

            {/* Unit Type */}
            <div className="mb-4">
              <label className="block text-stone-600 text-sm font-semibold mb-2">Select Unit Type</label>
              <select
                name="unitType"
                value={formData.unitType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-amber-500"
              >
                <option value="kg">Kilogram (grams)</option>
                <option value="quantity">Quantity</option>
              </select>
            </div>

            {/* Dynamic Input Based on Type */}
            <FormInput
              label={formData.unitType === "kg" ? "Weight (grams)" : "Quantity"}
              type="number"
              name="unitValue"
              value={formData.unitValue}
              onChange={handleChange}
              required
            />

            {/* Category */}
            <div className="mb-4">
              <label className="block text-stone-600 text-sm font-semibold mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border bg-stone-50"
              >
                {["Cake", "Pastry", "Cookies", "Bread", "Brownie", "Donuts", "Chocolates", "Snacks", "Others"].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-stone-600 text-sm font-semibold mb-2">Description</label>
              <textarea
                name="productDescription"
                value={formData.productDescription}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 rounded-lg border bg-stone-50"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 py-3 text-stone-600 font-bold hover:bg-stone-100 rounded-lg transition-colors">
                Cancel
              </button>
              <div className="flex-1">
                <Button text={initialData ? "Update Product" : "Add Product"} type="submit" />
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductFormModal;