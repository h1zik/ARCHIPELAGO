import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Plus, Minus } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) return null;

  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-[#F2EFE9]" data-testid="product-detail-page">
      {/* Split Screen Layout */}
      <div className="grid md:grid-cols-2 min-h-screen">
        {/* Left: Fixed Image */}
        <div className="relative md:sticky md:top-0 h-screen overflow-hidden" style={{ background: 'linear-gradient(135deg, #F2EFE9 0%, #EAE7E2 50%, #DCD7C9 100%)' }}>
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, #A27B5C 0%, transparent 70%)' }}></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, #2C3639 0%, transparent 70%)' }}></div>
          </div>
          
          {/* Grain Texture */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url(https://grainy-gradients.vercel.app/noise.svg)' }}></div>
          
          {/* Logo Watermark */}
          <div className="absolute top-8 left-8 opacity-10">
            <img 
              src="https://customer-assets.emergentagent.com/job_fragrant-isles/artifacts/01hjnpjn_LOGO_HKI__2_-removebg-preview.png" 
              alt="Logo" 
              className="h-20"
            />
          </div>
          
          {/* Main Product Image Container */}
          <div className="h-full flex flex-col items-center justify-center p-8 md:p-16 relative z-10">
            {/* Product Info Badge */}
            <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
              <p className="text-xs uppercase tracking-widest text-[#A27B5C] font-medium">{product.island_name}</p>
            </div>
            
            {/* Product Image with Shadow */}
            <div className="relative w-full max-w-md">
              {/* Shadow effect */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-black/10 blur-2xl rounded-full"></div>
              
              {/* Main Image */}
              <img
                src={product.image_url}
                alt={product.name}
                className="relative w-full h-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                loading="lazy"
                data-testid="product-image"
              />
            </div>
            
            {/* Bottom Info */}
            <div className="absolute bottom-8 left-0 right-0 px-8 md:px-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#5C6B70] mb-1">Size</p>
                    <p className="text-lg font-medium text-[#2C3639]">{product.size}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-widest text-[#5C6B70] mb-1">Family</p>
                    <p className="text-lg font-medium text-[#2C3639]">{product.olfactive_family}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Scrollable Content */}
        <div className="p-8 md:p-16 space-y-12">
          {/* Product Info */}
          <div>
            <p className="text-sm uppercase tracking-widest text-[#A27B5C] mb-2">
              {product.island_name}
            </p>
            <h1
              className="text-4xl md:text-5xl mb-4"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
              data-testid="product-name"
            >
              {product.name}
            </h1>
            <p className="text-2xl font-medium text-[#A27B5C] mb-6" data-testid="product-price">
              Rp {product.price.toLocaleString('id-ID')}
            </p>
            <p className="text-base leading-relaxed text-[#5C6B70]" data-testid="product-description">
              {product.description}
            </p>
          </div>

          {/* Aroma Notes */}
          <div>
            <h2
              className="text-2xl mb-6"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Aroma Notes
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm uppercase tracking-widest text-[#A27B5C] mb-2 font-medium">Top Notes</h3>
                <p className="text-base">{product.aroma_notes.top.join(', ')}</p>
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-widest text-[#A27B5C] mb-2 font-medium">Heart Notes</h3>
                <p className="text-base">{product.aroma_notes.heart.join(', ')}</p>
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-widest text-[#A27B5C] mb-2 font-medium">Base Notes</h3>
                <p className="text-base">{product.aroma_notes.base.join(', ')}</p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-2 gap-6 py-6 border-t border-b border-[#D1CCC0]">
            <div>
              <p className="text-sm uppercase tracking-widest text-[#5C6B70] mb-1">Size</p>
              <p className="text-base font-medium">{product.size}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-widest text-[#5C6B70] mb-1">Olfactive Family</p>
              <p className="text-base font-medium">{product.olfactive_family}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-widest text-[#5C6B70] mb-1">Mood</p>
              <p className="text-base font-medium">{product.mood}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-widest text-[#5C6B70] mb-1">Stock</p>
              <p className="text-base font-medium">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
            </div>
          </div>

          {/* Add to Cart */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-[#D1CCC0] rounded-full">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-[#EAE7E2] transition-colors"
                  data-testid="decrease-quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="px-6 font-medium" data-testid="quantity-display">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 hover:bg-[#EAE7E2] transition-colors"
                  data-testid="increase-quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="add-to-cart-button"
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          {/* Reviews */}
          <div>
            <h2
              className="text-2xl mb-6"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Reviews
            </h2>
            {product.reviews.length === 0 ? (
              <p className="text-[#5C6B70]" data-testid="no-reviews">No reviews yet. Be the first to review this product!</p>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        fill={i < Math.round(averageRating) ? '#A27B5C' : 'none'}
                        stroke={i < Math.round(averageRating) ? '#A27B5C' : '#D1CCC0'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-[#5C6B70]" data-testid="review-count">
                    {averageRating.toFixed(1)} ({product.reviews.length} reviews)
                  </span>
                </div>
                <div className="space-y-6">
                  {product.reviews.map((review, index) => (
                    <div key={index} className="border-b border-[#D1CCC0] pb-6 last:border-0" data-testid={`review-${index}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < review.rating ? '#A27B5C' : 'none'}
                              stroke={i < review.rating ? '#A27B5C' : '#D1CCC0'}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{review.reviewer_name}</span>
                      </div>
                      <p className="text-sm text-[#5C6B70]">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;