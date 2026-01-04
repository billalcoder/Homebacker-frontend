import React, { useState, useEffect } from 'react';
import ProductItem from '../components/ProductItem';
import ProductFormModal from '../components/ProductFormModal';
import Button from '../components/Button';
import useApi from "../hooks/useApi";

const UploadProduct = () => {
  const [products, setProducts] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // Holds product being edited
  const productApi = useApi();        // GET / DELETE
  const productMutateApi = useApi(); // POST / PUT
const loading = productApi.loading;
  // --- API Functions ---

const fetchProducts = async () => {
  try {
    const data = await productApi.request({
      url: `${import.meta.env.VITE_BASEURL}/client/getproduct`,
      retry: 1,
    });

    if (!data) return; // aborted safely

    const productList = data.data || (Array.isArray(data) ? data : []);
    setProducts(productList);

  } catch (error) {
    if (error.name === "AbortError") return;

    fetch(`${import.meta.env.VITE_BASEURL}/log/frontend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        api: "/client/getproduct",
        route: window.location.pathname,
        source: "product",
        userAgent: navigator.userAgent,
      }),
    });
  }
};

  useEffect(() => {
    fetchProducts();
  }, []);

const handleCreate = async (formData) => {
  if (productMutateApi.loading) return;

  try {
    const res = await productMutateApi.request({
      url: `${import.meta.env.VITE_BASEURL}/client/product`,
      method: "POST",
      body: formData,
      retry: 1,
    });

    // 🚪 Close modal FIRST (UI response)
    setIsModalOpen(false);

    // 🔄 Clear edit state if any
    setEditingProduct(null);

    // ⏳ Small delay avoids mobile race conditions
    await new Promise(r => setTimeout(r, 300));

    // 🔁 Always refresh products
    await fetchProducts();

  } catch (error) {
    if (error.name === "AbortError") return;
    alert("Something went wrong. Please try again.");
  }
};


const handleUpdate = async (formData) => {
  if (!editingProduct || productMutateApi.loading) return;

  try {
    const res = await productMutateApi.request({
      url: `${import.meta.env.VITE_BASEURL}/client/product/${editingProduct._id}`,
      method: "PUT",
      body: formData,
      retry: 1,
    });

    if (res?.success) {
      setIsModalOpen(false);
      setEditingProduct(null);
      await new Promise(r => setTimeout(r, 300));
      await fetchProducts();
    } else {
      alert(res?.message || "Failed to update product");
    }

  } catch (error) {
    if (error.name === "AbortError") return;
    alert("Something went wrong. Please try again.");
  }
};


const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this product?")) return;
  if (productApi.loading) return;

  // Optimistic UI
  setProducts(prev => prev.filter(p => p._id !== id));

  try {
    await productApi.request({
      url: `${import.meta.env.VITE_BASEURL}/client/product/${id}`,
      method: "DELETE",
      retry: 1,
    });
  } catch (error) {
    if (error.name === "AbortError") return;
    alert("Delete failed. Refreshing...");
    fetchProducts();
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
            <Button text="Upload First Product" onClick={openAddModal} disabled={productMutateApi.loading}/>
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