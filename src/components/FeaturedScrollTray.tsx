import React, { useRef } from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Lock, 
  MapPin, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Clock 
} from 'lucide-react';
import { Profile } from '../types';

interface FeaturedScrollTrayProps {
  profiles: Profile[];
  interestSentMap: Record<string, boolean>;
  onExpressInterest: (profileId: string) => void;
  onOpenDetails: (profile: Profile) => void;
}

export default function FeaturedScrollTray({
  profiles,
  interestSentMap,
  onExpressInterest,
  onOpenDetails
}: FeaturedScrollTrayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll controls for desktop accessibility
  const handleScroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = 320; // Scroll roughly one card size
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // We can show all profiles or prioritize active ones
  const displayedProfiles = profiles;

  if (displayedProfiles.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-rose-50/40 via-pink-50/20 to-amber-50/35 border-y border-rose-100 py-6 my-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header segment with quick slide arrows */}
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <h3 className="font-display font-black text-base sm:text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span>Live &amp; Active Members Now</span>
              <span className="bg-rose-100 text-rose-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                Real-Time
              </span>
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-500">
              Profiles online recently. Connect immediately to trigger WhatsApp consult or direct inbox chats.
            </p>
          </div>
          
          {/* Scroll Buttons */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => handleScroll('left')}
              className="p-1.5 bg-white border border-rose-100 text-slate-700 hover:text-rose-600 rounded-full shadow-2xs hover:bg-rose-50 active:scale-95 transition-all cursor-pointer"
              title="Slide Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-1.5 bg-white border border-rose-100 text-slate-700 hover:text-rose-600 rounded-full shadow-2xs hover:bg-rose-50 active:scale-95 transition-all cursor-pointer"
              title="Slide Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Container wrapper */}
        <div 
          ref={containerRef}
          className="flex overflow-x-auto gap-4 pb-3 scrollbar-none snap-x snap-mandatory touch-pan-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayedProfiles.map((profile) => {
            const hasSent = !!interestSentMap[profile.id];
            
            return (
              <div 
                key={profile.id}
                className="flex-shrink-0 w-64 bg-white rounded-2xl border border-rose-50 shadow-sm hover:shadow-md transition-all duration-300 snap-start flex flex-col justify-between overflow-hidden relative group"
              >
                
                {/* Heart shortcut or verification */}
                <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
                  {profile.verified && (
                    <span className="bg-emerald-600/90 backdrop-blur-xs text-white text-[8px] font-black px-1.5 py-0.5 rounded-md flex items-center space-x-0.5 shadow-xs uppercase tracking-wide">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                {/* Profile Card Body Area */}
                <div className="p-3" onClick={() => onOpenDetails(profile)}>
                  
                  {/* Photo area with status overlay */}
                  <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-100 mb-2.5 cursor-pointer">
                    {profile.hasPhoto !== false ? (
                      <img 
                        src={profile.avatar} 
                        alt={profile.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                        <Lock className="w-5 h-5 text-rose-450 mb-1" />
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Photo Private</span>
                        <span className="text-[8px] text-gray-505 mt-0.5">Password Locked</span>
                      </div>
                    )}

                    {/* Quality Match overlay */}
                    <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 rounded-md text-[9px] font-black text-rose-300 border border-white/10">
                      Match {profile.compatibilityScore}%
                    </div>
                  </div>

                  {/* Identification and Location Details */}
                  <div className="space-y-1 cursor-pointer">
                    
                    {/* Live dot status pill overlay */}
                    <div className="flex items-center space-x-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${profile.online ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
                      <span className="text-[9.5px] font-bold text-gray-500 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5 shrink-0" />
                        <span>{profile.lastActiveText || (profile.online ? 'Online' : 'Offline')}</span>
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <h4 className="font-display font-extrabold text-sm text-slate-900 truncate pr-1">
                        {profile.name}
                      </h4>
                      <span className="text-xs font-black text-rose-600 shrink-0">
                        {profile.age} Yrs
                      </span>
                    </div>

                    <p className="text-[10.5px] text-slate-600 font-semibold truncate">
                      {profile.religion} &bull; {profile.caste}
                    </p>
                    
                    <div className="flex items-center text-[10px] text-gray-400 truncate">
                      <MapPin className="w-2.5 h-2.5 mr-0.5 text-rose-400 shrink-0" />
                      <span>{profile.location}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action: Connect Now Button */}
                <div className="px-3 pb-3 pt-1 border-t border-slate-50 bg-slate-50/30">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Stop details dialog trigger
                      onExpressInterest(profile.id);
                    }}
                    className={`w-full py-1.5 px-3 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                      hasSent
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-600 hover:bg-rose-700 text-white shadow-2xs hover:shadow-xs active:scale-98'
                    }`}
                  >
                    {hasSent ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Connected</span>
                      </>
                    ) : (
                      <>
                        <Heart className="w-3.5 h-3.5 fill-current" />
                        <span>Connect Now</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
