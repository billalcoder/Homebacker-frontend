import React, { useEffect, useState } from 'react';
import { Trash2, Search, CheckCircle, Store, Package, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Search State
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BASEURL}/admin/clients?page=${page}&limit=10&search=${search}`, {
        credentials: "include"
      });
      if (res.ok) {
        const result = await res.json();
        // Handle response structure { data: [...], pagination: {...} }
        setClients(result.data || []);
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
        fetchClients();
    }, 500);
    return () => clearTimeout(timer);
  }, [page, search]);

  const handleSearchChange = (e) => {
      setSearch(e.target.value);
      setPage(1); // Reset to page 1 on search
  };

  const handleVerify = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASEURL}/admin/clients/${id}/verify`, {
        method: "PATCH",
        credentials: "include"
      });
      if (res.ok) fetchClients();
    } catch (err) {
      alert("Verification failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Warning: This will delete the Client AND ALL THEIR PRODUCTS. Continue?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BASEURL}/admin/clients/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) fetchClients();
    } catch (err) {
      alert("Failed to delete client");
    }
  };

  // Completeness Logic based ONLY on 4 Shop Details fields
  const getCompleteness = (client) => {
    const fields = [
      client.shopName,
      client.shopDescription,
      client.profileImage,
      client.coverImage
    ];

    const filled = fields.filter(val => {
        if (!val || val.trim() === "") return false;
        if (val === "https://placehold.co/400") return false;
        return true;
    }).length;

    return Math.round((filled / 4) * 100);
  };

  return (
    <div className="animate-fade-in pb-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Shops & Clients</h1>
          <p className="text-stone-500">Total Clients: {totalDocs}</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-stone-200 flex items-center gap-2 shadow-sm">
          <Search size={18} className="text-stone-400" />
          <input 
            className="outline-none text-sm w-64"
            placeholder="Search by name, shop, or email..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden mb-4">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-200 text-xs uppercase text-stone-500 font-bold">
            <tr>
              <th className="px-6 py-4">Shop Details</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4 text-center">Completeness</th>
              <th className="px-6 py-4 text-center">Products</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
               <tr><td colSpan="6" className="p-12 text-center text-stone-400 font-medium">Loading Clients...</td></tr>
            ) : clients.length === 0 ? (
               <tr><td colSpan="6" className="p-12 text-center text-stone-400 font-medium">No clients found matching your search.</td></tr>
            ) : (
              clients.map(client => {
                const completeness = getCompleteness(client);
                const isLowProfile = completeness < 100;

                return (
                  <tr key={client._id} className="hover:bg-stone-50 transition-colors group">
                    
                    {/* 1. Shop Info */}
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {client.profileImage && client.profileImage !== "https://placehold.co/400" ? (
                            <img src={client.profileImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <Store size={18} className="text-stone-400" />
                        )}
                      </div>
                      <div>
                          <span className="font-bold text-stone-800 block text-sm">{client.shopName || "Unnamed Shop"}</span>
                          <span className="text-xs text-stone-500">Owner: {client.name}</span>
                      </div>
                    </td>

                    {/* 2. Contact */}
                    <td className="px-6 py-4 text-sm">
                        <div className="text-stone-700 font-medium">{client.email}</div>
                        <div className="text-stone-400 text-xs">{client.phone}</div>
                    </td>

                    {/* 3. Profile Completeness Bar */}
                    <td className="px-6 py-4">
                        <div className="flex flex-col items-center gap-1 w-24 mx-auto">
                            <div className="flex justify-between w-full text-[10px] font-bold">
                                <span className={isLowProfile ? 'text-amber-600' : 'text-green-600'}>
                                    {completeness}%
                                </span>
                                {isLowProfile && <AlertCircle size={10} className="text-amber-500" />}
                            </div>
                            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                                <div 
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        completeness === 100 ? 'bg-green-500' : 
                                        completeness >= 50 ? 'bg-amber-500' : 'bg-red-400'
                                    }`} 
                                    style={{ width: `${completeness}%` }}
                                ></div>
                            </div>
                        </div>
                    </td>

                    {/* 4. Product Count Badge */}
                    <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold border border-blue-100">
                            <Package size={14} />
                            {client.productCount || 0}
                        </div>
                    </td>

                    {/* 5. Status Toggle */}
                    <td className="px-6 py-4 text-center">
                      {client.isVerified ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-200">
                              <CheckCircle size={12} /> Verified
                          </span>
                      ) : (
                          <button 
                              onClick={() => handleVerify(client._id)}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200 hover:bg-amber-100 hover:border-amber-300 transition-all shadow-sm"
                          >
                              Verify
                          </button>
                      )}
                    </td>

                    {/* 6. Actions */}
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(client._id)}
                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Client & All Products"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
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

export default AdminClients;