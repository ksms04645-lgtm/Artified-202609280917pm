import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  CreditCard, 
  Banknote, 
  QrCode, 
  CheckCircle2, 
  MessageCircle, 
  ArrowLeft, 
  Sparkles, 
  Upload, 
  Phone, 
  User, 
  Mail, 
  FileText, 
  ShieldCheck, 
  Copy, 
  Check,
  Truck 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { DELIVERY_ZONES } from '../data/products';
import { DeliveryZone, PaymentMethod, OrderDetails } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    clearCart,
    subtotal,
    giftPackaging,
    discount,
    orderNote,
    giftMessage,
    selectedDeliveryZone,
    setSelectedDeliveryZone,
    setCompletedOrder,
    openTracker,
    recordOnlineOrderSales
  } = useCart();

  // Form State
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [transactionId, setTransactionId] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDetails | null>(null);

  if (!isCheckoutOpen) return null;

  const currentDeliveryFee = selectedDeliveryZone.fee;
  const giftFee = giftPackaging ? 150 : 0;
  const grandTotal = Math.max(0, subtotal + currentDeliveryFee + giftFee - discount);

  const validateDetails = () => {
    const errs: { [key: string]: string } = {};
    if (!fullName.trim()) errs.fullName = 'Please enter your full name';
    if (!phone.trim()) {
      errs.phone = 'Phone number is required for courier delivery';
    } else if (!/^[0-9+ ]{9,15}$/.test(phone.trim())) {
      errs.phone = 'Please provide a valid Nepali phone number (e.g. 98XXXXXXXX)';
    }
    if (!address.trim()) errs.address = 'Street address / Area is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToPayment = () => {
    if (validateDetails()) {
      setStep('payment');
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod !== 'cod' && !transactionId.trim() && !screenshotPreview) {
      setErrors({ payment: 'Please enter your transaction ID or upload a payment screenshot' });
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrderId = `#ART-2026-${randomNum}`;

    const order: OrderDetails = {
      orderId: newOrderId,
      items: [...cart],
      customerName: fullName,
      phone: phone,
      email: email || undefined,
      address: address,
      landmark: landmark || undefined,
      deliveryZone: selectedDeliveryZone,
      paymentMethod: paymentMethod,
      giftPackaging: giftPackaging,
      giftMessage: giftMessage || undefined,
      orderNote: orderNote || undefined,
      subtotal: subtotal,
      deliveryFee: currentDeliveryFee,
      giftPackagingFee: giftFee,
      discount: discount,
      total: grandTotal,
      transactionId: transactionId || undefined,
      paymentScreenshot: screenshotPreview || undefined,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    };

    setConfirmedOrder(order);
    setCompletedOrder(order);
    recordOnlineOrderSales(cart);
    clearCart();
    setStep('confirmation');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const triggerWhatsAppConfirmation = (order: OrderDetails) => {
    const phoneNumber = '9779767573721';
    let text = `*✨ NEW ARTIFIED_NP ORDER - ${order.orderId}*\n\n`;
    text += `👤 *Customer:* ${order.customerName}\n`;
    text += `📞 *Phone:* ${order.phone}\n`;
    text += `📍 *Delivery Zone:* ${order.deliveryZone.name}\n`;
    text += `🏠 *Address:* ${order.address}${order.landmark ? ` (Landmark: ${order.landmark})` : ''}\n\n`;

    text += `🛍️ *Order Items:*\n`;
    order.items.forEach((item, index) => {
      text += `${index + 1}. ${item.product.title} (Qty: ${item.quantity}) - Rs. ${(item.product.price * item.quantity).toLocaleString()}\n`;
      if (item.customizationNote) {
        text += `   ↳ Note: ${item.customizationNote}\n`;
      }
    });

    text += `\n💵 *Payment:* ${
      order.paymentMethod === 'cod'
        ? 'Cash on Delivery (COD)'
        : order.paymentMethod === 'esewa'
        ? `eSewa (Txn ID: ${order.transactionId || 'Pending'})`
        : `Khalti (Txn ID: ${order.transactionId || 'Pending'})`
    }\n`;

    if (order.giftPackaging) {
      text += `🎁 *Gift Packaging:* Yes (Handwritten calligraphy note)\n`;
    }
    if (order.giftMessage) {
      text += `📝 *Gift Note:* "${order.giftMessage}"\n`;
    }
    if (order.orderNote) {
      text += `💬 *Order Note:* "${order.orderNote}"\n`;
    }

    text += `\n📦 *Subtotal:* Rs. ${order.subtotal.toLocaleString()}`;
    text += `\n🚚 *Delivery:* Rs. ${order.deliveryFee.toLocaleString()}`;
    if (order.discount > 0) text += `\n🏷️ *Discount:* -Rs. ${order.discount.toLocaleString()}`;
    text += `\n💰 *GRAND TOTAL:* Rs. ${order.total.toLocaleString()}\n\n`;
    text += `Please confirm my order booking and estimated dispatch date. Dhanyabad! 🙏`;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1C1B1A]/60 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (step !== 'confirmation') setIsCheckoutOpen(false);
        }}
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#FAF8F5] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E8DFD8] overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E8DFD8]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
            <h2 className="font-serif text-lg font-semibold text-[#1C1B1A]">
              {step === 'details' && 'Step 1: Delivery Information in Nepal'}
              {step === 'payment' && 'Step 2: Select Payment Method'}
              {step === 'confirmation' && 'Order Placed Successfully!'}
            </h2>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-full text-[#8C847E] hover:text-[#1C1B1A] hover:bg-[#FAF8F5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 flex-1 space-y-6">

          {/* STEP 1: CUSTOMER DETAILS & DELIVERY ZONE */}
          {step === 'details' && (
            <div className="space-y-5">
              
              {/* Delivery Zone Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1B1A] mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Select Delivery Location (Nepal):</span>
                </label>
                <div className="space-y-2">
                  {DELIVERY_ZONES.map((zone) => {
                    const isSelected = selectedDeliveryZone.id === zone.id;
                    return (
                      <div
                        key={zone.id}
                        onClick={() => setSelectedDeliveryZone(zone)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-white border-[#1C1B1A] ring-1 ring-[#1C1B1A] shadow-xs'
                            : 'bg-white/60 border-[#E8DFD8] hover:border-[#C5A880]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1C1B1A]">{zone.name}</span>
                          <span className="text-xs font-semibold text-[#8C7A6B]">
                            + Rs. {zone.fee}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#736C65] mt-0.5">{zone.area}</p>
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-[#C5A880]">
                          <span>⚡ {zone.estimatedDays}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1B1A] mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#8C847E] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Samikshya Shrestha"
                      className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-lg text-xs text-[#1C1B1A] focus:outline-none ${
                        errors.fullName ? 'border-rose-500' : 'border-[#E8DFD8] focus:border-[#C5A880]'
                      }`}
                    />
                  </div>
                  {errors.fullName && <p className="text-[10px] text-rose-500 mt-1">{errors.fullName}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1B1A] mb-1">
                      Phone Number (WhatsApp) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#8C847E] absolute left-3 top-3" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 98XXXXXXXX"
                        className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-lg text-xs text-[#1C1B1A] focus:outline-none ${
                          errors.phone ? 'border-rose-500' : 'border-[#E8DFD8] focus:border-[#C5A880]'
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="text-[10px] text-rose-500 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1B1A] mb-1">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#8C847E] absolute left-3 top-3" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="For order receipts"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E8DFD8] rounded-lg text-xs text-[#1C1B1A] focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1B1A] mb-1">
                    Street Address & Ward Number *
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. House No. 24, Jhamsikhel Marg, Ward 3, Lalitpur"
                    className={`w-full p-2.5 bg-white border rounded-lg text-xs text-[#1C1B1A] focus:outline-none ${
                      errors.address ? 'border-rose-500' : 'border-[#E8DFD8] focus:border-[#C5A880]'
                    }`}
                  />
                  {errors.address && <p className="text-[10px] text-rose-500 mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1B1A] mb-1">
                    Notable Landmark (Near cafe, temple, school, hospital)
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near New Road Gate, Chikamugal, Kathmandu"
                    className="w-full p-2.5 bg-white border border-[#E8DFD8] rounded-lg text-xs text-[#1C1B1A] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              {/* Order Breakdown Snapshot */}
              <div className="bg-white p-4 rounded-xl border border-[#E8DFD8] space-y-1.5 text-xs text-[#5E5955]">
                <div className="flex justify-between">
                  <span>Items ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery ({selectedDeliveryZone.name})</span>
                  <span>Rs. {currentDeliveryFee.toLocaleString()}</span>
                </div>
                {giftPackaging && (
                  <div className="flex justify-between text-[#8C7A6B]">
                    <span>Luxury Gift Packaging</span>
                    <span>+ Rs. 150</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Voucher Applied</span>
                    <span>- Rs. {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#F0EBE5] flex justify-between font-bold text-sm text-[#1C1B1A]">
                  <span>Total Amount</span>
                  <span>Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleProceedToPayment}
                className="w-full py-3.5 bg-[#1C1B1A] text-white rounded-xl text-xs font-semibold tracking-wider uppercase hover:bg-[#34312F] transition-all shadow-sm"
              >
                Proceed to Payment Selection
              </button>
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD SELECTION */}
          {step === 'payment' && (
            <div className="space-y-5">
              
              {/* Payment Option Tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-white border-[#1C1B1A] ring-1 ring-[#1C1B1A] shadow-xs'
                      : 'bg-white/60 border-[#E8DFD8] hover:border-[#C5A880]'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-[#C5A880]" />
                  <span className="text-xs font-bold text-[#1C1B1A]">Cash On Delivery</span>
                  <span className="text-[9px] text-[#736C65]">Doorstep cash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('esewa')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'esewa'
                      ? 'bg-white border-[#1C1B1A] ring-1 ring-[#1C1B1A] shadow-xs'
                      : 'bg-white/60 border-[#E8DFD8] hover:border-[#C5A880]'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#60BB46] text-white flex items-center justify-center font-bold text-[11px]">
                    e
                  </div>
                  <span className="text-xs font-bold text-[#1C1B1A]">eSewa QR</span>
                  <span className="text-[9px] text-[#60BB46] font-semibold">Instant Wallet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('khalti')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'khalti'
                      ? 'bg-white border-[#1C1B1A] ring-1 ring-[#1C1B1A] shadow-xs'
                      : 'bg-white/60 border-[#E8DFD8] hover:border-[#C5A880]'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#5D2E8E] text-white flex items-center justify-center font-bold text-[11px]">
                    K
                  </div>
                  <span className="text-xs font-bold text-[#1C1B1A]">Khalti QR</span>
                  <span className="text-[9px] text-[#5D2E8E] font-semibold">Digital Payment</span>
                </button>
              </div>

              {/* COD DETAILS */}
              {paymentMethod === 'cod' && (
                <div className="bg-white p-4 rounded-xl border border-[#E8DFD8] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#1C1B1A]">
                    <Banknote className="w-4 h-4 text-[#C5A880]" />
                    <span>Cash on Delivery (COD) Confirmation</span>
                  </div>
                  <p className="text-xs text-[#5E5955] leading-relaxed">
                    You can pay the full amount of <strong>Rs. {grandTotal.toLocaleString()}</strong> in cash or scan our rider's QR code when your handmade parcel arrives at your doorstep in {selectedDeliveryZone.name}.
                  </p>
                  <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-[#E8DFD8] text-[11px] text-[#736C65] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#C5A880] shrink-0" />
                    <span>Open & inspect your handmade package in front of the rider before paying.</span>
                  </div>
                </div>
              )}

              {/* ESEWA OR KHALTI QR DETAILS */}
              {(paymentMethod === 'esewa' || paymentMethod === 'khalti') && (
                <div className="bg-white p-4 rounded-xl border border-[#E8DFD8] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-[#C5A880]" />
                      <span className="text-xs font-bold text-[#1C1B1A]">
                        Scan to Pay with {paymentMethod === 'esewa' ? 'eSewa' : 'Khalti'}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#1C1B1A]">
                      Rs. {grandTotal.toLocaleString()}
                    </span>
                  </div>

                  {/* QR Box Visual */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#FAF8F5] p-4 rounded-xl border border-[#E8DFD8]">
                    {/* Simulated Authentic Nepali QR Code Graphic */}
                    <div className="w-36 h-36 bg-white p-2 rounded-xl border border-[#E8DFD8] shadow-xs flex flex-col items-center justify-center shrink-0 relative">
                      <div className="w-full h-full bg-linear-to-br from-zinc-900 to-zinc-700 rounded-lg p-1.5 flex flex-col items-center justify-center text-white">
                        <div className="grid grid-cols-4 gap-1 w-full h-full p-1 opacity-90">
                          <div className="bg-white rounded-xs"></div>
                          <div className="bg-white rounded-xs"></div>
                          <div className="bg-zinc-800"></div>
                          <div className="bg-white rounded-xs"></div>
                          <div className="bg-zinc-800"></div>
                          <div className="bg-white rounded-xs"></div>
                          <div className="bg-white rounded-xs"></div>
                          <div className="bg-zinc-800"></div>
                          <div className="bg-white rounded-xs"></div>
                          <div className="bg-zinc-800"></div>
                          <div className="bg-white rounded-xs"></div>
                          <div className="bg-white rounded-xs"></div>
                          <div className="bg-white rounded-xs"></div>
                          <div className="bg-white rounded-xs"></div>
                          <div className="bg-zinc-800"></div>
                          <div className="bg-white rounded-xs"></div>
                        </div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="px-1.5 py-0.5 bg-white text-[9px] font-bold rounded shadow-xs text-[#1C1B1A] border border-[#E8DFD8]">
                          {paymentMethod.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-[#5E5955] space-y-1.5 flex-1">
                      <p><strong className="text-[#1C1B1A]">Account Name:</strong> Artified Nepal</p>
                      <div className="flex items-center gap-2">
                        <p><strong className="text-[#1C1B1A]">Merchant ID / Mobile:</strong> 9767573721</p>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('9767573721')}
                          className="text-[10px] text-[#C5A880] hover:text-[#1C1B1A] font-semibold flex items-center gap-1 border border-[#E8DFD8] px-1.5 py-0.5 rounded bg-white"
                        >
                          {copiedAccount ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedAccount ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <p><strong className="text-[#1C1B1A]">Bank:</strong> Global IME Bank / Nabil Bank</p>
                      <p className="text-[10px] text-[#8C7A6B]">
                        Scan from {paymentMethod === 'esewa' ? 'eSewa app' : 'Khalti app'} or Mobile Banking (Fonepay QR).
                      </p>
                    </div>
                  </div>

                  {/* Transaction ID input */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1B1A] mb-1">
                      Transaction ID / Reference Code:
                    </label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g. ESW-9812491 or FONEPAY-XXXXXX"
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8DFD8] rounded-lg text-xs text-[#1C1B1A] focus:outline-none focus:border-[#C5A880]"
                    />
                    {errors.payment && <p className="text-[10px] text-rose-500 mt-1">{errors.payment}</p>}
                  </div>

                  {/* Simulated screenshot receipt upload */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1B1A] mb-1">
                      Upload Payment Screenshot (Optional):
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 cursor-pointer py-2 px-3 bg-[#FAF8F5] border border-dashed border-[#C5A880] rounded-lg flex items-center justify-center gap-2 hover:bg-white text-xs text-[#736C65]">
                        <Upload className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>{screenshotPreview ? 'Receipt Attached ✓' : 'Click or drop screenshot'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setScreenshotPreview(URL.createObjectURL(e.target.files[0]));
                            }
                          }}
                        />
                      </label>
                      {screenshotPreview && (
                        <button
                          type="button"
                          onClick={() => setScreenshotPreview(null)}
                          className="text-xs text-rose-600 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Back & Submit Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="px-4 py-3 border border-[#E8DFD8] text-xs font-semibold uppercase tracking-wider text-[#1C1B1A] rounded-xl hover:bg-white transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="flex-1 py-3.5 bg-[#1C1B1A] text-white rounded-xl text-xs font-semibold tracking-wider uppercase hover:bg-[#34312F] transition-all shadow-sm"
                >
                  Confirm & Place Order (Rs. {grandTotal.toLocaleString()})
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ORDER CONFIRMATION & WHATSAPP TRIGGER */}
          {step === 'confirmation' && confirmedOrder && (
            <div className="text-center py-4 space-y-5">
              
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#8C7A6B]">
                  Booking Received
                </span>
                <h3 className="font-serif text-2xl text-[#1C1B1A] font-semibold mt-1">
                  Dhanyabad, {confirmedOrder.customerName}!
                </h3>
                <p className="text-xs text-[#736C65] mt-1">
                  Your handmade order <strong className="text-[#1C1B1A]">{confirmedOrder.orderId}</strong> has been logged and received.
                </p>
              </div>

              {/* High impact WhatsApp Action Banner */}
              <div className="bg-[#E8F5E9] border border-[#A5D6A7] p-5 rounded-2xl text-left space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1B5E20]">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  <span>Instant Verification & Tracking via WhatsApp</span>
                </div>
                <p className="text-xs text-[#2E7D32] leading-relaxed">
                  Send your order booking directly to our WhatsApp craft support (+977 9767573721) with one click. We will confirm your delivery slot and share live photos while weaving your piece!
                </p>

                <button
                  type="button"
                  onClick={() => triggerWhatsAppConfirmation(confirmedOrder)}
                  className="w-full py-3.5 bg-[#25D366] text-white font-semibold text-xs tracking-wider uppercase rounded-xl hover:bg-[#20ba5a] transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Confirm Order via WhatsApp (Click to Send)</span>
                </button>
              </div>

              {/* Order Receipt Details Card */}
              <div className="bg-white p-4 rounded-xl border border-[#E8DFD8] text-left space-y-2.5 text-xs text-[#5E5955]">
                <div className="flex justify-between border-b border-[#F0EBE5] pb-2 font-semibold text-[#1C1B1A]">
                  <span>Order Reference</span>
                  <span className="font-mono text-[#8C7A6B]">{confirmedOrder.orderId}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Zone</span>
                  <span className="font-medium text-[#1C1B1A]">{confirmedOrder.deliveryZone.name}</span>
                </div>

                <div className="flex justify-between">
                  <span>Payment Mode</span>
                  <span className="font-medium text-[#1C1B1A] uppercase">{confirmedOrder.paymentMethod}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Address</span>
                  <span className="font-medium text-[#1C1B1A] text-right max-w-xs">{confirmedOrder.address}</span>
                </div>

                <div className="pt-2 border-t border-[#F0EBE5] flex justify-between font-bold text-sm text-[#1C1B1A]">
                  <span>Total Payable</span>
                  <span>Rs. {confirmedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    openTracker(confirmedOrder.orderId);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#FAF8F5] border border-[#C5A880] text-[#1C1B1A] text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-white flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Truck className="w-4 h-4 text-[#C5A880]" />
                  <span>Track Order Live ({confirmedOrder.orderId})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#34312F] transition-colors"
                >
                  Return to Store
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
