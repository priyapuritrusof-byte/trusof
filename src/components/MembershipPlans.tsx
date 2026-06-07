/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Star, Award, Sparkles, Check, CreditCard, ShoppingBag, X } from 'lucide-react';

interface MembershipPlansProps {
  onUpgradeSuccess: (tierName: string) => void;
  isUserPremium: boolean;
  premiumTier: string;
}

export default function MembershipPlans({
  onUpgradeSuccess,
  isUserPremium,
  premiumTier
}: MembershipPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string } | null>(null);
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCVV, setCardCVV] = useState('123');
  const [upiId, setUpiId] = useState('trusof@upi');
  const [payMethod, setPayMethod] = useState<'card' | 'upi'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const PLANS = [
    {
      name: 'Silver Connect VIP',
      price: '₹0',
      duration: '3 Months (FREE!!)',
      features: [
        'See 100+ Hidden Phone Numbers',
        'Direct Unlimited Chat with Matches',
        'Daily Matrimonial Alerts',
        'Aadhaar Verification Badge'
      ],
      badge: '100% FREE',
      color: 'from-slate-400 to-slate-500',
      popular: false
    },
    {
      name: 'Gold Premium Star VIP',
      price: '₹0',
      duration: '6 Months (FREE!!)',
      features: [
        'See EVERY hidden phone number & Email ID',
        'Direct unlimited active chatting instantly',
        'Standout gold badge decoration',
        'Auto priority profiling search visibility',
        'Live Kundali matches score compatibility'
      ],
      badge: 'Most Popular',
      color: 'from-amber-500 via-pink-600 to-rose-600',
      popular: true
    },
    {
      name: 'Royal Diamond Elite VIP',
      price: '₹0',
      duration: '1 Year (FREE!!)',
      features: [
        'Personal Matching Consultant Assist',
        'See EVERY hidden phone number & Email ID',
        'Direct unlimited active chatting',
        'Absolute topmost search results priority',
        'Premium horoscope match analysis'
      ],
      badge: 'Prestige VIP FREE',
      color: 'from-violet-600 to-indigo-800',
      popular: false
    }
  ];

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setIsProcessing(true);
    setTimeout(() => {
      onUpgradeSuccess(selectedPlan.name);
      setIsProcessing(false);
      setSelectedPlan(null);
    }, 1800);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      
      {/* Title Segment */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-1 bg-amber-50 border border-amber-200 text-amber-800 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>Active Premium Access Plans</span>
        </div>
        <h3 className="font-display font-black text-3xl text-slate-900 tracking-tight leading-none sm:text-4xl">
          100% Free Premium Membership
        </h3>
        <p className="text-sm text-gray-500">
          Unlock hidden contact info, see star matching results, double your chances of success and find brides or grooms 3x faster with 100% Free Premium. No charges, no hidden credit cards.
        </p>
      </div>

      {isUserPremium && (
        <div className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-2xl p-6 border border-amber-300 max-w-lg mx-auto text-center space-y-3.5 shadow-lg shadow-amber-50">
          <Award className="w-12 h-12 text-white animate-bounceOnce mx-auto stroke-1" />
          <h4 className="font-extrabold text-xl">Aapka Premium Plan Active Hai!</h4>
          <p className="text-xs text-yellow-50 font-medium">
            Currently subscribed to: <strong>{premiumTier}</strong>. 
            All hidden contact details, premium profiles, and active messaging are fully unlocked globally for your account.
          </p>
        </div>
      )}

      {/* Plans Grids layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {PLANS.map((plan) => {
          const isCurrent = isUserPremium && premiumTier === plan.name;
          return (
            <div
              key={plan.name}
              className={`relative bg-white border rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 ${
                plan.popular 
                  ? 'border-rose-300 ring-2 ring-rose-500/10 shadow-xl scale-[1.02]' 
                  : 'border-slate-150 shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[10px] font-black tracking-wider px-3.5 py-1 rounded-full shadow-md uppercase">
                  Most Popular choice
                </div>
              )}

              <div className="space-y-6">
                
                {/* Headline Info */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    {plan.badge}
                  </span>
                  <h4 className="font-display font-extrabold text-lg text-slate-900 tracking-tight mt-1">
                    {plan.name}
                  </h4>
                  <div className="flex items-baseline space-x-1 mt-3">
                    <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                    <span className="text-xs text-gray-400 font-medium">/ {plan.duration}</span>
                  </div>
                </div>

                {/* Features divider lists */}
                <div className="border-t border-slate-100 pt-5 space-y-3.5">
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start space-x-2.5 text-xs text-slate-600">
                      <div className="w-4.5 h-4.5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Action active upgrade triggers */}
              <div className="pt-6 mt-6 border-t border-slate-50">
                <button
                  onClick={() => {
                    if (!isCurrent) setSelectedPlan({ name: plan.name, price: plan.price });
                  }}
                  disabled={isCurrent}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-black shadow-2xs transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                      : plan.popular
                        ? 'bg-rose-600 text-white hover:bg-rose-700 hover:shadow-md'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                  id={`upgrade-btn-${plan.name.toLowerCase().replace(/ /g, '-')}`}
                >
                  <Award className="w-4 h-4" />
                  <span>{isCurrent ? 'Plan is currently Active' : `Subscribe (${plan.price})`}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Benefit grid comparison below */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-xs sm:text-xs text-gray-500 leading-relaxed text-center font-sans tracking-wide">
        Need customizations or bank offline wire transfers? Reach out to escalation desk at: <a href="mailto:priyapuritrusof@gmail.com" className="font-semibold text-rose-600 underline">priyapuritrusof@gmail.com</a>
      </div>

      {/* Interactive payment Modal Checkout overlayer */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-rose-50 animate-scaleUp text-slate-850">
            
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2.5 mb-6">
              <ShoppingBag className="w-10 h-10 text-rose-600 mx-auto" />
              <h4 className="font-display font-black text-xl text-slate-900 leading-snug">
                Checkout Details Gateway
              </h4>
              <p className="text-xs text-slate-500">
                You are subscribing to: <strong>{selectedPlan.name} ({selectedPlan.price})</strong>
              </p>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              
              {/* Select payment mode */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-100 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setPayMethod('card')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    payMethod === 'card' ? 'bg-white shadow-3xs text-slate-900' : 'text-gray-500 hover:text-slate-850'
                  }`}
                >
                  Debit/Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPayMethod('upi')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    payMethod === 'upi' ? 'bg-white shadow-3xs text-slate-900' : 'text-gray-500 hover:text-slate-850'
                  }`}
                >
                  Direct UPI ID
                </button>
              </div>

              {payMethod === 'card' ? (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">Card Number</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold tracking-wider text-slate-800"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase">Expiry Month/Yr</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase">CVV Verification</label>
                      <input
                        type="password"
                        required
                        value={cardCVV}
                        onChange={(e) => setCardCVV(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">VPA UPI Address ID</label>
                  <input
                    type="text"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-indigo-700"
                  />
                  <p className="text-[10px] text-gray-400">BHIM, Google Pay, PhonePe compatible address ID</p>
                </div>
              )}

              {/* Submit Payment action button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 mt-4 cursor-pointer"
                id="submit-payment-gateway-btn"
              >
                <CreditCard className="w-4 h-4 text-white" />
                <span>
                  {isProcessing ? 'Activating Free Benefit...' : 'Activate 100% Free Premium instantly'}
                </span>
              </button>
            </form>

            <div className="mt-4 flex items-center justify-center space-x-2 text-[10px] text-gray-400 uppercase font-mono tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>TLS 1.3 Certified Mock Security Enclave</span>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
