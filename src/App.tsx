import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { ProductCatalog } from './components/catalog/ProductCatalog';
import { VendorDirectory } from './components/vendors/VendorDirectory';
import { InventorySKUManager } from './components/inventory/InventorySKUManager';
import { DeliveryTrackingModule } from './components/logistics/DeliveryTrackingModule';
import { ReturnManagementDashboard } from './components/returns/ReturnManagementDashboard';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { ErpIntegrationsView } from './components/integrations/ErpIntegrationsView';
import { JavaBackendExplorer } from './components/java/JavaBackendExplorer';
import { CartAndCheckoutModal } from './components/cart/CartAndCheckoutModal';
import { CustomerCareHotline } from './components/common/CustomerCareHotline';
import { AuthModal } from './components/auth/AuthModal';
import { TerraLogo } from './components/common/TerraLogo';
import { ShieldCheck, PhoneCall, Heart, ExternalLink, RefreshCw } from 'lucide-react';
import { Order } from './types';

const MainPortalContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('catalog');
  const [selectedVendorForCatalog, setSelectedVendorForCatalog] = useState<string | null>(null);
  const [initialReturnOrder, setInitialReturnOrder] = useState<string | null>(null);
  const [initialReturnProduct, setInitialReturnProduct] = useState<string | null>(null);

  const { setIsHotlineOpen, setIsAuthModalOpen, currentUser } = useApp();

  const handleSelectVendorProducts = (vendorId: string) => {
    setSelectedVendorForCatalog(vendorId);
    setActiveTab('catalog');
  };

  const handleInitiateReturn = (order: Order, productId: string) => {
    setInitialReturnOrder(order.id);
    setInitialReturnProduct(productId);
    setActiveTab('returns');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'catalog' && (
          <ProductCatalog
            selectedVendorId={selectedVendorForCatalog}
            onClearVendorFilter={() => setSelectedVendorForCatalog(null)}
            onOpenSKUManager={() => setActiveTab('inventory')}
          />
        )}

        {activeTab === 'vendors' && (
          <VendorDirectory onSelectVendorProducts={handleSelectVendorProducts} />
        )}

        {activeTab === 'inventory' && <InventorySKUManager />}

        {activeTab === 'logistics' && (
          <DeliveryTrackingModule onInitiateReturn={handleInitiateReturn} />
        )}

        {activeTab === 'returns' && (
          <ReturnManagementDashboard
            initialCreateOrder={initialReturnOrder}
            initialProductId={initialReturnProduct}
          />
        )}

        {activeTab === 'analytics' && <AnalyticsDashboard />}

        {activeTab === 'integrations' && <ErpIntegrationsView />}

        {activeTab === 'javacode' && <JavaBackendExplorer />}
      </main>

      {/* Global Modals & Drawers */}
      <CartAndCheckoutModal />
      <CustomerCareHotline />
      <AuthModal />

      {/* Clean Modern Footer */}
      <footer className="border-t border-stone-200 bg-white mt-12 py-10 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-stone-100">
            {/* Col 1: Brand */}
            <div className="space-y-3 md:col-span-1">
              <TerraLogo variant="full" size="md" />
              <p className="text-xs text-stone-500 leading-relaxed">
                Regional agricultural exchange connecting 26+ verified organic growers directly with consumers and local restaurants through temperature-monitored cold-chain delivery.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-mono font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Encrypted AES-256 Vault Active</span>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-stone-900 font-mono uppercase tracking-wider block mb-1">
                Marketplace Modules
              </span>
              <ul className="space-y-1.5 text-stone-600">
                <li>
                  <button onClick={() => setActiveTab('catalog')} className="hover:text-emerald-800">
                    Produce Catalog & Prices
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('vendors')} className="hover:text-emerald-800">
                    26 Certified Local Vendors
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('inventory')} className="hover:text-emerald-800">
                    SKU Tracking & Stock Levels
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('logistics')} className="hover:text-emerald-800">
                    Cold-Chain Courier Tracking
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Post-Purchase & Returns */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-stone-900 font-mono uppercase tracking-wider block mb-1">
                Post-Purchase & Support
              </span>
              <ul className="space-y-1.5 text-stone-600">
                <li>
                  <button onClick={() => setActiveTab('returns')} className="hover:text-emerald-800">
                    Return Claims & Auto-Labels
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsHotlineOpen(true)} className="hover:text-emerald-800 text-emerald-800 font-bold">
                    1-800-FARM-FRESH (Care Line)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('analytics')} className="hover:text-emerald-800">
                    Crop Refinement Feedback
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('integrations')} className="hover:text-emerald-800">
                    ERP Inventory Software Sync
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Customer Care Toll-Free Badge */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2 text-xs">
              <span className="font-bold font-display text-stone-900 flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-emerald-700" />
                Customer Care & Returns
              </span>
              <p className="text-stone-500 text-[11px] leading-relaxed">
                Need immediate help with damaged produce or return shipping? Call our local post-purchase support line:
              </p>
              <button
                onClick={() => setIsHotlineOpen(true)}
                className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-mono font-bold text-xs shadow-xs transition-colors"
              >
                1-800-FARM-FRESH
              </button>
              <div className="text-[10px] text-stone-400 font-mono text-center">
                Operating 24/7 with Live Agent Dispatch
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
            <p>© {new Date().getFullYear()} TerraHarvest Food & Produce Exchange Inc. All rights reserved.</p>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <button onClick={() => setIsAuthModalOpen(true)} className="hover:underline">
                Current Role: [{currentUser.role.toUpperCase()}]
              </button>
              <span>·</span>
              <span>PCI-DSS Level 1 Stripe</span>
              <span>·</span>
              <span>USDA Organic Aligned</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainPortalContent />
    </AppProvider>
  );
}
