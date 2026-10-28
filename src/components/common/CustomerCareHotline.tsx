import React, { useState } from 'react';
import { Phone, PhoneCall, ShieldCheck, Clock, MessageSquare, AlertCircle, X, CheckCircle2, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CustomerCareHotline: React.FC = () => {
  const { isHotlineOpen, setIsHotlineOpen, currentUser, returns, addNotification } = useApp();
  const [activeTab, setActiveTab] = useState<'call' | 'inquiry' | 'policy'>('call');
  const [isCalling, setIsCalling] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Inquiry form
  const [selectedRma, setSelectedRma] = useState('');
  const [subject, setSubject] = useState('');
  const [inquiryText, setInquiryText] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  if (!isHotlineOpen) return null;

  const handleStartCall = () => {
    setIsCalling(true);
    setTimeout(() => {
      setIsCalling(false);
      setCallConnected(true);
      const timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }, 1800);
  };

  const handleEndCall = () => {
    setCallConnected(false);
    setIsCalling(false);
    setCallDuration(0);
    addNotification('Hotline Call Concluded', 'Call with Senior Support Specialist David K. Rossi completed. Summary emailed.', 'system', 'customer');
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !inquiryText.trim()) return;
    setTicketSubmitted(true);
    addNotification(
      'Priority Inquiry Logged',
      `Ticket #${Math.floor(10000 + Math.random() * 90000)} linked to RMA ${selectedRma || 'General'}. Agent dispatched.`,
      'return',
      'support'
    );
    setTimeout(() => {
      setTicketSubmitted(false);
      setSubject('');
      setInquiryText('');
      setSelectedRma('');
      setIsHotlineOpen(false);
    }, 2000);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Phone className="w-5 h-5 text-emerald-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold font-display">Customer Care & Return Support</h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  24/7 Dedicated
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">Direct assistance for perishable returns, cold-chain checks & refunds</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (callConnected) handleEndCall();
              setIsHotlineOpen(false);
            }}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toll-Free Banner */}
        <div className="bg-stone-50 border-b border-stone-200 px-6 py-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-stone-500 uppercase">Toll-Free Hotline:</span>
            <a
              href="tel:18003276373"
              className="text-base font-bold font-mono text-emerald-800 tracking-tight hover:underline flex items-center gap-1.5"
            >
              1-800-FARM-FRESH
              <span className="text-xs text-stone-400 font-normal">(1-800-327-6373)</span>
            </a>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Avg Wait: &lt; 45 sec</span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-stone-200 px-6 pt-2 bg-stone-50/50">
          <button
            onClick={() => setActiveTab('call')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'call'
                ? 'border-emerald-700 text-emerald-800 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Live Voice Support
          </button>
          <button
            onClick={() => setActiveTab('inquiry')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'inquiry'
                ? 'border-emerald-700 text-emerald-800 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Complex RMA Escalation
          </button>
          <button
            onClick={() => setActiveTab('policy')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'policy'
                ? 'border-emerald-700 text-emerald-800 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Freshness Guarantee
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm">
          {activeTab === 'call' && (
            <div className="text-center py-4 space-y-5">
              {!callConnected && !isCalling ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-50 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                    <PhoneCall className="w-9 h-9" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-stone-900 font-display">Speak Directly with Farm Care Agent</h4>
                    <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
                      Our Bengaluru Yeshwanthpur hub staff can immediately authorize instant refunds, dispatch replacement baskets, or arrange contactless return pickups for temperature-sensitive goods across Karnataka.
                    </p>
                  </div>

                  <div className="bg-stone-100 rounded-xl p-3 max-w-sm mx-auto text-left flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-300 flex items-center justify-center font-bold text-stone-700 text-xs">
                      DN
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-stone-800">Darshan N. Rao</p>
                      <p className="text-[11px] text-stone-500">Senior Post-Purchase Specialist · Bengaluru Central Hub</p>
                    </div>
                  </div>

                  <button
                    onClick={handleStartCall}
                    className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-md transition-all inline-flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Connect Call via Browser Simulation
                  </button>
                </>
              ) : isCalling ? (
                <div className="py-8 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-amber-100 border-4 border-amber-50 text-amber-600 flex items-center justify-center mx-auto animate-bounce">
                    <Phone className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-semibold text-stone-800">Dialing 1800-TERRA-KA (+91 80 2840 5500)...</h4>
                  <p className="text-xs text-stone-500">Routing to Lead Quality Inspector at Bengaluru Regional Hub</p>
                </div>
              ) : (
                <div className="py-4 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE CALL IN PROGRESS: {formatSeconds(callDuration)}
                  </div>

                  <div className="bg-stone-900 text-emerald-400 font-mono text-xs rounded-xl p-4 text-left space-y-2">
                    <p className="text-stone-400">Agent: "Namaskara {currentUser.name}! I see you're checking on your recent produce order. How can I help resolve your delivery or return inquiry in Karnataka today?"</p>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-500">
                      <span>Audio Link: Encrypted TLS 1.3</span>
                      <span>·</span>
                      <span>Bitrate: 64kbps Opus</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={handleEndCall}
                      className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Hang Up Call
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'inquiry' && (
            <form onSubmit={handleSendInquiry} className="space-y-4">
              {ticketSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-stone-800">Inquiry Ticket Dispatched</h4>
                  <p className="text-xs text-stone-500">A senior resolution agent will review and update your return ledger.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Related RMA / Order (Optional)
                    </label>
                    <select
                      value={selectedRma}
                      onChange={(e) => setSelectedRma(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                    >
                      <option value="">Select an active return request...</option>
                      {returns.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.id} — {r.productName} (₹{r.refundAmount.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Inquiry Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Courier missed pickup / need cold-pack courier replacement"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Detailed Explanation
                    </label>
                    <textarea
                      rows={3}
                      value={inquiryText}
                      onChange={(e) => setInquiryText(e.target.value)}
                      placeholder="Please explain the condition of the produce or difficulty with the return shipping label..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsHotlineOpen(false)}
                      className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm"
                    >
                      Submit Priority Ticket
                    </button>
                  </div>
                </>
              )}
            </form>
          )}

          {activeTab === 'policy' && (
            <div className="space-y-3 text-xs text-stone-600">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <h5 className="font-semibold text-emerald-900 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  100% Farm Freshness Guarantee
                </h5>
                <p>
                  Every perishable vegetable, fruit, and dairy item is covered by our unconditional 48-hour farm guarantee. If items arrive damaged, bruised, or wilted, an instant return authorization and refund are issued without delay.
                </p>
              </div>

              <div className="space-y-2">
                <div className="border border-stone-200 rounded-lg p-2.5">
                  <span className="font-semibold text-stone-800">Do I have to return bruised produce?</span>
                  <p className="mt-1 text-stone-500">
                    For farm compost safety, we frequently designate bruised leafy greens or berries as "Customer Compost Approved" so you do not need to physically ship decomposing vegetables back.
                  </p>
                </div>
                <div className="border border-stone-200 rounded-lg p-2.5">
                  <span className="font-semibold text-stone-800">How fast does the Stripe refund settle?</span>
                  <p className="mt-1 text-stone-500">
                    Refunds are immediately pushed back to your original payment method via Stripe (Credit card, Apple Pay, or Bank ACH) within 1-2 business banking days.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
