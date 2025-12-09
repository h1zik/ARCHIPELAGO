import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import axios from 'axios';
import QuizModal from '../components/QuizModal';

const Home = () => {
  const [islands, setIslands] = useState([]);
  const [theme, setTheme] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (theme?.hero_images?.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % theme.hero_images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [theme]);

  const fetchData = async () => {
    try {
      const [islandsRes, themeRes] = await Promise.all([
        axios.get(`${API}/islands`),
        axios.get(`${API}/theme`)
      ]);
      setIslands(islandsRes.data);
      setTheme(themeRes.data);
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

  const heroImages = theme?.hero_images?.length > 0 ? theme.hero_images : [
    'https://images.unsplash.com/photo-1637060548964-f064b88cd344?crop=entropy&cs=srgb&fm=jpg&q=85'
  ];

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section with Parallax Slideshow */}
      <section className="relative h-screen overflow-hidden" data-testid="hero-section">
        {/* Slideshow Images */}
        {heroImages.map((img, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: currentSlide === index ? 1 : 0 }}
          >
            <img
              src={img}
              alt={`Hero ${index + 1}`}
              className="w-full h-full object-cover transform scale-110"
              loading={index === 0 ? 'eager' : 'lazy'}
              style={{
                transform: currentSlide === index ? 'scale(1)' : 'scale(1.1)',
                transition: 'transform 5s ease-out'
              }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(44,54,57,0.2), rgba(44,54,57,0.8))' }}></div>
          </div>
        ))}

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center text-center z-10">
          <div className="container mx-auto px-6">
            <h1
              className="text-5xl md:text-7xl text-white mb-6 fade-up"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontStyle: 'italic' }}
              data-testid="hero-title"
            >
              Discover Indonesia<br />Through Scent
            </h1>
            <p className="text-lg md:text-xl text-[#DCD7C9] max-w-2xl mx-auto mb-8 leading-relaxed" data-testid="hero-subtitle">
              Perjalanan olfaktori melalui enam pulau. Setiap aroma adalah cerita yang menunggu untuk diceritakan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setQuizOpen(true)}
                className="btn-primary inline-flex items-center gap-2"
                data-testid="hero-quiz-button"
              >
                <Sparkles size={20} />
                Discover Your Island
              </button>
              <Link to="/shop" className="btn-secondary" data-testid="hero-shop-button">
                Explore Collection
              </Link>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
              }`}
              data-testid={`slide-indicator-${index}`}
            />
          ))}
        </div>
      </section>

      {/* Islands Grid Section */}
      <section className="section-padding bg-[#F2EFE9]" data-testid="islands-section">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl mb-4"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Six Islands, Six Stories
            </h2>
            <p className="text-lg text-[#5C6B70] max-w-2xl mx-auto">
              Setiap pulau membawa karakternya sendiri. Pilih yang paling mewakili jiwa Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {islands.map((island) => (
              <Link
                key={island.id}
                to={`/islands/${island.slug}`}
                className="group relative overflow-hidden aspect-[3/4] card-hover"
                data-testid={`island-card-${island.slug}`}
              >
                <div className="absolute inset-0 image-zoom">
                  <img
                    src={island.image_url}
                    alt={island.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3
                    className="text-3xl mb-2"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    {island.name}
                  </h3>
                  <p className="text-sm text-white/80 mb-4">{island.mood}</p>
                  <div className="inline-flex items-center gap-2 text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/islands" className="btn-primary" data-testid="view-all-islands-button">
              View All Islands
            </Link>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-[#EAE7E2]" data-testid="story-section">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2
                className="text-4xl md:text-5xl mb-6"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Crafted with Indonesian Soul
              </h2>
              <p className="text-lg leading-relaxed text-[#5C6B70] mb-6">
                Archipelago Scent lahir dari kecintaan mendalam terhadap kekayaan alam dan budaya Indonesia.
                Setiap parfum adalah hasil riset mendalam terhadap karakter geografis, flora, dan cerita rakyat
                dari enam pulau pilihan.
              </p>
              <p className="text-lg leading-relaxed text-[#5C6B70] mb-8">
                Kami percaya bahwa aroma memiliki kekuatan untuk membawa Anda melintasi ruang dan waktu.
                Kenakan Archipelago, dan biarkan Indonesia hidup di kulit Anda.
              </p>
              <Link to="/about" className="btn-secondary" data-testid="learn-more-button">
                Learn More
              </Link>
            </div>
            <div className="image-zoom rounded overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1720404219082-d4f6ee18b5b2?crop=entropy&cs=srgb&fm=jpg&q=85"
                alt="Craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-[#2C3639] text-white" data-testid="cta-section">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2
            className="text-4xl md:text-5xl mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Not Sure Which Scent Suits You?
          </h2>
          <p className="text-lg text-[#DCD7C9] max-w-2xl mx-auto mb-8">
            Take our personalized Scent Finder Quiz and discover the island that matches your personality.
          </p>
          <button
            onClick={() => setQuizOpen(true)}
            className="bg-[#A27B5C] text-white px-8 py-4 rounded-full hover:bg-[#8B6A4D] transition-all duration-300 hover:scale-105 font-medium tracking-wide inline-flex items-center gap-2"
            data-testid="cta-quiz-button"
          >
            <Sparkles size={20} />
            Start Quiz
          </button>
        </div>
      </section>

      {/* Quiz Modal */}
      <QuizModal isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
    </div>
  );
};

export default Home;