import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Package, 
  MapPin, 
  Phone, 
  MessageCircle, 
  User, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getTrackedOrder, normalizeOrderId } from '../data/trackingData';
import { TrackedOrderData, OrderProductionPhase } from '../types';

export const OrderTrackerModal: React.FC = () => {
  const { 
    isTrackerOpen, 
    setIsTrackerOpen, 
    trackingOrderId, 
    setTrackingOrderId,
    completedOrder 
  } = useCart();

  const [inputOrderId, setInputOrderId] = useState<string>('');
  const [trackedOrder, setTrackedOrder] = useState<TrackedOrderData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // When trackingOrderId changes or modal opens, automatically perform lookup
  useEffect(() => {
    if (isTrackerOpen) {
      const targetId = trackingOrderId || completedOrder?.orderId || 'ART-2026-8842';
      setInputOrderId(targetId);
      performLookup(targetId);
    }
  }, [isTrackerOpen, trackingOrderId, completedOrder]);

  const performLookup = (idToLookup: string) => {
    if (!idToLookup.trim()) {
      setErrorMsg('Please enter a valid Order ID (e.g. #ART-2026-8842)');
      setTrackedOrder(null);
      return;
    }

    setIsSearching(true);
    setErrorMsg(null);

    setTimeout(() => {
      const order = getTrackedOrder(idToLookup);
      if (order) {
        setTrackedOrder(order);
        setErrorMsg(null);
      } else {
        setTrackedOrder(null);
        setErrorMsg(`We couldn't locate an order with ID "${idToLookup}". Please verify your order number or consult our WhatsApp support.`);
      }
      setIsSearching(false);
    }, 250);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(inputOrderId);
  };

  const handleSelectQuickId = (sampleId: string) => {
    setInputOrderId(sampleId);
    setTrackingOrderId(sampleId);
    performLookup(sampleId);
  };

  const openWhatsAppInquiry = (order: TrackedOrderData) => {
    const phone = '9779767573721';
    const text = encodeURIComponent(
      `Namaste Artified Store! ✨ I am checking the status of my order ${order.orderId} (${order.items.map((i) => i.title).join(', ')}). Could you provide a quick update on production/dispatch? Dhanyabad!`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  if (!isTrackerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#1C1B1A]/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsTrackerOpen(false)}
      />

      {/* Main Modal Dialog */}
      <div className="relative bg-[#FAF8F5] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E8DFD8] overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white border-b border-[#E8DFD8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E8DFD8] flex items-center justify-center text-[#C5A880]">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-[#1C1B1A]">
                Handmade Order & Craft Tracker
              </h2>
              <p className="text-[10px] text-[#8C7A6B] uppercase tracking-wider font-medium">
                Live Craft Progress • Chikamugal Store & Valley Dispatch
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsTrackerOpen(false)}
            className="p-1.5 rounded-full text-[#8C847E] hover:text-[#1C1B1A] hover:bg-[#FAF8F5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Quick Demo Chips */}
        <div className="p-4 sm:p-6 bg-white border-b border-[#E8DFD8] space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8C847E] absolute left-3.5 top-3" />
              <input
                type="text"
                value={inputOrderId}
                onChange={(e) => setInputOrderId(e.target.value)}
                placeholder="Enter Order ID (e.g. #ART-2026-8842)..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E8DFD8] rounded-xl text-xs sm:text-sm text-[#1C1B1A] placeholder-[#9E9791] font-mono focus:outline-none focus:border-[#C5A880] focus:bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-5 py-2.5 bg-[#1C1B1A] text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-[#34312F] transition-all shrink-0 flex items-center gap-1.5 shadow-xs"
            >
              {isSearching ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C5A880]" />
                  <span>Tracking...</span>
                </>
              ) : (
                <span>Track Status</span>
              )}
            </button>
          </form>

          {/* Quick Demo Order Chips */}
          <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-[#736C65]">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-[#8C7A6B]">
              Quick Demo Statuses:
            </span>
            {completedOrder && (
              <button
                type="button"
                onClick={() => handleSelectQuickId(completedOrder.orderId)}
                className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors font-mono font-medium"
              >
                ★ Your Order ({completedOrder.orderId})
              </button>
            )}
            <button
              type="button"
              onClick={() => handleSelectQuickId('ART-2026-8842')}
              className="px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E8DFD8] hover:border-[#C5A880] text-[#1C1B1A] transition-colors font-mono"
            >
              #ART-2026-8842 (In Weaving)
            </button>
            <button
              type="button"
              onClick={() => handleSelectQuickId('ART-2026-5521')}
              className="px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E8DFD8] hover:border-[#C5A880] text-[#1C1B1A] transition-colors font-mono"
            >
              #ART-2026-5521 (Out for Delivery)
            </button>
            <button
              type="button"
              onClick={() => handleSelectQuickId('ART-2026-3190')}
              className="px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E8DFD8] hover:border-[#C5A880] text-[#1C1B1A] transition-colors font-mono"
            >
              #ART-2026-3190 (Pokhara Packaging)
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{errorMsg}</p>
                <p className="text-[11px] text-amber-800 mt-1">
                  Tip: If you recently placed an order via WhatsApp or Cash on Delivery, our team updates status within 1-2 hours after receiving your inquiry.
                </p>
              </div>
            </div>
          )}

          {trackedOrder && (
            <div className="space-y-6">
              
              {/* Order High-Level Status Card */}
              <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EBE5] pb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C7A6B]">
                      Order Reference
                    </span>
                    <h3 className="font-mono text-xl font-bold text-[#1C1B1A]">
                      {trackedOrder.orderId}
                    </h3>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C7A6B]">
                      Estimated Arrival
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-[#1C1B1A]">
                      {trackedOrder.estimatedDeliveryDate}
                    </p>
                  </div>
                </div>

                {/* Progress Bar with Phase Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#1C1B1A] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>
                        {trackedOrder.currentPhase === 'confirmed' && 'Order Confirmed & Maker Assigned'}
                        {trackedOrder.currentPhase === 'beading_in_progress' && 'Hand-Beading & Weaving in Progress'}
                        {trackedOrder.currentPhase === 'quality_and_packaging' && 'Quality Inspection & Luxury Packaging'}
                        {trackedOrder.currentPhase === 'out_for_delivery' && 'Dispatched • Out for Doorstep Delivery'}
                        {trackedOrder.currentPhase === 'delivered' && 'Delivered to Doorstep'}
                      </span>
                    </span>
                    <span className="font-bold text-[#C5A880]">
                      {trackedOrder.progressPercentage}%
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-2.5 bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E8DFD8]">
                    <div 
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-[#C5A880] rounded-full transition-all duration-700 relative"
                      style={{ width: `${trackedOrder.progressPercentage}%` }}
                    >
                      <span className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Artisan & Atelier Card */}
                <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8DFD8] flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-white border border-[#E8DFD8] flex items-center justify-center text-[#C5A880] shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-xs space-y-0.5">
                    <p className="font-semibold text-[#1C1B1A]">
                      Assigned Maker: {trackedOrder.artisanName} ({trackedOrder.artisanRole})
                    </p>
                    <p className="text-[11px] text-[#736C65] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#C5A880]" />
                      <span>{trackedOrder.studioLocation}</span>
                    </p>
                    <p className="text-[11px] text-[#5E5955] italic pt-1 leading-relaxed border-t border-[#E8DFD8]/60 mt-1">
                      &ldquo;{trackedOrder.liveCraftNotes}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Courier details if out for delivery */}
                {trackedOrder.courierPartner && (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-700" />
                      <div>
                        <p className="font-semibold">{trackedOrder.courierPartner}</p>
                        {trackedOrder.consignmentCode && (
                          <p className="text-[10px] text-emerald-700 font-mono">
                            Consignment: {trackedOrder.consignmentCode}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded uppercase tracking-wider">
                      On Route
                    </span>
                  </div>
                )}
              </div>

              {/* Artisanal Milestone Timeline */}
              <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-xs">
                <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#1C1B1A] mb-4 pb-2 border-b border-[#F0EBE5]">
                  Craft & Logistics Milestones
                </h4>

                <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E8DFD8]">
                  {trackedOrder.milestones.map((m, idx) => {
                    return (
                      <div key={idx} className="relative group">
                        {/* Dot indicator */}
                        <div 
                          className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            m.completed 
                              ? 'bg-emerald-600 border-emerald-600 text-white' 
                              : m.current
                              ? 'bg-[#1C1B1A] border-[#C5A880] text-[#C5A880] ring-4 ring-[#C5A880]/20'
                              : 'bg-white border-[#D8CFCA] text-[#A69E96]'
                          }`}
                        >
                          {m.completed ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : m.current ? (
                            <div className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#D8CFCA]" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className={`font-semibold ${m.current ? 'text-[#C5A880]' : m.completed ? 'text-[#1C1B1A]' : 'text-[#8C847E]'}`}>
                              {m.label}
                            </span>
                            <span className="text-[10px] text-[#8C847E] font-medium">
                              {m.timestamp}
                            </span>
                          </div>

                          <p className="text-xs text-[#5E5955] leading-relaxed">
                            {m.description}
                          </p>

                          <p className="text-[10px] text-[#A69E96]">
                            📍 {m.location}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items & Destination Details */}
              <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-xs space-y-4">
                <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#1C1B1A] pb-2 border-b border-[#F0EBE5]">
                  Pieces in Production / Delivery
                </h4>

                <div className="space-y-3">
                  {trackedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 text-xs">
                      <div className="w-14 h-16 rounded-lg overflow-hidden bg-[#FAF8F5] border border-[#E8DFD8] shrink-0">
                        <img 
                          src={item.image?.trim() || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80'} 
                          alt={item.title} 
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80';
                          }}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="font-serif font-semibold text-[#1C1B1A]">{item.title}</p>
                          <p className="text-[11px] text-[#736C65]">Quantity: {item.quantity}</p>
                          {item.customization && (
                            <p className="text-[10px] text-[#C5A880] font-medium">
                              Custom: &ldquo;{item.customization}&rdquo;
                            </p>
                          )}
                        </div>
                        <p className="font-bold text-[#1C1B1A]">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#F0EBE5] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#5E5955]">
                  <div>
                    <span className="font-semibold text-[#1C1B1A] block mb-0.5">Shipping Destination:</span>
                    <p className="text-[11px] leading-relaxed">{trackedOrder.deliveryAddress}</p>
                    <p className="text-[10px] text-[#8C7A6B] mt-0.5">Zone: {trackedOrder.deliveryZoneName}</p>
                  </div>

                  <div>
                    <span className="font-semibold text-[#1C1B1A] block mb-0.5">Payment Details:</span>
                    <p className="text-[11px]">{trackedOrder.paymentMethodText}</p>
                    <p className="text-[11px] font-bold text-[#1C1B1A] mt-0.5">
                      Total: Rs. {trackedOrder.total.toLocaleString()} ({trackedOrder.paymentStatus})
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Consultation */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-center sm:text-left">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                  <p className="text-emerald-900 leading-tight">
                    Need live progress photos or have custom dimension questions? Chat with our Chikamugal store team.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openWhatsAppInquiry(trackedOrder)}
                  className="px-4 py-2.5 bg-[#25D366] text-white rounded-xl font-semibold text-xs uppercase tracking-wider hover:bg-[#20ba5a] transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Store Support</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-[#E8DFD8] flex items-center justify-between text-xs text-[#736C65]">
          <p>
            ⏱️ Each handcrafted piece undergoes 48h quality and bead tensile verification before dispatch.
          </p>
          <button
            type="button"
            onClick={() => setIsTrackerOpen(false)}
            className="px-5 py-2 bg-[#FAF8F5] border border-[#E8DFD8] rounded-lg text-xs font-semibold text-[#1C1B1A] hover:bg-white"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
