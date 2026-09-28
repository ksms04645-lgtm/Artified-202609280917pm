import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const WishlistDrawer: React.FC = () => {
  const {
    products,
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart,
    setQuickViewProduct
  } = useCart();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveToCart = (product: any) => {
    addToCart(product, 1);
    toggleWishlist(product.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1C1B1A]/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl z-10 flex flex-col justify-between border-l border-[#E8DFD8]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-white border-b border-[#E8DFD8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="font-serif text-lg font-semibold tracking-wide text-[#1C1B1A]">
              Saved Wishlist
            </h2>
            <span className="text-xs bg-[#FAF8F5] text-[#8C7A6B] px-2 py-0.5 rounded-full border border-[#E8DFD8]">
              {wishlistedProducts.length} pieces
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 rounded-full text-[#8C847E] hover:text-[#1C1B1A] hover:bg-[#FAF8F5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-1 space-y-4">
          {wishlistedProducts.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-white border border-[#E8DFD8] flex items-center justify-center mx-auto mb-4 text-[#C5A880]">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg text-[#1C1B1A] font-medium mb-1">
                Your wishlist is empty
              </h3>
              <p className="text-xs text-[#736C65] max-w-xs mx-auto mb-6">
                Tap the heart on any pearl bag, choker, or macrame design to save your favorites here.
              </p>
              <button
                type="button"
                onClick={() => setIsWishlistOpen(false)}
                className="px-6 py-2.5 bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#34312F] transition-colors"
              >
                Browse Creations
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {wishlistedProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-3.5 bg-white rounded-xl border border-[#E8DFD8] flex gap-3.5 shadow-2xs"
                >
                  <div 
                    onClick={() => {
                      setIsWishlistOpen(false);
                      setQuickViewProduct(product);
                    }}
                    className="w-20 h-24 rounded-lg overflow-hidden bg-[#FAF8F5] shrink-0 border border-[#F0EBE5] cursor-pointer"
                  >
                    <img
                      src={product.images[0]?.trim() || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80'}
                      alt={product.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80';
                      }}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 
                          onClick={() => {
                            setIsWishlistOpen(false);
                            setQuickViewProduct(product);
                          }}
                          className="font-serif text-sm font-medium text-[#1C1B1A] leading-snug line-clamp-1 cursor-pointer hover:text-[#C5A880]"
                        >
                          {product.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product.id)}
                          className="text-[#A69E96] hover:text-rose-500 p-0.5 transition-colors"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs font-semibold text-[#1C1B1A] mt-0.5">
                        Rs. {product.price.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-[#8C7A6B] capitalize">
                        {product.category.replace('-', ' ')}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#F0EBE5]">
                      <button
                        type="button"
                        onClick={() => handleMoveToCart(product)}
                        className="w-full py-1.5 px-3 bg-[#1C1B1A] text-white rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#34312F] transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlistedProducts.length > 0 && (
          <div className="p-4 bg-white border-t border-[#E8DFD8]">
            <button
              type="button"
              onClick={() => {
                wishlistedProducts.forEach((p) => addToCart(p, 1));
                setIsWishlistOpen(false);
              }}
              className="w-full py-3 bg-[#1C1B1A] text-white rounded-xl text-xs font-semibold tracking-wider uppercase hover:bg-[#34312F] transition-all flex items-center justify-center gap-2"
            >
              <span>Move All to Bag</span>
              <ArrowRight className="w-4 h-4 text-[#C5A880]" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
