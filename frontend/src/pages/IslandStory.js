import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';

const IslandStory = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [island, setIsland] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      const islandsRes = await axios.get(`${API}/islands`);
      const foundIsland = islandsRes.data.find(i => i.slug === slug);
      
      if (!foundIsland) {
        navigate('/islands');
        return;
      }

      setIsland(foundIsland);

      const productsRes = await axios.get(`${API}/products?island_id=${foundIsland.id}`);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!island) return null;

  return (
    <div className="min-h-screen bg-[#F2EFE9]" data-testid="island-story-page">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden" data-testid="island-hero">
        <div className="absolute inset-0 image-zoom">
          <img
            src={island.image_url}
            alt={island.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(44,54,57,0.3), rgba(44,54,57,0.8))' }}></div>
        
        <div className="absolute inset-0 flex items-center justify-center text-center z-10">
          <div className="container mx-auto px-6">
            <h1
              className="text-6xl md:text-8xl text-white mb-6"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontStyle: 'italic' }}
              data-testid="island-name"
            >
              {island.name}
            </h1>
            <p className="text-xl md:text-2xl text-[#DCD7C9] uppercase tracking-widest" data-testid="island-mood">
              {island.mood}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <h2
            className="text-3xl md:text-4xl mb-8 text-center"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            The Story
          </h2>
          <p className="text-lg md:text-xl leading-relaxed text-[#2C3639] text-center" data-testid="island-story">
            {island.story}
          </p>
        </div>
      </section>

      {/* Aroma Notes */}
      <section className="section-padding bg-[#EAE7E2]">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <h2
            className="text-3xl md:text-4xl mb-12 text-center"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Aroma Notes
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center" data-testid="top-notes">
              <h3 className="text-sm uppercase tracking-widest text-[#A27B5C] mb-4 font-medium">Top Notes</h3>
              <ul className="space-y-2">
                {island.aroma_notes.top.map((note, index) => (
                  <li key={index} className="text-lg" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center" data-testid="heart-notes">
              <h3 className="text-sm uppercase tracking-widest text-[#A27B5C] mb-4 font-medium">Heart Notes</h3>
              <ul className="space-y-2">
                {island.aroma_notes.heart.map((note, index) => (
                  <li key={index} className="text-lg" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center" data-testid="base-notes">
              <h3 className="text-sm uppercase tracking-widest text-[#A27B5C] mb-4 font-medium">Base Notes</h3>
              <ul className="space-y-2">
                {island.aroma_notes.base.map((note, index) => (
                  <li key={index} className="text-lg" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="section-padding">
        <div className="container mx-auto px-6 md:px-12">
          <h2
            className="text-3xl md:text-4xl mb-12 text-center"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Shop This Island
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {products.map((product) => (
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
                  />
                </div>
                <h3
                  className="text-xl mb-2 group-hover:text-[#A27B5C] transition-colors"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {product.name}
                </h3>
                <p className="text-sm text-[#5C6B70] mb-2">{product.size}</p>
                <p className="text-lg font-medium text-[#A27B5C]">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/shop" className="btn-secondary inline-flex items-center gap-2" data-testid="shop-all-button">
              Shop All Products <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IslandStory;