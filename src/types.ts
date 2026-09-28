export interface Product {
  id: string;
  title: string;
  subtitle: string;
  category: 'pearl-bags' | 'pearl-necklaces' | 'macrame' | 'accessories' | 'custom-beaded';
  price: number; // In NPR (Rs.)
  originalPrice?: number; // In NPR (Rs.)
  rating: number;
  reviewsCount: number;
  soldCount?: number;
  onlineSalesCount?: number;
  customReviews?: ProductReviewItem[];
  isHandmade: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  inStock: boolean;
  stockCount: number;
  leadTime: string; // e.g. "Handmade to order: 2–4 business days"
  materials: string[];
  dimensions: string;
  weight?: string;
  description: string;
  stylingTip?: string;
  careNotes: string[];
  images: string[];
  tags: string[];
}

export interface CartItem {
  id: string; // unique item id (product.id + customization hash)
  product: Product;
  quantity: number;
  customizationNote?: string;
  selectedColorOrStyle?: string;
}

export interface DeliveryZone {
  id: 'inside_ring_road' | 'outside_ring_road' | 'outside_valley';
  name: string;
  area: string;
  fee: number; // in NPR
  estimatedDays: string;
  description: string;
}

export type PaymentMethod = 'cod' | 'esewa' | 'khalti';

export interface OrderDetails {
  orderId: string;
  items: CartItem[];
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  landmark?: string;
  deliveryZone: DeliveryZone;
  paymentMethod: PaymentMethod;
  giftPackaging: boolean;
  giftMessage?: string;
  orderNote?: string;
  subtotal: number;
  deliveryFee: number;
  giftPackagingFee: number;
  discount: number;
  total: number;
  transactionId?: string;
  paymentScreenshot?: string;
  createdAt: string;
}

export interface ProductReviewItem {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  verified: boolean;
  comment: string;
}

export interface Testimonial {
  id: string;
  author: string;
  location: string;
  rating: number;
  comment: string;
  productName: string;
  date: string;
  verifiedPurchase: boolean;
  image?: string;
}

export interface TikTokReel {
  id: string;
  title: string;
  handle: string;
  views: string;
  likes: string;
  showViews?: boolean; // Toggle whether to display view count on video
  showLikes?: boolean; // Toggle whether to display like count on video
  thumbnail: string;
  videoUrl?: string; // Direct TikTok video URL (e.g. https://www.tiktok.com/@artified_np/video/...)
  videoCaption: string;
  featuredProductName?: string;
  featuredProductId?: string;
}

export interface InstagramJournalItem {
  id: string;
  title: string;
  handle?: string;
  caption: string;
  thumbnail: string;
  videoUrl?: string;
  postUrl: string;
  likes?: string;
  views?: string;
  showViews?: boolean;
  showLikes?: boolean;
  date?: string;
  comments?: string;
  taggedProductId?: string;
  taggedProductName?: string;
  taggedProductPrice?: number;
}

export type OrderProductionPhase = 
  | 'confirmed'
  | 'handcrafting_and_packaging'
  | 'out_for_delivery'
  | 'delivered'
  | 'beading_in_progress'
  | 'quality_and_packaging';

export interface TrackingMilestone {
  stage: OrderProductionPhase;
  label: string;
  description: string;
  timestamp: string;
  location: string;
  completed: boolean;
  current: boolean;
}

export interface TrackedOrderData {
  orderId: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  deliveryZoneName: string;
  paymentMethodText: string;
  paymentStatus: string;
  items: Array<{
    title: string;
    image: string;
    quantity: number;
    price: number;
    customization?: string;
  }>;
  total: number;
  orderPlacedDate: string;
  estimatedDeliveryDate: string;
  currentPhase: OrderProductionPhase;
  progressPercentage: number;
  artisanName: string;
  artisanRole: string;
  studioLocation: string;
  courierPartner?: string;
  consignmentCode?: string;
  liveCraftNotes: string;
  milestones: TrackingMilestone[];
}

export interface CraftStoryData {
  badge: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  stat1Number: string;
  stat1Label: string;
  stat2Number: string;
  stat2Label: string;
  image1: string;
  image2: string;
  videoUrl?: string; // Optional TikTok craft / making video URL
  videoButtonLabel?: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
}

