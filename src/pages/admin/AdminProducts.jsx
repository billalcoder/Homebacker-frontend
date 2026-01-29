import React, { useEffect, useState } from 'react';
import { ToggleLeft, ToggleRight, Search, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Search State
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BASEURL}/admin/products?page=${page}&limit=12&search=${search}`, {
        credentials: "include"
      });
      if (res.ok) {
        const result = await res.json();
        // Handle response structure { data: [...], pagination: {...} }
        setProducts(result.data || []);
        if (result.pagination) {
            setTotalPages(result.pagination.totalPages);
            setTotalDocs(result.pagination.total);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Debounce Search & Fetch on page change
  useEffect(() => {
    const timer = setTimeout(() => {
        fetchProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [page, search]);

  const handleSearchChange = (e) => {
      setSearch(e.target.value);
      setPage(1); // Reset to page 1 on search
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASEURL}/admin/products/${id}/toggle-status`, {
        method: "PATCH",
        credentials: "include"
      });
      if (res.ok) {
        const { product } = await res.json();
        setProducts(products.map(p => p._id === id ? { ...p, isActive: product.isActive } : p));
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Products Inventory</h1>
          <p className="text-stone-500">Total Items: {totalDocs}</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-stone-200 flex items-center gap-2 shadow-sm">
          <Search size={18} className="text-stone-400" />
          <input 
            className="outline-none text-sm w-64"
            placeholder="Search product or category..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {loading ? (
             <div className="col-span-full text-center py-20 text-stone-400">Loading Products...</div>
        ) : products.length === 0 ? (
             <div className="col-span-full text-center py-20 text-stone-400">No products found.</div>
        ) : (
            products.map(product => (
                <div key={product._id} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden flex flex-col group hover:shadow-md transition-all">
                    <div className="h-40 bg-stone-100 relative">
                        <img 
                            src={product.images?.[0] || product.imageUrl || "https://placehold.co/300"} 
                            className={`w-full h-full object-cover transition-opacity ${product.isActive ? 'opacity-100' : 'opacity-50 grayscale'}`}
                            alt={product.productName}
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-stone-600 uppercase">
                            {product.category}
                        </div>
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-stone-800 line-clamp-1 text-sm">{product.productName}</h3>
                                <p className="text-xs text-stone-500">By {product.clientId?.name || "Unknown Shop"}</p>
                            </div>
                            <span className="font-bold text-amber-600">₹{product.price}</span>
                        </div>
                        
                        <div className="mt-auto pt-4 border-t border-stone-50 flex justify-between items-center">
                            <span className={`text-xs font-bold flex items-center gap-1 ${product.isActive ? 'text-green-600' : 'text-stone-400'}`}>
                                {product.isActive ? <Eye size={14}/> : <EyeOff size={14}/>}
                                {product.isActive ? 'Live' : 'Hidden'}
                            </span>
                            
                            <button 
                                onClick={() => handleToggleStatus(product._id)}
                                className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                                    product.isActive 
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                                }`}
                            >
                                {product.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center px-4">
          <span className="text-sm text-stone-500">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
              <button 
                disabled={page === 1} 
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 border border-stone-200 rounded-lg disabled:opacity-50 flex items-center bg-white hover:bg-stone-50 transition-colors"
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <button 
                disabled={page === totalPages || totalPages === 0} 
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 border border-stone-200 rounded-lg disabled:opacity-50 flex items-center bg-white hover:bg-stone-50 transition-colors"
              >
                Next <ChevronRight size={16} />
              </button>
          </div>
      </div>
    </div>
  );
};

export default AdminProducts;