import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';

const IslandsCollection = () => {
  const [islands, setIslands] = useState([]);
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

  return (
    <div className="min-h-screen bg-[#F2EFE9]" data-testid="islands-collection-page">
      {/* Header */}
      <section className="section-padding bg-[#EAE7E2] pt-40">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h1
            className="text-5xl md:text-7xl mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
            data-testid="islands-title"
          >
            The Islands
          </h1>
          <p className="text-lg md:text-xl text-[#5C6B70] max-w-3xl mx-auto leading-relaxed">
            Enam pulau, enam karakter, enam cerita yang menunggu untuk ditemukan.
            Pilih pulau yang paling berbicara kepada jiwa Anda.
          </p>
        </div>
      </section>

      {/* Islands Grid */}
      <section className="section-padding">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {islands.map((island, index) => (
              <Link
                key={island.id}
                to={`/islands/${island.slug}`}
                className="group"
                data-testid={`island-card-${island.slug}`}
              >
                <div className="relative overflow-hidden aspect-[4/3] mb-6 image-zoom">
                  <img
                    src={island.image_url}
                    alt={island.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="inline-flex items-center gap-2 text-sm uppercase tracking-widest">
                      Explore <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
                <div>
                  <h2
                    className="text-3xl md:text-4xl mb-3 group-hover:text-[#A27B5C] transition-colors"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    {island.name}
                  </h2>
                  <p className="text-sm uppercase tracking-widest text-[#A27B5C] mb-4">
                    {island.mood}
                  </p>
                  <p className="text-base leading-relaxed text-[#5C6B70]">
                    {island.story.substring(0, 120)}...
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default IslandsCollection;