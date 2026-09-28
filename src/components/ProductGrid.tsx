import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  ChevronRight,
  SearchX, 
  Star, 
  CheckCircle2, 
  MapPin, 
  RotateCcw, 
  MessageSquare, 
  Send, 
  Quote, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useCart } from '../context/CartContext';
import { TESTIMONIALS } from '../data/products';
import { Testimonial } from '../types';
import { isProductBestSeller, sanitizeReviewItem } from '../utils/productStats';

type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'featured', label: 'Sort by' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price (low to high)' },
  { id: 'price-desc', label: 'Price (high to low)' },
  { id: 'name-asc', label: 'Name A-Z' },
  { id: 'name-desc', label: 'Name Z-A' },
];

export const ProductGrid: React.FC = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    products,
    productImageFit,
    setProductImageFit,
    bestsellerThreshold,
    quickViewProduct,
    setQuickViewProduct,
    isSellerMode,
    openReviewsManager
  } = useCart();

  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Customer Reviews state at bottom of product catalog
  const [reviewsList, setReviewsList] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem('artified_grid_reviews_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.map(sanitizeReviewItem);
      }
    } catch {}
    return TESTIMONIALS.map(sanitizeReviewItem);
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewLocation, setReviewLocation] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewProduct, setReviewProduct] = useState('Handcrafted Pearl Bag');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    const newRev: Testimonial = {
      id: `rev-${Date.now()}`,
      author: reviewAuthor.trim(),
      location: reviewLocation.trim() || 'Kathmandu, Nepal',
      rating: reviewRating,
      comment: reviewComment.trim(),
      productName: reviewProduct.trim() || 'Handcrafted Pearl Piece',
      date: 'Just now',
      verifiedPurchase: true
    };

    const updated = [newRev, ...reviewsList];
    setReviewsList(updated);
    try {
      localStorage.setItem('artified_grid_reviews_v2', JSON.stringify(updated));
    } catch {}

    setReviewSubmitted(true);
    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSubmitted(false);
      setReviewAuthor('');
      setReviewLocation('');
      setReviewComment('');
    }, 1800);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = [
    { id: 'all', label: 'All Creations' },
    { id: 'pearl-bags', label: 'Pearl Bags' },
    { id: 'pearl-necklaces', label: 'Pearl Necklaces' },
    { id: 'macrame', label: 'Macrame' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'new-arrivals', label: 'New Arrivals', isSpecial: true },
    { id: 'best-sellers', label: 'Best Sellers', isSpecial: true },
  ];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.materials.some((m) => m.toLowerCase().includes(q))
      );
    }

    // Filter by category
    if (selectedCategory === 'pearl-bags') {
      result = result.filter((p) => p.category === 'pearl-bags');
    } else if (selectedCategory === 'pearl-necklaces') {
      result = result.filter((p) => p.category === 'pearl-necklaces');
    } else if (selectedCategory === 'macrame') {
      result = result.filter((p) => p.category === 'macrame');
    } else if (selectedCategory === 'accessories') {
      result = result.filter((p) => p.category === 'accessories');
    } else if (selectedCategory === 'new-arrivals') {
      result = result.filter((p) => p.isNewArrival);
    } else if (selectedCategory === 'best-sellers') {
      result = result.filter((p) => p.isBestSeller || isProductBestSeller(p, bestsellerThreshold));
    }

    // Sort by requested options
    if (sortBy === 'newest') {
      result.sort((a, b) => {
        if (a.isNewArrival === b.isNewArrival) return 0;
        return a.isNewArrival ? -1 : 1;
      });
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.title.localeCompare(a.title));
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy, bestsellerThreshold]);

  const currentSortLabel = SORT_OPTIONS.find((opt) => opt.id === sortBy)?.label || 'Sort by';
  const currentCategoryLabel = 
    categories.find((cat) => cat.id === selectedCategory)?.label || 'All Creations';

  return (
    <section id="shop-section" className="pt-1 sm:pt-2 pb-10 sm:pb-14 px-2.5 sm:px-4 lg:px-6 max-w-[1440px] mx-auto">
      {/* Category Dropdown, Select Product Navigation (with green arrows), & Sort Bar - In ONE SINGLE LINE */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2.5 mb-2 sm:mb-2.5 relative z-50 flex-nowrap w-full">
        {/* Category Dropdown (All Creations, Pearl Bags, Pearl Necklaces, Macrame, Accessories, New Arrivals, Best Sellers) */}
        <div ref={categoryDropdownRef} className="relative z-[60] shrink-0">
          <button
            type="button"
            onClick={() => {
              setIsCategoryOpen(!isCategoryOpen);
              setIsSortOpen(false);
            }}
            className="flex items-center justify-between gap-1.5 sm:gap-2.5 bg-white border border-[#D1D5DB] rounded-md px-2.5 sm:px-3 py-1.5 text-xs text-[#111827] min-w-[125px] sm:min-w-[170px] shadow-2xs hover:border-[#9CA3AF] focus:outline-none transition-colors"
          >
            <span className="font-normal flex items-center gap-1.5 truncate">
              {selectedCategory === 'new-arrivals' && <Sparkles className="w-3.5 h-3.5 text-[#C5A880] fill-[#C5A880] shrink-0" />}
              {selectedCategory === 'best-sellers' && <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37] shrink-0" />}
              <span>{currentCategoryLabel}</span>
            </span>
            {isCategoryOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-[#374151] shrink-0" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-[#374151] shrink-0" />
            )}
          </button>

          {isCategoryOpen && (
            <div className="absolute left-0 mt-1 w-full min-w-[210px] bg-white border border-[#D1D5DB] rounded-md shadow-2xl py-1.5 z-[100] animate-fade-in">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const isDividerBefore = cat.id === 'new-arrivals';
                return (
                  <React.Fragment key={cat.id}>
                    {isDividerBefore && (
                      <div className="my-1.5 border-t border-[#E5E7EB]">
                        <span className="block px-3.5 pt-1.5 pb-0.5 text-[9px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                          Featured Collections
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setIsCategoryOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#E5E5E5] text-[#111827] font-semibold'
                          : cat.isSpecial
                          ? 'text-[#8A6224] hover:bg-[#FAF3E8] font-medium'
                          : 'text-[#374151] hover:bg-[#F3F4F6]'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {cat.id === 'new-arrivals' && <Sparkles className="w-3.5 h-3.5 text-[#C5A880] fill-[#C5A880]" />}
                        {cat.id === 'best-sellers' && <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />}
                        <span>{cat.label}</span>
                      </span>
                      {isSelected && (
                        <span className="text-[11px] text-[#111827] font-bold">✓</span>
                      )}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>

        {/* Custom Sort Dropdown */}
        <div ref={sortDropdownRef} className="relative shrink-0 z-[60]">
          <button
            type="button"
            onClick={() => {
              setIsSortOpen(!isSortOpen);
              setIsCategoryOpen(false);
            }}
            className="flex items-center justify-between gap-1.5 sm:gap-2.5 bg-white border border-[#D1D5DB] rounded-md px-2.5 sm:px-3 py-1.5 text-xs text-[#111827] min-w-[115px] sm:min-w-[155px] shadow-2xs hover:border-[#9CA3AF] focus:outline-none transition-colors"
          >
            <span className="font-normal">{currentSortLabel}</span>
            {isSortOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-[#374151] shrink-0" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-[#374151] shrink-0" />
            )}
          </button>

          {isSortOpen && (
            <div className="absolute right-0 mt-1 w-full min-w-[185px] bg-white border border-[#D1D5DB] rounded-md shadow-2xl py-1 z-[100] animate-fade-in">
              {SORT_OPTIONS.map((option) => {
                const isSelected = sortBy === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setSortBy(option.id);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm transition-colors block ${
                      isSelected
                        ? 'bg-[#E5E5E5] text-[#111827] font-medium'
                        : 'text-[#374151] hover:bg-[#F3F4F6]'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Active Search Filter Badge */}
      {searchQuery && (
        <div className="mb-6 flex items-center justify-between bg-white border border-[#E8DFD8] p-3 rounded-lg text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#736C65]">Filtered by:</span>
            <span className="font-semibold text-[#1C1B1A]">"{searchQuery}"</span>
            <span className="text-[#8C7A6B]">({filteredProducts.length} pieces found)</span>
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-[#C5A880] hover:text-[#1C1B1A] font-semibold underline"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Product Grid - 5 columns on desktop, 10 items fully visible in viewport */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5 lg:gap-3 relative z-0 isolate">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-[#E8DFD8] max-w-lg mx-auto">
          <SearchX className="w-12 h-12 text-[#C5A880] mx-auto mb-4" />
          <h3 className="font-serif text-xl text-[#1C1B1A] font-medium mb-1">
            No handcrafted pieces matched
          </h3>
          <p className="text-xs text-[#736C65] mb-6">
            We couldn't find any products matching your selection. Feel free to message our store in Chikamugal, Kathmandu on WhatsApp or explore our full collection.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 bg-[#FAF8F5] border border-[#E8DFD8] text-xs font-semibold uppercase tracking-wider text-[#1C1B1A] rounded-full hover:bg-white"
            >
              Reset Filters
            </button>
            <a
              href="https://wa.me/9779767573721?text=Namaste!%20I%20am%20looking%20for%20a%20handcrafted%20piece%20from%20Chikamugal,%20Kathmandu."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#34312F] inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Ask Chikamugal Store</span>
            </a>
          </div>
        </div>
      )}

      {/* ========================================================
          CUSTOMER REVIEWS SECTION - Placed directly at the bottom 
          of the product catalog shown in the photo
          ======================================================== */}
      <div className="mt-12 sm:mt-16 pt-8 border-t border-[#E8DFD8]">
        {/* Reassurance Badges Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-8">
          <div className="p-3 bg-white rounded-xl border border-[#E8DFD8] shadow-2xs flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E8DFD8] text-[#C5A880] flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] uppercase tracking-wider text-[#736C65] font-semibold">Store Location</span>
              <span className="block text-xs font-bold text-[#1C1B1A] truncate">Chikamugal, Kathmandu</span>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-emerald-200/80 shadow-2xs flex items-center gap-2.5 bg-emerald-50/30">
            <div className="w-8 h-8 rounded-lg bg-emerald-100/70 border border-emerald-300 text-emerald-700 flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] uppercase tracking-wider text-emerald-700 font-bold">Exchange Guarantee</span>
              <span className="block text-xs font-bold text-emerald-900 truncate">Easy exchange within 24 hrs</span>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#E8DFD8] shadow-2xs flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E8DFD8] text-amber-500 flex items-center justify-center shrink-0">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] uppercase tracking-wider text-[#736C65] font-semibold">Patron Rating</span>
              <span className="block text-xs font-bold text-[#1C1B1A] truncate">4.9 / 5.0 (1,200+ Delivered)</span>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#E8DFD8] shadow-2xs flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E8DFD8] text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] uppercase tracking-wider text-[#736C65] font-semibold">Nepal Dispatch</span>
              <span className="block text-xs font-bold text-[#1C1B1A] truncate">Fast Valley & All-Nepal</span>
            </div>
          </div>
        </div>

        {/* Section Header with 'Write a Review' Button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C7A6B] mb-1">
              <Quote className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Voices of Artified Patrons</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1B1A] font-semibold">
              Loved Across Nepal • Customer Reviews
            </h2>
            <p className="text-xs text-[#736C65] mt-1 max-w-xl">
              Handcrafted with pride at our store in <strong>Chikamugal, Kathmandu</strong>. Every delivery includes an authentic artisan check with our <strong>easy exchange within 24 hrs</strong> policy.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {isSellerMode && (
              <button
                type="button"
                onClick={() => openReviewsManager(null)}
                className="px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                title="Manage and edit all customer reviews with Seller Studio"
              >
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Seller Studio Reviews</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2.5 bg-[#1C1B1A] hover:bg-[#34312F] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors self-start sm:self-auto shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{showReviewForm ? 'Close Review Form' : 'Write a Review'}</span>
            </button>
          </div>
        </div>

        {/* Inline Review Submission Form */}
        {showReviewForm && (
          <form onSubmit={handleAddReview} className="mb-8 p-5 bg-white rounded-2xl border border-[#C5A880]/50 shadow-sm space-y-4 animate-fade-in max-w-2xl">
            <div className="flex items-center justify-between border-b border-[#F0EBE5] pb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1B1A]">
                Review Your Handcrafted Piece
              </h4>
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-[#736C65] mr-1">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-0.5 focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= reviewRating
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
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
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
                  value={reviewLocation}
                  onChange={(e) => setReviewLocation(e.target.value)}
                  placeholder="e.g. Chikamugal, Kathmandu / Pokhara"
                  className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E8DFD8] rounded-lg focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1B1A] mb-1">
                Product Purchased
              </label>
              <input
                type="text"
                value={reviewProduct}
                onChange={(e) => setReviewProduct(e.target.value)}
                placeholder="e.g. Maya Aurelia Pearl Bag"
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E8DFD8] rounded-lg focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1B1A] mb-1">
                Your Review & Experience *
              </label>
              <textarea
                required
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Tell others about the bead shine, craftsmanship, delivery from Chikamugal, and easy exchange reassurance..."
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E8DFD8] rounded-lg focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-[#736C65]">
                📍 Delivered from Chikamugal, Kathmandu • 24h easy exchange
              </span>
              <button
                type="submit"
                className="px-4 py-2 bg-[#C5A880] hover:bg-[#b5966a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{reviewSubmitted ? 'Review Published!' : 'Submit Review'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Customer Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {reviewsList.map((rev) => (
            <div
              key={rev.id}
              className="p-4 bg-white rounded-xl border border-[#E8DFD8] shadow-2xs hover:border-[#C5A880]/70 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= Math.round(rev.rating) ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#A69E96]">{rev.date}</span>
                </div>

                <p className="text-xs text-[#3E3A36] leading-relaxed mb-3">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-2.5 border-t border-[#F5F2ED] flex items-center justify-between text-[11px]">
                <div className="min-w-0 pr-2">
                  <span className="font-semibold text-[#1C1B1A] block truncate">{rev.author}</span>
                  <span className="text-[10px] text-[#8C7A6B] block truncate leading-tight mt-0.5">{rev.location}</span>
                  <span className="text-[9px] text-[#C5A880] font-medium block truncate mt-0.5">
                    {rev.productName}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isSellerMode && (
                    <button
                      type="button"
                      onClick={() => openReviewsManager(null)}
                      className="px-2 py-0.5 text-[10px] font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded shadow-2xs transition-colors cursor-pointer"
                      title="Edit this review in Seller Studio"
                    >
                      Edit
                    </button>
                  )}
                  {rev.verifiedPurchase && (
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded shrink-0">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Storefront Reassurance Note */}
        <div className="mt-5 p-3.5 bg-white/80 rounded-xl border border-[#E8DFD8] flex items-center justify-between text-xs text-[#5E5955] flex-wrap gap-2.5">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            <span>Store: <strong>Chikamugal, Kathmandu, Nepal</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-emerald-600" />
            <span><strong>Easy exchange within 24 hrs</strong> of delivery across Nepal</span>
          </div>
        </div>
      </div>
    </section>
  );
};
