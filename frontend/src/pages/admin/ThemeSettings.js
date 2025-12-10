import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '../../components/AdminLayout';

const ThemeSettings = () => {
  const [theme, setTheme] = useState({
    primary_color: '#2C3639',
    secondary_color: '#DCD7C9',
    accent_color: '#A27B5C',
    hero_images: []
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  useEffect(() => {
    fetchTheme();
  }, []);

  const fetchTheme = async () => {
    try {
      const response = await axios.get(`${API}/theme`);
      setTheme(response.data);
    } catch (error) {
      console.error('Failed to fetch theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API}/admin/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fullUrl = `${process.env.REACT_APP_BACKEND_URL}${response.data.url}`;
      setTheme({ ...theme, hero_images: [...theme.hero_images, fullUrl] });
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeHeroImage = (index) => {
    setTheme({
      ...theme,
      hero_images: theme.hero_images.filter((_, idx) => idx !== index)
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API}/admin/theme`, theme);
      toast.success('Theme updated successfully');
    } catch (error) {
      console.error('Failed to update theme:', error);
      toast.error('Failed to update theme');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="spinner"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div data-testid="theme-settings-page">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Theme Settings
          </h1>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-[#A27B5C] text-white rounded-full hover:bg-[#8B6A4D] transition-colors"
            data-testid="save-theme-button"
          >
            <Save size={20} />
            Save Changes
          </button>
        </div>

        <div className="space-y-8">
          {/* Color Settings */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Color Palette
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm uppercase tracking-widest mb-2 font-medium">
                  Primary Color
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={theme.primary_color}
                    onChange={(e) => setTheme({ ...theme, primary_color: e.target.value })}
                    className="w-16 h-16 rounded border border-[#D1CCC0]"
                    data-testid="input-primary-color"
                  />
                  <input
                    type="text"
                    value={theme.primary_color}
                    onChange={(e) => setTheme({ ...theme, primary_color: e.target.value })}
                    className="flex-1 p-3 border border-[#D1CCC0] rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm uppercase tracking-widest mb-2 font-medium">
                  Secondary Color
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={theme.secondary_color}
                    onChange={(e) => setTheme({ ...theme, secondary_color: e.target.value })}
                    className="w-16 h-16 rounded border border-[#D1CCC0]"
                    data-testid="input-secondary-color"
                  />
                  <input
                    type="text"
                    value={theme.secondary_color}
                    onChange={(e) => setTheme({ ...theme, secondary_color: e.target.value })}
                    className="flex-1 p-3 border border-[#D1CCC0] rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm uppercase tracking-widest mb-2 font-medium">
                  Accent Color
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={theme.accent_color}
                    onChange={(e) => setTheme({ ...theme, accent_color: e.target.value })}
                    className="w-16 h-16 rounded border border-[#D1CCC0]"
                    data-testid="input-accent-color"
                  />
                  <input
                    type="text"
                    value={theme.accent_color}
                    onChange={(e) => setTheme({ ...theme, accent_color: e.target.value })}
                    className="flex-1 p-3 border border-[#D1CCC0] rounded font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hero Images */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Hero Images (Homepage Slideshow)
            </h2>
            
            <div className="mb-6">
              <label className="block mb-3">
                <div className="flex items-center gap-3 cursor-pointer">
                  <div className="px-6 py-3 bg-[#5F7161] text-white rounded-full hover:bg-[#4F6151] transition-colors inline-flex items-center gap-2">
                    <Upload size={20} />
                    {uploading ? 'Uploading...' : 'Upload Hero Image'}
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                  data-testid="hero-image-upload"
                />
              </label>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {theme.hero_images.map((image, index) => (
                <div key={index} className="relative group" data-testid={`hero-image-${index}`}>
                  <img
                    src={image}
                    alt={`Hero ${index + 1}`}
                    className="w-full h-48 object-cover rounded"
                  />
                  <button
                    onClick={() => removeHeroImage(index)}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    data-testid={`remove-hero-image-${index}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            {theme.hero_images.length === 0 && (
              <p className="text-[#5C6B70] text-center py-8">No hero images uploaded yet.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ThemeSettings;
