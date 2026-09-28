import { TrackedOrderData, OrderDetails } from '../types';

export const DEMO_TRACKED_ORDERS: Record<string, TrackedOrderData> = {
  'ART-2026-8842': {
    orderId: 'ART-2026-8842',
    customerName: 'Aaradhya Shrestha',
    phone: '9841****89',
    deliveryAddress: 'House 14, Ward 3, Jhamsikhel (near British School), Lalitpur',
    deliveryZoneName: 'Inside Ring Road (Kathmandu / Lalitpur)',
    paymentMethodText: 'eSewa QR Verified',
    paymentStatus: 'Paid (Txn ID: 9382104812)',
    items: [
      {
        title: 'The Maya Aurelia Structured Pearl Bag',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
        quantity: 1,
        price: 4200,
        customization: 'Detachable 100cm pearl strap requested'
      }
    ],
    total: 4450,
    orderPlacedDate: 'Yesterday, 11:30 AM',
    estimatedDeliveryDate: 'Tomorrow, by 4:00 PM',
    currentPhase: 'beading_in_progress',
    progressPercentage: 65,
    artisanName: 'Sunita Shakya',
    artisanRole: 'Master Bead Maker (9 yrs experience)',
    studioLocation: 'Artified Store, Chikamugal, Kathmandu',
    liveCraftNotes: 'Dual monofilament nylon tension verified. Shell-pearl luster sorting complete; base grid woven, currently hand-weaving the top fold and setting the 18k champagne gold hardware.',
    milestones: [
      {
        stage: 'confirmed',
        label: 'Order Confirmed & Design Locked',
        description: 'Order logged into craft register. Specifications and dimensions verified.',
        timestamp: 'Yesterday, 11:35 AM',
        location: 'Chikamugal Store',
        completed: true,
        current: false,
      },
      {
        stage: 'beading_in_progress',
        label: 'Hand-Beading & Weaving in Progress',
        description: 'Maker Sunita Shakya is weaving 10mm high-luster pearls using double monofilament tension lines.',
        timestamp: 'Today, 9:15 AM',
        location: 'Craft Bench #3, Chikamugal',
        completed: false,
        current: true,
      },
      {
        stage: 'quality_and_packaging',
        label: 'Quality Check & Luxury Dust Pouch',
        description: 'Tensile stress inspection, pearl luster polish, and placement into breathable cotton dust bag.',
        timestamp: 'Estimated: Today, 5:30 PM',
        location: 'Quality Finishing Bay',
        completed: false,
        current: false,
      },
      {
        stage: 'out_for_delivery',
        label: 'Dispatched with Valley Courier',
        description: 'Handed to express doorstep courier rider for Jhamsikhel delivery.',
        timestamp: 'Estimated: Tomorrow Morning',
        location: 'Kathmandu Valley Logistics',
        completed: false,
        current: false,
      },
      {
        stage: 'delivered',
        label: 'Delivered to Doorstep',
        description: 'Hand-delivered with 48-hour inspection guarantee.',
        timestamp: 'Estimated: Tomorrow by 4:00 PM',
        location: 'Jhamsikhel, Lalitpur',
        completed: false,
        current: false,
      },
    ]
  },
  'ART-2026-5521': {
    orderId: 'ART-2026-5521',
    customerName: 'Prakriti Thapa',
    phone: '9801****23',
    deliveryAddress: 'Villa 7, Gairidhara / Baluwatar, Kathmandu',
    deliveryZoneName: 'Inside Ring Road (Kathmandu / Lalitpur)',
    paymentMethodText: 'Cash on Delivery (COD)',
    paymentStatus: 'Pay on Doorstep (Rs. 6,850)',
    items: [
      {
        title: 'Kathmandu Heritage Baroque Pearl Choker',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
        quantity: 1,
        price: 2850
      },
      {
        title: 'The Ayla Boho Macrame Bucket Bag',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80',
        quantity: 1,
        price: 3800
      }
    ],
    total: 6850,
    orderPlacedDate: '2 Days Ago, 2:15 PM',
    estimatedDeliveryDate: 'Today between 2:00 PM – 5:00 PM',
    currentPhase: 'out_for_delivery',
    progressPercentage: 90,
    artisanName: 'Bikash & Team',
    artisanRole: 'Kathmandu Logistics Hub',
    studioLocation: 'Chikamugal Store Hub',
    courierPartner: 'Nepal Express Delivery (Rider: Bikash Maharjan • +977-9841234567)',
    consignmentCode: 'KTM-EXP-7729',
    liveCraftNotes: 'Pieces inspected, packed in signature Artified cotton dust bag with ribbon seal, and out on courier bike for Baluwatar delivery.',
    milestones: [
      {
        stage: 'confirmed',
        label: 'Order Confirmed',
        description: 'Order accepted for cash on delivery.',
        timestamp: '2 Days Ago, 2:20 PM',
        location: 'Central Craft Register',
        completed: true,
        current: false,
      },
      {
        stage: 'beading_in_progress',
        label: 'Artisanal Weaving Completed',
        description: 'Macrame knotting and natural freshwater baroque pearl stringing finished.',
        timestamp: 'Yesterday, 1:40 PM',
        location: 'Chikamugal Store Workshop',
        completed: true,
        current: false,
      },
      {
        stage: 'quality_and_packaging',
        label: 'Inspection & Gift Packaging',
        description: 'Inspected under store light, sealed in eco-cotton dust pouch with care card.',
        timestamp: 'Yesterday, 6:00 PM',
        location: 'Finishing Bay',
        completed: true,
        current: false,
      },
      {
        stage: 'out_for_delivery',
        label: 'Out for Doorstep Delivery',
        description: 'Rider Bikash Maharjan is en route across Kathmandu Ring Road to Baluwatar.',
        timestamp: 'Today, 10:45 AM',
        location: 'Kathmandu Transit Hub',
        completed: false,
        current: true,
      },
      {
        stage: 'delivered',
        label: 'Delivered to Doorstep',
        description: 'Payment collection and handover.',
        timestamp: 'Expected Today by 5:00 PM',
        location: 'Baluwatar, Kathmandu',
        completed: false,
        current: false,
      },
    ]
  },
  'ART-2026-3190': {
    orderId: 'ART-2026-3190',
    customerName: 'Dikshya Gurung',
    phone: '9813****77',
    deliveryAddress: 'Peace Lane, Lakeside Ward 6, Pokhara, Gandaki',
    deliveryZoneName: 'Outside Kathmandu Valley (Major Cities in Nepal)',
    paymentMethodText: 'Khalti Digital Wallet',
    paymentStatus: 'Verified (Txn ID: KHL-88294)',
    items: [
      {
        title: 'The Celestia Mini Pearl Box Bag',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
        quantity: 1,
        price: 3600
      }
    ],
    total: 3970,
    orderPlacedDate: 'Yesterday, 4:20 PM',
    estimatedDeliveryDate: 'Within 2–3 Days (Pokhara Express)',
    currentPhase: 'quality_and_packaging',
    progressPercentage: 80,
    artisanName: 'Reema Maharjan',
    artisanRole: 'Finishing Lead',
    studioLocation: 'Artified Store, Chikamugal, Kathmandu',
    courierPartner: 'Sundar Pokhara Express Air Cargo',
    consignmentCode: 'PKR-AIR-4418',
    liveCraftNotes: 'Box bag structural tension tested up to 12kg. Placed into breathable satin-lined dust pouch with complimentary pearl care microfiber wipe. Preparing air cargo dispatch to Pokhara.',
    milestones: [
      {
        stage: 'confirmed',
        label: 'Order Confirmed',
        description: 'Khalti payment verified for Pokhara delivery.',
        timestamp: 'Yesterday, 4:25 PM',
        location: 'Chikamugal Store Workshop',
        completed: true,
        current: false,
      },
      {
        stage: 'beading_in_progress',
        label: 'Handcrafting & Pearl Assembly',
        description: 'Mini box pearl geometry assembled by maker Reema Maharjan.',
        timestamp: 'Today, 11:00 AM',
        location: 'Chikamugal Store Workshop',
        completed: true,
        current: false,
      },
      {
        stage: 'quality_and_packaging',
        label: 'Quality Check & Protective Packaging',
        description: 'Pouching in double bubble wrap and wooden reinforced gift box for inter-city transit.',
        timestamp: 'Today, 2:30 PM',
        location: 'Packaging Station',
        completed: false,
        current: true,
      },
      {
        stage: 'out_for_delivery',
        label: 'Intercity Cargo Transit to Pokhara',
        description: 'Dispatched via daily morning air cargo courier to Pokhara airport hub.',
        timestamp: 'Scheduled for Tomorrow Morning',
        location: 'Kathmandu Cargo Terminal',
        completed: false,
        current: false,
      },
      {
        stage: 'delivered',
        label: 'Doorstep Handover in Pokhara',
        description: 'Lakeside doorstep delivery with SMS dispatch notification.',
        timestamp: 'Expected in 2 days',
        location: 'Lakeside, Pokhara',
        completed: false,
        current: false,
      },
    ]
  }
};

/**
 * Normalizes input order id (e.g. "#art-2026-8842" -> "ART-2026-8842")
 */
export function normalizeOrderId(id: string): string {
  return id.replace(/[#\s]/g, '').toUpperCase();
}

/**
 * Fetches order tracking data from demo records, local storage records,
 * or generates realistic real-time artisanal status for newly created orders.
 */
export function getTrackedOrder(orderIdInput: string): TrackedOrderData | null {
  if (!orderIdInput.trim()) return null;

  const normalized = normalizeOrderId(orderIdInput);

  // 1. Check pre-configured demo orders
  if (DEMO_TRACKED_ORDERS[normalized]) {
    return DEMO_TRACKED_ORDERS[normalized];
  }

  // 2. Check locally placed orders in browser storage
  try {
    const savedOrdersRaw = localStorage.getItem('artified_orders');
    if (savedOrdersRaw) {
      const orders: OrderDetails[] = JSON.parse(savedOrdersRaw);
      const matched = orders.find((o) => normalizeOrderId(o.orderId) === normalized);
      if (matched) {
        return buildTrackedOrderFromOrderDetails(matched);
      }
    }
  } catch {
    // ignore parsing errors
  }

  // 3. If user entered a realistic ART- format, generate realistic slow-fashion tracking
  if (normalized.startsWith('ART-') || normalized.startsWith('ART')) {
    return generateDynamicTrackedOrder(normalized);
  }

  return null;
}

function buildTrackedOrderFromOrderDetails(order: OrderDetails): TrackedOrderData {
  return {
    orderId: order.orderId,
    customerName: order.customerName,
    phone: order.phone,
    deliveryAddress: `${order.address}${order.landmark ? ` (Near ${order.landmark})` : ''}`,
    deliveryZoneName: order.deliveryZone.name,
    paymentMethodText: 
      order.paymentMethod === 'cod'
        ? 'Cash on Delivery (COD)'
        : order.paymentMethod === 'esewa'
        ? `eSewa (Txn: ${order.transactionId || 'Pending'})`
        : `Khalti (Txn: ${order.transactionId || 'Pending'})`,
    paymentStatus: order.paymentMethod === 'cod' ? 'Pay on Delivery' : 'Paid & Verified',
    items: order.items.map((i) => ({
      title: i.product.title,
      image: i.product.images[0],
      quantity: i.quantity,
      price: i.product.price,
      customization: i.customizationNote,
    })),
    total: order.total,
    orderPlacedDate: order.createdAt || 'Just now',
    estimatedDeliveryDate: order.deliveryZone.estimatedDays,
    currentPhase: 'beading_in_progress',
    progressPercentage: 35,
    artisanName: 'Sunita Shakya & Maya Craft Collective',
    artisanRole: 'Assigned Master Bead Weaver',
    studioLocation: 'Artified Store, Chikamugal, Kathmandu',
    liveCraftNotes: `Your order was received and confirmed! Master maker Sunita has reserved the required luster pearls and high-strength nylon filaments. Hand-beading is scheduled to commence at our Chikamugal store.`,
    milestones: [
      {
        stage: 'confirmed',
        label: 'Order Logged & Maker Assigned',
        description: 'Order details and custom requests confirmed by workshop lead.',
        timestamp: order.createdAt || 'Today',
        location: 'Chikamugal Store, Kathmandu',
        completed: true,
        current: false,
      },
      {
        stage: 'beading_in_progress',
        label: 'Hand-Beading & Weaving',
        description: 'Tension calculation and hand-weaving with reinforced monofilament cores.',
        timestamp: 'In Progress Now',
        location: 'Craft Bench #2, Chikamugal',
        completed: false,
        current: true,
      },
      {
        stage: 'quality_and_packaging',
        label: 'Quality Inspection & Dust Bag Pouching',
        description: 'Tensile stress inspection and luxury gift packaging.',
        timestamp: 'Upcoming (1–2 days)',
        location: 'Packaging Station',
        completed: false,
        current: false,
      },
      {
        stage: 'out_for_delivery',
        label: 'Courier Dispatch',
        description: `Handover to courier service for ${order.deliveryZone.name}.`,
        timestamp: 'Upcoming',
        location: 'Kathmandu Logistics Hub',
        completed: false,
        current: false,
      },
      {
        stage: 'delivered',
        label: 'Doorstep Delivery',
        description: 'Safe handover at your address with 48h inspection guarantee.',
        timestamp: `Estimated within ${order.deliveryZone.estimatedDays}`,
        location: order.deliveryZone.name,
        completed: false,
        current: false,
      },
    ]
  };
}

function generateDynamicTrackedOrder(orderId: string): TrackedOrderData {
  return {
    orderId: orderId.startsWith('#') ? orderId : `#${orderId}`,
    customerName: 'Valued Artified Patron',
    phone: '98XXXXXXXX',
    deliveryAddress: 'Kathmandu Valley, Nepal',
    deliveryZoneName: 'Inside Ring Road (Kathmandu / Lalitpur)',
    paymentMethodText: 'Verified Order Booking',
    paymentStatus: 'Confirmed in Ledger',
    items: [
      {
        title: 'Artisanal Handcrafted Creation',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
        quantity: 1,
        price: 4200,
        customization: 'Handmade slow-fashion piece'
      }
    ],
    total: 4300,
    orderPlacedDate: 'Recently Placed',
    estimatedDeliveryDate: '2–3 business days',
    currentPhase: 'beading_in_progress',
    progressPercentage: 55,
    artisanName: 'Saraswati & Chikamugal Collective',
    artisanRole: 'Handmade Craft Team',
    studioLocation: 'Artified Store, Chikamugal, Kathmandu',
    liveCraftNotes: 'Weaving underway in Chikamugal workshop. Each bead is manually anchored to ensure structural longevity.',
    milestones: [
      {
        stage: 'confirmed',
        label: 'Order Confirmed',
        description: 'Piece assigned to Chikamugal workshop.',
        timestamp: 'Completed',
        location: 'Chikamugal Store',
        completed: true,
        current: false,
      },
      {
        stage: 'beading_in_progress',
        label: 'Hand-Weaving in Progress',
        description: 'Hand-stringing and knot tensioning currently underway.',
        timestamp: 'Active Now',
        location: 'Chikamugal Workshop Bench',
        completed: false,
        current: true,
      },
      {
        stage: 'quality_and_packaging',
        label: 'Quality Check & Satin Dust Bag',
        description: 'Inspection and packaging in signature breathable cotton pouch.',
        timestamp: 'Estimated Tomorrow',
        location: 'Packaging Station',
        completed: false,
        current: false,
      },
      {
        stage: 'out_for_delivery',
        label: 'Dispatched via Courier',
        description: 'Handed over for doorstep delivery.',
        timestamp: 'Upcoming',
        location: 'Kathmandu Express Hub',
        completed: false,
        current: false,
      },
      {
        stage: 'delivered',
        label: 'Delivered',
        description: 'Safe arrival at your doorstep.',
        timestamp: 'Estimated in 2-3 days',
        location: 'Your Doorstep',
        completed: false,
        current: false,
      }
    ]
  };
}
