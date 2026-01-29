import React, { useEffect, useState } from 'react';
import { Trash2, Search, User } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASEURL}/admin/users`, {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BASEURL}/admin/users/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) {
        setUsers(users.filter(u => u._id !== id));
      }
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Users Directory</h1>
          <p className="text-stone-500">Manage customer accounts</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-stone-200 flex items-center gap-2 shadow-sm">
          <Search size={18} className="text-stone-400" />
          <input 
            className="outline-none text-sm w-64"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-200 text-xs uppercase text-stone-500 font-bold">
            <tr>
              <th className="px-6 py-4">User Info</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
               <tr><td colSpan="4" className="p-8 text-center text-stone-400">Loading Users...</td></tr>
            ) : filteredUsers.length === 0 ? (
               <tr><td colSpan="4" className="p-8 text-center text-stone-400">No users found.</td></tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user._id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                      <User size={16} />
                    </div>
                    <span className="font-semibold text-stone-700">{user.name}</span>
                  </td>
                  <td className="px-6 py-4 text-stone-600 text-sm">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(user._id)}
                      className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete User"
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

export default AdminUsers;