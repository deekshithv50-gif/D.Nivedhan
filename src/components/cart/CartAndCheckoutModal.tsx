import React, { useState } from 'react';
import {
  ShoppingBag,
  CreditCard,
  Building2,
  Lock,
  CheckCircle2,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  X,
  Plus,
  Minus,
  Receipt,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';

export const CartAndCheckoutModal: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    createOrder,
    currentUser,
    setActiveDeliveryOrder,
  } = useApp();

  const [step, setStep] = useState<'cart' | 'payment' | 'confirmed'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'digital_wallet' | 'bank_transfer'>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Address
  const [address, setAddress] = useState('Flat 402, Prestige Palms, 12th Main, Indiranagar, Bengaluru, KA 560038');

  // Credit card state
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvc, setCardCvc] = useState('892');
  const [cardZip, setCardZip] = useState('560038');
  const [cardBrand, setCardBrand] = useState('Visa');

  // Bank transfer state
  const [routingNumber, setRoutingNumber] = useState('HDFC0000140');
  const [accountNumber, setAccountNumber] = useState('9918230192');
  const [bankName, setBankName] = useState('HDFC Bank / Karnataka Agri Escrow');

  // Digital wallet state
  const [walletType, setWalletType] = useState<'Apple Pay' | 'Google Pay'>('Apple Pay');

  if (!isCartOpen) return null;

  const deliveryFee = cartSubtotal > 499 ? 0 : 49.00;
  const tax = +(cartSubtotal * 0.05).toFixed(2);
  const total = +(cartSubtotal + deliveryFee + tax).toFixed(2);

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      let paymentDetails: Order['paymentDetails'] = {
        transactionId: `ch_3N${Math.random().toString(36).substring(2, 14)}`,
      };

      if (paymentMethod === 'credit_card') {
        paymentDetails = {
          ...paymentDetails,
          brand: cardBrand,
          last4: cardNumber.slice(-4).replace(/\s/g, '') || '4242',
        };
      } else if (paymentMethod === 'digital_wallet') {
        paymentDetails = {
          ...paymentDetails,
          walletType,
        };
      } else if (paymentMethod === 'bank_transfer') {
        paymentDetails = {
          ...paymentDetails,
          bankName,
          last4: accountNumber.slice(-4) || '0192',
        };
      }

      const order = createOrder({
        paymentMethod,
        paymentDetails,
        deliveryAddress: address,
      });

      setConfirmedOrder(order);
      setIsProcessing(false);
      setStep('confirmed');
    }, 1800);
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setStep('cart');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              {step === 'cart' ? (
                <ShoppingBag className="w-5 h-5" />
              ) : step === 'payment' ? (
                <Lock className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold font-display">
                {step === 'cart'
                  ? `Your Fresh Farm Cart (${cart.length} items)`
                  : step === 'payment'
                  ? 'Stripe Gateway Checkout (PCI-DSS)'
                  : 'Order Confirmed & Escrow Secured'}
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                {step === 'cart'
                  ? 'Cold-chain direct delivery from 26 local producers'
                  : step === 'payment'
                  ? 'Multi-rail payment processing: Cards, Wallets & Bank ACH'
                  : `Order #${confirmedOrder?.id} · Cold-Chain Manifest Issued`}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1: CART ITEMS */}
          {step === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-stone-800">Your basket is empty</h4>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    Browse fresh heirloom vegetables, artisanal dairy, or sourdough from our 26 local farm vendors.
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-2 px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl"
                  >
                    Start Exploring Catalog
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden bg-white">
                    {cart.map((item) => (
                      <div key={item.product.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=400&q=80';
                              }}
                            />
                          </div>
                          <div>
                            <p className="font-bold text-stone-900">{item.product.name}</p>
                            <p className="text-[11px] text-stone-500 font-mono">
                              {item.product.sku} · {item.product.vendorName}
                            </p>
                            <p className="text-stone-700 font-mono font-semibold mt-0.5">
                              ₹{item.product.price.toFixed(2)} <span className="text-stone-400 font-normal">{item.product.unit}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="px-2 py-1 hover:bg-stone-200 text-stone-700"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 font-mono font-bold text-stone-900">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className="px-2 py-1 hover:bg-stone-200 text-stone-700"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-mono font-bold text-stone-900 w-16 text-right tabular-nums">
                            ₹{(item.product.price * item.quantity).toFixed(2)}
                          </span>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-stone-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Local Cold-Chain Delivery Destination
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                    />
                  </div>

                  {/* Cost Breakdown */}
                  <div className="bg-stone-50 rounded-2xl p-4 space-y-2 text-xs font-mono border border-stone-200">
                    <div className="flex justify-between text-stone-600">
                      <span>Produce Subtotal:</span>
                      <span className="tabular-nums font-semibold text-stone-900">₹{cartSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Refrigerated Courier Delivery:</span>
                      <span className="tabular-nums font-semibold text-stone-900">
                        {deliveryFee === 0 ? 'FREE (Orders Over ₹499)' : `₹${deliveryFee.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Estimated GST (5%):</span>
                      <span className="tabular-nums font-semibold text-stone-900">₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-950 font-sans">
                      <span>Total Amount:</span>
                      <span className="font-mono text-emerald-800 tabular-nums">₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('payment')}
                    className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    Proceed to Stripe Payment Gateway
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* STEP 2: STRIPE MULTI-RAIL PAYMENT GATEWAY */}
          {step === 'payment' && (
            <form onSubmit={handleProcessPayment} className="space-y-4">
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider font-mono mb-2">
                  Select Online Payment Method (Stripe Processing)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'credit_card'
                        ? 'border-emerald-700 bg-emerald-50/50 text-emerald-950 shadow-xs ring-1 ring-emerald-700'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    Credit Cards
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('digital_wallet')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'digital_wallet'
                        ? 'border-emerald-700 bg-emerald-50/50 text-emerald-950 shadow-xs ring-1 ring-emerald-700'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    Digital Wallets
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-emerald-700 bg-emerald-50/50 text-emerald-950 shadow-xs ring-1 ring-emerald-700'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    Bank Transfers (ACH)
                  </button>
                </div>
              </div>

              {/* RAIL 1: CREDIT / DEBIT CARD */}
              {paymentMethod === 'credit_card' && (
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                    <span className="text-xs font-bold text-stone-800">Card Details</span>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-stone-500">
                      <span className="px-1.5 py-0.5 bg-white rounded border border-stone-200">Visa</span>
                      <span className="px-1.5 py-0.5 bg-white rounded border border-stone-200">Mastercard</span>
                      <span className="px-1.5 py-0.5 bg-white rounded border border-stone-200">Amex</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Expires (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Security Code</label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="CVC"
                        maxLength={4}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Postal Code</label>
                      <input
                        type="text"
                        value={cardZip}
                        onChange={(e) => setCardZip(e.target.value)}
                        placeholder="94610"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white font-mono"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* RAIL 2: DIGITAL WALLETS */}
              {paymentMethod === 'digital_wallet' && (
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-center">
                  <span className="text-xs text-stone-500">1-Touch Biometric Express Checkout</span>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setWalletType('Apple Pay')}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                        walletType === 'Apple Pay'
                          ? 'bg-black text-white border-black shadow'
                          : 'bg-white text-stone-800 border-stone-200'
                      }`}
                    >
                       Pay
                    </button>
                    <button
                      type="button"
                      onClick={() => setWalletType('Google Pay')}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                        walletType === 'Google Pay'
                          ? 'bg-stone-900 text-white border-stone-900 shadow'
                          : 'bg-white text-stone-800 border-stone-200'
                      }`}
                    >
                      <span className="text-blue-500 font-extrabold">G</span> Pay
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-400 font-mono">
                    Tokenized with device fingerprinting and instant cryptographic settlement.
                  </p>
                </div>
              )}

              {/* RAIL 3: DIRECT BANK TRANSFER (ACH) */}
              {paymentMethod === 'bank_transfer' && (
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                    <span className="text-xs font-bold text-stone-800">ACH Direct Bank Debit</span>
                    <span className="text-[10px] text-emerald-800 font-mono">Plaid / Stripe Verified</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        ABA Routing Number
                      </label>
                      <input
                        type="text"
                        value={routingNumber}
                        onChange={(e) => setRoutingNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Account Number
                      </label>
                      <input
                        type="password"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white font-mono"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Security & Escrow Notice */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-950">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Farm Payout Escrow Protection:</span>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Your payment of ₹{total.toFixed(2)} is held in protected escrow until cold-chain delivery is scanned at your door. In case of spoiled items, returns and instant Stripe refunds are fully automated.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
                >
                  ← Back to Basket
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Authorizing with Stripe...
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      Authorize & Pay ₹{total.toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: ORDER CONFIRMED RECEIPT & TRACKING LINK */}
          {step === 'confirmed' && confirmedOrder && (
            <div className="py-6 space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto border-4 border-emerald-50 animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[11px] font-mono text-emerald-800 font-bold uppercase tracking-wider">
                  Payment Succeeded · Stripe Intent {confirmedOrder.stripePaymentIntentId.slice(0, 15)}...
                </span>
                <h3 className="text-2xl font-bold font-display text-stone-900 mt-1">
                  Order #{confirmedOrder.id} Confirmed!
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                  Farm harvest manifests have been sent to our local growers. Your delivery is scheduled with refrigerated courier.
                </p>
              </div>

              {/* Digital Receipt Card */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-left text-xs font-mono space-y-2 max-w-md mx-auto">
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Tracking Number:</span>
                  <span className="font-bold text-stone-900">{confirmedOrder.trackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Courier Service:</span>
                  <span className="text-stone-800">{confirmedOrder.deliveryCourier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Temperature Log:</span>
                  <span className="text-emerald-800 font-semibold">{confirmedOrder.tempMonitored}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Delivery Address:</span>
                  <span className="text-stone-800 text-right truncate max-w-[200px]">
                    {confirmedOrder.deliveryAddress}
                  </span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-2 font-bold text-stone-950">
                  <span>Total Paid (Stripe):</span>
                  <span className="text-emerald-800">₹{confirmedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    handleClose();
                    setActiveDeliveryOrder(confirmedOrder);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
                >
                  Track Live Delivery & Courier Map
                </button>
                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold text-xs"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
