import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  Instagram, 
  BookOpen, 
  Truck
} from 'lucide-react';
import { useCart, AppNavTab } from '../context/CartContext';
import { ProductGrid } from './ProductGrid';
import { TikTokShowcase } from './TikTokShowcase';
import { InstagramShowcase } from './InstagramShowcase';
import { AboutCraftSection } from './AboutCraftSection';
import { OrderTrackerSection } from './OrderTrackerSection';

interface TabMeta {
  id: AppNavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
  </svg>
);

// Exact sequential order: Shop -> As Seen On TikTok -> Instagram Journal -> Our Craft & Story -> Track Order
export const TABS_SEQUENCE: TabMeta[] = [
  { id: 'home', label: 'Shop', icon: Home },
  { id: 'tiktok', label: 'As Seen On TikTok', icon: TikTokIcon },
  { id: 'journal', label: 'Instagram Journal', icon: Instagram },
  { id: 'craft', label: 'Our Craft & Story', icon: BookOpen },
  { id: 'track', label: 'Track Order', icon: Truck },
];

export const MainSwipeDeck: React.FC = () => {
  const { 
    activeNavTab, 
    setActiveNavTab,
    quickViewProduct,
    isCartOpen,
    isWishlistOpen,
    isCheckoutOpen,
    isTrackerOpen
  } = useCart();

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const deckRef = useRef<HTMLDivElement>(null);

  const activeIndex = TABS_SEQUENCE.findIndex((t) => t.id === activeNavTab);
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;

  // When activeNavTab changes, smoothly scroll window to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeNavTab]);

  const handlePrevTab = () => {
    const nextIdx = (safeIndex - 1 + TABS_SEQUENCE.length) % TABS_SEQUENCE.length;
    setActiveNavTab(TABS_SEQUENCE[nextIdx].id);
  };

  const handleNextTab = () => {
    const nextIdx = (safeIndex + 1) % TABS_SEQUENCE.length;
    setActiveNavTab(TABS_SEQUENCE[nextIdx].id);
  };

  const prevTabLabel = TABS_SEQUENCE[(safeIndex - 1 + TABS_SEQUENCE.length) % TABS_SEQUENCE.length].label;
  const nextTabLabel = TABS_SEQUENCE[(safeIndex + 1) % TABS_SEQUENCE.length].label;

  // Keyboard navigation when no modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName) ||
        quickViewProduct ||
        isCartOpen ||
        isWishlistOpen ||
        isCheckoutOpen ||
        isTrackerOpen
      ) {
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextTab();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevTab();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [safeIndex, quickViewProduct, isCartOpen, isWishlistOpen, isCheckoutOpen, isTrackerOpen]);

  // Touch Swipe Handlers (Mobile / Tablets)
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // If dragged right-to-left by > 50px -> advance to next tab (swipes right)
    if (dragOffset < -50 && safeIndex < TABS_SEQUENCE.length - 1) {
      setActiveNavTab(TABS_SEQUENCE[safeIndex + 1].id);
    }
    // If dragged left-to-right by > 50px -> retreat to previous tab (swipes left)
    else if (dragOffset > 50 && safeIndex > 0) {
      setActiveNavTab(TABS_SEQUENCE[safeIndex - 1].id);
    }
    setDragOffset(0);
  };

  // Mouse Drag Handlers (Desktop click & drag)
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Don't drag when interacting with forms, buttons, inputs, links, or select
    if (
      target.closest('button') || 
      target.closest('a') || 
      target.closest('input') || 
      target.closest('select') || 
      target.closest('textarea') ||
      target.closest('.no-drag')
    ) {
      return;
    }
    setIsDragging(true);
    setStartX(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset < -60 && safeIndex < TABS_SEQUENCE.length - 1) {
      setActiveNavTab(TABS_SEQUENCE[safeIndex + 1].id);
    } else if (dragOffset > 60 && safeIndex > 0) {
      setActiveNavTab(TABS_SEQUENCE[safeIndex - 1].id);
    }
    setDragOffset(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragOffset(0);
    }
  };

  // Base translation percentage for 6 screens (100% / 6 = 16.666667% each)
  const screenPercent = 100 / TABS_SEQUENCE.length;
  const baseTranslate = -(safeIndex * screenPercent);

  return (
    <div 
      ref={deckRef}
      className="relative w-full overflow-hidden min-h-screen bg-[#FAF8F5]"
    >
      {/* SWIPEABLE 6-SCREEN TRACK */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full overflow-hidden relative cursor-default"
      >
        <div
          className={`flex w-[500%] will-change-transform ${
            isDragging ? 'transition-none' : 'transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]'
          }`}
          style={{
            transform: `translateX(calc(${baseTranslate}% + ${dragOffset}px))`
          }}
        >
          {/* TAB 0: HOME (Product Grid with category & sort dropdowns + Testimonials + Care Guide) */}
          <div className="w-[20%] shrink-0">
            <div className="w-full">
              <ProductGrid />
            </div>
          </div>

          {/* TAB 1: AS SEEN ON TIKTOK */}
          <div className="w-[20%] shrink-0">
            <div className="w-full">
              <TikTokShowcase />
            </div>
          </div>

          {/* TAB 2: INSTAGRAM JOURNAL */}
          <div className="w-[20%] shrink-0">
            <div className="w-full">
              <InstagramShowcase />
            </div>
          </div>

          {/* TAB 3: OUR CRAFT & STORY */}
          <div className="w-[20%] shrink-0">
            <div className="w-full">
              <AboutCraftSection />
            </div>
          </div>

          {/* TAB 4: TRACK ORDER */}
          <div className="w-[20%] shrink-0">
            <div className="w-full">
              <OrderTrackerSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
