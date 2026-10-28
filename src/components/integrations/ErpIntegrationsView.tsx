import React, { useState } from 'react';
import {
  Boxes,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowLeftRight,
  Database,
  Webhook,
  Copy,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ErpIntegrationsView: React.FC = () => {
  const { erpIntegrations, triggerErpSync, addNotification } = useApp();
  const [copiedKey, setCopiedKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://api.terraharvest.local/v1/webhooks/erp-sync');

  const handleCopyKey = () => {
    navigator.clipboard.writeText('th_live_sec_892f3a4b9981e7d2c3');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
    addNotification('API Key Copied', 'Encrypted webhook authentication bearer token copied to clipboard.', 'system', 'admin');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 uppercase font-semibold">
            <span>Seamless Inventory Ecosystem</span>
            <span>·</span>
            <span>Bi-Directional ERP Connectors</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-stone-900 mt-1">
            Existing Inventory Software Integrations
          </h2>
          <p className="text-xs text-stone-500 max-w-2xl mt-0.5">
            Synchronize stock levels, batch numbers, and post-purchase RMA returns with your existing ERP, QuickBooks, Square POS, and farm bookkeeping tools.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active 2-Way Sync Engine
          </span>
        </div>
      </div>

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {erpIntegrations.map((erp) => (
          <div
            key={erp.id}
            className="bg-white rounded-2xl border border-stone-200 hover:border-stone-300 p-6 flex flex-col justify-between shadow-2xs transition-all space-y-4"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center font-bold text-stone-700 font-display text-base">
                    {erp.logo}
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-display text-stone-900">{erp.name}</h3>
                    <p className="text-[11px] text-stone-500 font-mono">{erp.connectedFarmsCount} Local Farms Linked</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    erp.status === 'connected'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : erp.status === 'syncing'
                      ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                      : 'bg-stone-100 text-stone-600 border-stone-200'
                  }`}
                >
                  {erp.status.toUpperCase()}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-stone-600 leading-relaxed">{erp.description}</p>

              {/* Telemetry info */}
              <div className="bg-stone-50 rounded-xl p-3 text-xs font-mono space-y-1.5 border border-stone-100">
                <div className="flex justify-between text-stone-500">
                  <span>Synced SKUs:</span>
                  <span className="font-bold text-stone-800">{erp.syncedSkusCount} Active Items</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Last Reconciled:</span>
                  <span className="text-stone-800">{erp.lastSynced}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Sync Direction:</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <ArrowLeftRight className="w-3 h-3" /> Two-Way Realtime
                  </span>
                </div>
              </div>
            </div>

            {/* Sync Action */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-400 font-mono">TLS 1.3 Webhooks</span>
              <button
                onClick={() => triggerErpSync(erp.id)}
                disabled={erp.status === 'syncing'}
                className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-emerald-800 disabled:opacity-50 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCw className={`w-3 h-3 ${erp.status === 'syncing' ? 'animate-spin' : ''}`} />
                {erp.status === 'syncing' ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Post-Purchase Support & Inventory Alignment Banner */}
      <div className="bg-gradient-to-br from-stone-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-white">
              Automated Post-Purchase Reversals & Return Reconciliation
            </h3>
            <p className="text-xs text-stone-300 font-mono">
              How TerraHarvest streamlines post-purchase support and improves overall customer satisfaction
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 space-y-1">
            <h4 className="font-bold text-emerald-300">1. Instant Restock or Compost Write-off</h4>
            <p className="text-stone-300 leading-relaxed">
              When a return label is issued, the system checks whether the perishable crop can be safely redistributed or routed to organic municipal composting, automatically posting adjustment journal entries to your ERP.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 space-y-1">
            <h4 className="font-bold text-emerald-300">2. Stripe Escrow Re-Balancing</h4>
            <p className="text-stone-300 leading-relaxed">
              If an item is returned or refunded due to transit damage, the vendor ledger in QuickBooks is credited for transit insurance without disrupting weekly cash disbursements.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 space-y-1">
            <h4 className="font-bold text-emerald-300">3. Continuous SKU Depletion</h4>
            <p className="text-stone-300 leading-relaxed">
              Customer orders instantly decrement local inventory across all connected sales channels (Square farm-stand POS, Shopify, and wholesale markets) to eliminate overselling.
            </p>
          </div>
        </div>
      </div>

      {/* Webhook Developer Configuration */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Webhook className="w-5 h-5 text-emerald-700" />
            <h4 className="text-sm font-bold text-stone-900 font-display">
              Enterprise Webhook Dispatcher
            </h4>
          </div>
          <span className="text-xs font-mono text-stone-500">256-bit Encrypted HMAC Signature</span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div>
            <label className="block text-stone-600 mb-1">Webhook Endpoint URL</label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-800"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
            <div>
              <span className="text-stone-500 block text-[11px]">Signing Secret (HMAC-SHA256):</span>
              <span className="font-bold text-stone-800">••••••••••••••••••••••••892f3a4b9981e7d2c3</span>
            </div>
            <button
              onClick={handleCopyKey}
              className="px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-700 rounded-lg border border-stone-200 flex items-center gap-1 text-xs"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey ? 'Copied' : 'Copy Secret'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
