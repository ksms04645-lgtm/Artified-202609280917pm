import { Product, DeliveryZone, Testimonial, TikTokReel, CraftStoryData, InstagramJournalItem } from '../types';
import { PRODUCT_REVIEWS_MAP } from '../utils/productStats';
import SAVED_PRODUCTS from './products.json';
import SAVED_CRAFT_STORY from './craft_story.json';
import { INSTAGRAM_JOURNAL_ITEMS } from './instagramJournalData';
import { TIKTOK_REELS_DATA } from './tiktokReelsData';

export const DEFAULT_INSTAGRAM_HANDLE = '@artified_np';
export const DEFAULT_INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/artified_np/';

export const DEFAULT_INSTAGRAM_ITEMS: InstagramJournalItem[] = INSTAGRAM_JOURNAL_ITEMS;

export const DEFAULT_CRAFT_STORY: CraftStoryData = (SAVED_CRAFT_STORY as unknown as CraftStoryData);

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'inside_ring_road',
    name: 'Inside Ring Road (Kathmandu / Lalitpur)',
    area: 'Kathmandu Central, Thamel, Jhamsikhel, Baluwatar, New Road, Lazimpat, Baneshwor',
    fee: 100,
    estimatedDays: '1–2 business days',
    description: 'Fast doorstep bike courier within Kathmandu Valley Ring Road'
  },
  {
    id: 'outside_ring_road',
    name: 'Outside Ring Road (Lalitpur / Bhaktapur / Kapan / Budhanilkantha)',
    area: 'Bhaktapur Durbar area, Kapan, Budhanilkantha, Dhapakhel, Imadol, Kirtipur, Thimi',
    fee: 150,
    estimatedDays: '2–3 business days',
    description: 'Extended valley doorstep delivery via express parcel service'
  },
  {
    id: 'outside_valley',
    name: 'Outside Kathmandu Valley (Major Cities in Nepal)',
    area: 'Pokhara, Chitwan, Butwal, Biratnagar, Dharan, Nepalgunj, Itahari, Birtamode, Hetauda',
    fee: 220,
    estimatedDays: '3–5 business days',
    description: 'Reliable nationwide courier delivery with SMS tracking updates'
  }
];

export const PRODUCTS: Product[] = (SAVED_PRODUCTS as unknown as Product[]).map((p) => ({
  ...p,
  customReviews: p.customReviews || PRODUCT_REVIEWS_MAP[p.id] || []
}));

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    author: 'Aayushi Khadgi',
    location: 'Baluwatar, Kathmandu',
    rating: 5,
    comment: 'Received the bag safely in very cute packaging! The pearls are tightly woven and not loose at all. Carried it for my cousin wedding party and everyone was asking where I bought it from. Thank you Artified!',
    productName: 'The Maya Aurelia Structured Pearl Bag',
    date: '2 weeks ago',
    verifiedPurchase: true
  },
  {
    id: 't2',
    author: 'Prerana Shahi',
    location: 'Jhamsikhel, Lalitpur',
    rating: 5,
    comment: 'Asked for custom length on WhatsApp and they replied fast and politely. Delivery inside Ring Road took only 1 day with COD. Choker looks very pretty with saree, happy with the purchase!',
    productName: 'Chandra Asymmetric Baroque Pearl Choker',
    date: '1 month ago',
    verifiedPurchase: true
  },
  {
    id: 't3',
    author: 'Bhawana Gurung',
    location: 'Lakeside, Pokhara',
    rating: 5,
    comment: 'Was bit worried about delivery to Pokhara, but received in 3 days safely with tracking SMS. The bag looks even nicer in hand than in TikTok video! Very happy with the quality.',
    productName: 'Himalayan Breeze Knotted Macrame Bag',
    date: '3 weeks ago',
    verifiedPurchase: true
  }
];

export const TIKTOK_REELS: TikTokReel[] = TIKTOK_REELS_DATA;

export const FAQS = [
  {
    q: 'How long does delivery take inside and outside Kathmandu Valley?',
    a: 'Inside Ring Road (Kathmandu/Lalitpur): 1–2 business days. Outside Ring Road: 2–3 business days. Major cities across Nepal (Pokhara, Chitwan, Butwal, Biratnagar, etc.): 3–5 business days via trusted courier.'
  },
  {
    q: 'How do I pay with eSewa, Khalti, or Cash on Delivery (COD)?',
    a: 'We offer Cash on Delivery (COD) within Kathmandu Valley and major cities. For eSewa and Khalti, you can scan our official QR code during checkout or transfer directly, and paste your transaction ID or send screenshot via WhatsApp.'
  },
  {
    q: 'Where is your store located and can I pick up in person?',
    a: 'Our physical store is located in Chikamugal, Kathmandu, Nepal. You can visit us in Chikamugal to pick up your handcrafted pieces or order online for fast home delivery with Cash on Delivery (COD).'
  },
  {
    q: 'How durable are the pearl bags? Will the beads break?',
    a: 'Our bags are crafted using commercial-grade reinforced transparent nylon monofilament with a tensile strength exceeding 15kg. The beads will not shatter under everyday use, and each anchor point is cross-tied four times for long-lasting structural durability.'
  },
  {
    q: 'What is your exchange and inspection policy?',
    a: 'We offer easy exchange within 24 hrs of delivery if there is any issue or if you need an adjustment. Simply contact our Chikamugal, Kathmandu store on WhatsApp with your Order ID for immediate support.'
  }
];
