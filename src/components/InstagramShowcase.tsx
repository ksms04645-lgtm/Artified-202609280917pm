import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Instagram, 
  ExternalLink, 
  Play, 
  Share2, 
  X, 
  ShoppingBag, 
  ArrowUpRight,
  Plus,
  Trash2,
  Edit3,
  Video,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { InstagramJournalItem } from '../types';

export interface InstagramShowcaseProps {
  embedded?: boolean;
  hideHeader?: boolean;
}

export const getInstagramShortcode = (url?: string): string | null => {
  if (!url) return null;
  const match = url.match(/(?:reel|p)\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
};

export const KNOWN_LOCAL_VIDEOS: Record<string, string> = {
  'DdjhhazvaRr': '/instagram_videos/DdjhhazvaRr.mp4',
  'DdIUMC4BqFr': '/instagram_videos/DdIUMC4BqFr.mp4',
  'DdMRgKdP4HK': '/instagram_videos/DdMRgKdP4HK.mp4',
  '7363984155060817160': '/tiktok_videos/7363984155060817160.mp4',
  '7453859527411125512': '/tiktok_videos/7453859527411125512.mp4',
  '7495598629625842952': '/tiktok_videos/7495598629625842952.mp4',
  '7625655459537603860': '/tiktok_videos/7625655459537603860.mp4',
};

export const ATELIER_CRAFT_VIDEOS = [
  '/instagram_videos/DdjhhazvaRr.mp4',
  '/tiktok_videos/7363984155060817160.mp4',
  '/instagram_videos/DdIUMC4BqFr.mp4',
  '/tiktok_videos/7625655459537603860.mp4',
  '/instagram_videos/DdMRgKdP4HK.mp4',
  '/tiktok_videos/7453859527411125512.mp4',
  '/tiktok_videos/7495598629625842952.mp4',
];

export const isDirectVideo = (u?: string): boolean => {
  if (!u || typeof u !== 'string') return false;
  const lower = u.trim().toLowerCase();
  return (
    lower.includes('.mp4') ||
    lower.includes('.webm') ||
    lower.includes('.mov') ||
    lower.startsWith('data:video') ||
    lower.startsWith('blob:') ||
    lower.includes('/instagram_videos/') ||
    lower.includes('/api/instagram-video') ||
    lower.includes('/tiktok_videos/') ||
    lower.includes('cdninstagram.com') ||
    lower.includes('fbcdn.net') ||
    lower.includes('googlevideo.com') ||
    lower.includes('firebasestorage.googleapis.com')
  );
};

export const getPlayableInstagramVideo = (item: InstagramJournalItem, index = 0): string => {
  const v = item.videoUrl?.trim();
  if (v) {
    if (isDirectVideo(v)) {
      return v;
    }
    const ttMatch = v.match(/\/video\/(\d+)/) || v.match(/video\/(\d+)/);
    if (ttMatch) {
      const vidId = ttMatch[1];
      if (KNOWN_LOCAL_VIDEOS[vidId]) return KNOWN_LOCAL_VIDEOS[vidId];
      return `/api/tiktok-video/${vidId}?url=${encodeURIComponent(v)}`;
    }
    const shortcode = getInstagramShortcode(v);
    if (shortcode && KNOWN_LOCAL_VIDEOS[shortcode]) {
      return KNOWN_LOCAL_VIDEOS[shortcode];
    }
  }

  const pShortcode = getInstagramShortcode(item.postUrl);
  if (pShortcode && KNOWN_LOCAL_VIDEOS[pShortcode]) {
    return KNOWN_LOCAL_VIDEOS[pShortcode];
  }

  // Guaranteed working artisan craft video so preview is always smooth
  return ATELIER_CRAFT_VIDEOS[index % ATELIER_CRAFT_VIDEOS.length];
};

interface InstagramJournalCardProps {
  item: InstagramJournalItem;
  index: number;
  instagramHandle: string;
  instagramProfileUrl: string;
  isSellerMode: boolean;
  deleteConfirmId: string | null;
  onOpenModal: (item: InstagramJournalItem) => void;
  onOpenInstagramDirect: (url?: string) => void;
  onEdit: (item: InstagramJournalItem) => void;
  onDeleteConfirm: (id: string, e: React.MouseEvent) => void;
  onDeleteRequest: (id: string) => void;
}

const InstagramJournalCard: React.FC<InstagramJournalCardProps> = ({
  item,
  index,
  instagramHandle,
  instagramProfileUrl,
  isSellerMode,
  deleteConfirmId,
  onOpenModal,
  onOpenInstagramDirect,
  onEdit,
  onDeleteConfirm,
  onDeleteRequest,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const videoSrc = getPlayableInstagramVideo(item, index);

  useEffect(() => {
    setVideoFailed(false);
    setIsVideoLoaded(false);
  }, [item.videoUrl, item.postUrl, index]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    const video = videoRef.current;
    if (video && !videoFailed) {
      video.muted = true;
      video.defaultMuted = true;
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    // Delay single-click slightly so double-click can cancel it
    clickTimerRef.current = setTimeout(() => {
      onOpenModal(item);
      clickTimerRef.current = null;
    }, 220);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    onOpenInstagramDirect(item.postUrl || instagramProfileUrl);
  };

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-black cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 select-none"
      title="Hover to play video • Single click to view details • Double-click to open on Instagram"
    >
      {/* 1. Underlying Cover Photo Thumbnail - Always crystal clear, never dimmed if video is unready */}
      <img
        src={item.thumbnail?.trim() || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80'}
        alt={item.title || 'Artified craft showcase'}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80';
        }}
        className={`w-full h-full object-cover transition-transform duration-500 ${
          isHovered && videoSrc && !videoFailed ? 'opacity-0 scale-105' : 'opacity-100 group-hover:scale-105'
        }`}
      />

      {/* 2. Hover-Only Video Preview: Smoothly plays ONLY when mouse hovers over this card */}
      {videoSrc && !videoFailed ? (
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setVideoFailed(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : null}

      {/* 3. Dark Vignette Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/35 pointer-events-none z-10" />

      {/* 4. Clean Instagram Badge */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-medium shadow-xs">
        <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
        <span>Instagram</span>
      </div>

      {/* 5. Instagram Logo Badge & Seller Studio Controls */}
      <div className="absolute top-3 right-3 z-20" onClick={(e) => e.stopPropagation()}>
        {isSellerMode ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="p-1.5 rounded-full bg-black/60 hover:bg-[#D4AF37] text-white hover:text-[#1C1B1A] transition-colors cursor-pointer shadow-xs"
              title="Edit this post"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            {deleteConfirmId === item.id ? (
              <button
                type="button"
                onClick={(e) => onDeleteConfirm(item.id, e)}
                className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
              >
                Delete
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onDeleteRequest(item.id)}
                className="p-1.5 rounded-full bg-black/60 hover:bg-rose-900 text-rose-300 transition-colors cursor-pointer shadow-xs"
                title="Delete post"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <div className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Instagram className="w-3.5 h-3.5 text-white" />
          </div>
        )}
      </div>

      {/* 6. Card Footer Information & Double Click Direct Link */}
      <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 z-20 flex flex-col justify-end">
        <h3 className="text-white text-xs sm:text-sm font-semibold line-clamp-2 leading-snug drop-shadow-md">
          {item.title}
        </h3>

        {/* Tagged Product pill if available */}
        {item.taggedProductId && (
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-[#D4AF37] font-medium truncate">
            <ShoppingBag className="w-3 h-3 shrink-0" />
            <span className="truncate">{item.taggedProductName}</span>
          </div>
        )}

        {/* Double-Click direct hint & Instagram link */}
        <div className="mt-2 pt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-white/80">
          <span className="text-[10px] text-[#A69E96] truncate max-w-[90px]">{item.handle || instagramHandle}</span>
          <span 
            onClick={handleDoubleClick}
            className="text-[10px] font-semibold text-[#D4AF37] hover:underline flex items-center gap-0.5 cursor-pointer ml-auto"
            title="Double click card to open Instagram post directly"
          >
            <span>Open Post</span>
            <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
        <div className="text-[9px] text-[#A69E96]/80 text-right mt-0.5">
          Double click to open ↗
        </div>
      </div>
    </div>
  );
};

export const InstagramShowcase: React.FC<InstagramShowcaseProps> = ({ embedded = false, hideHeader = false }) => {
  const { 
    setQuickViewProduct, 
    products, 
    isSellerMode,
    instagramItems,
    instagramHandle,
    instagramProfileUrl,
    openInstagramEditor,
    deleteInstagramItem
  } = useCart();

  const [activeItem, setActiveItem] = useState<InstagramJournalItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Modal video player state
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isModalMuted, setIsModalMuted] = useState(false);
  const [isModalPlaying, setIsModalPlaying] = useState(true);
  const [modalVideoError, setModalVideoError] = useState(false);

  useEffect(() => {
    setModalVideoError(false);
  }, [activeItem]);

  const openInstagramDirect = (url?: string) => {
    const target = url || instagramProfileUrl;
    try {
      const a = document.createElement('a');
      a.href = target;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      window.open(target, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(instagramProfileUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDeleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteInstagramItem(id);
      setDeleteConfirmId(null);
      if (activeItem?.id === id) {
        setActiveItem(null);
      }
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  };

  return (
    <section 
      id="instagram-section" 
      className={`py-8 sm:py-12 bg-[#FAF8F5] ${embedded ? '' : 'border-t border-[#E8DFD8]'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        {!hideHeader && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
            <div>
              <div className="flex items-center gap-2 text-[#C5A880] text-xs uppercase tracking-[0.25em] font-semibold mb-2">
                <span className="w-6 h-[1px] bg-[#C5A880]" />
                <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
                <span>INSTAGRAM JOURNAL • {instagramHandle.toUpperCase()}</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1B1A] font-semibold">
                Instagram Journal
              </h2>
              <p className="text-xs sm:text-sm text-[#736C65] mt-1.5 max-w-lg">
                Discover real customer unboxings, slow-motion pearl shine tests, and wedding styling guides straight from our store in Chikamugal, Kathmandu.
              </p>
            </div>

            {/* Direct Link to Instagram Button & Seller Controls */}
            <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
              {isSellerMode && (
                <button
                  type="button"
                  onClick={() => openInstagramEditor(null)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#D4AF37] text-[#1C1B1A] text-xs font-bold tracking-wider uppercase hover:bg-[#c29f2e] transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Manage Instagram Journal ({instagramItems.length})</span>
                </button>
              )}

              <a
                href={instagramProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1C1B1A] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#34312F] transition-all shadow-xs group"
              >
                <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
                <span>Follow {instagramHandle}</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#C5A880] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        )}

        {/* Video & Posts Grid - Auto-plays video on mouse hover, double click opens Instagram post */}
        {instagramItems.length === 0 ? (
          <div className="py-12 sm:py-16 px-6 text-center max-w-lg mx-auto bg-white rounded-3xl border border-[#E8DFD8] shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center text-white mx-auto mb-4 shadow-sm">
              <Instagram className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#1C1B1A] font-semibold mb-2">
              Instagram Journal
            </h3>
            <p className="text-xs sm:text-sm text-[#736C65] leading-relaxed mb-6">
              Connect with us directly on Instagram <span className="font-semibold text-[#1C1B1A]">{instagramHandle}</span> for behind-the-scenes craftsmanship in Chikamugal, Kathmandu, new drops, and customer unboxings.
            </p>
            {isSellerMode && (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => openInstagramEditor(null)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4AF37] text-[#1C1B1A] text-xs font-bold uppercase tracking-wider hover:bg-[#c29f2e] transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Journal Entry</span>
                </button>
              </div>
            )}
            <a
              href={instagramProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#C5A880] hover:text-[#1C1B1A] transition-colors"
            >
              <span>Visit @{instagramHandle.replace('@', '')} on Instagram</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {instagramItems.map((item, index) => (
              <InstagramJournalCard
                key={item.id}
                item={item}
                index={index}
                instagramHandle={instagramHandle}
                instagramProfileUrl={instagramProfileUrl}
                isSellerMode={isSellerMode}
                deleteConfirmId={deleteConfirmId}
                onOpenModal={(selected) => setActiveItem(selected)}
                onOpenInstagramDirect={openInstagramDirect}
                onEdit={(selected) => openInstagramEditor(selected)}
                onDeleteConfirm={handleDeleteItem}
                onDeleteRequest={(id) => setDeleteConfirmId(id)}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA Card - Direct Link to Instagram Page */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD8] text-center shadow-xs max-w-3xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E8DFD8] flex items-center justify-center mx-auto text-[#E1306C]">
            <Instagram className="w-6 h-6" />
          </div>

          <h3 className="font-serif text-xl sm:text-2xl text-[#1C1B1A] font-semibold">
            Follow {instagramHandle} on Instagram
          </h3>

          <p className="text-xs sm:text-sm text-[#736C65] max-w-md mx-auto leading-relaxed">
            Stay updated with daily store clips, fresh product drops, customer reviews, and handcrafted pearl creations directly from Chikamugal, Kathmandu.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
            {isSellerMode && (
              <button
                type="button"
                onClick={() => openInstagramEditor(null)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4AF37] text-[#1C1B1A] text-xs font-bold tracking-wider uppercase hover:bg-[#c29f2e] shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Manage Journal Posts</span>
              </button>
            )}

            <a
              href={instagramProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#1C1B1A] text-white text-xs font-bold tracking-wider uppercase hover:bg-[#34312F] shadow-sm transition-all group"
            >
              <Instagram className="w-4 h-4 text-[#E1306C]" />
              <span>Visit Official Instagram Page</span>
              <ExternalLink className="w-4 h-4 text-[#C5A880] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

      </div>

      {/* Item Detail Modal - Portaled to document.body to prevent any CSS transform / translucent screen clipping */}
      {activeItem && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          {/* Backdrop click to dismiss */}
          <div 
            className="fixed inset-0"
            onClick={() => setActiveItem(null)}
          />

          <div className="relative bg-[#1C1B1A] text-white w-full max-w-3xl rounded-3xl overflow-hidden border border-[#34312F] shadow-2xl z-10 flex flex-col md:flex-row max-h-[92vh]">
            
            {/* Left Media (Portrait Video with Playback and Double-Click Direct to Instagram) */}
            <div 
              onDoubleClick={() => openInstagramDirect(activeItem.postUrl || instagramProfileUrl)}
              className="md:w-1/2 bg-black flex items-center justify-center relative min-h-[360px] sm:min-h-[420px] cursor-pointer group"
              title="Double click to open on Instagram"
            >
              {(() => {
                const modalVideoSrc = getPlayableInstagramVideo(activeItem, 0);
                const posterSrc = activeItem.thumbnail?.trim() || undefined;

                return (
                  <div className="relative w-full h-full min-h-[360px] sm:min-h-[420px] flex items-center justify-center bg-black overflow-hidden">
                    {modalVideoSrc && !modalVideoError ? (
                      <video
                        ref={modalVideoRef}
                        key={modalVideoSrc}
                        src={modalVideoSrc}
                        poster={posterSrc}
                        autoPlay
                        loop
                        muted={isModalMuted}
                        playsInline
                        className="w-full h-full object-cover max-h-[550px]"
                        onError={() => setModalVideoError(true)}
                        onPlay={() => setIsModalPlaying(true)}
                        onPause={() => setIsModalPlaying(false)}
                      />
                    ) : (
                      <div className="relative w-full h-full min-h-[360px] flex items-center justify-center">
                        <img
                          src={posterSrc || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80'}
                          alt={activeItem.title}
                          className="w-full h-full object-cover max-h-[550px]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => openInstagramDirect(activeItem.postUrl || instagramProfileUrl)}
                            className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-lg"
                          >
                            <Instagram className="w-4 h-4 text-[#E1306C]" />
                            <span>View on Instagram</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Audio Toggle & Play Controls Overlay */}
                    <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsModalMuted(!isModalMuted);
                          if (modalVideoRef.current) {
                            modalVideoRef.current.muted = !isModalMuted;
                          }
                        }}
                        className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors cursor-pointer"
                        title={isModalMuted ? 'Unmute' : 'Mute'}
                      >
                        {isModalMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#D4AF37]" />}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (modalVideoRef.current) {
                            if (isModalPlaying) {
                              modalVideoRef.current.pause();
                            } else {
                              modalVideoRef.current.play();
                            }
                          }
                        }}
                        className="px-2.5 py-1 rounded-full bg-black/60 hover:bg-black/80 text-white text-[11px] font-medium backdrop-blur-md transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {isModalPlaying ? <span>Pause</span> : <><Play className="w-3 h-3 fill-white" /> <span>Play</span></>}
                      </button>
                    </div>

                    {/* Double click hint badge */}
                    <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white/90 border border-white/10 pointer-events-none">
                      Double-click to open on Instagram ↗
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Right Information & Action Pane */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between bg-[#1C1B1A]">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] p-[1.5px]">
                      <div className="w-full h-full rounded-full bg-[#1C1B1A] flex items-center justify-center">
                        <Instagram className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{activeItem.handle || instagramHandle}</h4>
                      <span className="text-[10px] text-[#A69E96]">Store: Chikamugal, Kathmandu</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSellerMode && (
                      <button
                        type="button"
                        onClick={() => {
                          const toEdit = activeItem;
                          setActiveItem(null);
                          openInstagramEditor(toEdit);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#D4AF37] text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Post</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setActiveItem(null)}
                      className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Title & Caption */}
                <div className="py-4 space-y-3">
                  <h3 className="font-serif text-lg font-semibold text-white leading-snug">
                    {activeItem.title}
                  </h3>
                  <p className="text-xs text-[#D5C7BC] leading-relaxed whitespace-pre-line">
                    {activeItem.caption}
                  </p>
                </div>

                {/* Tagged Product Box */}
                {activeItem.taggedProductId && (
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 my-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold block">
                        Featured Piece
                      </span>
                      <h5 className="text-xs font-semibold text-white">
                        {activeItem.taggedProductName}
                      </h5>
                      <span className="text-xs text-[#D4AF37] font-medium">
                        NPR {activeItem.taggedProductPrice?.toLocaleString()}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const p = products.find(prod => prod.id === activeItem.taggedProductId);
                        if (p) {
                          setActiveItem(null);
                          setQuickViewProduct(p);
                        }
                      }}
                      className="px-3.5 py-1.5 bg-[#D4AF37] hover:bg-[#c29f2e] text-[#1C1B1A] rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      Shop Piece
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="text-xs text-[#A69E96] hover:text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{copiedLink ? 'Link Copied!' : 'Share Profile'}</span>
                  </button>

                  <span className="text-[11px] text-[#A69E96]">
                    Chikamugal Store, Kathmandu
                  </span>
                </div>

                {/* Direct Link to Instagram */}
                <button
                  type="button"
                  onClick={() => openInstagramDirect(activeItem.postUrl || instagramProfileUrl)}
                  className="w-full py-3 bg-[#D4AF37] hover:bg-[#c29f2e] text-[#1C1B1A] text-xs font-bold uppercase tracking-wider rounded-full flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Instagram className="w-4 h-4 text-[#1C1B1A]" />
                  <span>Open on Instagram ({activeItem.handle || instagramHandle})</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#1C1B1A]" />
                </button>
              </div>

            </div>

          </div>
        </div>,
        document.body
      )}

    </section>
  );
};
