import { useState } from 'react';
import { Star, Check, Zap, Sparkles, Award } from 'lucide-react';

export default function PremiumPlans() {
  const [coupon, setCoupon] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [activePlan, setActivePlan] = useState<string | null>(null);

  const applyPromo = () => {
    if (coupon.trim().toUpperCase() === 'TRUSOF') {
      setDiscountApplied(true);
      alert('Promo applied successfully! 20% flat discount on all premium plans!');
    } else {
      alert('Invalid Promo code. Try typing "TRUSOF"');
    }
  };

  const PLANS = [
    {
      id: 'silver',
      name: 'Silver Shubh',
      price: 2999,
      duration: '3 Months',
      motto: 'Perfect for quick profile explorations',
      benefits: [
        'Send unlimited connection interests',
        'Siddha horoscope match percentage analytics',
        'Direct contact unlocking (up to 25 verified profiles)',
        'Support desk general updates'
      ],
      colors: 'border-slate-300 from-slate-100 to-slate-200 text-slate-800'
    },
    {
      id: 'gold',
      name: 'Golden Milan',
      price: 4999,
      duration: '6 Months',
      motto: 'Most popular plan with matchmaking assistants',
      benefits: [
        'Everything in Silver Shubh plan',
        'Detailed horoscope matching compatibility breakdown',
        'Unlocks up to 75 verified direct phone numbers',
        'Highlighted placement in search matching lists',
        'Dedicated matrimonial account counselor support'
      ],
      colors: 'border-amber-300 from-amber-50 to-amber-100/60 text-amber-800 focus-ring',
      featured: true
    },
    {
      id: 'platinum',
      name: 'Platinum Infiniti',
      price: 8999,
      duration: '12 Months',
      motto: 'Ultimate luxury with infinite match access',
      benefits: [
        'Everything in Golden Milan plan',
        'Infinite contact unlocks (No limitations)',
        'Express profile boost globally across sub-regions',
        'Secret anonymous mode browsing (Invisible browsing)',
        'Saptapadi Kundalini deep-analysis charts by astrologers'
      ],
      colors: 'border-rose-300 from-rose-50 to-pink-50 text-rose-800'
    }
  ];

  const handleSubscribe = (name: string) => {
    setActivePlan(name);
    setTimeout(() => {
      alert(`Congratulation! Your request for "${name}" membership is raised. Our Trusof Matchmaker executive will call you within 15 minutes!`);
      setActivePlan(null);
    }, 500);
  };

  return (
    <div className="bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 border-y border-gray-150" id="membership-pricing-section">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> Premium Memberships
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-gray-900 tracking-tight">
            Apna Shubh Jeevansathi Chunein Premium Plans Ke Sath
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm">
            Trusof Matrimony offers reliable paid benefits to help couples meet safely. Unlock verified contact lines and premium astrologer matching indexes.
          </p>
        </div>

        {/* Promo code area */}
        <div className="bg-white border border-rose-100 rounded-2xl p-4 sm:p-6 max-w-md mx-auto shadow-sm flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 space-y-1">
            <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5 uppercase">
              <Zap className="w-4 h-4 text-rose-500 fill-rose-500" /> Coupon Available!
            </h4>
            <p className="text-[11px] text-gray-500">Apply coupon <strong className="text-rose-600">&quot;TRUSOF&quot;</strong> to get instant 20% discount on any plan page.</p>
          </div>
          <div className="flex gap-1.5 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Enter Code..."
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className="px-3 py-2 text-xs border border-gray-200 rounded-lg outline-none uppercase w-full sm:w-28 text-center font-bold"
            />
            <button
              onClick={applyPromo}
              className="py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {PLANS.map((plan) => {
            const actualPrice = discountApplied ? Math.round(plan.price * 0.8) : plan.price;
            return (
              <div
                key={plan.id}
                className={`bg-white border-2 ${plan.featured ? 'border-rose-500 shadow-md ring-4 ring-rose-50' : 'border-gray-150'} rounded-3xl p-6 relative flex flex-col justify-between space-y-6 transition-all hover:-translate-y-1 overflow-hidden`}
              >
                {plan.featured && (
                  <div className="absolute top-0 right-0 bg-rose-500 text-white font-bold text-[10px] tracking-wider uppercase px-4 py-1.5 rounded-bl-2xl shadow-sm">
                    Recommemded
                  </div>
                )}

                <div className="space-y-4">
                  {/* Title Name */}
                  <div className="space-y-1">
                    <h3 className="font-display font-black text-xl text-gray-900">{plan.name}</h3>
                    <p className="text-gray-500 text-xs">{plan.motto}</p>
                  </div>

                  {/* Pricing Display */}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-gray-400 text-sm font-semibold">₹</span>
                    <span className="font-display font-black text-3xl text-slate-900 tracking-tight">
                      {actualPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-gray-500 text-xs font-medium">/ {plan.duration}</span>
                    {discountApplied && (
                      <span className="text-[11px] text-gray-400 line-through font-bold">
                        ₹{plan.price.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Feature benefits list */}
                  <ul className="space-y-2.5 text-xs text-gray-600 border-t border-gray-100 pt-4">
                    {plan.benefits.map((ben, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{ben}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Submit / Activate action button */}
                <button
                  onClick={() => handleSubscribe(plan.name)}
                  disabled={activePlan === plan.name}
                  className={`w-full py-3 rounded-2xl text-xs font-black tracking-wide uppercase transition-all shadow-sm ${
                    plan.featured
                      ? 'bg-rose-600 text-white hover:bg-rose-700 hover:shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  {activePlan === plan.name ? 'Connecting...' : 'Unlock Matches Now'}
                </button>
              </div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}
