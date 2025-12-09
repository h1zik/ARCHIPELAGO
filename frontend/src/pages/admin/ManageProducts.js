import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '../../components/AdminLayout';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [islands, setIslands] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  const emptyProduct = {
    name: '',
    island_id: '',
    island_name: '',
    price: 0,
    stock: 0,
    size: '50ml',
    description: '',
    aroma_notes: { top: [], heart: [], base: [] },
    olfactive_family: '',
    mood: '',
    image_url: ''
  };

  const [formData, setFormData] = useState(emptyProduct);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, islandsRes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/islands`)
      ]);
      setProducts(productsRes.data);
      setIslands(islandsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await axios.post(`${API}/admin/upload`, formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fullUrl = `${process.env.REACT_APP_BACKEND_URL}${response.data.url}`;
      setFormData({ ...formData, image_url: fullUrl });
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const island = islands.find(i => i.id === formData.island_id);
      const productData = {
        ...formData,
        island_name: island?.name || '',
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (editingProduct) {
        await axios.put(`${API}/admin/products/${editingProduct.id}`, productData);
        toast.success('Product updated successfully');
      } else {
        await axios.post(`${API}/admin/products`, productData);
        toast.success('Product created successfully');
      }
      
      fetchData();
      closeModal();
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await axios.delete(`${API}/admin/products/${id}`);
      toast.success('Product deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData(emptyProduct);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData(emptyProduct);
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
      <div data-testid="manage-products-page">
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-4xl"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Manage Products
          </h1>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-6 py-3 bg-[#A27B5C] text-white rounded-full hover:bg-[#8B6A4D] transition-colors"
            data-testid="add-product-button"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#EAE7E2]">
              <tr>
                <th className="text-left p-4 text-sm uppercase tracking-widest">Product</th>
                <th className="text-left p-4 text-sm uppercase tracking-widest">Island</th>
                <th className="text-left p-4 text-sm uppercase tracking-widest">Price</th>
                <th className="text-left p-4 text-sm uppercase tracking-widest">Stock</th>
                <th className="text-right p-4 text-sm uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-[#D1CCC0]/50" data-testid={`product-row-${product.id}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-[#5C6B70]">{product.size}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[#5C6B70]">{product.island_name}</td>
                  <td className="p-4">Rp {product.price.toLocaleString('id-ID')}</td>
                  <td className="p-4">{product.stock}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openModal(product)}
                        className="p-2 hover:bg-[#EAE7E2] rounded transition-colors"
                        data-testid={`edit-product-${product.id}`}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded transition-colors"
                        data-testid={`delete-product-${product.id}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6" data-testid="product-modal">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-[#D1CCC0]">
                <h2 className="text-2xl" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={closeModal} className="p-2 hover:bg-[#EAE7E2] rounded">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm uppercase tracking-widest mb-2 font-medium">Product Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full p-3 border border-[#D1CCC0] rounded focus:border-[#A27B5C] outline-none"
                      data-testid="input-product-name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm uppercase tracking-widest mb-2 font-medium">Island *</label>
                    <select
                      value={formData.island_id}
                      onChange={(e) => setFormData({ ...formData, island_id: e.target.value })}
                      required
                      className="w-full p-3 border border-[#D1CCC0] rounded focus:border-[#A27B5C] outline-none"
                      data-testid="select-island"
                    >
                      <option value="">Select Island</option>
                      {islands.map((island) => (
                        <option key={island.id} value={island.id}>{island.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm uppercase tracking-widest mb-2 font-medium">Price (Rp) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      className="w-full p-3 border border-[#D1CCC0] rounded focus:border-[#A27B5C] outline-none"
                      data-testid="input-price"
                    />
                  </div>
                  <div>
                    <label className="block text-sm uppercase tracking-widest mb-2 font-medium">Stock *</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                      className="w-full p-3 border border-[#D1CCC0] rounded focus:border-[#A27B5C] outline-none"
                      data-testid="input-stock"
                    />
                  </div>
                  <div>
                    <label className="block text-sm uppercase tracking-widest mb-2 font-medium">Size *</label>
                    <input
                      type="text"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      required
                      className="w-full p-3 border border-[#D1CCC0] rounded focus:border-[#A27B5C] outline-none"
                      data-testid="input-size"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm uppercase tracking-widest mb-2 font-medium">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    className="w-full p-3 border border-[#D1CCC0] rounded focus:border-[#A27B5C] outline-none"
                    data-testid="input-description"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm uppercase tracking-widest mb-2 font-medium">Olfactive Family *</label>
                    <input
                      type="text"
                      value={formData.olfactive_family}
                      onChange={(e) => setFormData({ ...formData, olfactive_family: e.target.value })}
                      required
                      className="w-full p-3 border border-[#D1CCC0] rounded focus:border-[#A27B5C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm uppercase tracking-widest mb-2 font-medium">Mood *</label>
                    <input
                      type="text"
                      value={formData.mood}
                      onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                      required
                      className="w-full p-3 border border-[#D1CCC0] rounded focus:border-[#A27B5C] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm uppercase tracking-widest mb-2 font-medium">Image URL *</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    required
                    className="w-full p-3 border border-[#D1CCC0] rounded focus:border-[#A27B5C] outline-none"
                    data-testid="input-image-url"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 border border-[#D1CCC0] rounded-full hover:bg-[#EAE7E2] transition-colors"
                    data-testid="cancel-button"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#A27B5C] text-white rounded-full hover:bg-[#8B6A4D] transition-colors"
                    data-testid="save-product-button"
                  >
                    {editingProduct ? 'Update' : 'Create'} Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageProducts;
