import React from 'react';
import { ShoppingBag, Heart, Sparkles, Truck, Compass } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const MobileBottomBar: React.FC = () => {
  const { 
    cartCount, 
    setIsCartOpen, 
    wishlist, 
    setIsWishlistOpen, 
    setSelectedCategory,
    openTracker
  } = useCart();

  const scrollToShop = () => {
    setSelectedCategory('all');
    const el = document.getElementById('shop-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E8DFD8] lg:hidden shadow-[0_-4px_20px_rgba(28,27,26,0.06)] px-3 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Explore Shop */}
        <button
          type="button"
          onClick={scrollToShop}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-[#5E5955] hover:text-[#1C1B1A]"
        >
          <Compass className="w-5 h-5 text-[#1C1B1A]" />
          <span className="text-[10px] font-medium tracking-wider uppercase mt-0.5">Explore</span>
        </button>

        {/* Live Order Tracker */}
        <button
          type="button"
          onClick={() => openTracker()}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-[#5E5955] hover:text-[#C5A880]"
        >
          <Truck className="w-5 h-5 text-[#C5A880]" />
          <span className="text-[10px] font-medium tracking-wider uppercase mt-0.5">Track</span>
        </button>

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => setIsWishlistOpen(true)}
          className="relative flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-[#5E5955] hover:text-[#1C1B1A]"
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-[#1C1B1A]'}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-wider uppercase mt-0.5">Wishlist</span>
        </button>

        {/* Shopping Bag */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-[#1C1B1A]"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-[#1C1B1A]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#C5A880] text-[#1C1B1A] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase mt-0.5">Bag ({cartCount})</span>
        </button>

      </div>
    </div>
  );
};
