import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Plus,
  ShoppingBag,
  Star,
  Check,
  Tag,
  AlertCircle,
  Barcode,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

interface ProductCatalogProps {
  selectedVendorId?: string | null;
  onClearVendorFilter?: () => void;
  onOpenSKUManager?: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  selectedVendorId,
  onClearVendorFilter,
  onOpenSKUManager,
}) => {
  const { products, vendors, addToCart, cart, setIsCartOpen, feedback } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesVendor = !selectedVendorId || p.vendorId === selectedVendorId;
      return matchesSearch && matchesCat && matchesVendor;
    });
  }, [products, searchQuery, selectedCategory, selectedVendorId]);

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart(product, 1);
    setAddedAnimationId(product.id);
    setTimeout(() => setAddedAnimationId(null), 1200);
  };

  const getCartQuantity = (productId: string) => {
    return cart.find((i) => i.product.id === productId)?.quantity || 0;
  };

  const activeVendor = selectedVendorId
    ? vendors.find((v) => v.id === selectedVendorId)
    : null;

  return (
    <div className="space-y-6">
      {/* Storefront Hero / Announcement */}
      <div className="bg-gradient-to-br from-emerald-900 via-stone-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-emerald-800/40 relative overflow-hidden">
        {/* Subtle decorative background organic shape */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <span className="text-[180px]">🥬</span>
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold tracking-wide">
            <span>Direct Farm Cold-Chain Logistics</span>
            <span>·</span>
            <span>Harvested Daily</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight leading-tight text-white">
            Peak Harvest Local Produce & Artisanal Goods
          </h1>
          <p className="text-sm text-stone-300 leading-relaxed">
            Every crop tracked with individual SKU inventory, origin lot verification, and continuous cold-chain monitoring from local farms to your kitchen.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-stone-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{products.length} Monitored SKUs</span>
            </div>
            <span>·</span>
            <div>2-4°C Active Cold Chain</div>
            <span>·</span>
            <div>Zero Synthetic Pesticides</div>
          </div>
        </div>
      </div>

      {/* Active Vendor Filter Notice if filtered */}
      {activeVendor && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-emerald-900">
            <span className="font-semibold">Filtering by farm:</span>
            <span className="font-bold">{activeVendor.name}</span>
            <span className="text-emerald-700">({activeVendor.location})</span>
          </div>
          <button
            onClick={onClearVendorFilter}
            className="text-xs text-emerald-800 underline font-semibold hover:text-emerald-950"
          >
            Show All Farms
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search produce by name, SKU (e.g. SKU-VEG-001), farm, or category..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-2xs"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {categories.map((cat) => (
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
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.map((product) => {
          const inCartCount = getCartQuantity(product.id);
          const isLowStock = product.stock <= product.minStockThreshold && product.stock > 0;
          const isOutOfStock = product.stock <= 0;

          return (
            <div
              key={product.id}
              onClick={() => setSelectedProductDetail(product)}
              className="bg-white rounded-2xl border border-stone-200 hover:border-stone-300 transition-all hover:shadow-md flex flex-col justify-between overflow-hidden cursor-pointer group"
            >
              {/* Product Visual Container with Real High-Definition Produce Image */}
              <div className="h-44 bg-stone-100 relative overflow-hidden border-b border-stone-100">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />

                {/* SKU Code Stamp */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md border border-stone-200/80 font-mono text-[10px] font-bold text-stone-700 shadow-2xs">
                  {product.sku}
                </div>

                {/* Stock Status Indicator */}
                <div className="absolute top-3 right-3 font-mono text-[10px] font-semibold">
                  {isOutOfStock ? (
                    <span className="bg-rose-100/95 text-rose-800 px-2 py-0.5 rounded-md border border-rose-200">
                      Out of Stock
                    </span>
                  ) : isLowStock ? (
                    <span className="bg-amber-100/95 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200">
                      Low: {product.stock} left
                    </span>
                  ) : (
                    <span className="bg-emerald-100/95 text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-200/80">
                      {product.stock} in stock
                    </span>
                  )}
                </div>

                {/* Batch Lot */}
                <div className="absolute bottom-2 left-3 text-[10px] font-mono text-white/90 bg-stone-900/60 backdrop-blur-sm px-1.5 py-0.5 rounded">
                  Lot: {product.batchLot}
                </div>
              </div>

              {/* Product Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  {/* Clean unboxed metadata with separators */}
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-600 font-mono mb-1 truncate">
                    <span>{product.vendorName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{product.origin.split('-')[0]}</span>
                  </div>

                  <h3 className="text-sm font-bold font-display text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Price Baseline and Purchase Action in Rupees */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <div className="text-base font-bold font-mono tabular-nums text-stone-900">
                      ₹{product.price.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-stone-600 font-mono">
                      {product.unit}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={isOutOfStock}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isOutOfStock
                          ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                          : addedAnimationId === product.id
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-stone-900 hover:bg-emerald-800 text-white shadow-2xs'
                      }`}
                    >
                      {addedAnimationId === product.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Added
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          {inCartCount > 0 ? `Add (${inCartCount})` : 'Add'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Product Modal (PDP) */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-stone-500">
                  <span className="text-emerald-700 font-bold">{selectedProductDetail.sku}</span>
                  <span>·</span>
                  <span>{selectedProductDetail.vendorName}</span>
                </div>
                <h2 className="text-2xl font-bold font-display text-stone-900 mt-1">
                  {selectedProductDetail.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedProductDetail(null)}
                className="text-stone-400 hover:text-stone-700 p-1 text-base font-bold"
              >
                ✕
              </button>
            </div>

            {/* Real Produce Visual Hero */}
            <div className="h-56 rounded-2xl relative overflow-hidden border border-stone-200 bg-stone-100">
              <img
                src={selectedProductDetail.imageUrl}
                alt={selectedProductDetail.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 pointer-events-none" />
              <div className="absolute bottom-3 right-3 bg-white/95 px-3 py-1 rounded-lg text-xs font-mono font-bold text-stone-800 border border-stone-200 shadow-sm">
                Lot #{selectedProductDetail.batchLot}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {selectedProductDetail.description}
            </p>

            {/* SKU and Inventory Management Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-xl text-xs font-mono">
              <div>
                <span className="text-stone-500">Retail Price:</span>
                <p className="font-bold text-stone-900 mt-0.5">₹{selectedProductDetail.price.toFixed(2)}</p>
                <p className="text-[10px] text-stone-500">{selectedProductDetail.unit}</p>
              </div>
              <div>
                <span className="text-stone-500">Stock on Hand:</span>
                <p className="font-bold text-emerald-800 mt-0.5">{selectedProductDetail.stock} units</p>
                <p className="text-[10px] text-stone-500">Min: {selectedProductDetail.minStockThreshold}</p>
              </div>
              <div>
                <span className="text-stone-500">Harvest Provenance:</span>
                <p className="font-bold text-stone-900 mt-0.5">{selectedProductDetail.origin.split('-')[0]}</p>
                <p className="text-[10px] text-stone-500">{selectedProductDetail.harvestDate}</p>
              </div>
              <div>
                <span className="text-stone-500">ERP Ledger Link:</span>
                <p className="font-bold text-stone-900 mt-0.5">{selectedProductDetail.externalErpId}</p>
                <p className="text-[10px] text-emerald-700">Live 2-Way Synced</p>
              </div>
            </div>

            {/* Customer Feedback & Refinement captured for this item */}
            <div className="pt-2 border-t border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold font-display uppercase tracking-wider text-stone-800">
                  Customer Feedback & Quality Refinements
                </h4>
                <div className="flex items-center gap-1 text-xs font-semibold text-stone-800">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{selectedProductDetail.rating.toFixed(2)}</span>
                  <span className="text-stone-400 font-normal">({selectedProductDetail.reviewCount} verified reviews)</span>
                </div>
              </div>

              {feedback.filter((f) => f.productId === selectedProductDetail.id).length > 0 ? (
                <div className="space-y-2">
                  {feedback
                    .filter((f) => f.productId === selectedProductDetail.id)
                    .map((fb) => (
                      <div key={fb.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-800">{fb.customerName}</span>
                          <span className="text-[10px] text-stone-400 font-mono">{fb.createdAt}</span>
                        </div>
                        <p className="text-stone-700">{fb.comment}</p>
                        {fb.refinementSuggestion && (
                          <p className="text-emerald-800 font-mono text-[11px] pt-1">
                            💡 Refinement Idea: {fb.refinementSuggestion}
                          </p>
                        )}
                        {fb.vendorReply && (
                          <div className="bg-white p-2 rounded-lg border border-stone-200 text-stone-600 mt-1.5 text-[11px]">
                            <span className="font-semibold text-emerald-900">Vendor Reply: </span>
                            {fb.vendorReply}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-xs text-stone-400 italic">
                  No direct refinement notes submitted for this harvest lot yet. Ratings are collected post-delivery.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                onClick={() => setSelectedProductDetail(null)}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleAddToCart(selectedProductDetail);
                  setSelectedProductDetail(null);
                  setIsCartOpen(true);
                }}
                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-sm flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Basket & Checkout (₹{selectedProductDetail.price.toFixed(2)})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
