import React from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Gift, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Tag, 
  Percent 
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    giftPackaging,
    setGiftPackaging,
    giftMessage,
    setGiftMessage,
    orderNote,
    setOrderNote,
    promoCode,
    applyPromoCode,
    removePromoCode,
    promoError,
    promoSuccess,
    discount,
    setIsCheckoutOpen,
  } = useCart();

  const [promoInput, setPromoInput] = React.useState('');
  const [showGiftMessageInput, setShowGiftMessageInput] = React.useState(false);

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1C1B1A]/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl z-10 flex flex-col justify-between border-l border-[#E8DFD8]">
        
        {/* Drawer Header */}
        <div className="px-6 py-5 bg-white border-b border-[#E8DFD8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#1C1B1A]" />
            <h2 className="font-serif text-lg font-semibold tracking-wide text-[#1C1B1A]">
              Your Handcrafted Bag
            </h2>
            <span className="text-xs bg-[#FAF8F5] text-[#8C7A6B] px-2 py-0.5 rounded-full border border-[#E8DFD8]">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full text-[#8C847E] hover:text-[#1C1B1A] hover:bg-[#FAF8F5] transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body: Cart Items List */}
        <div className="overflow-y-auto p-6 flex-1 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-white border border-[#E8DFD8] flex items-center justify-center mx-auto mb-4 text-[#C5A880]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg text-[#1C1B1A] font-medium mb-1">
                Your bag is empty
              </h3>
              <p className="text-xs text-[#736C65] max-w-xs mx-auto mb-6">
                Discover our signature pearl evening bags, baroque necklaces, and macrame creations.
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#34312F] transition-colors"
              >
                Browse Creations
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-white rounded-xl border border-[#E8DFD8] flex gap-3.5 shadow-2xs"
                  >
                    <div className="w-20 h-24 rounded-lg overflow-hidden bg-[#FAF8F5] shrink-0 border border-[#F0EBE5]">
                      <img
                        src={item.product.images[0]?.trim() || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80'}
                        alt={item.product.title}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80';
                        }}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-serif text-sm font-medium text-[#1C1B1A] leading-snug line-clamp-1">
                            {item.product.title}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#A69E96] hover:text-rose-500 p-0.5 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs font-semibold text-[#1C1B1A] mt-0.5">
                          Rs. {item.product.price.toLocaleString()}
                        </p>

                        {item.customizationNote && (
                          <p className="text-[10px] text-[#8C7A6B] bg-[#FAF8F5] px-2 py-1 rounded border border-[#E8DFD8] mt-1.5 line-clamp-1">
                            ✨ Custom: "{item.customizationNote}"
                          </p>
                        )}
                      </div>

                      {/* Quantity adjuster */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F0EBE5]">
                        <span className="text-[10px] uppercase tracking-wider text-[#8C847E]">
                          Qty
                        </span>
                        <div className="flex items-center border border-[#E8DFD8] rounded-md bg-[#FAF8F5]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs font-bold text-[#5E5955] hover:text-[#1C1B1A]"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-semibold text-[#1C1B1A] min-w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs font-bold text-[#5E5955] hover:text-[#1C1B1A]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gift Packaging Box */}
              <div className="bg-white p-3.5 rounded-xl border border-[#E8DFD8] space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-[#C5A880]" />
                    <div>
                      <span className="text-xs font-semibold text-[#1C1B1A] block">
                        Luxury Gift Packaging (+ Rs. 150)
                      </span>
                      <span className="text-[10px] text-[#736C65]">
                        Satin gold ribbon, handmade gift box & handwritten note
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={giftPackaging}
                    onChange={(e) => {
                      setGiftPackaging(e.target.checked);
                      if (e.target.checked) setShowGiftMessageInput(true);
                    }}
                    className="w-4 h-4 accent-[#1C1B1A] rounded"
                  />
                </label>

                {giftPackaging && (
                  <div className="pt-2 border-t border-[#F0EBE5]">
                    <textarea
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      placeholder="Write your personal gift message to be handwritten in calligraphy..."
                      rows={2}
                      className="w-full text-xs p-2 bg-[#FAF8F5] border border-[#E8DFD8] rounded-lg focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                )}
              </div>

              {/* Order instructions note */}
              <div className="bg-white p-3.5 rounded-xl border border-[#E8DFD8]">
                <label className="block text-xs font-semibold text-[#1C1B1A] mb-1">
                  Delivery / Customization Note:
                </label>
                <input
                  type="text"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="e.g. Please deliver after 3 PM or call before arrival"
                  className="w-full text-xs p-2 bg-[#FAF8F5] border border-[#E8DFD8] rounded-lg focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              {/* Voucher / Coupon Code */}
              <div className="bg-white p-3.5 rounded-xl border border-[#E8DFD8]">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#C5A880]" />
                  <span className="text-xs font-semibold text-[#1C1B1A]">Discount Voucher</span>
                </div>
                
                {promoCode ? (
                  <div className="mt-2 flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg text-xs">
                    <span className="font-semibold">{promoCode} applied (-Rs. {discount})</span>
                    <button
                      onClick={removePromoCode}
                      className="text-xs text-rose-600 hover:underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Enter 'TIKTOK10' or 'NEPALFIRST'"
                      className="flex-1 text-xs px-2.5 py-1.5 uppercase bg-[#FAF8F5] border border-[#E8DFD8] rounded-lg focus:outline-none focus:border-[#C5A880]"
                    />
                    <button
                      type="button"
                      onClick={() => applyPromoCode(promoInput)}
                      className="px-3 py-1.5 bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#34312F]"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {promoError && <p className="text-[10px] text-rose-600 mt-1">{promoError}</p>}
                {promoSuccess && <p className="text-[10px] text-emerald-700 mt-1">{promoSuccess}</p>}
              </div>

              {/* Security reassurance */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#736C65] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Doorstep Inspection • Cash on Delivery & eSewa Available</span>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer: Price Summary & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-[#E8DFD8] space-y-3">
            <div className="space-y-1.5 text-xs text-[#5E5955]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#1C1B1A]">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>
              {giftPackaging && (
                <div className="flex justify-between text-[#8C7A6B]">
                  <span>Luxury Gift Packaging</span>
                  <span>+ Rs. 150</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Promo Discount</span>
                  <span>- Rs. {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-[#736C65] text-[11px]">
                <span>Estimated Delivery</span>
                <span>Calculated at checkout (Rs. 100–220)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#F0EBE5] flex items-baseline justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#1C1B1A]">
                  Estimated Total:
                </span>
                <span className="block text-[10px] text-[#8C7A6B]">Taxes included in NPR</span>
              </div>
              <span className="font-serif text-xl font-bold text-[#1C1B1A]">
                Rs. {(subtotal + (giftPackaging ? 150 : 0) - discount).toLocaleString()}
              </span>
            </div>

            <button
              type="button"
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 bg-[#1C1B1A] text-white rounded-xl text-xs font-semibold tracking-wider uppercase hover:bg-[#34312F] transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Proceed to Delivery & Payment</span>
              <ArrowRight className="w-4 h-4 text-[#C5A880]" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
