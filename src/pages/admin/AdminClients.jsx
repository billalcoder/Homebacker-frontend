import React, { useEffect, useState } from 'react';
import { Trash2, Search, CheckCircle, XCircle, Store } from 'lucide-react';

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchClients = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASEURL}/admin/clients`, {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleVerify = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASEURL}/admin/clients/${id}/verify`, {
        method: "PATCH",
        credentials: "include"
      });
      if (res.ok) {
        setClients(clients.map(c => c._id === id ? { ...c, isVerified: true } : c));
      }
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
      if (res.ok) {
        setClients(clients.filter(c => c._id !== id));
      }
    } catch (err) {
      alert("Failed to delete client");
    }
  };

  const filteredClients = clients.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) || 
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Shops & Clients</h1>
          <p className="text-stone-500">Verify and manage shop owners</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-stone-200 flex items-center gap-2 shadow-sm">
          <Search size={18} className="text-stone-400" />
          <input 
            className="outline-none text-sm w-64"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-200 text-xs uppercase text-stone-500 font-bold">
            <tr>
              <th className="px-6 py-4">Shop Owner</th>
              <th className="px-6 py-4">Email / Phone</th>
              <th className="px-6 py-4 text-center">Verification</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
               <tr><td colSpan="4" className="p-8 text-center text-stone-400">Loading Clients...</td></tr>
            ) : filteredClients.length === 0 ? (
               <tr><td colSpan="4" className="p-8 text-center text-stone-400">No clients found.</td></tr>
            ) : (
              filteredClients.map(client => (
                <tr key={client._id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Store size={18} />
                    </div>
                    <div>
                        <span className="font-bold text-stone-700 block">{client.name}</span>
                        <span className="text-xs text-stone-400">ID: {client._id.slice(-6)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                      <div className="text-stone-700">{client.email}</div>
                      <div className="text-stone-500 text-xs">{client.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {client.isVerified ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-200">
                            <CheckCircle size={12} /> Verified
                        </span>
                    ) : (
                        <button 
                            onClick={() => handleVerify(client._id)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-bold border border-yellow-200 hover:bg-yellow-100 cursor-pointer"
                        >
                            Verify Now
                        </button>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(client._id)}
                      className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Client & Products"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminClients;