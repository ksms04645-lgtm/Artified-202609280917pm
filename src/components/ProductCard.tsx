import React, { useState, useEffect } from 'react';
import { Heart, Eye, ShoppingBag, Check, Star, Edit3 } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { calculateTotalSold, isProductBestSeller, calculateReviewsCount } from '../utils/productStats';

interface ProductCardProps {
  product: Product;
  isSelected?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isSelected = false }) => {
  const { 
    addToCart, 
    toggleWishlist, 
    isWishlisted, 
    setQuickViewProduct,
    isSellerMode,
    openProductEditor,
    toggleProductNewArrival,
    productImageFit,
    bestsellerThreshold
  } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const totalSold = calculateTotalSold(product);
  const isBestSeller = isProductBestSeller(product, bestsellerThreshold);
  const dynamicReviewsCount = calculateReviewsCount(product);

  const wishlisted = isWishlisted(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const fallbackByCategory: Record<string, string> = {
    'pearl-bags': 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=80',
    'pearl-necklaces': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
    'macrame': 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80',
    'accessories': 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=900&q=80',
    'custom-beaded': 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80',
  };

  const defaultFallback = fallbackByCategory[product.category] || 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=80';

  const rawPrimary = (product.images && product.images[0] && product.images[0].trim() && !product.images[0].startsWith('/uploads/')) 
    ? product.images[0].trim() 
    : defaultFallback;

  const rawSecondary = (product.images && product.images[1] && product.images[1].trim() && !product.images[1].startsWith('/uploads/')) 
    ? product.images[1].trim() 
    : rawPrimary;

  const [currentImg, setCurrentImg] = useState(rawPrimary);
  const [currentSecImg, setCurrentSecImg] = useState(rawSecondary);

  useEffect(() => {
    setCurrentImg(rawPrimary);
    setCurrentSecImg(rawSecondary);
  }, [rawPrimary, rawSecondary]);

  const displayOriginalPrice = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice
    : Math.round((product.price * 1.2) / 50) * 50;

  const discountPercent = Math.max(5, Math.round(((displayOriginalPrice - product.price) / displayOriginalPrice) * 100));

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => setQuickViewProduct(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white rounded-lg overflow-hidden border border-[#E5E7EB] hover:border-[#C5A880] transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer z-0"
    >
      {/* Image Container with secondary flip - 4:3 Compact Aspect Ratio */}
      <div className="relative aspect-[4/3] max-h-[155px] sm:max-h-[175px] bg-[#F9FAFB] overflow-hidden">
        {/* Badges - positioned strictly in front of product photo */}
        <div className="absolute top-1.5 left-1.5 z-30 flex flex-col gap-1 items-start pointer-events-none">
          {isBestSeller && (
            <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold tracking-wider uppercase bg-[#1C1B1A]/95 text-[#E6C687] border border-[#C5A880]/40 shadow-xs flex items-center gap-0.5">
              <span>★</span> Bestseller
            </span>
          )}
          {product.isNewArrival && !isBestSeller && !isSellerMode && (
            <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold tracking-wider uppercase bg-[#C5A880] text-white shadow-xs flex items-center gap-0.5">
              <span>✦</span> New
            </span>
          )}

          {/* Seller Mode Quick Controls */}
          {isSellerMode && (
            <div className="flex items-center gap-1 pointer-events-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleProductNewArrival(product.id);
                }}
                className={`px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold tracking-wider uppercase shadow-xs flex items-center gap-0.5 transition-all cursor-pointer ${
                  product.isNewArrival 
                    ? 'bg-[#C5A880] text-white hover:bg-[#A3865E]' 
                    : 'bg-white/95 text-[#736C65] border border-gray-300 hover:border-[#C5A880] hover:text-[#C5A880]'
                }`}
                title={product.isNewArrival ? "Click to unselect New Arrival" : "Click to select as New Arrival"}
              >
                <span>✦</span>
                <span>{product.isNewArrival ? 'New' : '+ New'}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openProductEditor(product);
                }}
                className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold tracking-wider uppercase bg-[#1C1B1A] text-[#D4AF37] border border-[#C5A880] shadow-sm flex items-center gap-0.5 hover:bg-[#34312F] transition-all cursor-pointer"
                title="Edit piece"
              >
                <Edit3 className="w-2.5 h-2.5 text-[#D4AF37]" />
                <span>Edit</span>
              </button>
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className={`absolute top-1.5 right-1.5 z-30 w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full flex items-center justify-center transition-all duration-150 ${
            wishlisted
              ? 'bg-rose-50 text-rose-500 shadow-2xs'
              : 'bg-white/90 backdrop-blur-2xs text-[#736C65] hover:text-[#1C1B1A] hover:bg-white shadow-2xs'
          }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3 h-3 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Ambient background blur when in 'contain' mode so portrait photos blend seamlessly without harsh cutoffs */}
        {productImageFit === 'contain' && (
          <img
            src={currentImg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover blur-md scale-125 opacity-20 pointer-events-none"
          />
        )}

        {/* Primary and secondary hover image - contain mode guarantees 100% of product is visible */}
        <img
          src={currentImg}
          alt={product.title}
          onError={() => {
            if (currentImg !== defaultFallback) {
              setCurrentImg(defaultFallback);
            }
          }}
          className={`relative z-0 w-full h-full transition-all duration-300 ${
            productImageFit === 'contain'
              ? 'object-contain object-center p-0.5'
              : 'object-cover object-center'
          } ${
            isHovered && currentSecImg !== currentImg
              ? 'opacity-0 scale-102'
              : 'opacity-100 scale-100'
          }`}
          loading="lazy"
        />
        {currentSecImg && currentSecImg !== currentImg && (
          <img
            src={currentSecImg}
            alt={`${product.title} alternate view`}
            onError={() => setCurrentSecImg(currentImg)}
            className={`absolute inset-0 z-0 w-full h-full transition-all duration-300 ${
              productImageFit === 'contain'
                ? 'object-contain object-center p-0.5'
                : 'object-cover object-center'
            } ${
              isHovered ? 'opacity-100 scale-102' : 'opacity-0 scale-100'
            }`}
            loading="lazy"
          />
        )}
      </div>

      {/* Product Details - Modeled directly on high-density reference style */}
      <div className="p-1.5 sm:p-2 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Title - Clean single line */}
          <h3 className="text-[11px] sm:text-xs font-normal text-[#1C1B1A] leading-tight line-clamp-1 group-hover:text-[#C5A880] transition-colors">
            {product.title}
          </h3>

          {/* Rating stars & review count row */}
          <div className="flex items-center gap-1 my-0.5">
            <div className="flex items-center text-teal-600">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 ${star <= Math.round(product.rating || 5) ? 'fill-current' : 'text-zinc-300'}`}
                />
              ))}
            </div>
            <span className="text-[9px] sm:text-[10px] text-[#736C65]">
              ({dynamicReviewsCount})
            </span>
          </div>
        </div>

        {/* Pricing & Add block */}
        <div className="mt-0.5 pt-0.5 border-t border-[#F3F4F6]">
          {/* Strikethrough price */}
          <div className="text-[9px] sm:text-[10px] text-[#8C847E] line-through leading-none">
            NPR{displayOriginalPrice.toLocaleString()}.00
          </div>

          {/* Current bold price + Add to bag icon button */}
          <div className="flex items-center justify-between gap-1 mt-0.5">
            <span className="text-xs sm:text-[13px] font-bold text-[#1C1B1A] tracking-tight leading-tight">
              NPR{product.price.toLocaleString()}.00
            </span>

            <button
              type="button"
              onClick={handleQuickAdd}
              className={`p-1 rounded-md transition-all shrink-0 ${
                justAdded
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#1C1B1A] border border-[#E8DFD8] hover:bg-[#1C1B1A] hover:text-white'
              }`}
              title="Add to bag"
              aria-label={`Add ${product.title} to bag`}
            >
              {justAdded ? (
                <Check className="w-3 h-3" />
              ) : (
                <ShoppingBag className="w-3 h-3" />
              )}
            </button>
          </div>

          {/* Green discount percentage badge */}
          <div className="text-[9px] sm:text-[10px] font-bold text-emerald-600 leading-none mt-0.5">
            {discountPercent}% OFF
          </div>

          {/* Number of products sold below % off */}
          <div className="text-[9px] sm:text-[10px] text-[#736C65] font-medium leading-none mt-1">
            {totalSold} sold
          </div>
        </div>
      </div>
    </div>
  );
};
