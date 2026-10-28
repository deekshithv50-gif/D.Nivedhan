import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Building2,
  MapPin,
  Star,
  ShieldCheck,
  CreditCard,
  Layers,
  ArrowUpRight,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Vendor } from '../../types';
import { VendorOnboardingWizard } from './VendorOnboardingWizard';

interface VendorDirectoryProps {
  onSelectVendorProducts?: (vendorId: string) => void;
}

export const VendorDirectory: React.FC<VendorDirectoryProps> = ({ onSelectVendorProducts }) => {
  const { vendors, products, currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [selectedVendorDetail, setSelectedVendorDetail] = useState<Vendor | null>(null);

  const categories = useMemo(() => {
    const set = new Set(vendors.map((v) => v.category));
    return ['All', ...Array.from(set)];
  }, [vendors]);

  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.businessReg.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || v.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [vendors, searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 uppercase font-semibold">
            <span>Verified Agricultural Network</span>
            <span>·</span>
            <span>{vendors.length} Certified Producers</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-stone-900 mt-1">
            Local Farm & Producer Directory
          </h2>
          <p className="text-xs text-stone-500 max-w-2xl mt-0.5">
            Connect directly with verified organic farms, regenerative growers, and artisanal producers within our regional 100-mile cold-chain radius.
          </p>
        </div>

        <button
          onClick={() => setIsOnboardingOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Onboard New Vendor
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 26+ vendors by farm name, city, certification, or EIN..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-2xs"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
          {categories.length > 5 && (
            <select
              value={categories.slice(0, 5).includes(selectedCategory) ? '' : selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-stone-100 text-stone-700 border-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="" disabled>More ({categories.length - 5})...</option>
              {categories.slice(5).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVendors.map((vendor) => {
          const vendorProductCount = products.filter((p) => p.vendorId === vendor.id).length;

          return (
            <div
              key={vendor.id}
              className="bg-white rounded-2xl border border-stone-200 hover:border-stone-300 transition-all hover:shadow-md flex flex-col justify-between overflow-hidden group"
            >
              {/* Header Gradient Strip */}
              <div className={`h-2.5 bg-gradient-to-r ${vendor.bannerColor}`} />

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Category & Status */}
                  <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono mb-2">
                    <span className="uppercase tracking-wider">{vendor.category}</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {vendor.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Vendor Name */}
                  <h3 className="text-base font-bold font-display text-stone-900 group-hover:text-emerald-800 transition-colors">
                    {vendor.name}
                  </h3>

                  {/* Location & Distance */}
                  <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      {vendor.location}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{vendor.distanceMiles} mi away</span>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-stone-600 mt-3 line-clamp-2 leading-relaxed">
                    {vendor.bio}
                  </p>

                  {/* Certifications text */}
                  <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] text-stone-600">
                    {vendor.certifications.map((c) => (
                      <span key={c} className="bg-stone-100 px-2 py-0.5 rounded-md font-medium">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Metrics */}
                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-semibold text-stone-800">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      {vendor.rating.toFixed(2)}
                      <span className="text-stone-400 font-normal">({vendor.reviewCount})</span>
                    </span>
                    <span className="text-stone-300">|</span>
                    <span className="text-stone-500 font-mono">
                      {vendorProductCount > 0 ? `${vendorProductCount} active SKUs` : 'Catalog Synced'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedVendorDetail(vendor)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                      title="View Farm Details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    {onSelectVendorProducts && (
                      <button
                        onClick={() => onSelectVendorProducts(vendor.id)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-lg text-[11px] transition-colors"
                      >
                        Products
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Vendor Inspection Modal */}
      {selectedVendorDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-700 font-semibold">
                  {selectedVendorDetail.businessReg}
                </span>
                <h3 className="text-lg font-bold font-display text-stone-900">
                  {selectedVendorDetail.name}
                </h3>
                <p className="text-xs text-stone-500">{selectedVendorDetail.location}</p>
              </div>
              <button
                onClick={() => setSelectedVendorDetail(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">{selectedVendorDetail.bio}</p>

            <div className="bg-stone-50 rounded-xl p-3 text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-stone-500">Stripe Account:</span>
                <span className="text-emerald-700 font-semibold">{selectedVendorDetail.stripeAccountId} (Connected)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Platform Commission:</span>
                <span className="text-stone-800">{(selectedVendorDetail.commissionRate * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Delivery Service Radius:</span>
                <span className="text-stone-800">{selectedVendorDetail.deliveryRadiusMiles} Miles</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">ERP Inventory System:</span>
                <span className="text-stone-800">{selectedVendorDetail.inventorySync.system} ({selectedVendorDetail.inventorySync.status})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Contact Telephone:</span>
                <span className="text-stone-800">{selectedVendorDetail.contactPhone}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedVendorDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg"
              >
                Close
              </button>
              {onSelectVendorProducts && (
                <button
                  onClick={() => {
                    const vid = selectedVendorDetail.id;
                    setSelectedVendorDetail(null);
                    onSelectVendorProducts(vid);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg"
                >
                  View Farm Catalog
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Wizard Modal */}
      <VendorOnboardingWizard
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
};
