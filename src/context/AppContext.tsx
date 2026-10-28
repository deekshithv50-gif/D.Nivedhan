import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  UserRole,
  Vendor,
  Product,
  Order,
  CartItem,
  ReturnRequest,
  CustomerFeedback,
  Notification,
  ErpIntegration,
  ReturnReason,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_VENDORS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_RETURNS,
  INITIAL_FEEDBACK,
  INITIAL_ERP_INTEGRATIONS,
} from '../data/initialData';

interface AppContextType {
  currentUser: User;
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  availableUsers: User[];
  
  // Vendors
  vendors: Vendor[];
  onboardNewVendor: (vendorData: Partial<Vendor>) => Vendor;
  updateVendorStatus: (vendorId: string, status: Vendor['status']) => void;
  
  // Products & SKU Inventory
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => Product;
  updateProductStock: (productId: string, delta: number) => void;
  setProductExactStock: (productId: string, exact: number) => void;
  reorderProductStock: (productId: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotalCount: number;
  
  // Checkout & Orders
  orders: Order[];
  createOrder: (orderPayload: {
    paymentMethod: 'credit_card' | 'digital_wallet' | 'bank_transfer';
    paymentDetails: Order['paymentDetails'];
    deliveryAddress: string;
  }) => Order;
  advanceOrderState: (orderId: string) => void;
  
  // Returns & RMA
  returns: ReturnRequest[];
  createReturnRequest: (data: {
    orderId: string;
    productId: string;
    reason: ReturnReason;
    notes: string;
    quantity: number;
  }) => ReturnRequest;
  updateReturnStatus: (
    returnId: string,
    status: ReturnRequest['status'],
    disposition?: ReturnRequest['disposition']
  ) => void;
  
  // Feedback
  feedback: CustomerFeedback[];
  submitFeedback: (feedback: Omit<CustomerFeedback, 'id' | 'createdAt' | 'helpfulCount'>) => void;
  vendorReplyFeedback: (feedbackId: string, reply: string) => void;
  
  // ERP Integrations
  erpIntegrations: ErpIntegration[];
  triggerErpSync: (integrationId: string) => void;
  
  // Notifications & Modals
  notifications: Notification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (title: string, message: string, type: Notification['type'], targetRole?: UserRole | 'all') => void;
  
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isHotlineOpen: boolean;
  setIsHotlineOpen: (open: boolean) => void;
  activeDeliveryOrder: Order | null;
  setActiveDeliveryOrder: (order: Order | null) => void;
  viewingReturnLabel: ReturnRequest | null;
  setViewingReturnLabel: (rma: ReturnRequest | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence with localStorage fallback (Karnataka versioned keys)
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('th_ka_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Admin by default for full evaluation
  });

  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem('th_ka_vendors');
    return saved ? JSON.parse(saved) : INITIAL_VENDORS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('th_ka_products');
    if (!saved) return INITIAL_PRODUCTS;
    try {
      const parsed: Product[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map((p) => p.id));
      const missing = INITIAL_PRODUCTS.filter((p) => !existingIds.has(p.id));
      if (missing.length > 0) {
        const merged = [...parsed, ...missing];
        localStorage.setItem('th_ka_products', JSON.stringify(merged));
        return merged;
      }
      return parsed;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('th_ka_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('th_ka_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [returns, setReturns] = useState<ReturnRequest[]>(() => {
    const saved = localStorage.getItem('th_ka_returns');
    return saved ? JSON.parse(saved) : INITIAL_RETURNS;
  });

  const [feedback, setFeedback] = useState<CustomerFeedback[]>(() => {
    const saved = localStorage.getItem('th_ka_feedback');
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACK;
  });

  const [erpIntegrations, setErpIntegrations] = useState<ErpIntegration[]>(() => {
    const saved = localStorage.getItem('th_ka_erp');
    return saved ? JSON.parse(saved) : INITIAL_ERP_INTEGRATIONS;
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-01',
      targetRole: 'all',
      title: 'Portal Live with 26 Certified Karnataka Local Vendors',
      message: 'Farmstead roots, heirloom produce, and artisan dairy catalogs synchronized across Bengaluru and Karnataka cold-chain routes.',
      timestamp: '10m ago',
      read: false,
      type: 'system',
    },
    {
      id: 'notif-02',
      targetRole: 'admin',
      title: 'Low Inventory Alert: Ramanagara Pastured Eggs',
      message: 'SKU-EGG-001 has reached 6 remaining units (Threshold: 18 units). Auto-restock signal sent.',
      timestamp: '25m ago',
      read: false,
      type: 'inventory',
    },
    {
      id: 'notif-03',
      targetRole: 'customer',
      title: 'Out for Delivery: Order #ORD-2026-7841',
      message: 'Courier #14 is on route with cold-chain verified at 3.6°C. ETA 01:45 PM.',
      timestamp: '35m ago',
      read: false,
      type: 'order',
    },
  ]);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHotlineOpen, setIsHotlineOpen] = useState(false);
  const [activeDeliveryOrder, setActiveDeliveryOrder] = useState<Order | null>(null);
  const [viewingReturnLabel, setViewingReturnLabel] = useState<ReturnRequest | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('th_ka_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('th_ka_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('th_ka_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('th_ka_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('th_ka_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('th_ka_returns', JSON.stringify(returns));
  }, [returns]);

  useEffect(() => {
    localStorage.setItem('th_ka_feedback', JSON.stringify(feedback));
  }, [feedback]);

  useEffect(() => {
    localStorage.setItem('th_ka_erp', JSON.stringify(erpIntegrations));
  }, [erpIntegrations]);

  // Role switching
  const switchUser = (userId: string) => {
    const target = INITIAL_USERS.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      addNotification('Session Switched', `Logged in as ${target.name} (${target.role.toUpperCase()})`, 'system', target.role);
    }
  };

  const switchRole = (role: UserRole) => {
    const target = INITIAL_USERS.find((u) => u.role === role);
    if (target) {
      setCurrentUser(target);
      addNotification('Role Updated', `Now acting as ${target.name} [${role.toUpperCase()}]`, 'system', role);
    }
  };

  // Vendor Onboarding
  const onboardNewVendor = (vendorData: Partial<Vendor>): Vendor => {
    const newId = `v-${String(vendors.length + 1).padStart(2, '0')}`;
    const newVendor: Vendor = {
      id: newId,
      name: vendorData.name || 'New Local Farm Producer',
      businessReg: vendorData.businessReg || `EIN-94-${Math.floor(1000000 + Math.random() * 9000000)}`,
      category: vendorData.category || 'Organic Vegetables & Roots',
      location: vendorData.location || 'Sonoma Valley, CA',
      city: vendorData.city || 'Sonoma',
      state: vendorData.state || 'CA',
      distanceMiles: vendorData.distanceMiles || 15.0,
      status: 'verified',
      rating: 5.0,
      reviewCount: 1,
      contactEmail: vendorData.contactEmail || 'contact@farm.local',
      contactPhone: vendorData.contactPhone || '(707) 555-0199',
      commissionRate: vendorData.commissionRate || 0.10,
      stripeStatus: 'connected',
      stripeAccountId: `acct_1NZ${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      deliveryRadiusMiles: vendorData.deliveryRadiusMiles || 45,
      certifications: vendorData.certifications || ['USDA Organic', 'Local Certified'],
      joinedDate: new Date().toISOString().split('T')[0],
      totalRevenue: 0,
      orderCount: 0,
      bio: vendorData.bio || 'Freshly onboarded sustainable food grower and farm partner.',
      bannerColor: 'from-emerald-800 to-teal-950',
      inventorySync: {
        system: (vendorData.inventorySync?.system as any) || 'QuickBooks Commerce',
        lastSync: 'Just now',
        status: 'synced',
      },
    };

    setVendors((prev) => [newVendor, ...prev]);
    addNotification(
      'Vendor Onboarding Approved',
      `${newVendor.name} has been verified with Stripe Express Payouts and inventory sync enabled.`,
      'vendor',
      'all'
    );
    return newVendor;
  };

  const updateVendorStatus = (vendorId: string, status: Vendor['status']) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, status } : v))
    );
    addNotification('Vendor Status Changed', `Vendor #${vendorId} status set to ${status}`, 'vendor', 'admin');
  };

  // Product & Inventory
  const addProduct = (productData: Omit<Product, 'id' | 'rating' | 'reviewCount'>): Product => {
    const newId = `p-${String(products.length + 1).padStart(3, '0')}`;
    const newProd: Product = {
      ...productData,
      id: newId,
      rating: 5.0,
      reviewCount: 0,
    };
    setProducts((prev) => [newProd, ...prev]);
    addNotification('New SKU Cataloged', `Product ${newProd.name} (${newProd.sku}) added to live inventory.`, 'inventory', 'all');
    return newProd;
  };

  const updateProductStock = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = Math.max(0, p.stock + delta);
          if (newStock <= p.minStockThreshold && p.stock > p.minStockThreshold) {
            addNotification(
              'Low Stock Warning',
              `SKU ${p.sku} (${p.name}) dropped to ${newStock} units (Threshold: ${p.minStockThreshold}).`,
              'inventory',
              'admin'
            );
          }
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
  };

  const setProductExactStock = (productId: string, exact: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, exact) } : p))
    );
  };

  const reorderProductStock = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const replenished = p.stock + p.reorderQuantity;
          addNotification(
            'Batch Restock Triggered',
            `Restocked ${p.reorderQuantity} units for SKU ${p.sku} (${p.name}). New count: ${replenished}`,
            'inventory',
            'vendor'
          );
          return { ...p, stock: replenished };
        }
        return p;
      })
    );
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartTotalCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Checkout & Order Placement
  const createOrder = ({
    paymentMethod,
    paymentDetails,
    deliveryAddress,
  }: {
    paymentMethod: 'credit_card' | 'digital_wallet' | 'bank_transfer';
    paymentDetails: Order['paymentDetails'];
    deliveryAddress: string;
  }): Order => {
    const orderId = `ORD-2026-${Math.floor(8000 + Math.random() * 1000)}`;
    const deliveryFee = cartSubtotal > 499 ? 0 : 49.00;
    const tax = +(cartSubtotal * 0.05).toFixed(2);
    const totalAmount = +(cartSubtotal + deliveryFee + tax).toFixed(2);

    const newOrder: Order = {
      id: orderId,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        sku: item.product.sku,
        quantity: item.quantity,
        price: item.product.price,
        vendorId: item.product.vendorId,
        vendorName: item.product.vendorName,
        unit: item.product.unit,
      })),
      subtotal: cartSubtotal,
      deliveryFee,
      tax,
      totalAmount,
      paymentStatus: 'paid',
      paymentMethod,
      paymentDetails,
      stripePaymentIntentId: `pi_3M${Math.random().toString(36).substring(2, 15)}`,
      createdAt: 'Just now',
      status: 'confirmed',
      deliveryCourier: 'Cold-Chain Express #14 (Driver: Manjunath K.)',
      tempMonitored: '3.4°C (Safe Range: 2-4°C)',
      deliveryAddress,
      trackingNumber: `TH-CC-${Math.floor(900000000 + Math.random() * 90000000)}`,
      estimatedDelivery: 'Today within 3 hours',
      carrierPhone: '+91 98450 28190',
      checkpoints: [
        {
          time: 'Just now',
          status: 'Order Placed & Escrow Secured',
          location: 'Stripe Gateway Authorized',
          detail: 'Payment authorized; vendor allocation dispatched to local hubs.',
          completed: true,
        },
        {
          time: 'Estimated +45m',
          status: 'Harvest Packaged & Consolidated',
          location: 'Devanahalli & Mandya Regional Cross-Dock',
          detail: 'Cold-chain tote packaged with biodegradable thermal insulation.',
          completed: false,
        },
        {
          time: 'Estimated +1h 30m',
          status: 'Loaded on Refrig Courier Vehicle',
          location: 'Yeshwanthpur Central Logistics Dock, Bengaluru',
          detail: 'Digital temperature sensor calibrated at 3.4°C.',
          completed: false,
        },
        {
          time: 'Estimated +2h 15m',
          status: 'Out for Final Local Delivery',
          location: 'Bengaluru Urban Delivery Route (Indiranagar / Koramangala)',
          detail: 'Driver in transit with live GPS beacon.',
          completed: false,
        },
        {
          time: 'Estimated +3h',
          status: 'Delivered to Doorstep / Concierge',
          location: deliveryAddress,
          detail: 'Contactless drop with temperature verification photo.',
          completed: false,
        },
      ],
    };

    // Deduct stock
    cart.forEach((c) => {
      updateProductStock(c.product.id, -c.quantity);
    });

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    addNotification(
      'Order Confirmed & Escrow Paid',
      `Order #${newOrder.id} totaling ₹${newOrder.totalAmount.toFixed(2)} processed via Stripe. Tracking #${newOrder.trackingNumber}`,
      'order',
      'all'
    );

    return newOrder;
  };

  const advanceOrderState = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const stages: Order['status'][] = [
          'confirmed',
          'packing',
          'cold_transit',
          'out_for_delivery',
          'delivered',
        ];
        const currentIndex = stages.indexOf(order.status);
        if (currentIndex < stages.length - 1) {
          const nextStatus = stages[currentIndex + 1];
          const updatedCheckpoints = order.checkpoints.map((cp, idx) => {
            if (idx <= currentIndex + 1) return { ...cp, completed: true };
            return cp;
          });

          addNotification(
            'Shipment Milestone Updated',
            `Order #${order.id} status is now: ${nextStatus.replace('_', ' ').toUpperCase()}`,
            'order',
            'all'
          );

          return {
            ...order,
            status: nextStatus,
            checkpoints: updatedCheckpoints,
          };
        }
        return order;
      })
    );
  };

  // Returns (RMA) & Automatic Shipping Label Generation
  const createReturnRequest = ({
    orderId,
    productId,
    reason,
    notes,
    quantity,
  }: {
    orderId: string;
    productId: string;
    reason: ReturnReason;
    notes: string;
    quantity: number;
  }): ReturnRequest => {
    const order = orders.find((o) => o.id === orderId);
    const item = order?.items.find((i) => i.productId === productId);
    const rmaId = `RMA-2026-${Math.floor(80000 + Math.random() * 10000)}`;
    const barcode = `TH-RMA-${rmaId.split('-')[2]}-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const newRma: ReturnRequest = {
      id: rmaId,
      orderId,
      productId,
      productName: item?.name || 'Local Farm Item',
      sku: item?.sku || 'SKU-GEN-001',
      quantity,
      vendorId: item?.vendorId || 'v-01',
      vendorName: item?.vendorName || 'Farm Vendor',
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      reason,
      notes,
      status: 'label_generated', // Automated return label generated immediately per prompt requirement
      refundAmount: +( (item?.price || 0) * quantity ).toFixed(2),
      createdAt: 'Just now',
      labelGeneratedAt: 'Just now',
      returnTrackingBarcode: barcode,
      carrier: 'TerraHarvest Karnataka Cold-Chain Express',
      returnWarehouse: 'Hub 01 Central Quality & Cold-Chain Center, Plot 14, Yeshwanthpur Industrial Area, Bengaluru, Karnataka 560022',
      disposition: 'compost',
    };

    setReturns((prev) => [newRma, ...prev]);
    setViewingReturnLabel(newRma);

    addNotification(
      'Return Authorized & Label Generated',
      `Return #${newRma.id} for "${newRma.productName}" created. Automatic return shipping label is ready to print.`,
      'return',
      'all'
    );

    return newRma;
  };

  const updateReturnStatus = (
    returnId: string,
    status: ReturnRequest['status'],
    disposition: ReturnRequest['disposition'] = 'compost'
  ) => {
    setReturns((prev) =>
      prev.map((r) => {
        if (r.id === returnId) {
          const updated = { ...r, status, disposition };
          if (status === 'refund_issued') {
            addNotification(
              'Stripe Refund Issued',
              `Refund of ₹${r.refundAmount.toFixed(2)} processed back to customer card for ${r.id}`,
              'payment',
              'all'
            );
          } else {
            addNotification(
              'Return Status Updated',
              `Return #${r.id} status changed to ${status.toUpperCase()}`,
              'return',
              'all'
            );
          }
          return updated;
        }
        return r;
      })
    );
  };

  // Feedback
  const submitFeedback = (fbData: Omit<CustomerFeedback, 'id' | 'createdAt' | 'helpfulCount'>) => {
    const newFb: CustomerFeedback = {
      ...fbData,
      id: `fb-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: 'Just now',
      helpfulCount: 1,
    };
    setFeedback((prev) => [newFb, ...prev]);
    addNotification(
      'Customer Feedback Captured',
      `New ${newFb.rating}-star review with refinement advice posted for ${newFb.productName}.`,
      'vendor',
      'all'
    );
  };

  const vendorReplyFeedback = (feedbackId: string, reply: string) => {
    setFeedback((prev) =>
      prev.map((f) => (f.id === feedbackId ? { ...f, vendorReply: reply } : f))
    );
    addNotification('Vendor Responded', 'Vendor replied to customer feedback and refinement note.', 'vendor', 'all');
  };

  // ERP Sync
  const triggerErpSync = (integrationId: string) => {
    setErpIntegrations((prev) =>
      prev.map((item) =>
        item.id === integrationId ? { ...item, status: 'syncing' } : item
      )
    );

    setTimeout(() => {
      setErpIntegrations((prev) =>
        prev.map((item) =>
          item.id === integrationId
            ? {
                ...item,
                status: 'connected',
                lastSynced: 'Just now',
              }
            : item
        )
      );
      addNotification(
        'Inventory Software Synced',
        `Real-time two-way synchronization complete for ERP connection #${integrationId}.`,
        'inventory',
        'admin'
      );
    }, 1200);
  };

  // Notifications
  const addNotification = (
    title: string,
    message: string,
    type: Notification['type'],
    targetRole: UserRole | 'all' = 'all'
  ) => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      targetRole,
      title,
      message,
      timestamp: 'Just now',
      read: false,
      type,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUser,
        switchRole,
        availableUsers: INITIAL_USERS,
        vendors,
        onboardNewVendor,
        updateVendorStatus,
        products,
        addProduct,
        updateProductStock,
        setProductExactStock,
        reorderProductStock,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartTotalCount,
        orders,
        createOrder,
        advanceOrderState,
        returns,
        createReturnRequest,
        updateReturnStatus,
        feedback,
        submitFeedback,
        vendorReplyFeedback,
        erpIntegrations,
        triggerErpSync,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsRead,
        addNotification,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isCartOpen,
        setIsCartOpen,
        isHotlineOpen,
        setIsHotlineOpen,
        activeDeliveryOrder,
        setActiveDeliveryOrder,
        viewingReturnLabel,
        setViewingReturnLabel,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
