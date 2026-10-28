import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Plus,
  Search,
  SlidersHorizontal,
  AlertTriangle,
  RotateCw,
  Barcode,
  CheckCircle2,
  TrendingDown,
  ArrowUpDown,
  Download,
  Upload,
  RefreshCw,
  Eye,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

export const InventorySKUManager: React.FC = () => {
  const {
    products,
    vendors,
    currentUser,
    updateProductStock,
    setProductExactStock,
    reorderProductStock,
    addProduct,
    erpIntegrations,
    triggerErpSync,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [vendorFilter, setVendorFilter] = useState('All');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'low' | 'out'>('all');
  const [selectedBarcodeProduct, setSelectedBarcodeProduct] = useState<Product | null>(null);
  const [isAddSkuModalOpen, setIsAddSkuModalOpen] = useState(false);

  // New SKU form
  const [newVendorId, setNewVendorId] = useState(vendors[0]?.id || 'v-01');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Organic Vegetables & Roots');
  const [newSku, setNewSku] = useState('');
  const [newPrice, setNewPrice] = useState(150.00);
  const [newWholesale, setNewWholesale] = useState(95.00);
  const [newUnit, setNewUnit] = useState('per kg');
  const [newStock, setNewStock] = useState(50);
  const [newThreshold, setNewThreshold] = useState(15);
  const [newReorderQty, setNewReorderQty] = useState(40);
  const [newBatchLot, setNewBatchLot] = useState('LOT-2026-SEP-14');

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // If user is a vendor, only show their products by default
      if (currentUser.role === 'vendor' && currentUser.vendorId && p.vendorId !== currentUser.vendorId) {
        return false;
      }
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.batchLot.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVendor = vendorFilter === 'All' || p.vendorId === vendorFilter;
      const isLow = p.stock <= p.minStockThreshold && p.stock > 0;
      const isOut = p.stock <= 0;
      const matchesStatus =
        stockStatusFilter === 'all' ||
        (stockStatusFilter === 'low' && isLow) ||
        (stockStatusFilter === 'out' && isOut);

      return matchesSearch && matchesVendor && matchesStatus;
    });
  }, [products, searchQuery, vendorFilter, stockStatusFilter, currentUser]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.stock <= p.minStockThreshold && p.stock > 0).length;
  }, [products]);

  const outOfStockCount = useMemo(() => {
    return products.filter((p) => p.stock <= 0).length;
  }, [products]);

  const totalInventoryUnits = useMemo(() => {
    return products.reduce((sum, p) => sum + p.stock, 0);
  }, [products]);

  const handleCreateSku = (e: React.FormEvent) => {
    e.preventDefault();
    const vendor = vendors.find((v) => v.id === newVendorId) || vendors[0];
    const generatedSku = newSku.trim() || `SKU-${newCategory.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    addProduct({
      vendorId: vendor.id,
      vendorName: vendor.name,
      name: newName,
      category: newCategory,
      sku: generatedSku,
      batchLot: newBatchLot || `LOT-2026-${Math.floor(100 + Math.random() * 900)}`,
      price: Number(newPrice),
      wholesalePrice: Number(newWholesale),
      unit: newUnit,
      stock: Number(newStock),
      minStockThreshold: Number(newThreshold),
      reorderQuantity: Number(newReorderQty),
      isOrganic: true,
      dietary: ['Organic', 'Non-GMO', 'Vegan'],
      origin: `${vendor.city}, ${vendor.state}`,
      harvestDate: 'Scheduled harvest',
      shelfLifeDays: 14,
      description: `Freshly cataloged farm produce: ${newName}.`,
      imageEmoji: '🥕',
      imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=800&q=80',
      accentColor: 'from-emerald-500/20 to-teal-500/20',
      externalErpId: `ERP-${generatedSku}`,
    });

    setIsAddSkuModalOpen(false);
    setNewName('');
    setNewSku('');
  };

  return (
    <div className="space-y-6">
      {/* Header & KPI Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 uppercase font-semibold">
            <span>Real-Time Inventory Operations</span>
            <span>·</span>
            <span>Continuous SKU Telemetry</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-stone-900 mt-1">
            Individual SKU & Inventory Management
          </h2>
          <p className="text-xs text-stone-500 max-w-2xl mt-0.5">
            Monitor real-time warehouse and farm gate stock levels, track harvest lots, trigger batch restocks, and synchronize with external ERP software.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddSkuModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Create SKU
          </button>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-mono text-stone-500 uppercase">Total Cataloged SKUs</span>
          <p className="text-2xl font-bold font-mono text-stone-900 mt-1">{products.length}</p>
          <span className="text-[10px] text-stone-400 font-mono">100% Barcode Indexed</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-mono text-stone-500 uppercase">Available Units in Hubs</span>
          <p className="text-2xl font-bold font-mono text-emerald-800 mt-1">{totalInventoryUnits}</p>
          <span className="text-[10px] text-emerald-600 font-mono">Cold-Chain Monitored</span>
        </div>

        <div
          onClick={() => setStockStatusFilter('low')}
          className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs cursor-pointer hover:border-amber-400 transition-colors"
        >
          <span className="text-[11px] font-mono text-amber-700 uppercase font-semibold">Low Stock Threshold</span>
          <p className="text-2xl font-bold font-mono text-amber-700 mt-1">{lowStockCount}</p>
          <span className="text-[10px] text-amber-600 font-mono">Needs Restock Order</span>
        </div>

        <div
          onClick={() => setStockStatusFilter('out')}
          className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs cursor-pointer hover:border-rose-400 transition-colors"
        >
          <span className="text-[11px] font-mono text-rose-700 uppercase font-semibold">Out of Stock</span>
          <p className="text-2xl font-bold font-mono text-rose-700 mt-1">{outOfStockCount}</p>
          <span className="text-[10px] text-rose-600 font-mono">Auto-Restock Alerted</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by SKU code (e.g. SKU-VEG-001), item name, batch lot, or farm..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Vendor Filter */}
          {currentUser.role !== 'vendor' && (
            <select
              value={vendorFilter}
              onChange={(e) => setVendorFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white text-stone-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="All">All Farms (26+)</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          )}

          {/* Status Tabs */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setStockStatusFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                stockStatusFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStockStatusFilter('low')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                stockStatusFilter === 'low'
                  ? 'bg-white text-amber-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Low ({lowStockCount})
            </button>
            <button
              onClick={() => setStockStatusFilter('out')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                stockStatusFilter === 'out'
                  ? 'bg-white text-rose-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Out ({outOfStockCount})
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time SKU Inventory Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">SKU / Lot #</th>
                <th className="py-3 px-4">Product Name & Category</th>
                <th className="py-3 px-4">Farm Origin</th>
                <th className="py-3 px-4 text-right">Retail / Wholesale</th>
                <th className="py-3 px-4 text-center">Stock Level</th>
                <th className="py-3 px-4 text-center">Min / Reorder</th>
                <th className="py-3 px-4 text-right">Quick Stock Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono">
              {filteredProducts.map((p) => {
                const isLow = p.stock <= p.minStockThreshold && p.stock > 0;
                const isOut = p.stock <= 0;
                const margin = (((p.price - p.wholesalePrice) / p.price) * 100).toFixed(0);

                return (
                  <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* SKU & Lot */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-stone-900">{p.sku}</span>
                        <button
                          onClick={() => setSelectedBarcodeProduct(p)}
                          className="text-stone-400 hover:text-stone-800 p-0.5"
                          title="Generate Barcode / Scan Tag"
                        >
                          <Barcode className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-[10px] text-stone-400 font-normal">
                        Lot: {p.batchLot}
                      </div>
                    </td>

                    {/* Product Name */}
                    <td className="py-3 px-4 font-sans">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=300&q=80';
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-stone-900 line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-stone-500 font-mono">{p.category}</p>
                        </div>
                      </div>
                    </td>

                    {/* Farm Origin */}
                    <td className="py-3 px-4 font-sans">
                      <p className="font-semibold text-stone-800">{p.vendorName}</p>
                      <p className="text-[11px] text-stone-500 font-mono">{p.origin.split('-')[0]}</p>
                    </td>

                    {/* Price & Margin in Rupees */}
                    <td className="py-3 px-4 text-right tabular-nums">
                      <div className="font-bold text-stone-900">₹{p.price.toFixed(2)}</div>
                      <div className="text-[10px] text-stone-400">
                        Cost: ₹{p.wholesalePrice.toFixed(2)} ({margin}% margin)
                      </div>
                    </td>

                    {/* Stock Level */}
                    <td className="py-3 px-4 text-center tabular-nums">
                      <div className="inline-flex items-center gap-1.5 font-bold">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isOut
                              ? 'bg-rose-500'
                              : isLow
                              ? 'bg-amber-500 animate-pulse'
                              : 'bg-emerald-500'
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            isOut
                              ? 'text-rose-700'
                              : isLow
                              ? 'text-amber-800'
                              : 'text-stone-900'
                          }`}
                        >
                          {p.stock}
                        </span>
                        <span className="text-[10px] text-stone-400 font-normal">units</span>
                      </div>
                    </td>

                    {/* Min / Reorder */}
                    <td className="py-3 px-4 text-center text-[11px] text-stone-500 tabular-nums">
                      <div>Min: {p.minStockThreshold}</div>
                      <div className="text-[10px] text-stone-400">Batch: +{p.reorderQuantity}</div>
                    </td>

                    {/* Quick Stock Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {/* Minus */}
                        <button
                          onClick={() => updateProductStock(p.id, -1)}
                          disabled={p.stock <= 0}
                          className="w-7 h-7 rounded-lg border border-stone-200 hover:bg-stone-100 flex items-center justify-center font-bold text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Deduct 1 unit"
                        >
                          -
                        </button>
                        {/* Plus */}
                        <button
                          onClick={() => updateProductStock(p.id, 1)}
                          className="w-7 h-7 rounded-lg border border-stone-200 hover:bg-stone-100 flex items-center justify-center font-bold text-stone-700"
                          title="Add 1 unit"
                        >
                          +
                        </button>
                        {/* Restock Batch */}
                        <button
                          onClick={() => reorderProductStock(p.id)}
                          className="px-2.5 py-1 text-[11px] font-sans font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors flex items-center gap-1"
                          title="Trigger batch harvest restock"
                        >
                          <RotateCw className="w-3 h-3" />
                          Restock
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Barcode & SKU Inspection Modal */}
      {selectedBarcodeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4 text-center">
            <div className="flex justify-between items-center pb-2 border-b border-stone-100">
              <span className="text-xs font-mono font-bold text-emerald-800">
                Hub Warehouse Barcode Tag
              </span>
              <button
                onClick={() => setSelectedBarcodeProduct(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-left space-y-1">
              <h4 className="text-sm font-bold text-stone-900 font-display">
                {selectedBarcodeProduct.name}
              </h4>
              <p className="text-xs text-stone-500 font-mono">
                {selectedBarcodeProduct.vendorName} · Lot #{selectedBarcodeProduct.batchLot}
              </p>
            </div>

            {/* Rendered SVG Barcode (Code-128 Mock) */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
              <svg className="w-full h-16 mx-auto" viewBox="0 0 240 60" preserveAspectRatio="none">
                <g fill="#1C1917">
                  <rect x="10" y="5" width="3" height="50" />
                  <rect x="15" y="5" width="2" height="50" />
                  <rect x="20" y="5" width="4" height="50" />
                  <rect x="26" y="5" width="1" height="50" />
                  <rect x="30" y="5" width="3" height="50" />
                  <rect x="36" y="5" width="2" height="50" />
                  <rect x="42" y="5" width="4" height="50" />
                  <rect x="49" y="5" width="1" height="50" />
                  <rect x="54" y="5" width="5" height="50" />
                  <rect x="62" y="5" width="2" height="50" />
                  <rect x="68" y="5" width="3" height="50" />
                  <rect x="74" y="5" width="2" height="50" />
                  <rect x="80" y="5" width="4" height="50" />
                  <rect x="88" y="5" width="2" height="50" />
                  <rect x="94" y="5" width="5" height="50" />
                  <rect x="103" y="5" width="1" height="50" />
                  <rect x="108" y="5" width="3" height="50" />
                  <rect x="114" y="5" width="4" height="50" />
                  <rect x="122" y="5" width="2" height="50" />
                  <rect x="128" y="5" width="3" height="50" />
                  <rect x="135" y="5" width="2" height="50" />
                  <rect x="141" y="5" width="4" height="50" />
                  <rect x="148" y="5" width="1" height="50" />
                  <rect x="153" y="5" width="5" height="50" />
                  <rect x="162" y="5" width="2" height="50" />
                  <rect x="168" y="5" width="4" height="50" />
                  <rect x="175" y="5" width="1" height="50" />
                  <rect x="180" y="5" width="3" height="50" />
                  <rect x="186" y="5" width="2" height="50" />
                  <rect x="192" y="5" width="4" height="50" />
                  <rect x="200" y="5" width="2" height="50" />
                  <rect x="206" y="5" width="3" height="50" />
                  <rect x="212" y="5" width="4" height="50" />
                  <rect x="220" y="5" width="2" height="50" />
                  <rect x="226" y="5" width="4" height="50" />
                </g>
              </svg>
              <span className="font-mono text-xs font-bold tracking-widest text-stone-800">
                *{selectedBarcodeProduct.sku}*
              </span>
            </div>

            <div className="flex justify-between items-center text-xs font-mono text-stone-500">
              <span>Stock: {selectedBarcodeProduct.stock} units</span>
              <span>Price: ₹{selectedBarcodeProduct.price.toFixed(2)}</span>
            </div>

            <button
              onClick={() => {
                window.print();
              }}
              className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-xs shadow transition-colors"
            >
              Print Warehouse Bin Tag
            </button>
          </div>
        </div>
      )}

      {/* Add New SKU Modal */}
      {isAddSkuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-stone-100">
              <h3 className="text-base font-bold font-display text-stone-900">
                Catalog New Individual SKU
              </h3>
              <button
                onClick={() => setIsAddSkuModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSku} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Assign to Local Farm Vendor
                </label>
                <select
                  value={newVendorId}
                  onChange={(e) => setNewVendorId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 bg-white"
                >
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Crop / Product Name *
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Purple Romanesco Cauliflower"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    SKU Code (Tracking ID)
                  </label>
                  <input
                    type="text"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    placeholder="SKU-VEG-XXX"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Batch / Harvest Lot
                  </label>
                  <input
                    type="text"
                    value={newBatchLot}
                    onChange={(e) => setNewBatchLot(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Retail Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Wholesale Cost (₹)
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    value={newWholesale}
                    onChange={(e) => setNewWholesale(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="per lb"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Low Alert Threshold
                  </label>
                  <input
                    type="number"
                    value={newThreshold}
                    onChange={(e) => setNewThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Reorder Batch Qty
                  </label>
                  <input
                    type="number"
                    value={newReorderQty}
                    onChange={(e) => setNewReorderQty(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSkuModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm"
                >
                  Save & Index SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
