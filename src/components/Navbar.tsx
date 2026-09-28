import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  Sparkles, 
  MessageCircle, 
  ChevronRight,
  ChevronDown,
  Truck,
  Instagram
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { NavbarSearch } from './NavbarSearch';

interface NavbarProps {
  onOpenSearch?: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateSection }) => {
  const { 
    cartCount, 
    setIsCartOpen, 
    wishlist, 
    setIsWishlistOpen,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    openTracker,
    setActiveSocialTab,
    activeNavTab,
    setActiveNavTab
  } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Shortcut key '/' to trigger search instantly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (category?: string, sectionId = 'shop-section') => {
    if (category) {
      setSelectedCategory(category);
    }
    setMobileMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openWhatsApp = () => {
    const phone = '9779767573721';
    const text = encodeURIComponent('Namaste Artified_np! ✨ I am browsing your online catalog and would like to ask about a custom handcrafted piece.');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <>
      <header
        className={`sticky top-0 z-30 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-[0_4px_24px_rgba(28,27,26,0.05)] border-b border-[#E8DFD8]'
            : 'bg-[#FAF8F5] border-b border-[#F0EBE5]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left: Mobile Menu Toggle & Search */}
            <div className="flex items-center gap-2 sm:gap-3 lg:w-1/4">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-[#1C1B1A] hover:text-[#C5A880] transition-colors focus:outline-none"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Mobile Search Icon Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="sm:hidden p-2 text-[#1C1B1A] hover:text-[#C5A880] transition-colors relative"
                aria-label="Search catalog"
              >
                <Search className="w-5 h-5" />
                {searchQuery && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C5A880]" />
                )}
              </button>

              {/* Desktop / Tablet Search Trigger Pill */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 text-xs text-[#5E5955] hover:text-[#1C1B1A] transition-all py-1.5 px-3 rounded-full border border-[#E8DFD8] bg-white/80 hover:border-[#C5A880] hover:bg-white shadow-2xs group"
              >
                <Search className="w-3.5 h-3.5 text-[#C5A880] group-hover:scale-110 transition-transform" />
                <span className="tracking-wide text-[11px]">
                  {searchQuery ? (
                    <span className="font-semibold text-[#1C1B1A] flex items-center gap-1">
                      <span>&ldquo;{searchQuery}&rdquo;</span>
                      <span className="text-[10px] bg-[#FAF8F5] border border-[#E8DFD8] px-1.5 py-0.2 rounded text-[#8C7A6B]">
                        Filtered
                      </span>
                    </span>
                  ) : (
                    <span>Search pearls, bags...</span>
                  )}
                </span>
                <kbd className="hidden md:inline-block ml-2 px-1.5 py-0.5 text-[9px] font-mono text-[#8C7A6B] bg-[#FAF8F5] border border-[#E8DFD8] rounded">
                  /
                </kbd>
              </button>
            </div>

            {/* Center: Brand Identity */}
            <div className="flex-1 text-center lg:w-2/4">
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-block group"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span className="font-serif tracking-[0.25em] text-xl sm:text-2xl text-[#1C1B1A] font-semibold uppercase group-hover:text-[#C5A880] transition-colors leading-tight">
                    Artified_np
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-0">
                  <span className="h-[1px] w-3 bg-[#C5A880]/60"></span>
                  <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#736C65] font-medium">
                    Handcrafted Elegance • Nepal
                  </span>
                  <span className="h-[1px] w-3 bg-[#C5A880]/60"></span>
                </div>
              </a>
            </div>

            {/* Right: Actions (Wishlist, Cart, WhatsApp) */}
            <div className="flex items-center justify-end gap-2 sm:gap-4 lg:w-1/4">
              {/* WhatsApp direct chat button */}
              <button
                type="button"
                onClick={openWhatsApp}
                title="Chat with Artified on WhatsApp"
                className="hidden md:flex items-center gap-1.5 text-xs text-[#1C1B1A] hover:text-[#075E54] py-1 px-2.5 rounded-full border border-[#E8DFD8] bg-white/60 hover:border-[#25D366] transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span className="font-medium text-[11px] tracking-wide">DM WhatsApp</span>
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => setIsWishlistOpen(true)}
                className="relative p-1.5 text-[#1C1B1A] hover:text-[#C5A880] transition-colors"
                aria-label={`Wishlist (${wishlist.length} items)`}
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${wishlist.length > 0 ? 'fill-[#C5A880] text-[#C5A880]' : ''}`} />
                {wishlist.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-[#1C1B1A] text-[#FAF8F5] text-[9px] font-semibold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Shopping Bag Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-1.5 text-[#1C1B1A] hover:text-[#C5A880] transition-colors flex items-center gap-1.5"
                aria-label={`Shopping bag (${cartCount} items)`}
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#C5A880] text-[#1C1B1A] text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden xl:inline text-xs font-medium tracking-wider uppercase text-[#1C1B1A]">
                  Bag ({cartCount})
                </span>
              </button>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center gap-6 sm:gap-8 py-1.5 sm:py-2 border-t border-[#E8DFD8]/60 text-[11px] sm:text-xs font-medium tracking-[0.12em] uppercase text-[#4A4541]">
            {/* Tab 0: Shop */}
            <button
              type="button"
              onClick={() => {
                setActiveNavTab('home');
                setSelectedCategory('all');
                setSearchQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`hover:text-[#1C1B1A] transition-colors pb-1 border-b-2 cursor-pointer ${
                activeNavTab === 'home'
                  ? 'border-[#C5A880] text-[#1C1B1A] font-semibold'
                  : 'border-transparent text-[#5E5955]'
              }`}
            >
              Shop
            </button>

            {/* Tab 1: As Seen On TikTok */}
            <button
              type="button"
              onClick={() => {
                setActiveNavTab('tiktok');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`hover:text-[#1C1B1A] transition-colors flex items-center gap-1.5 pb-1 border-b-2 cursor-pointer ${
                activeNavTab === 'tiktok'
                  ? 'border-[#C5A880] text-[#1C1B1A] font-semibold'
                  : 'border-transparent text-[#5E5955]'
              }`}
            >
              <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
              </svg>
              <span>As Seen On TikTok</span>
            </button>

            {/* Tab 2: Instagram Journal */}
            <button
              type="button"
              onClick={() => {
                setActiveNavTab('journal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`hover:text-[#1C1B1A] transition-colors flex items-center gap-1.5 pb-1 border-b-2 cursor-pointer ${
                activeNavTab === 'journal'
                  ? 'border-[#C5A880] text-[#1C1B1A] font-semibold'
                  : 'border-transparent text-[#5E5955]'
              }`}
            >
              <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
              <span>Instagram Journal</span>
            </button>

            {/* Tab 3: Our Craft & Story */}
            <button
              type="button"
              onClick={() => {
                setActiveNavTab('craft');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`hover:text-[#1C1B1A] transition-colors pb-1 border-b-2 cursor-pointer ${
                activeNavTab === 'craft'
                  ? 'border-[#C5A880] text-[#1C1B1A] font-semibold'
                  : 'border-transparent text-[#5E5955]'
              }`}
            >
              Our Craft & Story
            </button>

            {/* Tab 4: Track Order */}
            <button
              type="button"
              onClick={() => {
                setActiveNavTab('track');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`hover:text-[#1C1B1A] transition-colors flex items-center gap-1.5 pb-1 border-b-2 cursor-pointer ${
                activeNavTab === 'track'
                  ? 'border-[#C5A880] text-[#1C1B1A] font-semibold'
                  : 'border-transparent text-[#5E5955]'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Track Order</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Real-time Interactive Search Filtering Modal */}
      <NavbarSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-[#1C1B1A]/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 border-r border-[#E8DFD8]">
            <div className="p-6">
              <div className="flex items-center justify-between pb-6 border-b border-[#E8DFD8]">
                <div>
                  <h3 className="font-serif tracking-widest text-xl text-[#1C1B1A] uppercase font-semibold">
                    Artified_np
                  </h3>
                  <p className="text-[10px] tracking-widest uppercase text-[#8C847E]">
                    Handcrafted in Kathmandu
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#8C847E] hover:text-[#1C1B1A]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Real-time Search Trigger */}
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-[#E8DFD8] rounded-xl text-xs text-[#736C65] hover:border-[#C5A880] transition-colors shadow-2xs"
                >
                  <span className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#C5A880]" />
                    <span>{searchQuery ? `"${searchQuery}"` : 'Search entire catalog...'}</span>
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C5A880] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E8DFD8]">
                    Live
                  </span>
                </button>
              </div>

              {/* Navigation links */}
              <div className="mt-6 flex flex-col space-y-1">
                {/* 0. Shop */}
                <button
                  onClick={() => {
                    setActiveNavTab('home');
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center justify-between py-3 text-xs font-semibold tracking-wider uppercase border-b border-[#F0EBE5] ${
                    activeNavTab === 'home' ? 'text-[#C5A880]' : 'text-[#1C1B1A]'
                  }`}
                >
                  <span>Shop</span>
                  <ChevronRight className="w-4 h-4 text-[#8C847E]" />
                </button>

                {/* 1. As Seen On TikTok */}
                <button
                  onClick={() => {
                    setActiveNavTab('tiktok');
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center justify-between py-3 text-xs font-medium tracking-wider uppercase border-b border-[#F0EBE5] ${
                    activeNavTab === 'tiktok' ? 'text-[#C5A880] font-semibold' : 'text-[#4A4541]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                    </svg>
                    <span>As Seen On TikTok (@artified_np)</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#8C847E]" />
                </button>

                {/* 2. Instagram Journal */}
                <button
                  onClick={() => {
                    setActiveNavTab('journal');
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center justify-between py-3 text-xs font-medium tracking-wider uppercase border-b border-[#F0EBE5] ${
                    activeNavTab === 'journal' ? 'text-[#C5A880] font-semibold' : 'text-[#1C1B1A]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-[#E1306C]" />
                    <span>Instagram Journal (@artified_np)</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#8C847E]" />
                </button>

                {/* 3. Our Craft & Story */}
                <button
                  onClick={() => {
                    setActiveNavTab('craft');
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center justify-between py-3 text-xs font-medium tracking-wider uppercase border-b border-[#F0EBE5] ${
                    activeNavTab === 'craft' ? 'text-[#C5A880] font-semibold' : 'text-[#4A4541]'
                  }`}
                >
                  <span>Our Craft & Story</span>
                  <ChevronRight className="w-4 h-4 text-[#8C847E]" />
                </button>

                {/* 4. Track Order */}
                <button
                  onClick={() => {
                    setActiveNavTab('track');
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center justify-between py-3 text-xs font-medium tracking-wider uppercase border-b border-[#F0EBE5] ${
                    activeNavTab === 'track' ? 'text-[#C5A880] font-semibold' : 'text-[#1C1B1A]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#C5A880]" />
                    <span>Track Your Order</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#8C847E]" />
                </button>

                {/* Care Guide helper */}
                <button
                  onClick={() => {
                    setActiveNavTab('home');
                    setMobileMenuOpen(false);
                    setTimeout(() => {
                      const el = document.getElementById('care-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 350);
                  }}
                  className="flex items-center justify-between py-3 text-xs font-medium tracking-wider uppercase text-[#736C65] border-b border-[#F0EBE5]"
                >
                  <span>Pearl & Macrame Care Guide</span>
                  <ChevronRight className="w-4 h-4 text-[#8C847E]" />
                </button>
              </div>
            </div>

            {/* Mobile Footer with Social & WhatsApp */}
            <div className="p-6 bg-white/70 border-t border-[#E8DFD8] space-y-2.5">
              <a
                href="https://www.instagram.com/artified_np/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white rounded-lg text-xs font-semibold tracking-wider uppercase hover:opacity-95 transition-opacity shadow-sm"
              >
                <Instagram className="w-4 h-4" />
                <span>Follow @artified_np on Instagram</span>
              </a>

              <button
                type="button"
                onClick={openWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#25D366] text-white rounded-lg text-xs font-semibold tracking-wider uppercase hover:bg-[#20ba5a] transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp (+977)</span>
              </button>

              <div className="pt-2 flex items-center justify-center gap-4 text-xs text-[#736C65]">
                <a
                  href="https://tiktok.com/@artified_np"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#1C1B1A] underline underline-offset-2"
                >
                  TikTok: @artified_np
                </a>
                <span>•</span>
                <a
                  href="https://www.instagram.com/artified_np/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#1C1B1A] underline underline-offset-2"
                >
                  Instagram: @artified_np
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
