import React, { useState } from 'react';
import {
  Truck,
  ThermometerSnowflake,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Navigation,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';

interface DeliveryTrackingModuleProps {
  onInitiateReturn?: (order: Order, productId: string) => void;
}

export const DeliveryTrackingModule: React.FC<DeliveryTrackingModuleProps> = ({
  onInitiateReturn,
}) => {
  const { orders, activeDeliveryOrder, setActiveDeliveryOrder, advanceOrderState, setIsHotlineOpen } = useApp();
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    activeDeliveryOrder?.id || orders[0]?.id || ''
  );

  const currentOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  if (!currentOrder) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-stone-200">
        <Truck className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-stone-800">No active delivery shipments found</h3>
        <p className="text-xs text-stone-500">Place an order through the catalog to see real-time tracking.</p>
      </div>
    );
  }

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded-full text-xs font-mono font-bold">Confirmed</span>;
      case 'packing':
        return <span className="bg-blue-100 text-blue-900 px-2.5 py-1 rounded-full text-xs font-mono font-bold">Farm Packing</span>;
      case 'cold_transit':
        return <span className="bg-cyan-100 text-cyan-900 px-2.5 py-1 rounded-full text-xs font-mono font-bold">Cold Transit</span>;
      case 'out_for_delivery':
        return <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full text-xs font-mono font-bold animate-pulse">Out for Delivery</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full text-xs font-mono font-bold">Delivered</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 uppercase font-semibold">
            <span>Refrigerated Delivery Telemetry</span>
            <span>·</span>
            <span>Active Temperature Verification</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-stone-900 mt-1">
            Delivery Logistics & Shipment Tracker
          </h2>
          <p className="text-xs text-stone-500 max-w-2xl mt-0.5">
            Real-time GPS routing, cold-chain temperature telemetry, and contactless verification for farm produce orders.
          </p>
        </div>

        {/* Order Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-stone-600">Select Order:</label>
          <select
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="px-3 py-1.5 text-xs font-mono font-semibold rounded-xl border border-stone-200 bg-white text-stone-800"
          >
            {orders.map((ord) => (
              <option key={ord.id} value={ord.id}>
                {ord.id} — ₹{ord.totalAmount.toFixed(2)} ({ord.status.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Tracking Card */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        {/* Top Status Strip */}
        <div className="bg-stone-900 text-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono text-emerald-400 font-bold tracking-wider">
                Tracking #{currentOrder.trackingNumber}
              </span>
              {getStatusBadge(currentOrder.status)}
            </div>
            <h3 className="text-xl font-bold font-display text-white mt-1">
              Order {currentOrder.id}
            </h3>
            <p className="text-xs text-stone-400 font-mono mt-0.5">
              Courier: {currentOrder.deliveryCourier}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-stone-800/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-stone-700">
            <div className="flex items-center gap-2 text-cyan-300 font-mono">
              <ThermometerSnowflake className="w-5 h-5 text-cyan-400 animate-pulse" />
              <div>
                <span className="text-[10px] text-stone-400 uppercase block">Cold-Chain Temp</span>
                <span className="text-sm font-bold">{currentOrder.tempMonitored}</span>
              </div>
            </div>

            <div className="h-8 w-px bg-stone-700" />

            <div className="text-xs font-mono">
              <span className="text-[10px] text-stone-400 uppercase block">Estimated Drop</span>
              <span className="font-bold text-white">{currentOrder.estimatedDelivery}</span>
            </div>
          </div>
        </div>

        {/* Courier Map & Checkpoint Stepper */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-stone-200">
          {/* Checkpoint Stepper */}
          <div className="lg:col-span-2 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold font-mono text-stone-600 uppercase tracking-wider">
                Live Shipment Milestones
              </h4>
              <button
                onClick={() => advanceOrderState(currentOrder.id)}
                disabled={currentOrder.status === 'delivered'}
                className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-40 text-emerald-800 font-mono text-[11px] font-semibold rounded-lg border border-emerald-200 transition-colors flex items-center gap-1.5"
                title="Advance this shipment to next checkpoint (Demo tool)"
              >
                <Navigation className="w-3 h-3" />
                Simulate Courier Next Leg
              </button>
            </div>

            <div className="space-y-6 relative pl-6 border-l-2 border-emerald-500/30 ml-3">
              {currentOrder.checkpoints.map((cp, idx) => (
                <div key={idx} className="relative">
                  {/* Stepper Dot */}
                  <div
                    className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                      cp.completed
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-stone-300'
                    }`}
                  >
                    {cp.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h5
                        className={`text-xs font-bold font-display ${
                          cp.completed ? 'text-stone-900' : 'text-stone-600'
                        }`}
                      >
                        {cp.status}
                      </h5>
                      <span className="text-[10px] font-mono text-stone-600 shrink-0">{cp.time}</span>
                    </div>
                    <p className="text-[11px] font-mono text-emerald-800 font-semibold">{cp.location}</p>
                    <p className="text-xs text-stone-600">{cp.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Details & Return Action Box */}
          <div className="p-6 sm:p-8 bg-stone-50/60 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h4 className="text-xs font-bold font-mono text-stone-600 uppercase tracking-wider">
                Destination & Courier
              </h4>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3 text-xs">
                <div>
                  <span className="text-stone-600 font-mono text-[10px] uppercase font-semibold">Delivery Address</span>
                  <p className="font-semibold text-stone-900 mt-0.5">{currentOrder.deliveryAddress}</p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-stone-600 font-mono text-[10px] uppercase font-semibold">Courier Contact</span>
                    <p className="font-semibold text-stone-900">{currentOrder.carrierPhone}</p>
                  </div>
                  <a
                    href={`tel:${currentOrder.carrierPhone}`}
                    className="p-2 bg-emerald-50 text-emerald-800 rounded-lg hover:bg-emerald-100"
                    title="Call Courier"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Items in this Delivery */}
              <div>
                <span className="text-xs font-mono font-bold text-stone-700 uppercase">
                  Shipment Items ({currentOrder.items.length})
                </span>
                <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                  {currentOrder.items.map((it) => (
                    <div
                      key={it.productId}
                      className="bg-white p-3 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-stone-900">{it.name}</p>
                        <p className="text-[10px] font-mono text-stone-600">
                          {it.quantity} {it.unit} · {it.sku}
                        </p>
                      </div>

                      {/* Return Action Trigger for this item */}
                      {onInitiateReturn && (
                        <button
                          onClick={() => onInitiateReturn(currentOrder, it.productId)}
                          className="text-[11px] font-mono font-semibold text-rose-700 hover:text-rose-900 hover:underline flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Return Item
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Customer Care Hotline Box */}
            <div className="pt-4 border-t border-stone-200">
              <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Cold-Chain Spoilage Protection</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-normal">
                  If produce arrived warm, bruised, or damaged, our 24/7 care hotline can immediately issue a replacement or refund.
                </p>
                <button
                  onClick={() => setIsHotlineOpen(true)}
                  className="w-full py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200"
                >
                  Call Hotline: 1-800-FARM-FRESH
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
