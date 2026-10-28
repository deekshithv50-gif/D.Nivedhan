export type UserRole = 'admin' | 'vendor' | 'customer' | 'support';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  vendorId?: string; // If role is 'vendor'
  avatar?: string;
  token: string;
  permissions: string[];
}

export interface Vendor {
  id: string;
  name: string;
  businessReg: string; // EIN or state registry
  category: string;
  location: string;
  city: string;
  state: string;
  distanceMiles: number;
  status: 'active' | 'pending_review' | 'verified' | 'suspended';
  rating: number;
  reviewCount: number;
  contactEmail: string;
  contactPhone: string;
  commissionRate: number; // e.g. 0.10 for 10%
  stripeStatus: 'connected' | 'pending' | 'restricted';
  stripeAccountId: string;
  deliveryRadiusMiles: number;
  certifications: string[];
  joinedDate: string;
  totalRevenue: number;
  orderCount: number;
  bio: string;
  bannerColor: string;
  inventorySync: {
    system: 'QuickBooks Commerce' | 'Square POS' | 'Shopify Plus' | 'Katana MRP' | 'Manual';
    lastSync: string;
    status: 'synced' | 'pending' | 'error';
  };
}

export interface Product {
  id: string;
  vendorId: string;
  vendorName: string;
  name: string;
  category: string;
  sku: string; // Unique SKU tracking
  batchLot: string;
  price: number; // Retail selling price
  wholesalePrice: number; // Cost to platform
  unit: string; // 'per lb', 'per bunch', 'per 16 oz jar', etc.
  stock: number;
  minStockThreshold: number;
  reorderQuantity: number;
  isOrganic: boolean;
  dietary: string[]; // ['Organic', 'Non-GMO', 'Vegan', 'Gluten-Free']
  origin: string;
  harvestDate: string;
  shelfLifeDays: number;
  description: string;
  imageEmoji?: string;
  imageUrl: string;
  accentColor: string;
  rating: number;
  reviewCount: number;
  externalErpId: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DeliveryCheckpoint {
  time: string;
  status: string;
  location: string;
  detail: string;
  completed: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: {
    productId: string;
    name: string;
    sku: string;
    quantity: number;
    price: number;
    vendorId: string;
    vendorName: string;
    unit: string;
  }[];
  totalAmount: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  paymentStatus: 'paid' | 'escrow_held' | 'refunded';
  paymentMethod: 'credit_card' | 'digital_wallet' | 'bank_transfer';
  paymentDetails: {
    brand?: string;
    last4?: string;
    walletType?: 'Apple Pay' | 'Google Pay';
    bankName?: string;
    transactionId: string;
  };
  stripePaymentIntentId: string;
  createdAt: string;
  status: 'confirmed' | 'packing' | 'cold_transit' | 'out_for_delivery' | 'delivered';
  deliveryCourier: string;
  tempMonitored: string;
  deliveryAddress: string;
  trackingNumber: string;
  estimatedDelivery: string;
  carrierPhone: string;
  checkpoints: DeliveryCheckpoint[];
}

export type ReturnReason =
  | 'Arrived bruised / damaged produce'
  | 'Spoiled / past freshness threshold'
  | 'Missing item / wrong SKU received'
  | 'Cold-chain temperature breach (>8°C)'
  | 'Late delivery beyond promised window'
  | 'Quality not as described'
  | 'Spoilage / Mold Detected (Cold-Chain Breach)'
  | 'Bruised / Damaged During In-Transit Handling'
  | 'Past Expiry / Short Shelf Life'
  | 'Incorrect Crop / SKU Dispatched'
  | 'Taste / Freshness Quality Defect'
  | 'Overripe / Underripe';

export type ReturnStatus =
  | 'pending'
  | 'approved'
  | 'label_generated'
  | 'in_transit'
  | 'shipped'
  | 'received_hub'
  | 'refund_issued'
  | 'rejected';

export interface ReturnRequest {
  id: string; // e.g. RMA-2026-84920
  orderId: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  vendorId: string;
  vendorName: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  reason: ReturnReason;
  notes: string;
  status: ReturnStatus;
  refundAmount: number;
  createdAt: string;
  labelGeneratedAt?: string;
  returnTrackingBarcode: string;
  carrier: string;
  returnWarehouse: string;
  disposition: 'compost' | 're-inspect' | 'vendor_credit';
}

export interface CustomerFeedback {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  sku: string;
  vendorId: string;
  vendorName: string;
  customerName: string;
  rating: number; // 1-5
  freshnessScore: number; // 1-5
  packagingScore: number; // 1-5
  comment: string;
  refinementSuggestion: string;
  createdAt: string;
  vendorReply?: string;
  helpfulCount: number;
}

export interface Notification {
  id: string;
  targetRole: UserRole | 'all';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'return' | 'order' | 'inventory' | 'payment' | 'vendor' | 'system';
}

export interface ErpIntegration {
  id: string;
  name: string;
  vendorId?: string;
  vendorName?: string;
  status: 'connected' | 'syncing' | 'error' | 'disconnected';
  lastSynced: string;
  skuCount?: number;
  syncedSkusCount?: number;
  connectedFarmsCount?: number;
  description?: string;
  logo?: string;
  autoSyncEnabled?: boolean;
  webhookUrl?: string;
  apiVersion?: string;
}
