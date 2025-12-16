import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Instagram, Globe, Phone, Plus, Trash2, Save, X, Loader2, Store, LayoutGrid, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';

// ==========================================
// PARENT COMPONENT: ShopProfile
// ==========================================
const ShopProfile = () => {
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  // --- Main Data State ---
  const [shopData, setShopData] = useState({
    shopName: '',
    shopDescription: '',
    shopCategory: 'General',
    profileImage: 'https://placehold.co/400',
    coverImage: '',
    address: '',
    city: '',
    pincode: '',
    socialLinks: { instagram: '', whatsapp: '', website: '' },
    portfolio: []
  });

  // --- Upload State ---
  const [selectedProfileImg, setSelectedProfileImg] = useState(null);
  const [selectedCoverImg, setSelectedCoverImg] = useState(null);

  // --- Previews ---
  const [previewProfile, setPreviewProfile] = useState('');
  const [previewCover, setPreviewCover] = useState('');

  const API_BASE = `${import.meta.env.VITE_BASEURL}/client`;

  // --- 1. Fetch Data ---
  useEffect(() => {
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    try {
      const response = await fetch(`${API_BASE}/getshop`, {
        credentials: "include"
      });
      const data = await response.json();
      if (data) {
        setShopData(data);
        setPreviewProfile(data.profileImage);
        setPreviewCover(data.coverImage);
      }
    } catch (error) {
      console.error("Error fetching shop:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Input Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setShopData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setShopData(prev => ({ ...prev, [name]: value }));
    }
  };

  // --- 3. Image Handlers ---
  const handleImageSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    if (type === 'profile') {
      setSelectedProfileImg(file);
      setPreviewProfile(objectUrl);
    } else if (type === 'cover') {
      setSelectedCoverImg(file);
      setPreviewCover(objectUrl);
    }
  };

  // --- 4. Save / Submit ---
  const saveShopProfile = async () => {
    setLoading(true);
    const formData = new FormData();

    // Text Data
    Object.keys(shopData).forEach(key => {
      if (key === 'socialLinks') {
        formData.append('instagram', shopData.socialLinks.instagram);
        formData.append('whatsapp', shopData.socialLinks.whatsapp);
        formData.append('website', shopData.socialLinks.website);
      } else if (key !== 'portfolio' && key !== 'shopGallery' && key !== '_id' && key !== 'createdAt' && key !== 'updatedAt') {
        formData.append(key, shopData[key]);
      }
    });

    // Single Images
    if (selectedProfileImg) formData.append('profileImage', selectedProfileImg);
    if (selectedCoverImg) formData.append('coverImage', selectedCoverImg);

    try {
      const response = await fetch(`${API_BASE}/updateshop`, {
        method: 'PUT',
        credentials: "include",
        body: formData
      });
      const result = await response.json();
      if (result.success) {
        alert("Shop Profile Updated!");
        setIsEditMode(false);
        fetchShopData();
      } else {
        alert(result.message || "Update failed");
      }
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // --- 5. Portfolio Handlers ---
  const handleAddPortfolio = async (formData) => {
    try {
      const response = await fetch(`${API_BASE}/portfolio`, {
        method: 'POST',
   credentials: "include",
        body: formData
      });
      const result = await response.json();
      if (result) fetchShopData();
      return result;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleDeletePortfolio = async (itemId) => {
    try {
      const response = await fetch(`${API_BASE}/portfolio/${itemId}`, {
        method: 'DELETE',
       credentials: "include"
      });
      if (response.ok) {
        setShopData(prev => ({
          ...prev,
          portfolio: prev.portfolio.filter(item => item._id !== itemId)
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading && !shopData.shopName) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-800">
      <ShopHeader isEditMode={isEditMode} toggleEdit={() => setIsEditMode(!isEditMode)} onSave={saveShopProfile} />

      <div className="max-w-5xl mx-auto bg-white shadow-2xl min-h-screen">

        {/* HERO SECTION: Handles Sliding Effect or Edit Mode Cover */}
        <ShopHero
          isEditMode={isEditMode}
          coverPreview={previewCover}
          profilePreview={previewProfile}
          onImageSelect={handleImageSelect}
          portfolioItems={shopData.portfolio} // Pass portfolio for the slider
        />

        <div className="px-6 md:px-12 space-y-10 relative z-10 -mt-8">
          <ShopDetails
            isEditMode={isEditMode}
            data={shopData}
            onChange={handleInputChange}
          />

          <PortfolioManager
            isEditMode={isEditMode}
            items={shopData.portfolio}
            onAdd={handleAddPortfolio}
            onDelete={handleDeletePortfolio}
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT: ShopHeader
// ==========================================
const ShopHeader = ({ isEditMode, toggleEdit, onSave }) => (
  <div className="bg-white/90 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
    <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
      <Store className="text-blue-600" />
      {isEditMode ? 'Editing Shop' : 'Shop Preview'}
    </h1>
    <div className="flex items-center gap-3">
      <button
        onClick={toggleEdit}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isEditMode ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
      >
        {isEditMode ? 'Cancel Edit' : 'Edit Profile'}
      </button>
      {isEditMode && (
        <button
          onClick={onSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
        >
          <Save size={16} /> Save Changes
        </button>
      )}
    </div>
  </div>
);

// ==========================================
// COMPONENT: ShopHero (With Slider)
// ==========================================
const ShopHero = ({ isEditMode, coverPreview, profilePreview, onImageSelect, portfolioItems }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide effect for Preview Mode
  useEffect(() => {
    if (isEditMode || portfolioItems.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % portfolioItems.length);
    }, 4000); // Change slide every 4 seconds
    return () => clearInterval(timer);
  }, [isEditMode, portfolioItems.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % portfolioItems.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? portfolioItems.length - 1 : prev - 1));

  // EDIT MODE: Static Cover Image
  if (isEditMode) {
    return (
      <div className="relative mb-20">
        <div className="relative bg-gray-200 h-64 md:h-80 w-full group overflow-hidden">
          {coverPreview ? (
            <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <Camera size={48} className="mb-2 opacity-50" />
              <span className="text-sm font-medium">Add a cover image</span>
            </div>
          )}
          <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white text-gray-900 px-5 py-2.5 rounded-full flex items-center gap-2 font-medium shadow-lg transform hover:scale-105 transition-transform">
              <Camera size={18} /> Change Cover
            </div>
            <input type="file" hidden onChange={(e) => onImageSelect(e, 'cover')} accept="image/*" />
          </label>
        </div>
        {/* Profile Pic Overlay */}
        <ProfilePicOverlay preview={profilePreview} isEditMode={isEditMode} onImageSelect={onImageSelect} />
      </div>
    );
  }

  // PREVIEW MODE: Product Slider (if items exist)
  if (portfolioItems.length > 0) {
    return (
      <div className="relative mb-20 bg-gray-900 h-80 md:h-[400px] overflow-hidden group">
        {/* Slides */}
        {portfolioItems.map((item, index) => (
          <div
            key={item._id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* Background Image with Gradient */}
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white flex flex-col items-center text-center pb-24 md:pb-32 animate-in slide-in-from-bottom-10 duration-700">
              <span className="bg-blue-600 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">Featured Product</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-2 text-shadow">{item.title}</h2>
              <p className="text-2xl font-light text-blue-200">₹{item.price}</p>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 p-2 rounded-full text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
          <ChevronLeft size={32} />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 p-2 rounded-full text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
          <ChevronRight size={32} />
        </button>

        {/* Profile Pic Overlay (Still visible over slider) */}
        <ProfilePicOverlay preview={profilePreview} isEditMode={isEditMode} onImageSelect={onImageSelect} />
      </div>
    );
  }

  // PREVIEW MODE: Fallback if no products (Show static cover)
  return (
    <div className="relative mb-20">
      <div className="relative bg-gray-200 h-64 md:h-80 w-full overflow-hidden">
        {coverPreview ? (
          <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <span className="text-xl font-medium opacity-80">Welcome to My Shop</span>
          </div>
        )}
      </div>
      <ProfilePicOverlay preview={profilePreview} isEditMode={isEditMode} onImageSelect={onImageSelect} />
    </div>
  );
};

// Helper for Profile Pic to reduce duplication
const ProfilePicOverlay = ({ preview, isEditMode, onImageSelect }) => (
  <div className="absolute -bottom-16 left-6 md:left-10 z-20">
    <div className="relative w-36 h-36 rounded-full border-[6px] border-white shadow-xl bg-white overflow-hidden group">
      <img src={preview} alt="Profile" className="w-full h-full object-cover" />
      {isEditMode && (
        <label className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="text-white" size={24} />
          <input type="file" hidden onChange={(e) => onImageSelect(e, 'profile')} accept="image/*" />
        </label>
      )}
    </div>
  </div>
);

// ==========================================
// COMPONENT: ShopDetails
// ==========================================
const ShopDetails = ({ isEditMode, data, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-4">
    {/* Left Column: Details */}
    <div className="md:col-span-2 space-y-6">
      {isEditMode ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Shop Name</label>
            <input
              name="shopName" value={data.shopName} onChange={onChange}
              placeholder="Enter Shop Name"
              className="w-full text-4xl font-extrabold text-gray-900 border-b-2 border-blue-100 focus:border-blue-600 outline-none pb-2 bg-transparent placeholder-gray-300 transition-colors"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</label>
              <select
                name="shopCategory" value={data.shopCategory} onChange={onChange}
                className="w-full mt-1 p-3 border border-gray-200 rounded-lg text-gray-700 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              >
                <option value="General">General</option>
                <option value="Bakery">Bakery</option>
                <option value="Clothing">Clothing</option>
                <option value="Electronics">Electronics</option>
                <option value="Services">Services</option>
                <option value="Food">Food & Beverage</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">About the Shop</label>
            <textarea
              name="shopDescription" value={data.shopDescription} onChange={onChange}
              placeholder="Tell customers about your shop..." rows={4}
              className="w-full mt-1 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none resize-none bg-gray-50 focus:bg-white transition-all"
            />
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{data.shopName || "Untitled Shop"}</h1>
          <span className="inline-block bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full mt-3 font-semibold uppercase tracking-wide border border-blue-100">
            {data.shopCategory}
          </span>
          <p className="text-gray-600 leading-relaxed mt-6 text-lg">
            {data.shopDescription || "No description provided yet."}
          </p>
        </div>
      )}
    </div>

    {/* Right Column: Contact Card */}
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-fit space-y-6">
      <h3 className="font-bold text-gray-900 border-b pb-3 text-lg">Contact Info</h3>

      {/* Location */}
      <div className="space-y-3">
        <div className="flex gap-3 text-gray-600">
          <MapPin size={20} className="shrink-0 text-blue-500 mt-0.5" />
          {isEditMode ? (
            <div className="space-y-3 w-full">
              <input name="address" value={data.address} onChange={onChange} placeholder="Street Address" className="w-full border-b border-gray-200 pb-1 text-sm outline-none focus:border-blue-500" />
              <div className="flex gap-2">
                <input name="city" value={data.city} onChange={onChange} placeholder="City" className="w-1/2 border-b border-gray-200 pb-1 text-sm outline-none focus:border-blue-500" />
                <input name="pincode" value={data.pincode} onChange={onChange} placeholder="Pin" className="w-1/2 border-b border-gray-200 pb-1 text-sm outline-none focus:border-blue-500" />
              </div>
            </div>
          ) : (
            <span className="text-sm leading-relaxed">{data.address || "No Address"}, <br />{data.city} {data.pincode}</span>
          )}
        </div>
      </div>

      {/* Socials */}
      <div className="space-y-4">
        {[
          { icon: Instagram, color: "text-pink-600", name: "socialLinks.instagram", val: data.socialLinks.instagram, label: "Instagram" },
          { icon: Phone, color: "text-green-600", name: "socialLinks.whatsapp", val: data.socialLinks.whatsapp, label: "WhatsApp" },
          { icon: Globe, color: "text-gray-600", name: "socialLinks.website", val: data.socialLinks.website, label: "Website" }
        ].map((social, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <social.icon size={20} className={`${social.color} shrink-0`} />
            {isEditMode ? (
              <input name={social.name} value={social.val} onChange={onChange} placeholder={`${social.label} URL/Num`} className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-200" />
            ) : (
              social.val ? (
                <a href={social.val} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline hover:text-blue-800 truncate font-medium">
                  {social.val}
                </a>
              ) : (
                <span className="text-sm text-gray-400 italic">Not connected</span>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ==========================================
// COMPONENT: PortfolioManager
// ==========================================
const PortfolioManager = ({ isEditMode, items, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', price: '', image: null });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newItem.image || !newItem.title || !newItem.price) return alert("All fields required");

    setLoading(true);
    const formData = new FormData();

    // 1. Append Text Fields FIRST (Critical for Multer/Backend parsing)
    formData.append('title', newItem.title);
    formData.append('price', newItem.price);

    // 2. Append File LAST
    // Ensure this key matches your backend: upload.single('portfolioImages') vs 'image'
    // You mentioned your backend route uses 'portfolioImages'
    formData.append('portfolioImages', newItem.image); 

    // Debug: Check console to see what is being sent
    console.log("Submitting Portfolio Item:", {
        title: newItem.title, 
        price: newItem.price, 
        image: newItem.image.name
    });

    const success = await onAdd(formData);
    
    setLoading(false);
    if (success) {
      setIsAdding(false);
      setNewItem({ title: '', price: '', image: null });
    } else {
      alert("Failed to add item. Check console.");
    }
  };

  return (
    <div className="mt-12 border-t border-gray-100 pt-10 pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="text-blue-600" /> Portfolio & Products
          </h2>
          <p className="text-gray-500 text-sm mt-1">Manage your selling items</p>
        </div>
        {isEditMode && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-black transition-all flex items-center gap-2 shadow-lg"
          >
            <Plus size={16} /> Add Item
          </button>
        )}
      </div>

      {/* Add Item Form */}
      {isAdding && (
        <div className="bg-white border border-blue-100 rounded-xl p-6 mb-8 shadow-xl ring-1 ring-blue-50 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-start mb-6">
            <h4 className="font-bold text-lg text-gray-800">Add New Product</h4>
            <button onClick={() => setIsAdding(false)} className="p-1 hover:bg-gray-100 rounded-full"><X size={20} className="text-gray-400 hover:text-red-500" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Image Input */}
            <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center h-40 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors relative group">
              {newItem.image ? (
                <img src={URL.createObjectURL(newItem.image)} className="h-full w-full object-cover rounded-xl" alt="preview" />
              ) : (
                <div className="text-center text-gray-400 group-hover:text-blue-500">
                  <Camera className="mx-auto mb-2" size={24} />
                  <span className="text-xs font-bold">Upload Image</span>
                </div>
              )}
              <input type="file" required onChange={e => setNewItem({ ...newItem, image: e.target.files[0] })} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
            </div>

            {/* Text Inputs */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Title</label>
                <input
                  type="text" placeholder="e.g. Chocolate Truffle Cake" required
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors"
                  value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (₹)</label>
                <input
                  type="text" 
                  placeholder="0.00" 
                  required
                  min="1" // Ensure positive number
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors"
                  value={newItem.price} 
                  onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md disabled:bg-blue-400"
              >
                {loading ? 'Saving...' : 'Add to Portfolio'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid List */}
      {items.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium text-gray-500">No products added yet.</p>
          {isEditMode && <p className="text-sm mt-2">Click "Add Item" to start selling.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group relative duration-300">
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 truncate text-lg">{item.title}</h3>
                {/* Ensure we render price, defaulting to 0 if undefined */}
                <p className="text-blue-600 font-bold mt-1">₹{item.price || "0"}</p>
              </div>
              {console.log(typeof(item.price))}

              {isEditMode && (
                <button
                  onClick={() => onDelete(item._id)}
                  className="absolute top-2 right-2 bg-white text-red-500 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:scale-110"
                  title="Delete Item"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopProfile;