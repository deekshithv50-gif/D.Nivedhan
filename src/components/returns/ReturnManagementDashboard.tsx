import React, { useState, useMemo } from 'react';
import {
  RotateCcw,
  Search,
  Filter,
  Plus,
  Barcode,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  FileText,
  DollarSign,
  PhoneCall,
  ChevronRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReturnRequest, ReturnReason } from '../../types';
import { ReturnLabelModal } from './ReturnLabelModal';

interface ReturnManagementDashboardProps {
  initialCreateOrder?: string | null;
  initialProductId?: string | null;
}

export const ReturnManagementDashboard: React.FC<ReturnManagementDashboardProps> = ({
  initialCreateOrder,
  initialProductId,
}) => {
  const {
    returns,
    orders,
    createReturnRequest,
    updateReturnStatus,
    currentUser,
    viewingReturnLabel,
    setViewingReturnLabel,
    setIsHotlineOpen,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [reasonFilter, setReasonFilter] = useState<string>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New return form state
  const [selectedOrderId, setSelectedOrderId] = useState(initialCreateOrder || orders[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState(initialProductId || '');
  const [returnReason, setReturnReason] = useState<ReturnReason>('Spoilage / Mold Detected (Cold-Chain Breach)');
  const [returnQuantity, setReturnQuantity] = useState(1);
  const [returnNotes, setReturnNotes] = useState('');

  const returnReasons: ReturnReason[] = [
    'Spoilage / Mold Detected (Cold-Chain Breach)',
    'Bruised / Damaged During In-Transit Handling',
    'Past Expiry / Short Shelf Life',
    'Incorrect Crop / SKU Dispatched',
    'Taste / Freshness Quality Defect',
    'Overripe / Underripe',
  ];

  const currentOrderForReturn = orders.find((o) => o.id === selectedOrderId);

  const filteredReturns = useMemo(() => {
    return returns.filter((r) => {
      // If user is a customer, only show their own returns
      if (currentUser.role === 'customer' && r.customerId !== currentUser.id) {
        return false;
      }
      // If user is a vendor, only show returns for their items
      if (currentUser.role === 'vendor' && currentUser.vendorId && r.vendorId !== currentUser.vendorId) {
        return false;
      }

      const matchesSearch =
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
      const matchesReason = reasonFilter === 'All' || r.reason === reasonFilter;

      return matchesSearch && matchesStatus && matchesReason;
    });
  }, [returns, searchQuery, statusFilter, reasonFilter, currentUser]);

  const totalRefundAmount = useMemo(() => {
    return returns.reduce((sum, r) => sum + r.refundAmount, 0);
  }, [returns]);

  const handleOpenCreateReturn = (orderId?: string, productId?: string) => {
    if (orderId) setSelectedOrderId(orderId);
    if (productId) setSelectedProductId(productId);
    setIsCreateModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId || !selectedProductId) return;

    createReturnRequest({
      orderId: selectedOrderId,
      productId: selectedProductId,
      reason: returnReason,
      notes: returnNotes,
      quantity: Number(returnQuantity) || 1,
    });

    setIsCreateModalOpen(false);
    setReturnNotes('');
  };

  const getStatusPill = (status: ReturnRequest['status']) => {
    switch (status) {
      case 'label_generated':
        return (
          <span className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-800 border border-cyan-200 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
            <Barcode className="w-3 h-3" /> Label Generated
          </span>
        );
      case 'in_transit':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold animate-pulse">
            <Clock className="w-3 h-3" /> In Transit
          </span>
        );
      case 'received_hub':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
            Received at Hub
          </span>
        );
      case 'refund_issued':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
            <CheckCircle2 className="w-3 h-3" /> Stripe Refund Issued
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
            Disputed / Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full text-[10px] font-mono">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 uppercase font-semibold">
            <span>Automated Post-Purchase RMA System</span>
            <span>·</span>
            <span>Instant Return Label Dispatch</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-stone-900 mt-1">
            Returns & Quality Claims Dashboard
          </h2>
          <p className="text-xs text-stone-500 max-w-2xl mt-0.5">
            Automatic pre-paid shipping label generation, return reason telemetry, cold-chain spoilage audits, and automated Stripe refund escrow disbursements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsHotlineOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            1-800-FARM-FRESH
          </button>

          <button
            onClick={() => handleOpenCreateReturn()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Initiate Return Request
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-mono text-stone-500 uppercase">Total RMA Requests</span>
          <p className="text-2xl font-bold font-mono text-stone-900 mt-1">{returns.length}</p>
          <span className="text-[10px] text-stone-400 font-mono">100% Automated Labels</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-mono text-emerald-800 uppercase font-semibold">Authorized Refunds</span>
          <p className="text-2xl font-bold font-mono text-emerald-800 mt-1">₹{totalRefundAmount.toFixed(2)}</p>
          <span className="text-[10px] text-emerald-600 font-mono">Pushed via Stripe Gateway</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-mono text-amber-700 uppercase font-semibold">In Transit to Hub</span>
          <p className="text-2xl font-bold font-mono text-amber-700 mt-1">
            {returns.filter((r) => r.status === 'in_transit' || r.status === 'label_generated').length}
          </p>
          <span className="text-[10px] text-amber-600 font-mono">Refrig Return Totes</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-mono text-stone-500 uppercase">Average Resolution Time</span>
          <p className="text-2xl font-bold font-mono text-stone-900 mt-1">&lt; 3.2 Hrs</p>
          <span className="text-[10px] text-stone-400 font-mono">Zero Customer Friction</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search RMAs by ID (e.g. RMA-2026-7841), product, customer name, or order..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white text-stone-700"
          >
            <option value="All">All Statuses</option>
            <option value="label_generated">Label Generated</option>
            <option value="in_transit">In Transit</option>
            <option value="received_hub">Received at Hub</option>
            <option value="refund_issued">Refund Issued</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Reason filter */}
          <select
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white text-stone-700"
          >
            <option value="All">All Reasons</option>
            {returnReasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Returns Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">RMA ID & Barcode</th>
                <th className="py-3 px-4">Produce Item & Order</th>
                <th className="py-3 px-4">Reason for Return</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Stripe Refund</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono">
              {filteredReturns.map((rma) => (
                <tr key={rma.id} className="hover:bg-stone-50/70 transition-colors">
                  {/* RMA ID & Barcode */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-stone-900">{rma.id}</div>
                    <div className="text-[10px] text-stone-400 font-mono">{rma.returnTrackingBarcode}</div>
                  </td>

                  {/* Produce Item & Order */}
                  <td className="py-3 px-4 font-sans">
                    <div className="font-bold text-stone-900">{rma.productName}</div>
                    <div className="text-[11px] text-stone-500 font-mono">
                      Order: {rma.orderId} · Qty: {rma.quantity} · {rma.vendorName}
                    </div>
                  </td>

                  {/* Reason & Notes */}
                  <td className="py-3 px-4 font-sans">
                    <span className="font-semibold text-rose-700 block text-xs">{rma.reason}</span>
                    <span className="text-[11px] text-stone-500 line-clamp-1 italic">
                      "{rma.notes}"
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 text-center">
                    {getStatusPill(rma.status)}
                  </td>

                  {/* Refund */}
                  <td className="py-3 px-4 text-right font-bold text-stone-900 tabular-nums">
                    ₹{rma.refundAmount.toFixed(2)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      {/* View / Print Shipping Label */}
                      <button
                        onClick={() => setViewingReturnLabel(rma)}
                        className="px-2.5 py-1 text-[11px] font-sans font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors flex items-center gap-1"
                        title="View & Print Shipping Label"
                      >
                        <Printer className="w-3 h-3" />
                        Label
                      </button>

                      {/* Admin/Support Status Actions */}
                      {(currentUser.role === 'admin' || currentUser.role === 'support') && (
                        <>
                          {rma.status !== 'refund_issued' && (
                            <button
                              onClick={() => updateReturnStatus(rma.id, 'refund_issued', 'compost')}
                              className="px-2.5 py-1 text-[11px] font-sans font-bold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
                              title="Authorize Instant Stripe Refund"
                            >
                              Approve Refund
                            </button>
                          )}
                          {rma.status === 'label_generated' && (
                            <button
                              onClick={() => updateReturnStatus(rma.id, 'in_transit')}
                              className="px-2.5 py-1 text-[11px] font-sans font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900"
                            >
                              Mark In-Transit
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Return Shipping Label Modal */}
      <ReturnLabelModal
        rma={viewingReturnLabel}
        onClose={() => setViewingReturnLabel(null)}
      />

      {/* Create New Return Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-stone-100">
              <div>
                <h3 className="text-base font-bold font-display text-stone-900">
                  Initiate Return & Auto-Generate Label
                </h3>
                <p className="text-xs text-stone-400 font-mono">100% Farm Freshness Guarantee</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              {/* Order selection */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Select Order
                </label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => {
                    setSelectedOrderId(e.target.value);
                    const order = orders.find((o) => o.id === e.target.value);
                    if (order && order.items[0]) {
                      setSelectedProductId(order.items[0].productId);
                    }
                  }}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 bg-white"
                  required
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.id} — ₹{o.totalAmount.toFixed(2)} ({o.createdAt})
                    </option>
                  ))}
                </select>
              </div>

              {/* Product in order selection */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Select Produce Item to Return
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 bg-white"
                  required
                >
                  <option value="">Choose item...</option>
                  {currentOrderForReturn?.items.map((i) => (
                    <option key={i.productId} value={i.productId}>
                      {i.name} ({i.sku}) — ₹{i.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reason for returning the product */}
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Reason for Returning Product *
                </label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value as ReturnReason)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 bg-white"
                  required
                >
                  {returnReasons.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={returnQuantity}
                  onChange={(e) => setReturnQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 font-mono"
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Condition Notes / Temperature Observations
                </label>
                <textarea
                  rows={2}
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  placeholder="e.g. Received warm to touch or bruised in box bottom..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 resize-none"
                  required
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
                <ShieldCheck className="w-4 h-4 text-emerald-700 inline mr-1" />
                Submitting this form immediately generates a printable barcode shipping label and dispatches a notification to customer support.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-sm"
                >
                  Authorize & Generate Return Label
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
