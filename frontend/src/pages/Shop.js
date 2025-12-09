import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter } from 'lucide-react';
import axios from 'axios';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [islands, setIslands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    island_id: '',
    mood: '',
    olfactive_family: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  useEffect(() => {
    fetchIslands();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchIslands = async () => {
    try {
      const response = await axios.get(`${API}/islands`);
      setIslands(response.data);
    } catch (error) {
      console.error('Failed to fetch islands:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.island_id) params.append('island_id', filters.island_id);
      if (filters.mood) params.append('mood', filters.mood);
      if (filters.olfactive_family) params.append('olfactive_family', filters.olfactive_family);

      const response = await axios.get(`${API}/products?${params.toString()}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const moods = [...new Set(products.map(p => p.mood).filter(Boolean))];
  const olfactiveFamilies = [...new Set(products.map(p => p.olfactive_family).filter(Boolean))];

  const clearFilters = () => {
    setFilters({ island_id: '', mood: '', olfactive_family: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2EFE9]" data-testid="shop-page">
      {/* Header */}
      <section className="section-padding bg-[#EAE7E2] pt-32">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h1
            className="text-5xl md:text-7xl mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
            data-testid="shop-title"
          >
            Shop Collection
          </h1>
          <p className="text-lg md:text-xl text-[#5C6B70] max-w-3xl mx-auto leading-relaxed">
            Temukan parfum yang sempurna untuk Anda. Setiap botol adalah perjalanan.
          </p>
        </div>
      </section>

      {/* Shop Content */}
      <section className="section-padding">
        <div className="container mx-auto px-6 md:px-12">
          {/* Filter Bar */}
          <div className="mb-12">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 mb-6 text-sm uppercase tracking-widest hover:text-[#A27B5C] transition-colors"
              data-testid="toggle-filters-button"
            >
              <Filter size={18} />
              Filters
            </button>

            {showFilters && (
              <div className="grid md:grid-cols-4 gap-6 p-6 bg-[#EAE7E2] rounded" data-testid="filters-panel">
                {/* Island Filter */}
                <div>
                  <label className="block text-sm uppercase tracking-widest mb-2 font-medium">Island</label>
                  <select
                    value={filters.island_id}
                    onChange={(e) => setFilters({ ...filters, island_id: e.target.value })}
                    className="w-full p-3 bg-[#F2EFE9] border border-[#D1CCC0] focus:border-[#A27B5C] outline-none"
                    data-testid="island-filter"
                  >
                    <option value="">All Islands</option>
                    {islands.map((island) => (
                      <option key={island.id} value={island.id}>{island.name}</option>
                    ))}
                  </select>
                </div>

                {/* Mood Filter */}
                <div>
                  <label className="block text-sm uppercase tracking-widest mb-2 font-medium">Mood</label>
                  <select
                    value={filters.mood}
                    onChange={(e) => setFilters({ ...filters, mood: e.target.value })}
                    className="w-full p-3 bg-[#F2EFE9] border border-[#D1CCC0] focus:border-[#A27B5C] outline-none"
                    data-testid="mood-filter"
                  >
                    <option value="">All Moods</option>
                    {moods.map((mood) => (
                      <option key={mood} value={mood}>{mood}</option>
                    ))}
                  </select>
                </div>

                {/* Olfactive Family Filter */}
                <div>
                  <label className="block text-sm uppercase tracking-widest mb-2 font-medium">Olfactive Family</label>
                  <select
                    value={filters.olfactive_family}
                    onChange={(e) => setFilters({ ...filters, olfactive_family: e.target.value })}
                    className="w-full p-3 bg-[#F2EFE9] border border-[#D1CCC0] focus:border-[#A27B5C] outline-none"
                    data-testid="olfactive-filter"
                  >
                    <option value="">All Families</option>
                    {olfactiveFamilies.map((family) => (
                      <option key={family} value={family}>{family}</option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full btn-secondary"
                    data-testid="clear-filters-button"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {products.length === 0 ? (
              <div className="col-span-full text-center py-12" data-testid="no-products">
                <p className="text-lg text-[#5C6B70]">No products found with the selected filters.</p>
              </div>
            ) : (
              products.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group"
                  data-testid={`product-card-${product.id}`}
                >
                  <div className="relative overflow-hidden aspect-square mb-4 image-zoom bg-white">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-widest text-[#A27B5C] mb-2">
                      {product.island_name}
                    </p>
                    <h3
                      className="text-xl mb-2 group-hover:text-[#A27B5C] transition-colors"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      {product.name}
                    </h3>
                    <p className="text-sm text-[#5C6B70] mb-2">{product.size}</p>
                    <p className="text-lg font-medium text-[#2C3639]">
                      Rp {product.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;