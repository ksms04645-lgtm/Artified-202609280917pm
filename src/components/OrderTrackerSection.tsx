import React, { useState } from 'react';
import { 
  Search, 
  Truck, 
  Sparkles, 
  CheckCircle2, 
  Package, 
  MapPin, 
  MessageCircle, 
  ShieldCheck, 
  AlertCircle
} from 'lucide-react';
import { getTrackedOrder } from '../data/trackingData';
import { TrackedOrderData } from '../types';
import { useCart } from '../context/CartContext';

export const OrderTrackerSection: React.FC = () => {
  const { trackingOrderId, setTrackingOrderId } = useCart();
  const [inputOrderId, setInputOrderId] = useState<string>(trackingOrderId || 'ART-2026-8842');
  const [trackedOrder, setTrackedOrder] = useState<TrackedOrderData | null>(() => {
    return getTrackedOrder(trackingOrderId || 'ART-2026-8842');
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const performLookup = (idToLookup: string) => {
    if (!idToLookup.trim()) {
      setErrorMsg('Please enter an Order ID or Phone Number');
      setTrackedOrder(null);
      return;
    }

    setIsSearching(true);
    setErrorMsg(null);

    setTimeout(() => {
      const order = getTrackedOrder(idToLookup);
      if (order) {
        setTrackedOrder(order);
        setTrackingOrderId(order.orderId);
      } else {
        setTrackedOrder(null);
        setErrorMsg(`We couldn't find an order for "${idToLookup}". Please check the ID or contact us on WhatsApp.`);
      }
      setIsSearching(false);
    }, 400);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(inputOrderId);
  };

  const PHASES: Array<{
    key: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { key: 'confirmed', label: 'Order Confirmed', icon: Package },
    { key: 'beading_in_progress', label: 'Atelier Weaving', icon: Sparkles },
    { key: 'quality_and_packaging', label: 'Inspection & Silk Packaging', icon: ShieldCheck },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2 }
  ];

  const getPhaseIndex = (phase?: string) => {
    switch (phase) {
      case 'confirmed': return 0;
      case 'beading_in_progress': return 1;
      case 'quality_and_packaging': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      default: return 1;
    }
  };

  const currentIdx = getPhaseIndex(trackedOrder?.currentPhase);

  return (
    <section className="py-12 sm:py-16 bg-[#FAF8F5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-[#C5A880] text-xs uppercase tracking-[0.25em] font-semibold mb-3 border border-[#E8DFD8]">
            <Truck className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>REAL-TIME DELIVERY TRACKER</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#1C1B1A] font-semibold tracking-tight">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-[#5E5955] mt-2.5 leading-relaxed">
            Follow the handcrafting progress of your pearl piece in our Kathmandu atelier, through finishing, inspection, and dispatch to your doorstep.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl border border-[#E8DFD8] p-4 sm:p-6 shadow-xs max-w-xl mx-auto mb-10">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8C847E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputOrderId}
                onChange={(e) => setInputOrderId(e.target.value)}
                placeholder="Enter Order ID (e.g. ART-2026-8842)"
                className="w-full pl-10 pr-3 py-3 bg-[#FAF8F5] border border-[#E8DFD8] rounded-xl text-xs sm:text-sm text-[#1C1B1A] focus:outline-none focus:border-[#C5A880]"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-3 bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-black transition-colors cursor-pointer shrink-0"
            >
              {isSearching ? 'Checking...' : 'Track'}
            </button>
          </form>

          {/* Quick Demo ID Suggestion */}
          <div className="mt-3 flex items-center justify-between text-[11px] text-[#736C65]">
            <span>Try sample order:</span>
            <button
              type="button"
              onClick={() => {
                setInputOrderId('ART-2026-8842');
                performLookup('ART-2026-8842');
              }}
              className="text-[#C5A880] hover:text-[#1C1B1A] underline font-medium cursor-pointer"
            >
              #ART-2026-8842 (Maya Pearl Bag)
            </button>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-xs flex items-center gap-2 max-w-xl mx-auto mb-8">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Order Details Card */}
        {trackedOrder && (
          <div className="bg-white rounded-3xl border border-[#E8DFD8] p-6 sm:p-10 shadow-sm space-y-8 animate-fade-in">
            
            {/* Top Summary Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DFD8]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base sm:text-lg font-bold text-[#1C1B1A]">
                    {trackedOrder.orderId}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                    {trackedOrder.paymentStatus}
                  </span>
                </div>
                <p className="text-xs text-[#5E5955] mt-1">
                  Ordered on {trackedOrder.orderPlacedDate} • Customer: <span className="font-medium text-[#1C1B1A]">{trackedOrder.customerName}</span>
                </p>
                {trackedOrder.artisanName && (
                  <p className="text-[11px] text-[#C5A880] mt-0.5 font-medium">
                    Artisan: {trackedOrder.artisanName} ({trackedOrder.artisanRole})
                  </p>
                )}
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] text-[#736C65] uppercase tracking-wider block">Estimated Delivery</span>
                <span className="font-serif text-lg font-bold text-[#C5A880]">
                  {trackedOrder.estimatedDeliveryDate}
                </span>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#C5A880] mb-6">
                Progress Timeline ({trackedOrder.progressPercentage}%)
              </h3>
              
              <div className="relative">
                {/* Connecting Line */}
                <div className="hidden sm:block absolute top-1/2 left-0 w-full h-[2px] bg-[#E8DFD8] -translate-y-1/2 -z-0" />
                <div 
                  className="hidden sm:block absolute top-1/2 left-0 h-[2px] bg-[#C5A880] -translate-y-1/2 -z-0 transition-all duration-700"
                  style={{ width: `${(currentIdx / (PHASES.length - 1)) * 100}%` }}
                />

                {/* Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                  {PHASES.map((phase, idx) => {
                    const isDone = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;
                    const IconComponent = phase.icon;

                    return (
                      <div key={phase.key} className="flex sm:flex-col items-center gap-3 sm:gap-2 sm:text-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isCurrent
                            ? 'bg-[#C5A880] text-white shadow-md ring-4 ring-[#C5A880]/20'
                            : isDone
                            ? 'bg-[#1C1B1A] text-white'
                            : 'bg-[#F0EBE5] text-[#8C847E]'
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="sm:mt-1">
                          <p className={`text-xs font-semibold ${isDone ? 'text-[#1C1B1A]' : 'text-[#8C847E]'}`}>
                            {phase.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Craft Notes Banner */}
            {trackedOrder.liveCraftNotes && (
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#1C1B1A] uppercase tracking-wider">
                    Atelier Craft Update
                  </h4>
                  <p className="text-xs text-[#5E5955] mt-0.5 leading-relaxed">
                    {trackedOrder.liveCraftNotes}
                  </p>
                </div>
              </div>
            )}

            {/* Product & Courier Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              
              {/* Product Info */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8DFD8]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1B1A] mb-3">
                  Item Details
                </h4>
                <div className="space-y-3">
                  {trackedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3.5">
                      <img 
                        src={item.image?.trim() || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80'} 
                        alt={item.title} 
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80';
                        }}
                        className="w-14 h-14 rounded-xl object-cover border border-[#E8DFD8]"
                      />
                      <div>
                        <h5 className="font-serif text-sm font-semibold text-[#1C1B1A]">
                          {item.title}
                        </h5>
                        <p className="text-xs text-[#5E5955] mt-0.5">
                          Quantity: {item.quantity} • NPR {item.price.toLocaleString()}
                        </p>
                        {item.customization && (
                          <p className="text-[11px] text-[#C5A880] mt-0.5 font-medium">
                            Note: {item.customization}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t border-[#E8DFD8] flex items-center justify-between text-xs font-semibold text-[#1C1B1A]">
                  <span>Total Amount</span>
                  <span>NPR {trackedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Delivery Destination */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8DFD8]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1B1A] mb-3">
                  Delivery Destination
                </h4>
                <div className="flex items-start gap-2.5 text-xs text-[#5E5955]">
                  <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#1C1B1A]">{trackedOrder.deliveryAddress}</p>
                    <p className="text-[11px] text-[#736C65] mt-1">Zone: {trackedOrder.deliveryZoneName}</p>
                    {trackedOrder.courierPartner && (
                      <p className="text-[11px] text-[#736C65] mt-0.5">
                        Courier: {trackedOrder.courierPartner} {trackedOrder.consignmentCode ? `(${trackedOrder.consignmentCode})` : ''}
                      </p>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Support Hotline */}
            <div className="pt-4 border-t border-[#E8DFD8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="text-[#5E5955]">
                Need immediate status assistance or want to update your delivery address?
              </span>
              <a
                href={`https://wa.me/9779767573721?text=${encodeURIComponent(`Hi Artified Nepal, I want an update on my order ${trackedOrder.orderId}`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#20ba5a] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Helpdesk</span>
              </a>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
