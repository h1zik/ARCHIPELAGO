import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '../../components/AdminLayout';

const ManageIslands = () => {
  const [islands, setIslands] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  useEffect(() => {
    fetchIslands();
  }, []);

  const fetchIslands = async () => {
    try {
      const response = await axios.get(`${API}/islands`);
      setIslands(response.data);
    } catch (error) {
      console.error('Failed to fetch islands:', error);
      toast.error('Failed to load islands');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (island) => {
    setEditingId(island.id);
    setEditData({...island});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API}/admin/islands/${editingId}`, {
        story: editData.story,
        mood: editData.mood,
        image_url: editData.image_url,
        aroma_notes: editData.aroma_notes
      });
      
      toast.success('Island updated successfully');
      fetchIslands();
      setEditingId(null);
      setEditData(null);
    } catch (error) {
      console.error('Failed to update island:', error);
      toast.error('Failed to update island');
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
      <div data-testid="manage-islands-page">
        <h1
          className="text-4xl mb-8"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Manage Islands
        </h1>

        <div className="space-y-6">
          {islands.map((island) => {
            const isEditing = editingId === island.id;
            const data = isEditing ? editData : island;

            return (
              <div
                key={island.id}
                className="bg-white p-6 rounded-lg shadow-sm"
                data-testid={`island-card-${island.slug}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h2
                    className="text-2xl"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    {island.name}
                  </h2>
                  {!isEditing ? (
                    <button
                      onClick={() => handleEdit(island)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#A27B5C] text-white rounded hover:bg-[#8B6A4D] transition-colors"
                      data-testid={`edit-button-${island.slug}`}
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-[#5F7161] text-white rounded hover:bg-[#4F6151] transition-colors"
                        data-testid={`save-button-${island.slug}`}
                      >
                        <Save size={16} />
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 bg-[#9A3B3B] text-white rounded hover:bg-[#8A2B2B] transition-colors"
                        data-testid={`cancel-button-${island.slug}`}
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm uppercase tracking-widest mb-2 font-medium">
                      Mood
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={data.mood}
                        onChange={(e) => setEditData({ ...editData, mood: e.target.value })}
                        className="w-full p-3 border border-[#D1CCC0] rounded focus:border-[#A27B5C] outline-none"
                        data-testid={`input-mood-${island.slug}`}
                      />
                    ) : (
                      <p className="text-[#5C6B70]">{data.mood}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm uppercase tracking-widest mb-2 font-medium">
                      Story
                    </label>
                    {isEditing ? (
                      <textarea
                        value={data.story}
                        onChange={(e) => setEditData({ ...editData, story: e.target.value })}
                        rows={4}
                        className="w-full p-3 border border-[#D1CCC0] rounded focus:border-[#A27B5C] outline-none"
                        data-testid={`input-story-${island.slug}`}
                      />
                    ) : (
                      <p className="text-[#5C6B70] leading-relaxed">{data.story}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm uppercase tracking-widest mb-2 font-medium">
                      Image URL
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={data.image_url}
                        onChange={(e) => setEditData({ ...editData, image_url: e.target.value })}
                        className="w-full p-3 border border-[#D1CCC0] rounded focus:border-[#A27B5C] outline-none"
                        data-testid={`input-image-${island.slug}`}
                      />
                    ) : (
                      <a href={data.image_url} target="_blank" rel="noopener noreferrer" className="text-[#A27B5C] hover:underline text-sm">
                        {data.image_url}
                      </a>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm uppercase tracking-widest mb-2 font-medium">
                        Top Notes
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={data.aroma_notes.top.join(', ')}
                          onChange={(e) => setEditData({
                            ...editData,
                            aroma_notes: { ...editData.aroma_notes, top: e.target.value.split(',').map(s => s.trim()) }
                          })}
                          placeholder="Comma separated"
                          className="w-full p-3 border border-[#D1CCC0] rounded focus:border-[#A27B5C] outline-none"
                        />
                      ) : (
                        <p className="text-sm text-[#5C6B70]">{data.aroma_notes.top.join(', ')}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm uppercase tracking-widest mb-2 font-medium">
                        Heart Notes
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={data.aroma_notes.heart.join(', ')}
                          onChange={(e) => setEditData({
                            ...editData,
                            aroma_notes: { ...editData.aroma_notes, heart: e.target.value.split(',').map(s => s.trim()) }
                          })}
                          placeholder="Comma separated"
                          className="w-full p-3 border border-[#D1CCC0] rounded focus:border-[#A27B5C] outline-none"
                        />
                      ) : (
                        <p className="text-sm text-[#5C6B70]">{data.aroma_notes.heart.join(', ')}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm uppercase tracking-widest mb-2 font-medium">
                        Base Notes
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={data.aroma_notes.base.join(', ')}
                          onChange={(e) => setEditData({
                            ...editData,
                            aroma_notes: { ...editData.aroma_notes, base: e.target.value.split(',').map(s => s.trim()) }
                          })}
                          placeholder="Comma separated"
                          className="w-full p-3 border border-[#D1CCC0] rounded focus:border-[#A27B5C] outline-none"
                        />
                      ) : (
                        <p className="text-sm text-[#5C6B70]">{data.aroma_notes.base.join(', ')}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageIslands;
