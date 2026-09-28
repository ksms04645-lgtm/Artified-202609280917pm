import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  HeartHandshake, 
  Truck, 
  ShoppingBag, 
  MessageCircle, 
  Clock, 
  Sparkles, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  ChevronRight,
  Heart,
  ZoomIn,
  Edit3,
  MessageSquare,
  Send
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { calculateTotalSold, isProductBestSeller, calculateReviewsCount, getProductReviews } from '../utils/productStats';
import { ProductReviewItem } from '../types';

export const ProductDetailModal: React.FC = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    toggleWishlist, 
    isWishlisted,
    isSellerMode,
    openProductEditor,
    bestsellerThreshold,
    addProductReview,
    products,
    selectedCategory,
    openReviewsManager
  } = useCart();

  const fallbackByCategory: Record<string, string> = {
    'pearl-bags': 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=80',
    'pearl-necklaces': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
    'macrame': 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80',
    'accessories': 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=900&q=80',
    'custom-beaded': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
  };
  const modalFallback = quickViewProduct 
    ? (fallbackByCategory[quickViewProduct.category] || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80')
    : 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80';

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedStyle, setSelectedStyle] = useState('Default Ivory / Classic');
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<'materials' | 'care' | 'delivery' | null>('materials');

  // Customer Review Submission State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewLocation, setNewReviewLocation] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Hover-to-Zoom inspection state
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [zoomScale, setZoomScale] = useState(2.4);

  // Reset zoom whenever image changes
  useEffect(() => {
    setIsZoomed(false);
    setShowReviewForm(false);
    setReviewSubmitted(false);
  }, [activeImageIndex, quickViewProduct?.id]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsZoomed(true);
    handleMouseMove(e);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((touch.clientX - left) / width) * 100));
      const y = Math.max(0, Math.min(100, ((touch.clientY - top) / height) * 100));
      setZoomPosition({ x, y });
      setIsZoomed(true);
    }
  };

  const handleTouchEnd = () => {
    setIsZoomed(false);
  };

  const categoryProducts = React.useMemo(() => {
    let list = [...products];
    if (selectedCategory === 'pearl-bags') {
      list = list.filter((p) => p.category === 'pearl-bags');
    } else if (selectedCategory === 'pearl-necklaces') {
      list = list.filter((p) => p.category === 'pearl-necklaces');
    } else if (selectedCategory === 'macrame') {
      list = list.filter((p) => p.category === 'macrame');
    } else if (selectedCategory === 'accessories') {
      list = list.filter((p) => p.category === 'accessories');
    } else if (selectedCategory === 'new-arrivals') {
      list = list.filter((p) => p.isNewArrival);
    } else if (selectedCategory === 'best-sellers') {
      list = list.filter((p) => p.isBestSeller || isProductBestSeller(p, bestsellerThreshold));
    }
    return list.length > 0 ? list : products;
  }, [products, selectedCategory, bestsellerThreshold]);

  const currentProductIndex = React.useMemo(() => {
    if (!quickViewProduct) return -1;
    const idx = categoryProducts.findIndex((p) => p.id === quickViewProduct.id);
    return idx >= 0 ? idx : 0;
  }, [categoryProducts, quickViewProduct]);

  const handlePrevProduct = () => {
    if (categoryProducts.length <= 1) return;
    const newIdx = (currentProductIndex - 1 + categoryProducts.length) % categoryProducts.length;
    setQuickViewProduct(categoryProducts[newIdx]);
    setActiveImageIndex(0);
  };

  const handleNextProduct = () => {
    if (categoryProducts.length <= 1) return;
    const newIdx = (currentProductIndex + 1) % categoryProducts.length;
    setQuickViewProduct(categoryProducts[newIdx]);
    setActiveImageIndex(0);
  };

  // Keyboard navigation for Left/Right arrows
  useEffect(() => {
    if (!quickViewProduct) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevProduct();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextProduct();
      } else if (e.key === 'Escape') {
        setQuickViewProduct(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quickViewProduct, currentProductIndex, categoryProducts]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const wishlisted = isWishlisted(product.id);
  const totalSold = calculateTotalSold(product);
  const isBestSeller = isProductBestSeller(product, bestsellerThreshold);
  const dynamicReviewsCount = calculateReviewsCount(product);
  const reviewsList = getProductReviews(product);

  const handleAddToCart = () => {
    addToCart(product, quantity, '', selectedStyle);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setQuickViewProduct(null);
    }, 900);
  };

  const handleWhatsAppOrder = () => {
    const phone = '9779767573721';
    const text = `Namaste Artified_np! ✨ I would like to order / inquire about the *${product.title}* (Rs. ${product.price.toLocaleString()}). Delivery in Kathmandu Valley / Nepal.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newReview: ProductReviewItem = {
      id: `${product.id}-rev-${Date.now()}`,
      author: newReviewAuthor.trim(),
      location: newReviewLocation.trim() || 'Kathmandu, Nepal',
      rating: newReviewRating,
      date: 'Today',
      verified: true,
      comment: newReviewComment.trim()
    };

    addProductReview(product.id, newReview);
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setShowReviewForm(false);
      setNewReviewAuthor('');
      setNewReviewLocation('');
      setNewReviewComment('');
    }, 2200);
  };

  const toggleAccordion = (key: 'materials' | 'care' | 'delivery') => {
    setActiveAccordion(activeAccordion === key ? null : key);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#1C1B1A]/60 backdrop-blur-xs transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      {/* Modal Dialog Container with Floating Side Navigation Arrows as in Image 1 */}
      <div className="relative w-full max-w-4xl my-auto z-10 flex items-center justify-center">
        {/* Previous Product Arrow (Left Side of Modal) */}
        {categoryProducts.length > 1 && (
          <button
            type="button"
            onClick={handlePrevProduct}
            className="absolute -left-5 sm:-left-8 md:-left-12 lg:-left-16 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white text-[#1C1B1A] border-2 border-[#1C1B1A] shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-115 hover:border-emerald-600 hover:text-emerald-600 hover:shadow-[0_0_28px_rgba(16,185,129,0.7),0_8px_20px_rgba(0,0,0,0.18)] active:scale-95 cursor-pointer focus:outline-none group"
            title="Previous piece (Left arrow key)"
            aria-label="Previous piece"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3] transition-colors" />
          </button>
        )}

        {/* Next Product Arrow (Right Side of Modal) */}
        {categoryProducts.length > 1 && (
          <button
            type="button"
            onClick={handleNextProduct}
            className="absolute -right-5 sm:-right-8 md:-right-12 lg:-right-16 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white text-emerald-700 border-2 border-emerald-700 shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-115 hover:border-emerald-500 hover:text-emerald-500 hover:shadow-[0_0_28px_rgba(16,185,129,0.7),0_8px_20px_rgba(0,0,0,0.18)] active:scale-95 cursor-pointer focus:outline-none group"
            title="Next piece (Right arrow key)"
            aria-label="Next piece"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3] transition-colors" />
          </button>
        )}

        {/* Modal Dialog Card */}
        <div className="bg-[#FAF8F5] w-full rounded-2xl shadow-2xl border border-[#E8DFD8] overflow-hidden flex flex-col max-h-[92vh]">
          {/* Top Header with Title, Counter, and Actions in ONE SINGLE LINE */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#E8DFD8] bg-white sticky top-0 z-20 gap-2">
            {/* Left: Brand and Category Label */}
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-[#8C7A6B] truncate">
                Artified_np Handmade Piece
              </span>
              <span className="text-[#C5A880] shrink-0">•</span>
              <span className="text-xs text-[#736C65] font-medium capitalize truncate">
                {selectedCategory === 'all' ? product.category.replace('-', ' ') : selectedCategory.replace('-', ' ')}
              </span>
            </div>

            {/* Right Action buttons and Counter */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {categoryProducts.length > 1 && (
                <span className="text-xs sm:text-sm font-medium text-[#736C65] tabular-nums mr-1 sm:mr-1.5">
                  {currentProductIndex + 1}/{categoryProducts.length}
                </span>
              )}

              {isSellerMode && (
                <>
                  <button
                    type="button"
                    onClick={() => openReviewsManager(product.id)}
                    className="px-2.5 sm:px-3 py-1.5 rounded-full border border-amber-300 bg-amber-50 text-amber-900 text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-100 transition-colors shadow-xs cursor-pointer"
                    title="Edit customer reviews for this piece (Seller Studio)"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="hidden md:inline">Edit Reviews ({reviewsList.length})</span>
                    <span className="md:hidden">Reviews</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openProductEditor(product)}
                    className="px-2.5 sm:px-3 py-1.5 rounded-full border border-[#C5A880] bg-[#1C1B1A] text-[#D4AF37] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#34312F] transition-colors shadow-xs cursor-pointer"
                    title="Edit this piece (Seller Only)"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="hidden sm:inline">Edit Piece</span>
                  </button>
                </>
              )}

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-2 rounded-full border border-[#E8DFD8] transition-colors cursor-pointer ${
                  wishlisted ? 'bg-rose-50 text-rose-500 border-rose-200' : 'text-[#736C65] hover:text-[#1C1B1A]'
                }`}
                title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
              </button>
              <button
                onClick={() => setQuickViewProduct(null)}
                className="p-2 rounded-full border border-[#E8DFD8] text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="overflow-y-auto p-4 sm:p-6 md:p-8 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Left: Gallery Column */}
              <div className="md:col-span-6 flex flex-col gap-3">
                {/* Main Feature View with Hover-to-Zoom */}
                <div 
                  className="relative aspect-[4/5] rounded-xl overflow-hidden bg-white border border-[#E8DFD8] shadow-xs cursor-crosshair select-none group"
                  onMouseEnter={handleMouseEnter}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onTouchStart={handleTouchMove}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <img
                    src={product.images[activeImageIndex]?.trim() || modalFallback}
                    alt={product.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = modalFallback;
                    }}
                    className="w-full h-full object-cover object-center pointer-events-none will-change-transform"
                    style={{
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      transform: isZoomed ? `scale(${zoomScale})` : 'scale(1)',
                      transition: isZoomed ? 'transform 0.05s ease-out' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />

                  {/* Hover-to-zoom craft inspection status badge */}
                  <div 
                    className={`absolute top-3 left-3 py-1 px-2.5 rounded-full text-[11px] font-medium transition-all duration-200 flex items-center gap-1.5 shadow-xs backdrop-blur-md pointer-events-none z-10 ${
                      isZoomed 
                        ? 'bg-[#1C1B1A]/90 text-[#FAF8F5] border border-[#C5A880]/50' 
                        : 'bg-white/95 text-[#5E5955] border border-[#E8DFD8] opacity-90 group-hover:opacity-100'
                    }`}
                  >
                    {isZoomed ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                        <span>Inspecting Bead Details ({zoomScale}x)</span>
                      </>
                    ) : (
                      <>
                        <ZoomIn className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>Hover / Pan to Inspect Beads</span>
                      </>
                    )}
                  </div>

                  {/* Zoom Scale Selector Pills (2x, 2.5x, 3.2x) */}
                  <div 
                    className="absolute bottom-3 right-3 flex items-center bg-[#1C1B1A]/85 backdrop-blur-md rounded-full p-0.5 border border-white/10 shadow-sm z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {[2.0, 2.5, 3.2].map((scaleVal) => (
                      <button
                        key={scaleVal}
                        type="button"
                        onClick={() => setZoomScale(scaleVal)}
                        className={`px-2 py-0.5 text-[10px] rounded-full font-mono transition-colors ${
                          zoomScale === scaleVal
                            ? 'bg-[#C5A880] text-[#1C1B1A] font-bold shadow-2xs'
                            : 'text-[#FAF8F5]/80 hover:text-white'
                        }`}
                      >
                        {scaleVal}x
                      </button>
                    ))}
                  </div>

                  {/* Craft Lead Time Floating Tag */}
                  <div 
                    className={`absolute bottom-3 left-3 bg-[#1C1B1A]/85 backdrop-blur-md text-white text-[11px] py-1 px-3 rounded-full flex items-center gap-1.5 shadow-sm transition-opacity duration-200 pointer-events-none ${
                      isZoomed ? 'opacity-30' : 'opacity-100'
                    }`}
                  >
                    <Clock className="w-3 h-3 text-[#D4AF37]" />
                    <span>{product.leadTime}</span>
                  </div>
                </div>

              {/* Thumbnail Strip */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx
                          ? 'border-[#C5A880] ring-2 ring-[#C5A880]/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={img?.trim() || modalFallback} 
                        alt="" 
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = modalFallback;
                        }}
                        className="w-full h-full object-cover" 
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Badges Trio */}
              <div className="grid grid-cols-3 gap-2 mt-2 pt-4 border-t border-[#E8DFD8]">
                <div className="bg-white p-2.5 rounded-lg border border-[#E8DFD8] text-center">
                  <HeartHandshake className="w-4 h-4 text-[#C5A880] mx-auto mb-1" />
                  <p className="text-[10px] font-semibold text-[#1C1B1A]">100% Handcrafted</p>
                  <p className="text-[9px] text-[#736C65]">Chikamugal, Kathmandu</p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-[#E8DFD8] text-center">
                  <ShieldCheck className="w-4 h-4 text-[#C5A880] mx-auto mb-1" />
                  <p className="text-[10px] font-semibold text-[#1C1B1A]">Quality Inspected</p>
                  <p className="text-[9px] text-[#736C65]">High Tensile Wire</p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-[#E8DFD8] text-center">
                  <Truck className="w-4 h-4 text-[#C5A880] mx-auto mb-1" />
                  <p className="text-[10px] font-semibold text-[#1C1B1A]">Easy Exchange</p>
                  <p className="text-[9px] text-[#736C65]">Within 24 Hours</p>
                </div>
              </div>
            </div>

            {/* Right: Product Details & Controls */}
            <div className="md:col-span-6 flex flex-col justify-between">
              <div>
                {/* Title & Star Rating */}
                <div className="flex items-center gap-1.5 text-xs text-[#736C65] mb-1.5 flex-wrap">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-semibold text-[#1C1B1A]">{product.rating}</span>
                  <span className="text-[#A69E96]">({dynamicReviewsCount} customer reviews)</span>
                  <span className="text-zinc-300">•</span>
                  <span className="text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                    {totalSold} sold
                  </span>
                  {isBestSeller && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase bg-[#1C1B1A] text-[#E6C687] border border-[#C5A880]/40">
                      ★ Bestseller
                    </span>
                  )}
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1B1A] font-semibold leading-tight">
                  {product.title}
                </h2>
                <p className="text-xs text-[#736C65] mt-1 font-medium">
                  {product.subtitle}
                </p>

                {/* Price Display in NPR */}
                <div className="flex items-baseline gap-3 my-4 py-3 px-4 bg-white rounded-xl border border-[#E8DFD8]">
                  <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1B1A]">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-[#A69E96] line-through">
                      Rs. {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-xs font-medium text-[#2E7D32] bg-emerald-50 px-2 py-0.5 rounded-md ml-auto">
                    In Stock (Nepal)
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#5E5955] leading-relaxed mb-5">
                  {product.description}
                </p>

                {/* Clean Quantity Selector (Bespoke customization completely removed) */}
                <div className="flex items-center justify-between p-3 mb-5 bg-white rounded-xl border border-[#E8DFD8]">
                  <span className="text-xs font-semibold text-[#1C1B1A] uppercase tracking-wider">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-[#E8DFD8] rounded-lg bg-[#FAF8F5]">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-sm font-semibold text-[#5E5955] hover:text-[#1C1B1A]"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-xs font-bold text-[#1C1B1A] min-w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="px-3 py-1.5 text-sm font-semibold text-[#5E5955] hover:text-[#1C1B1A]"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons: Add to Bag & WhatsApp Direct Order */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 px-6 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
                      addedSuccess
                        ? 'bg-[#2E7D32] text-white'
                        : 'bg-[#1C1B1A] text-white hover:bg-[#34312F]'
                    }`}
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added To Your Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#C5A880]" />
                        <span>Add To Bag (Rs. {(product.price * quantity).toLocaleString()})</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppOrder}
                    className="py-3.5 px-5 bg-white border border-[#25D366] text-[#075E54] hover:bg-[#25D366]/5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>Order via WhatsApp</span>
                  </button>
                </div>

                {/* Collapsible Accordions: Specs, Care, Delivery */}
                <div className="border-t border-[#E8DFD8] divide-y divide-[#E8DFD8]">
                  {/* Materials & Specs */}
                  <div>
                    <button
                      onClick={() => toggleAccordion('materials')}
                      className="w-full py-3 flex items-center justify-between text-xs font-semibold text-[#1C1B1A] uppercase tracking-wider text-left"
                    >
                      <span>Materials & Dimensions</span>
                      {activeAccordion === 'materials' ? (
                        <ChevronUp className="w-4 h-4 text-[#8C7A6B]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#8C7A6B]" />
                      )}
                    </button>
                    {activeAccordion === 'materials' && (
                      <div className="pb-3 text-xs text-[#5E5955] space-y-1.5">
                        <p><strong className="text-[#1C1B1A]">Dimensions:</strong> {product.dimensions}</p>
                        {product.weight && <p><strong className="text-[#1C1B1A]">Weight:</strong> {product.weight}</p>}
                        <div>
                          <strong className="text-[#1C1B1A] block mb-1">Materials:</strong>
                          <ul className="list-disc pl-4 space-y-0.5 text-[#736C65]">
                            {product.materials.map((m, idx) => (
                              <li key={idx}>{m}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Handmade Care */}
                  <div>
                    <button
                      onClick={() => toggleAccordion('care')}
                      className="w-full py-3 flex items-center justify-between text-xs font-semibold text-[#1C1B1A] uppercase tracking-wider text-left"
                    >
                      <span>Handmade Care Instructions</span>
                      {activeAccordion === 'care' ? (
                        <ChevronUp className="w-4 h-4 text-[#8C7A6B]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#8C7A6B]" />
                      )}
                    </button>
                    {activeAccordion === 'care' && (
                      <div className="pb-3 text-xs text-[#5E5955]">
                        <ul className="list-disc pl-4 space-y-1 text-[#736C65]">
                          {product.careNotes.map((note, idx) => (
                            <li key={idx}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Delivery & Payment in Nepal */}
                  <div>
                    <button
                      onClick={() => toggleAccordion('delivery')}
                      className="w-full py-3 flex items-center justify-between text-xs font-semibold text-[#1C1B1A] uppercase tracking-wider text-left"
                    >
                      <span>Delivery in Nepal & Payment Modes</span>
                      {activeAccordion === 'delivery' ? (
                        <ChevronUp className="w-4 h-4 text-[#8C7A6B]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#8C7A6B]" />
                      )}
                    </button>
                    {activeAccordion === 'delivery' && (
                      <div className="pb-3 text-xs text-[#5E5955] space-y-1 text-[#736C65]">
                        <p>• <strong>Inside Ring Road, Kathmandu:</strong> Rs. 100 (1–2 days delivery)</p>
                        <p>• <strong>Outside Ring Road (Lalitpur/Bhaktapur):</strong> Rs. 150 (2–3 days)</p>
                        <p>• <strong>Outside Valley (Pokhara, Chitwan, etc.):</strong> Rs. 220 (3–5 days)</p>
                        <p>• <strong>Payment Methods:</strong> Cash on Delivery (COD), eSewa QR, Khalti QR, Mobile Banking.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Customer Reviews & Ratings Section (placed at the bottom of the modal) */}
          <div className="mt-8 pt-6 border-t border-[#E8DFD8]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-xl sm:text-2xl text-[#1C1B1A] font-semibold">
                    Customer Reviews in Nepal
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#FAF8F5] border border-[#E8DFD8] text-[#1C1B1A]">
                    {dynamicReviewsCount} Reviews
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#1C1B1A]">{product.rating} out of 5</span>
                  <span className="text-zinc-300">•</span>
                  <span className="text-xs text-[#736C65]">{totalSold} verified pieces delivered from Chikamugal</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                {isSellerMode && (
                  <button
                    type="button"
                    onClick={() => openReviewsManager(product.id)}
                    className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    title="Open Seller Studio Review Manager for this piece"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                    <span>Manage Reviews</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2 bg-[#1C1B1A] hover:bg-[#34312F] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{showReviewForm ? 'Cancel Review' : 'Write a Review'}</span>
                </button>
              </div>
            </div>

            {/* Review Submission Form */}
            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="mb-6 p-4 sm:p-5 bg-white rounded-2xl border border-[#E8DFD8] shadow-xs space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-[#F0EBE5] pb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1B1A]">
                    Share Your Handcrafted Experience
                  </h4>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-[#736C65] mr-1">Your Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReviewRating(star)}
                        className="p-0.5 focus:outline-none"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= newReviewRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-zinc-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1B1A] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      placeholder="e.g. Alisha Shrestha"
                      className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E8DFD8] rounded-lg focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1B1A] mb-1">
                      Location in Nepal
                    </label>
                    <input
                      type="text"
                      value={newReviewLocation}
                      onChange={(e) => setNewReviewLocation(e.target.value)}
                      placeholder="e.g. Chikamugal, Kathmandu / Pokhara"
                      className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E8DFD8] rounded-lg focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1B1A] mb-1">
                    Your Review *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="Tell us about the beading quality, pearl shine, and delivery experience..."
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E8DFD8] rounded-lg focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-[10px] text-[#8C7A6B]">
                    Verified buyer reviews help support traditional Nepali artisans.
                  </p>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#C5A880] hover:bg-[#b0936b] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{reviewSubmitted ? 'Review Published!' : 'Submit Review'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {reviewsList.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 bg-white rounded-xl border border-[#E8DFD8] shadow-2xs hover:border-[#C5A880]/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= Math.round(rev.rating) ? 'fill-amber-400' : 'text-zinc-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-[#A69E96]">{rev.date}</span>
                    </div>

                    <p className="text-xs text-[#4A4541] leading-relaxed mb-3">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#F5F2ED] flex items-center justify-between text-[11px]">
                    <div>
                      <span className="font-semibold text-[#1C1B1A]">{rev.author}</span>
                      <span className="text-[10px] text-[#8C7A6B] block leading-none mt-0.5">{rev.location}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isSellerMode && (
                        <button
                          type="button"
                          onClick={() => openReviewsManager(product.id)}
                          className="px-2 py-0.5 text-[10px] font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                          title="Edit review in Seller Studio"
                        >
                          <Edit3 className="w-2.5 h-2.5 text-amber-700" />
                          <span>Edit</span>
                        </button>
                      )}
                      {rev.verified && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                          <Check className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Verified Purchase</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Assurance Footnote */}
            <div className="mt-4 p-3 bg-white/70 rounded-xl border border-[#E8DFD8] flex items-center justify-between text-[11px] text-[#736C65] flex-wrap gap-2">
              <span>📍 Handcrafted & Dispatched from <strong>Chikamugal, Kathmandu</strong></span>
              <span>🔄 <strong>Easy Exchange within 24 hrs</strong> of delivery</span>
            </div>
          </div>
        </div>

      </div>
        </div>
    </div>
  );
};
