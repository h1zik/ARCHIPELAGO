import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

const DiscoverySet = () => {
  const [discoverySet, setDiscoverySet] = useState(null);
  const [islands, setIslands] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, islandsRes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/islands`)
      ]);

      const discoveryProduct = productsRes.data.find(p => p.id === 'prod_discovery_set');
      setDiscoverySet(discoveryProduct);
      setIslands(islandsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (discoverySet) {
      addToCart(discoverySet, 1);
      toast.success('Discovery Set added to cart!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2EFE9]" data-testid="discovery-set-page">
      {/* Hero */}
      <section className="section-padding bg-[#EAE7E2]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h1
                className="text-5xl md:text-7xl mb-6"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
                data-testid="discovery-set-title"
              >
                Discovery Set
              </h1>
              <p className="text-lg md:text-xl leading-relaxed text-[#5C6B70] mb-8">
                Tidak yakin aroma mana yang cocok? Mulai perjalanan Anda dengan Discovery Set—
                koleksi 6 vial miniatur dari setiap pulau. Temukan signature scent Anda.
              </p>
              {discoverySet && (
                <>
                  <p className="text-3xl font-bold text-[#A27B5C] mb-6" data-testid="discovery-set-price">
                    Rp {discoverySet.price.toLocaleString('id-ID')}
                  </p>
                  <button
                    onClick={handleAddToCart}
                    className="btn-primary"
                    data-testid="add-discovery-set-button"
                  >
                    Add to Cart
                  </button>
                </>
              )}
            </div>
            <div className="image-zoom rounded overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1709662369900-130507781728?crop=entropy&cs=srgb&fm=jpg&q=85"
                alt="Discovery Set"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="section-padding">
        <div className="container mx-auto px-6 md:px-12">
          <h2
            className="text-4xl md:text-5xl mb-12 text-center"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            What's Inside
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {islands.map((island) => (
              <div
                key={island.id}
                className="bg-[#EAE7E2] p-8 rounded"
                data-testid={`discovery-island-${island.slug}`}
              >
                <h3
                  className="text-2xl mb-3"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {island.name}
                </h3>
                <p className="text-sm uppercase tracking-widest text-[#A27B5C] mb-4">
                  {island.mood}
                </p>
                <p className="text-sm text-[#5C6B70] leading-relaxed">
                  {island.story.substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="section-padding bg-[#EAE7E2]">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <h2
            className="text-4xl md:text-5xl mb-12 text-center"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            How to Use
          </h2>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-[#A27B5C] text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl mb-2 font-medium">Test Each Scent</h3>
                <p className="text-[#5C6B70] leading-relaxed">
                  Uji setiap aroma pada pulse points (pergelangan tangan, leher) di hari yang berbeda.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-[#A27B5C] text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl mb-2 font-medium">Observe the Evolution</h3>
                <p className="text-[#5C6B70] leading-relaxed">
                  Biarkan aroma berkembang 6-8 jam untuk merasakan seluruh profil aromanya.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-[#A27B5C] text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl mb-2 font-medium">Find Your Island</h3>
                <p className="text-[#5C6B70] leading-relaxed">
                  Pilih yang paling cocok dengan kepribadian dan gaya hidup Anda, lalu beli ukuran penuh.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <h2
            className="text-4xl md:text-5xl mb-12 text-center"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Why Choose Discovery Set?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <Check className="text-[#A27B5C] flex-shrink-0" size={24} />
              <div>
                <h3 className="text-lg mb-2 font-medium">Cost-Effective</h3>
                <p className="text-sm text-[#5C6B70]">Hemat 40% dibanding beli 6 vial terpisah.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Check className="text-[#A27B5C] flex-shrink-0" size={24} />
              <div>
                <h3 className="text-lg mb-2 font-medium">Risk-Free</h3>
                <p className="text-sm text-[#5C6B70]">Coba semua varian sebelum komit ke ukuran penuh.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Check className="text-[#A27B5C] flex-shrink-0" size={24} />
              <div>
                <h3 className="text-lg mb-2 font-medium">Travel-Friendly</h3>
                <p className="text-sm text-[#5C6B70]">Ukuran sempurna untuk dibawa traveling.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Check className="text-[#A27B5C] flex-shrink-0" size={24} />
              <div>
                <h3 className="text-lg mb-2 font-medium">Perfect Gift</h3>
                <p className="text-sm text-[#5C6B70]">Hadiah ideal untuk pencinta parfum.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DiscoverySet;