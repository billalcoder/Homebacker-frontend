import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Instagram, Globe, Phone, Plus, Trash2, Save, X, Loader2, Store, LayoutGrid, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import ImageCropper from "../components/ImageCropper";
import { getCroppedImage } from "../utils/cropImage";
import FormInput from '../components/FormInput';
import { logToServer } from '../utils/logs';
import useApi from "../hooks/useApi";
import { compressImage } from "../utils/compressImage";

// ==========================================
// PARENT COMPONENT: ShopProfile
// ==========================================
const ShopProfile = () => {
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [cropTarget, setCropTarget] = useState(null);
  const [showCropper, setShowCropper] = useState(false);


  const shopApi = useApi();
  const portfolioApi = useApi();

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
  const [isSaving, setIsSaving] = useState(false);
  // --- Previews ---
  const [previewProfile, setPreviewProfile] = useState('');
  const [previewCover, setPreviewCover] = useState('');

  const API_BASE = `${import.meta.env.VITE_BASEURL}/client`;

  // --- 1. Fetch Data ---
  useEffect(() => {
    fetchShopData();
  }, []);


  // const fetchShopData = async () => {
  //   try {
  //     const response = await fetch(`${API_BASE}/getshop`, {
  //       credentials: "include"
  //     });
  //     const data = await response.json();
  //     if (data) {
  //       setShopData(data);
  //       setPreviewProfile(data.profileImage);
  //       setPreviewCover(data.coverImage);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching shop:", error);
  //     fetch(`${import.meta.env.VITE_BASEURL}/log/frontend`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         message: error.message,
  //         stack: error.stack,
  //         api: "/getshop",
  //         route: window.location.pathname,
  //         source: "shop",
  //         userAgent: navigator.userAgent,
  //       }),
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchShopData = async () => {
    const data = await shopApi.request({
      url: `${API_BASE}/getshop`,
      retry: 1
    });

    if (!data) return;

    setShopData(data);
    setPreviewProfile(data.profileImage);
    setPreviewCover(data.coverImage);
    setLoading(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveShopProfile(); // your API / save logic
      setIsEditMode(false);
    } finally {
      setIsSaving(false);
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
  // const handleImageSelect = (e, type) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const objectUrl = URL.createObjectURL(file);
  //   if (type === 'profile') {
  //     setSelectedProfileImg(file);
  //     setPreviewProfile(objectUrl);
  //   } else if (type === 'cover') {
  //     setSelectedCoverImg(file);
  //     setPreviewCover(objectUrl);
  //   }
  // };

  const handleImageSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setCropImageSrc(imageUrl);
    setCropTarget(type); // "profile" or "cover"
    setShowCropper(true);
  };

  // const handleCropDone = async (croppedPixels) => {
  //   const croppedFile = await getCroppedImage(cropImageSrc, croppedPixels);
  //   const preview = URL.createObjectURL(croppedFile);

  //   if (cropTarget === "profile") {
  //     setSelectedProfileImg(croppedFile);
  //     setPreviewProfile(preview);
  //   }

  //   if (cropTarget === "cover") {
  //     setSelectedCoverImg(croppedFile);
  //     setPreviewCover(preview);
  //   }

  //   setShowCropper(false);
  //   setCropImageSrc(null);
  //   setCropTarget(null);
  // };

  const handleCropDone = async (croppedPixels) => {
    const croppedFile = await getCroppedImage(cropImageSrc, croppedPixels);
    const preview = URL.createObjectURL(croppedFile);

    if (cropTarget === "profile") {
      setSelectedProfileImg(croppedFile);
      setPreviewProfile(preview);
    }

    if (cropTarget === "cover") {
      setSelectedCoverImg(croppedFile);
      setPreviewCover(preview);
    }

    setShowCropper(false);
    setCropImageSrc(null);
    setCropTarget(null);
  };



  // --- 4. Save / Submit ---
  const saveShopProfile = async () => {
    // 🔒 prevent duplicate clicks / race condition
    if (shopApi.loading) return;

    const formData = new FormData();

    // ===============================
    // Text fields
    // ===============================
    Object.keys(shopData).forEach(key => {
      if (key === "socialLinks") {
        formData.append("instagram", shopData.socialLinks?.instagram || "");
        formData.append("whatsapp", shopData.socialLinks?.whatsapp || "");
        formData.append("website", shopData.socialLinks?.website || "");
      }
      else if (
        key !== "portfolio" &&
        key !== "shopGallery" &&
        key !== "_id" &&
        key !== "createdAt" &&
        key !== "updatedAt"
      ) {
        formData.append(key, shopData[key] ?? "");
      }
    });

    // ===============================
    // Images
    // ===============================
    if (selectedProfileImg) formData.append("profileImage", selectedProfileImg);
    if (selectedCoverImg) formData.append("coverImage", selectedCoverImg);

    try {
      const result = await shopApi.request({
        url: `${API_BASE}/updateshop`,
        method: "PUT",
        body: formData,
        retry: 1, // 🔁 mobile-safe retry
      });

      if (!result) return; // request aborted safely

      if (result.success) {
        setIsEditMode(false);

        // ⏳ small delay avoids fetch overlap on mobile
        await new Promise(r => setTimeout(r, 300));
        await fetchShopData();
      } else {
        alert(result.message || "Update failed");
      }

    } catch (error) {
      // 🚫 ignore AbortErrors
      if (error.name === "AbortError") return;

      console.error("Update failed:", error);

      // optional: your server logger
      fetch(`${import.meta.env.VITE_BASEURL}/log/frontend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          api: "/updateshop",
          route: window.location.pathname,
          source: "shop",
          userAgent: navigator.userAgent,
        }),
      });

      alert("Something went wrong. Please try again.");
    }
  };


  // const saveShopProfile = async () => {
  //   setLoading(true);
  //   const formData = new FormData();

  //   // Text Data
  //   Object.keys(shopData).forEach(key => {
  //     if (key === 'socialLinks') {
  //       formData.append('instagram', shopData.socialLinks.instagram);
  //       formData.append('whatsapp', shopData.socialLinks.whatsapp);
  //       formData.append('website', shopData.socialLinks.website);
  //     } else if (key !== 'portfolio' && key !== 'shopGallery' && key !== '_id' && key !== 'createdAt' && key !== 'updatedAt') {
  //       formData.append(key, shopData[key]);
  //     }
  //   });

  //   // Single Images
  //   if (selectedProfileImg) formData.append('profileImage', selectedProfileImg);
  //   if (selectedCoverImg) formData.append('coverImage', selectedCoverImg);

  //   try {
  //     const response = await fetch(`${API_BASE}/updateshop`, {
  //       method: 'PUT',
  //       credentials: "include",
  //       body: formData
  //     });
  //     const result = await response.json();
  //     if (result.success) {
  //       alert("Shop Profile Updated!");
  //       setIsEditMode(false);
  //       fetchShopData();
  //     } else {
  //       alert(result.message || "Update failed");
  //     }
  //   } catch (error) {
  //     console.error("Update failed", error);
  //     logToServer("save btn click", { error })
  //     fetch(`${import.meta.env.VITE_BASEURL}/log/frontend`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         message: error.message,
  //         stack: error.stack,
  //         api: "/updateshop",
  //         route: window.location.pathname,
  //         source: "shop",
  //         userAgent: navigator.userAgent,
  //       }),
  //     });
  //     alert(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // --- 5. Portfolio Handlers ---

  const handleAddPortfolio = async (formData) => {
    if (portfolioApi.loading) return false;

    try {
      const res = await portfolioApi.request({
        url: `${API_BASE}/portfolio`,
        method: "POST",
        body: formData,
        retry: 1
      });

      if (res?.success) {
        await fetchShopData();
        return true;
      }
      return false;
    } catch (err) {
      alert(err)
      alert(portfolioApi.error || "Upload failed");
      return false;
    }
  };


  // const handleAddPortfolio = async (formData) => {
  //   try {
  //     const response = await fetch(`${API_BASE}/portfolio`, {
  //       method: 'POST',
  //       credentials: "include",
  //       body: formData
  //     });
  //     const result = await response.json();
  //     if (result) fetchShopData();
  //     return result;
  //   } catch (error) {
  //     console.error(error);
  //     fetch(`${import.meta.env.VITE_BASEURL}/log/frontend`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         message: error.message,
  //         stack: error.stack,
  //         api: "/protfolio",
  //         route: window.location.pathname,
  //         source: "shop",
  //         userAgent: navigator.userAgent,
  //       }),
  //     });
  //     return false;
  //   }
  // };

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
      fetch(`${import.meta.env.VITE_BASEURL}/log/frontend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          api: "/protfolio/id",
          route: window.location.pathname,
          source: "shop",
          userAgent: navigator.userAgent,
        }),
      });
    }
  };

  if (loading && !shopData.shopName) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-800">
      <ShopHeader isEditMode={isEditMode} toggleEdit={() => setIsEditMode(!isEditMode)} onSave={handleSave} isSaving={isSaving} />

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
      {showCropper && (
        <ImageCropper
          imageSrc={cropImageSrc}
          aspect={cropTarget === "cover" ? 16 / 9 : 1}
          onDone={handleCropDone}
          onCancel={() => {
            setShowCropper(false);
            setCropImageSrc(null);
            setCropTarget(null);
          }}
        />
      )}

    </div>
  );
};

// ==========================================
// COMPONENT: ShopHeader
// ==========================================
const ShopHeader = ({ isEditMode, toggleEdit, onSave, isSaving }) => {

  const shopApi = useApi();
  const portfolioApi = useApi();
  return (
    <div className="bg-white/90 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">

      {/* Title */}
      <h1 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
        <Store className="text-blue-600" />
        <span className="hidden sm:inline">
          {isEditMode ? 'Editing Shop' : 'Shop Preview'}
        </span>
      </h1>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Edit / Cancel */}
        <button
          onClick={toggleEdit}
          disabled={isSaving}
          className={`p-2 sm:px-4 sm:py-2 rounded-full text-sm font-medium transition-all
          ${isEditMode
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        >
          <span className="sm:hidden">
            {isEditMode ? <X size={18} /> : <LayoutGrid size={18} />}
          </span>
          <span className="hidden sm:inline">
            {isEditMode ? 'Cancel Edit' : 'Edit Profile'}
          </span>
        </button>

        {/* Save Button */}

        {isEditMode && (
          <button
            onClick={onSave}
            disabled={shopApi.loading}
            className={`bg-blue-600 text-white p-2 sm:px-6 sm:py-2 rounded-full text-sm font-medium
            flex items-center gap-2 shadow-md transition-all
            ${isSaving
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:bg-blue-700 hover:shadow-lg'
              }
          `}
          >
            {/* Loader */}
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}

            <span className="hidden sm:inline">
              {shopApi.loading ? 'Saving...' : 'Save Changes'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}



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
            {console.log(item)}
            {/* Background Image with Gradient */}
            <img src={item.images} alt={item.title} className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white flex flex-col items-center text-center pb-24 md:pb-32 animate-in slide-in-from-bottom-10 duration-700">
              <span className="bg-blue-600 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">Featured Product</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-2 text-shadow">{item.productName || "title"}</h2>
              <p className="text-2xl font-light text-blue-200">₹{item.price || "price"}</p>
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
  <div className="absolute -bottom-16 left-6 md:left-10 z-0">
    <div className="relative w-36 h-36 rounded-full border-[6px] border-white shadow-xl bg-white overflow-hidden group">
      <img src={preview ? preview : "https://via.placeholder.com/300x300"} alt="Profile" className="w-full h-full object-cover" />
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
    {console.log(data)}
    {/* Left Column: Details */}
    <div className="md:col-span-2 space-y-6">
      {isEditMode ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Shop Name</label>
            <input
              name="shopName" value={data.shopName || "shopname"} onChange={onChange}
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
                <option value="Bakery">Bakery</option>
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
  const [newItem, setNewItem] = useState({ title: '', price: '', image: null, category: "Cake", unitType: "kg", unitValue: "250" });
  const [loading, setLoading] = useState(false);
  const [cropSrc, setCropSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageProcessing, setImageProcessing] = useState(false);

  const shopApi = useApi();
  const portfolioApi = useApi();
  useEffect(() => {
    if (newItem.unitType === "kg") {
      setNewItem(prev => ({ ...prev, unitValue: "250" }));
    } else {
      setNewItem(prev => ({ ...prev, unitValue: "1" }));
    }
  }, [newItem.unitType]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newItem.image || !newItem.title || !newItem.price) return alert("All fields required");

    setLoading(true);

    const compressedImage = await compressImage(newItem.image);
    const formData = new FormData();

    // 1. Append Text Fields FIRST (Critical for Multer/Backend parsing)
    formData.append('title', newItem.title);
    formData.append('price', newItem.price);
    formData.append('category', newItem.category);
    formData.append('unitType', newItem.unitType);
    formData.append('unitValue', newItem.unitValue);

    // 2. Append File LAST
    // Ensure this key matches your backend: upload.single('portfolioImages') vs 'image'
    // You mentioned your backend route uses 'portfolioImages'
    formData.append('portfolioImages', compressedImage);


    // Debug: Check console to see what is being sent
    console.log("Submitting Portfolio Item:", {
      title: newItem.title,
      price: newItem.price,
      image: newItem.image?.name || "no-file",
      category: newItem.category,
      unitType: newItem.unitType,
      unitValue: newItem.unitValue
    });

    let success = false;

    try {
      success = await onAdd(formData);
    } finally {
      setLoading(false);
    }

    const DEFAULT_ITEM = {
      title: '',
      price: '',
      image: null,
      category: "Cake",
      unitType: "kg",
      unitValue: "250"
    };

    if (success) {
      setIsAdding(false);
      setNewItem(DEFAULT_ITEM);
    } else {
      alert("Failed to add item. Check console.");
    }
  };

  const handleCropDone = async (pixels) => {
    try {
      setImageProcessing(true);

      const croppedFile = await getCroppedImage(cropSrc, pixels);
      const compressedImage = await compressImage(croppedFile);

      setNewItem(prev => ({ ...prev, image: compressedImage }));
      setPreviewUrl(URL.createObjectURL(compressedImage));

      setShowCropper(false);
      setCropSrc(null);
    } catch (err) {
      console.error("Image processing failed:", err);
      alert("Failed to process image");
    } finally {
      setImageProcessing(false);
    }
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setCropSrc(null);
  };


  return (
    <div className="mt-12 border-t border-gray-100 pt-10 pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="text-blue-600" /> Portfolio & Products
          </h2>
          <p className="text-gray-500 text-sm mt-1">Upload your selling items</p>
          <p className="text-gray-500 text-sm mt-1">“You can add a maximum of 7 best products here. Please use the upload section to add other remaining products.”</p>
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
                <img src={previewUrl} className="h-full w-full object-cover rounded-xl" alt="preview" />
              ) : (
                <div className="text-center text-gray-400 group-hover:text-blue-500">
                  <Camera className="mx-auto mb-2" size={24} />
                  <span className="text-xs font-bold">Upload Image</span>
                </div>
              )}
              <input type="file" required onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                setCropSrc(URL.createObjectURL(file));
                setShowCropper(true);
              }}
                className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
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
              <div className="mb-4">
                <label className="block text-stone-600 text-sm font-semibold mb-2">Select Unit Type</label>
                <select
                  name="unitType"
                  value={newItem.unitType}
                  onChange={e => setNewItem({ ...newItem, unitType: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="kg">Kilogram (grams)</option>
                  <option value="quantity">Quantity</option>
                </select>
              </div>
              {newItem.unitType === "kg" ? (
                <div>
                  <label className="block text-stone-600 text-sm font-semibold mb-2">
                    Weight (grams)
                  </label>
                  <select
                    value={newItem.unitValue}
                    onChange={e =>
                      setNewItem({ ...newItem, unitValue: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-stone-50"
                  >
                    <option value="250">250 g</option>
                    <option value="500">500 g</option>
                    <option value="750">750 g</option>
                    <option value="1000">1 kg</option>
                    <option value="1500">1.5 kg</option>
                    <option value="2000">2 kg</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-stone-600 text-sm font-semibold mb-2">
                    Quantity
                  </label>
                  <select
                    value={newItem.unitValue}
                    onChange={e =>
                      setNewItem({ ...newItem, unitValue: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-stone-50"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, , 9, 10, 11, 12].map(q => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-stone-600 text-sm font-semibold mb-2">Category</label>
                <select
                  name="category"
                  value={newItem.category}
                  onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full p-3 rounded-lg border bg-stone-50"
                >
                  {["Cake", "Pastry", "Cookies", "Bread", "Brownie", "Donuts", "Chocolates", "Snacks", "Others"].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
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
                disabled={portfolioApi.loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md disabled:bg-blue-400"
              >
                {portfolioApi.loading ? 'Saving...' : 'Add to Portfolio'}
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
                <img src={item.images} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 truncate text-lg">{item.productName}</h3>
                {/* Ensure we render price, defaulting to 0 if undefined */}
                <p className="text-blue-600 font-bold mt-1">₹{item.price || "0"}</p>
              </div>
              {console.log(item)}
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
      {showCropper && (
        <ImageCropper
          imageSrc={cropSrc}
          aspect={1}
          onDone={handleCropDone}
          onCancel={handleCropCancel}
        />
      )}

    </div>
  );
};

export default ShopProfile;