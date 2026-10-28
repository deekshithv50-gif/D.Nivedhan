import React from 'react';
import { Printer, Download, X, Barcode, ShieldAlert, CheckCircle, Truck, Building2 } from 'lucide-react';
import { ReturnRequest } from '../../types';
import { TerraLogo } from '../common/TerraLogo';

interface ReturnLabelModalProps {
  rma: ReturnRequest | null;
  onClose: () => void;
}

export const ReturnLabelModal: React.FC<ReturnLabelModalProps> = ({ rma, onClose }) => {
  if (!rma) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Control Bar (Hidden on print) */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Barcode className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold font-display">Automated Return Shipping Label</h3>
              <p className="text-[11px] text-stone-400 font-mono">
                {rma.id} · Pre-Paid Cold-Chain Priority Return
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Label
            </button>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable 4x6" Shipping Label Canvas */}
        <div className="p-6 overflow-y-auto bg-stone-100/50 flex justify-center">
          <div className="w-full max-w-md bg-white border-2 border-dashed border-stone-900 p-6 rounded-xl shadow-md text-stone-900 space-y-4 print:border-solid print:shadow-none print:m-0 print:p-4">
            {/* Carrier Banner */}
            <div className="flex items-center justify-between border-b-2 border-stone-900 pb-3">
              <TerraLogo variant="compact" size="sm" />
              <div className="text-right font-mono">
                <span className="block text-xs font-black uppercase tracking-wider">
                  PRIORITY COLD-CHAIN RETURN
                </span>
                <span className="text-[10px] text-stone-500 font-semibold">POSTAGE PAID BY PLATFORM</span>
              </div>
            </div>

            {/* Shipper & Consignee Addresses */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono border-b-2 border-stone-900 pb-4">
              {/* FROM */}
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-500 block">SHIP FROM (CUSTOMER):</span>
                <p className="font-bold text-stone-900">{rma.customerName}</p>
                <p className="text-[11px] text-stone-600">{rma.customerEmail}</p>
                <p className="text-[11px] text-stone-600 mt-1">Direct Residential Drop-off</p>
              </div>

              {/* TO WAREHOUSE */}
              <div className="border-l-2 border-stone-200 pl-4">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">RETURN DESTINATION:</span>
                <p className="font-bold text-stone-900">TerraHarvest Hub 01</p>
                <p className="text-[11px] text-stone-600 leading-tight">
                  Central Quality & Cold-Chain Center<br />
                  Plot 14, Yeshwanthpur Industrial Area<br />
                  Bengaluru, Karnataka 560022
                </p>
              </div>
            </div>

            {/* RMA & Product Information Block */}
            <div className="bg-stone-50 p-3 rounded-lg border border-stone-300 text-xs font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-500">RMA Authorization:</span>
                <span className="font-bold text-stone-900">{rma.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Order Reference:</span>
                <span className="text-stone-800">{rma.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">SKU / Item:</span>
                <span className="font-bold text-stone-900">{rma.sku} ({rma.quantity}x {rma.productName})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Return Reason:</span>
                <span className="text-rose-700 font-bold">{rma.reason}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Authorized Refund:</span>
                <span className="font-bold text-emerald-800">₹{rma.refundAmount.toFixed(2)} (via Stripe)</span>
              </div>
            </div>

            {/* High-Resolution SVG Barcode */}
            <div className="text-center pt-2 space-y-1">
              <svg className="w-full h-20 mx-auto" viewBox="0 0 280 70" preserveAspectRatio="none">
                <g fill="#000000">
                  <rect x="10" y="5" width="4" height="60" />
                  <rect x="16" y="5" width="2" height="60" />
                  <rect x="22" y="5" width="5" height="60" />
                  <rect x="30" y="5" width="2" height="60" />
                  <rect x="35" y="5" width="4" height="60" />
                  <rect x="42" y="5" width="1" height="60" />
                  <rect x="46" y="5" width="5" height="60" />
                  <rect x="54" y="5" width="3" height="60" />
                  <rect x="60" y="5" width="2" height="60" />
                  <rect x="66" y="5" width="6" height="60" />
                  <rect x="75" y="5" width="2" height="60" />
                  <rect x="80" y="5" width="4" height="60" />
                  <rect x="88" y="5" width="3" height="60" />
                  <rect x="94" y="5" width="2" height="60" />
                  <rect x="100" y="5" width="5" height="60" />
                  <rect x="108" y="5" width="1" height="60" />
                  <rect x="113" y="5" width="4" height="60" />
                  <rect x="120" y="5" width="2" height="60" />
                  <rect x="125" y="5" width="6" height="60" />
                  <rect x="134" y="5" width="2" height="60" />
                  <rect x="140" y="5" width="5" height="60" />
                  <rect x="148" y="5" width="2" height="60" />
                  <rect x="154" y="5" width="3" height="60" />
                  <rect x="160" y="5" width="4" height="60" />
                  <rect x="168" y="5" width="2" height="60" />
                  <rect x="174" y="5" width="5" height="60" />
                  <rect x="182" y="5" width="2" height="60" />
                  <rect x="188" y="5" width="4" height="60" />
                  <rect x="195" y="5" width="3" height="60" />
                  <rect x="202" y="5" width="2" height="60" />
                  <rect x="208" y="5" width="6" height="60" />
                  <rect x="218" y="5" width="2" height="60" />
                  <rect x="224" y="5" width="4" height="60" />
                  <rect x="232" y="5" width="2" height="60" />
                  <rect x="238" y="5" width="5" height="60" />
                  <rect x="246" y="5" width="1" height="60" />
                  <rect x="252" y="5" width="4" height="60" />
                  <rect x="260" y="5" width="3" height="60" />
                  <rect x="266" y="5" width="4" height="60" />
                </g>
              </svg>
              <p className="font-mono text-xs font-black tracking-widest text-stone-900">
                {rma.returnTrackingBarcode}
              </p>
            </div>

            {/* Warehouse Return Notes */}
            <div className="border-t-2 border-stone-900 pt-3 text-[10px] font-mono text-stone-500 leading-tight">
              <p>INSTRUCTIONS: Tape this label securely to outer cold bag or tote. Courier will scan upon pickup. Customer service inquiries: 1-800-FARM-FRESH.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
