import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Truck,
  ShieldCheck,
  Sparkles,
  Layers,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Vendor } from '../../types';

interface VendorOnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VendorOnboardingWizard: React.FC<VendorOnboardingWizardProps> = ({
  isOpen,
  onClose,
}) => {
  const { onboardNewVendor, addProduct } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState(false);

  // Step 1: Identity
  const [farmName, setFarmName] = useState('');
  const [ein, setEin] = useState('');
  const [category, setCategory] = useState('Organic Vegetables & Roots');
  const [city, setCity] = useState('');
  const [state, setState] = useState('CA');
  const [bio, setBio] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Step 2: Certifications
  const [selectedCerts, setSelectedCerts] = useState<string[]>(['USDA Organic']);

  // Step 3: Payout & Stripe
  const [bankRouting, setBankRouting] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [stripeAccountType, setStripeAccountType] = useState('Stripe Express Payouts');

  // Step 4: Logistics
  const [deliveryRadius, setDeliveryRadius] = useState(45);
  const [distanceMiles, setDistanceMiles] = useState(18.5);

  // Step 5: Initial Product SKU
  const [productName, setProductName] = useState('');
  const [productSku, setProductSku] = useState('');
  const [productPrice, setProductPrice] = useState(120.00);
  const [productStock, setProductStock] = useState(50);
  const [productUnit, setProductUnit] = useState('per kg');

  if (!isOpen) return null;

  const certOptions = [
    'USDA Organic',
    'CCOF Certified Organic',
    'Regenerative Organic Certified',
    'GAP Food Safety Certified',
    'Bee Friendly Farming',
    'Demeter Biodynamic',
    'Non-GMO Project Verified',
    'Animal Welfare Approved',
  ];

  const toggleCert = (cert: string) => {
    setSelectedCerts((prev) =>
      prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert]
    );
  };

  const handleFinishOnboarding = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Create Vendor
    const createdVendor = onboardNewVendor({
      name: farmName || 'Valley Horizon Organic Farm',
      businessReg: ein || `EIN-94-${Math.floor(1000000 + Math.random() * 9000000)}`,
      category,
      city: city || 'Sebastopol',
      state: state || 'CA',
      location: `${city || 'Sebastopol'}, ${state || 'CA'}`,
      distanceMiles: Number(distanceMiles) || 20,
      deliveryRadiusMiles: Number(deliveryRadius) || 45,
      certifications: selectedCerts.length > 0 ? selectedCerts : ['USDA Organic'],
      contactEmail: contactEmail || 'sales@valleyhorizon.farm',
      contactPhone: contactPhone || '(707) 555-0182',
      bio: bio || 'Sustainable grower focused on organic soil stewardship and same-day morning cold-chain harvest.',
      commissionRate: 0.10,
    });

    // 2. Create initial SKU if specified
    if (productName.trim()) {
      const generatedSku = productSku.trim() || `SKU-${category.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
      addProduct({
        vendorId: createdVendor.id,
        vendorName: createdVendor.name,
        name: productName,
        category,
        sku: generatedSku,
        batchLot: `LOT-2026-NEW-${Math.floor(10 + Math.random() * 90)}`,
        price: Number(productPrice) || 120.00,
        wholesalePrice: +(Number(productPrice) * 0.65).toFixed(2),
        unit: productUnit || 'per kg',
        stock: Number(productStock) || 50,
        minStockThreshold: 15,
        reorderQuantity: 40,
        isOrganic: selectedCerts.some((c) => c.toLowerCase().includes('organic')),
        dietary: ['Organic', 'Non-GMO', 'Vegan'],
        origin: `${createdVendor.city}, ${createdVendor.state}`,
        harvestDate: 'Fresh harvest scheduled',
        shelfLifeDays: 10,
        description: `Freshly harvested ${productName} directly from ${createdVendor.name}.`,
        imageEmoji: '🥕',
        imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=800&q=80',
        accentColor: 'from-emerald-500/20 to-teal-500/20',
        externalErpId: `QB-${generatedSku}`,
      });
    }

    setCompleted(true);
    setTimeout(() => {
      setCompleted(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display">Local Farm & Vendor Onboarding</h3>
              <p className="text-xs text-stone-400 font-mono">
                Step {currentStep} of 5 — Instant Verification & Product SKU Integration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicator */}
        <div className="grid grid-cols-5 border-b border-stone-200 bg-stone-50 text-[11px] font-mono text-center">
          <div className={`py-2 border-r border-stone-200 ${currentStep >= 1 ? 'text-emerald-800 font-bold bg-emerald-50/50' : 'text-stone-600'}`}>
            1. Identity
          </div>
          <div className={`py-2 border-r border-stone-200 ${currentStep >= 2 ? 'text-emerald-800 font-bold bg-emerald-50/50' : 'text-stone-600'}`}>
            2. Certs
          </div>
          <div className={`py-2 border-r border-stone-200 ${currentStep >= 3 ? 'text-emerald-800 font-bold bg-emerald-50/50' : 'text-stone-600'}`}>
            3. Stripe Payout
          </div>
          <div className={`py-2 border-r border-stone-200 ${currentStep >= 4 ? 'text-emerald-800 font-bold bg-emerald-50/50' : 'text-stone-600'}`}>
            4. Logistics
          </div>
          <div className={`py-2 ${currentStep >= 5 ? 'text-emerald-800 font-bold bg-emerald-50/50' : 'text-stone-600'}`}>
            5. Initial SKU
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {completed ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-4 border-emerald-50 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-stone-900 font-display">Vendor Successfully Onboarded!</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {farmName || 'New Partner Farm'} is now active in the directory with Stripe payouts connected and live SKU inventory enabled.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFinishOnboarding} className="space-y-4">
              {/* Step 1: Identity */}
              {currentStep === 1 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-stone-900">Farm / Business Entity Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Farm or Business Name *
                      </label>
                      <input
                        type="text"
                        value={farmName}
                        onChange={(e) => setFarmName(e.target.value)}
                        placeholder="e.g. Whispering Willow Organics"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Business Tax ID / EIN *
                      </label>
                      <input
                        type="text"
                        value={ein}
                        onChange={(e) => setEin(e.target.value)}
                        placeholder="EIN-94-XXXXXXX"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Primary Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                      >
                        <option>Organic Vegetables & Roots</option>
                        <option>Stonefruit & Orchards</option>
                        <option>Citrus & Subtropical</option>
                        <option>Farmstead Dairy & Cheeses</option>
                        <option>Specialty Fungi & Microbes</option>
                        <option>Ancient Grains & Flours</option>
                        <option>Fresh Cut Herbs & Sprouts</option>
                        <option>Pastured Poultry & Eggs</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Sonoma"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">State</label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="CA"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Contact Email</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="contact@farm.org"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="(707) 555-0123"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Farm Philosophy & Growing Practices
                    </label>
                    <textarea
                      rows={2}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Describe soil stewardship, irrigation, harvest frequency..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Certifications */}
              {currentStep === 2 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-stone-900">Verified Agricultural Certifications</h4>
                  <p className="text-xs text-stone-500">
                    Select all verified badges and audits held by your farm or processing facility:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {certOptions.map((cert) => {
                      const isChecked = selectedCerts.includes(cert);
                      return (
                        <div
                          key={cert}
                          onClick={() => toggleCert(cert)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                            isChecked
                              ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-semibold'
                              : 'border-stone-200 hover:border-stone-300 text-stone-600'
                          }`}
                        >
                          <span>{cert}</span>
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center ${
                              isChecked ? 'bg-emerald-600 text-white' : 'border border-stone-300'
                            }`}
                          >
                            {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 mt-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 inline mr-1" />
                    All organic and safety certificates undergo automated verification against the USDA Organic Integrity Database.
                  </div>
                </div>
              )}

              {/* Step 3: Stripe Payout */}
              {currentStep === 3 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-stone-900">Stripe Express Merchant Account & Settlement</h4>
                  <p className="text-xs text-stone-500">
                    Direct automated payouts for order batches with escrow release after delivery verification:
                  </p>

                  <div className="p-4 rounded-xl bg-stone-900 text-white space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-emerald-400 font-bold">Stripe Connect Custom/Express</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                        Zero Processing Delay
                      </span>
                    </div>
                    <p className="text-xs text-stone-300">
                      Funds from customers are secured in escrow upon order placement and automatically deposited to your bank within 24 hours of cold-chain doorstep confirmation.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Bank Routing Number (ABA)
                      </label>
                      <input
                        type="text"
                        value={bankRouting}
                        onChange={(e) => setBankRouting(e.target.value)}
                        placeholder="121000358"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Account Number
                      </label>
                      <input
                        type="password"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        placeholder="••••••••4918"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                    Standard vendor commission rate is fixed at 10% platform fee, with zero setup fees or recurring listing charges.
                  </div>
                </div>
              )}

              {/* Step 4: Logistics */}
              {currentStep === 4 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-stone-900">Cold-Chain Logistics & Delivery Radius</h4>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                        <span>Max Delivery Service Radius</span>
                        <span className="font-mono font-bold text-emerald-700">{deliveryRadius} miles</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="120"
                        step="5"
                        value={deliveryRadius}
                        onChange={(e) => setDeliveryRadius(Number(e.target.value))}
                        className="w-full accent-emerald-700"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                        <span>Distance from Regional Central Cross-Dock</span>
                        <span className="font-mono font-bold text-stone-800">{distanceMiles} miles</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="100"
                        step="1"
                        value={distanceMiles}
                        onChange={(e) => setDistanceMiles(Number(e.target.value))}
                        className="w-full accent-emerald-700"
                      />
                    </div>

                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
                      <Truck className="w-4 h-4 text-emerald-700 inline mr-1" />
                      Couriers operate temperature-calibrated reefer vans (2-4°C) with morning consolidation sweeps to collect crates directly from your wash-pack shed.
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Initial SKU */}
              {currentStep === 5 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-stone-900">Create First Product SKU</h4>
                  <p className="text-xs text-stone-500">
                    Seed your vendor catalog with your flagship harvest crop:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="e.g. Crisp French Breakfast Radishes"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Individual SKU Identifier
                      </label>
                      <input
                        type="text"
                        value={productSku}
                        onChange={(e) => setProductSku(e.target.value)}
                        placeholder="SKU-VEG-XXX (Auto-generated if empty)"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Retail Price (₹)</label>
                      <input
                        type="number"
                        step="0.50"
                        value={productPrice}
                        onChange={(e) => setProductPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Unit of Measure</label>
                      <input
                        type="text"
                        value={productUnit}
                        onChange={(e) => setProductUnit(e.target.value)}
                        placeholder="per lb / per bunch"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Initial Stock Count</label>
                      <input
                        type="number"
                        value={productStock}
                        onChange={(e) => setProductStock(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Navigation Footer */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm flex items-center gap-1"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-md flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Complete Onboarding & Launch Catalog
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
