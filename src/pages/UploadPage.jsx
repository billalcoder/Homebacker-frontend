import React, { useState, useEffect } from 'react';
import ProductItem from '../components/ProductItem';
import ProductFormModal from '../components/ProductFormModal';
import Button from '../components/Button';

const UploadProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // Holds product being edited

  // --- API Functions ---

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BASEURL}/client/getproduct` , {credentials : "include"});
      const data = await res.json();
      console.log(data);
      
      if (res.ok) {
        // Handle case where backend might return { products: [...] } or just [...]
        const productList = data.data || (Array.isArray(data) ? data : []);
        setProducts(productList);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async (formData) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASEURL}/client/product`, {
        method: 'POST',
        // IMPORTANT: Do NOT set Content-Type header when sending FormData.
        // The browser automatically sets it to multipart/form-data with the correct boundary.
        body: formData, 
        credentials : "include"
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchProducts(); // Refresh list to show new item
      } else {
        const errData = await res.json();
        alert(errData.message || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleUpdate = async (formData) => {
    if (!editingProduct) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BASEURL}/client/product/${editingProduct._id}`, {
        method: 'PUT',
        body: formData,
        credentials : "include"
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingProduct(null);
        fetchProducts(); // Refresh list
      } else {
        const errData = await res.json();
        alert(errData.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BASEURL}/client/product/${id}`, {
        method: 'DELETE',
        credentials : "include"
      });

      if (res.ok) {
        // Optimistically remove from state so we don't have to wait for a re-fetch
        setProducts(prev => prev.filter(p => p._id !== id));
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  // --- Event Handlers ---

  const openAddModal = () => {
    setEditingProduct(null); // Clear editing state
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product); // Set item to edit
    setIsModalOpen(true);
  };

  // --- Render Logic ---

  return (
    <div className="p-6 relative min-h-[80vh]">
      
      {/* 1. Top Header Area (Only visible if we have products) */}
      {products.length > 0 && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-stone-700">My Products</h2>
          <button 
            onClick={openAddModal}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-amber-700 transition-colors flex items-center transform hover:scale-105 duration-200"
          >
            <span className="text-xl mr-1">+</span> Add Product
          </button>
        </div>
      )}

      {/* 2. Content Area */}
      {loading ? (
        <div className="text-center py-20 text-stone-400 font-medium">Loading your bakery items...</div>
      ) : products.length === 0 ? (
        
        // EMPTY STATE: Centered Button
        <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-4 text-amber-500 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-stone-700 mb-2">No Products Yet</h3>
          <p className="text-stone-500 mb-6 max-w-xs mx-auto">Start building your menu by adding your first delicious item.</p>
          <div className="w-48 mx-auto">
            <Button text="Upload First Product" onClick={openAddModal} />
          </div>
        </div>

      ) : (
        
        // POPULATED STATE: Grid List
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20 animate-fade-in">
          {products.map(product => (
            <ProductItem 
              key={product._id} 
              product={product} 
              onEdit={openEditModal} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}

      {/* 3. The Modal (Handles both Add and Edit) */}
      <ProductFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={editingProduct ? handleUpdate : handleCreate}
        initialData={editingProduct}
      />
    </div>
  );
};

export default UploadProduct;