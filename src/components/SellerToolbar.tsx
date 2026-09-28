import React, { useState } from 'react';
import { Sparkles, Lock, ChevronUp, ChevronDown, Package, Check, Layers, Video, Feather, Instagram, Star, MessageSquare, HardDrive } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const SellerToolbar: React.FC = () => {
  const { 
    isSellerMode, 
    setIsSellerMode, 
    products, 
    setIsCatalogListOpen,
    reels,
    openTikTokEditor,
    instagramItems,
    openInstagramEditor,
    setIsCraftStoryModalOpen,
    bestsellerThreshold,
    setBestsellerThreshold,
    openReviewsManager,
    setIsWebsiteExportOpen,
    setIsGoogleDriveOpen
  } = useCart();

  const [isMinimized, setIsMinimized] = useState(false);

  if (!isSellerMode) return null;

  return (
    <aside 
      aria-label="Seller Studio Mode Controls" 
      className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2 animate-fade-in"
    >
      {/* Minimized Pill */}
      {isMinimized ? (
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#1C1B1A] text-[#FAF8F5] border border-[#C5A880]/50 rounded-full shadow-xl hover:bg-[#2C2927] transition-all text-xs font-semibold"
          title="Expand Seller Toolbar"
        >
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
          <span>Seller Mode ({products.length})</span>
          <ChevronUp className="w-3.5 h-3.5 text-[#C5A880]" />
        </button>
      ) : (
        /* Expanded Floating Toolbar */
        <div className="bg-[#1C1B1A]/95 text-white border border-[#C5A880]/40 rounded-2xl shadow-2xl p-3.5 sm:p-4 backdrop-blur-md max-w-xs sm:max-w-sm flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-white/10 gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
              <div>
                <p className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                  <span>Seller Studio Mode</span>
                  <span className="text-[10px] font-normal text-[#C5A880] bg-[#C5A880]/20 px-1.5 py-0.2 rounded">
                    Seller Only
                  </span>
                </p>
                <p className="text-[10px] text-[#A69E96]">
                  Invisible to buyers • {products.length} active pieces
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="p-1 text-[#A69E96] hover:text-white rounded-md"
              title="Minimize toolbar"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setIsCatalogListOpen(true)}
              className="w-full py-2.5 px-3 bg-[#FAF8F5] text-[#1C1B1A] hover:bg-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Layers className="w-4 h-4 text-[#C5A880]" />
              <span>Manage All Products ({products.length})</span>
            </button>

            {/* Monthly Bestseller Threshold Quick Adjust */}
            <div className="p-2 px-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
              <span className="text-[#D8D2CB] text-[11px]">Monthly Bestseller Goal:</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={1}
                  value={bestsellerThreshold}
                  onChange={(e) => setBestsellerThreshold(Math.max(1, Number(e.target.value)))}
                  className="w-14 text-center px-1 py-0.5 bg-black/50 border border-[#C5A880]/60 rounded text-xs text-[#E6C687] font-bold focus:outline-none"
                  title="Products with sold count >= this number automatically become Bestsellers"
                />
                <span className="text-[10px] text-[#A69E96]">sold</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openTikTokEditor(null)}
              className="w-full py-2 px-3 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-white/10"
            >
              <Video className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Manage TikTok Reels ({reels.length})</span>
            </button>

            <button
              type="button"
              onClick={() => openInstagramEditor(null)}
              className="w-full py-2 px-3 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-white/10"
            >
              <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
              <span>Manage Instagram Journal ({instagramItems.length})</span>
            </button>

            <button
              type="button"
              onClick={() => openReviewsManager(null)}
              className="w-full py-2 px-3 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-white/10"
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Manage Product Reviews</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCraftStoryModalOpen(true)}
              className="w-full py-2 px-3 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-white/10"
            >
              <Feather className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Edit Craft Story & Making Video</span>
            </button>

            <button
              type="button"
              onClick={() => setIsGoogleDriveOpen(true)}
              className="w-full py-2 px-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-blue-500/40"
            >
              <HardDrive className="w-3.5 h-3.5 text-blue-300" />
              <span>Google Drive Cloud Sync</span>
            </button>

            <button
              type="button"
              onClick={() => setIsWebsiteExportOpen(true)}
              className="w-full py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-amber-500/40"
            >
              <Package className="w-3.5 h-3.5 text-amber-300" />
              <span>Export Complete Website & All Products</span>
            </button>

            <div>
              <button
                type="button"
                onClick={() => setIsSellerMode(false)}
                className="w-full py-2 px-3 bg-white/5 hover:bg-rose-950/40 text-xs text-rose-300 rounded-xl flex items-center justify-center gap-1.5 border border-rose-900/30 transition-colors"
                title="Exit seller mode to view site as customer"
              >
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>Exit & Lock</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
