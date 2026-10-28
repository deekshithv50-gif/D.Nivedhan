import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  FileSpreadsheet,
  FileText,
  Star,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sparkles,
  DollarSign,
  Truck,
  RotateCcw,
  Store,
  Send,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AnalyticsDashboard: React.FC = () => {
  const { feedback, vendorReplyFeedback, vendors, products, orders, returns, addNotification } = useApp();
  const [selectedReportType, setSelectedReportType] = useState('weekly_settlement');
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [reportGenerated, setReportGenerated] = useState<string | null>(null);

  // Quick stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalRefunds = returns.reduce((sum, r) => sum + r.refundAmount, 0);
  const netRevenue = totalRevenue - totalRefunds;

  const handleSendReply = (feedbackId: string) => {
    const text = replyTextMap[feedbackId];
    if (!text || !text.trim()) return;
    vendorReplyFeedback(feedbackId, text);
    setReplyTextMap((prev) => ({ ...prev, [feedbackId]: '' }));
  };

  const handleGenerateReport = (type: string) => {
    setReportGenerated(type);
    addNotification(
      'Automated Report Generated',
      `Audit report [${type.toUpperCase()}] compiled and ready for CSV/PDF export.`,
      'system',
      'admin'
    );
    setTimeout(() => {
      setReportGenerated(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 uppercase font-semibold">
            <span>Marketplace Intelligence & Telemetry</span>
            <span>·</span>
            <span>Real-Time Ingestion</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-stone-900 mt-1">
            Analytics & Automated Reporting Hub
          </h2>
          <p className="text-xs text-stone-500 max-w-2xl mt-0.5">
            Holistic marketplace metrics, cold-chain SLA performance, automated post-purchase reports, and customer feedback for crop refinement.
          </p>
        </div>

        {/* Automated Report Export */}
        <div className="flex items-center gap-2">
          <select
            value={selectedReportType}
            onChange={(e) => setSelectedReportType(e.target.value)}
            className="px-3 py-2 text-xs font-mono rounded-xl border border-stone-200 bg-white text-stone-800"
          >
            <option value="weekly_settlement">Weekly Vendor Payout Settlement</option>
            <option value="daily_harvest">Daily Farm Harvest & SKU Load Manifest</option>
            <option value="cold_chain_audit">Cold-Chain Temperature & Spoilage Audit</option>
            <option value="rma_telemetry">Post-Purchase Return & RMA Root-Causes</option>
          </select>

          <button
            onClick={() => handleGenerateReport(selectedReportType)}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            {reportGenerated ? 'Compiled!' : 'Export Report'}
          </button>
        </div>
      </div>

      {/* 4 Core Financial & Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-stone-500">
            <span className="uppercase">Gross Merchandise Value</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +24.8%
            </span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-stone-950 tabular-nums">
            ₹{(totalRevenue + 482000).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-stone-500">
            Escrow settled via Stripe Connect across 26 farm accounts.
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-stone-500">
            <span className="uppercase">Net Platform Revenue</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +19.2%
            </span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-800 tabular-nums">
            ₹{Math.round((totalRevenue + 482000) * 0.10).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-stone-500">
            Fixed 10% platform commission with zero listing fees.
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-stone-500">
            <span className="uppercase">Cold-Chain Accuracy</span>
            <span className="text-emerald-700 font-semibold">99.4% SLA</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-cyan-800 tabular-nums">
            3.2°C Avg
          </div>
          <div className="text-[11px] text-stone-500">
            Telemetry verified by refrigerated sensors across all delivery legs.
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-stone-500">
            <span className="uppercase">RMA Resolution Rate</span>
            <span className="text-stone-500 font-semibold">&lt; 3.2 Hrs</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-stone-900 tabular-nums">
            {returns.length} Handled
          </div>
          <div className="text-[11px] text-stone-500">
            Instant label generation with 100% automated refund processing.
          </div>
        </div>
      </div>

      {/* Analytics Visual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Cohort Revenue Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-display text-stone-900">
                Monthly Harvest Volume & Regional Demand
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                Aggregated sales across Vegetables, Orchards, Dairy & Specialties
              </p>
            </div>
            <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2.5 py-1 rounded-lg">
              Trailing 6 Months
            </span>
          </div>

          {/* Bar chart visualization */}
          <div className="pt-4 space-y-3 font-mono text-xs">
            {[
              { month: 'April 2026', rev: 284000, percent: 55, orders: 490, topCrop: 'Early Asparagus & Strawberries' },
              { month: 'May 2026', rev: 362000, percent: 70, orders: 620, topCrop: 'Sugar Snap Peas & Cherries' },
              { month: 'June 2026', rev: 441000, percent: 84, orders: 740, topCrop: 'Heirloom Tomatoes & Peaches' },
              { month: 'July 2026', rev: 498000, percent: 92, orders: 815, topCrop: 'Sweet Corn & Blackberries' },
              { month: 'August 2026', rev: 524000, percent: 98, orders: 860, topCrop: 'Figs, Melons & Microgreens' },
              { month: 'September 2026 (MTD)', rev: 549200, percent: 100, orders: 890, topCrop: 'Honeycrisp Apples & Romanesco' },
            ].map((bar) => (
              <div key={bar.month} className="space-y-1">
                <div className="flex justify-between text-stone-700">
                  <span className="font-semibold">{bar.month}</span>
                  <div className="space-x-3">
                    <span className="text-stone-400 font-normal">{bar.topCrop}</span>
                    <span className="font-bold tabular-nums text-stone-900">₹{bar.rev.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-700 to-teal-600 rounded-full transition-all duration-500"
                    style={{ width: `${bar.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Delivery & Temperature Compliance Metrics */}
          <div className="mt-6 pt-4 border-t border-stone-100 grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-stone-50 rounded-xl">
              <span className="text-[10px] uppercase font-mono text-stone-500 block">Avg Delivery Distance</span>
              <span className="text-sm font-bold font-mono text-stone-900 mt-0.5 block">18.4 Miles</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl">
              <span className="text-[10px] uppercase font-mono text-stone-500 block">Packaging Biodegradability</span>
              <span className="text-sm font-bold font-mono text-emerald-800 mt-0.5 block">100% Compostable</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl">
              <span className="text-[10px] uppercase font-mono text-stone-500 block">Stripe Payout Punctuality</span>
              <span className="text-sm font-bold font-mono text-stone-900 mt-0.5 block">24h Settlement</span>
            </div>
          </div>
        </div>

        {/* Right Col: Automated Reporting Automation Schedule */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-bold font-display text-stone-900">
                Automated Reporting Engine
              </h3>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Cron-scheduled report pipelines push encrypted audit manifests to QuickBooks, Square, and vendor finance teams:
            </p>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 rounded-xl border border-stone-200 bg-stone-50 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-stone-800">Daily 05:00 AM Harvest Pull</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Active</span>
                </div>
                <p className="text-[11px] text-stone-500 font-sans">
                  Sends crate counts directly to all 26 local farm washing sheds.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-stone-200 bg-stone-50 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-stone-800">Weekly Stripe Escrow Sweep</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Active</span>
                </div>
                <p className="text-[11px] text-stone-500 font-sans">
                  Auto-disburses vendor balances directly to connected bank accounts.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-stone-200 bg-stone-50 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-stone-800">Monthly Spoilage & RMA Analysis</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Active</span>
                </div>
                <p className="text-[11px] text-stone-500 font-sans">
                  Compiles return reasons to guide farm packaging and transit insulation adjustments.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleGenerateReport('comprehensive_audit')}
            className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold font-mono transition-colors"
          >
            Run Instant Comprehensive Export
          </button>
        </div>
      </div>

      {/* Customer Feedback System for Product Refinement */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 uppercase font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Post-Purchase Feedback Loop</span>
            </div>
            <h3 className="text-xl font-bold font-display text-stone-900 mt-1">
              Customer Feedback & Product Refinement Telemetry
            </h3>
            <p className="text-xs text-stone-500 max-w-2xl mt-0.5">
              Captured post-delivery from customers to give growers direct agronomic guidance on harvest timing, ripening, and insulation.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-stone-600 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
            <span>Feedback Ingestion: </span>
            <span className="text-emerald-700 font-bold">100% Live</span>
          </div>
        </div>

        {/* Feedback Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feedback.map((fb) => (
            <div
              key={fb.id}
              className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-stone-300 transition-all shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">{fb.productName}</h4>
                    <p className="text-[11px] text-stone-500 font-mono">
                      {fb.customerName} · Order #{fb.orderId}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 font-bold text-xs text-stone-800">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{fb.rating}.0</span>
                  </div>
                </div>

                {/* Scores breakdown */}
                <div className="flex items-center gap-3 text-[11px] font-mono text-stone-600">
                  <span>Freshness: <strong className="text-emerald-800">{fb.freshnessScore}/5</strong></span>
                  <span>·</span>
                  <span>Packaging: <strong className="text-emerald-800">{fb.packagingScore}/5</strong></span>
                </div>

                {/* Customer Comment */}
                <p className="text-xs text-stone-700 leading-relaxed italic">
                  "{fb.comment}"
                </p>

                {/* Refinement Suggestion */}
                {fb.refinementSuggestion && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 text-xs text-emerald-950">
                    <span className="font-bold flex items-center gap-1 text-emerald-900">
                      💡 Farm Refinement Suggestion:
                    </span>
                    <p className="mt-0.5 text-emerald-800">{fb.refinementSuggestion}</p>
                  </div>
                )}

                {/* Vendor Reply if exists */}
                {fb.vendorReply && (
                  <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs text-stone-700 space-y-0.5">
                    <span className="font-bold text-stone-900">Farm Vendor Response:</span>
                    <p className="text-stone-600">{fb.vendorReply}</p>
                  </div>
                )}
              </div>

              {/* Reply Input for Vendor / Admin */}
              {!fb.vendorReply && (
                <div className="pt-2 border-t border-stone-200/60 flex items-center gap-2">
                  <input
                    type="text"
                    value={replyTextMap[fb.id] || ''}
                    onChange={(e) =>
                      setReplyTextMap({ ...replyTextMap, [fb.id]: e.target.value })
                    }
                    placeholder="Reply to customer with refinement action..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                  <button
                    onClick={() => handleSendReply(fb.id)}
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0"
                  >
                    <Send className="w-3 h-3" />
                    Reply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
