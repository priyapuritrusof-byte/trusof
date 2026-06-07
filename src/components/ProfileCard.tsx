/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ShieldCheck, Lock, Heart, Star, Phone, MessageSquare, Clipboard, MapPin, Briefcase, GraduationCap, Coins } from 'lucide-react';
import { Profile } from '../types';

interface ProfileCardProps {
  profile: Profile;
  isUserPremium: boolean;
  onExpressInterest: (profileId: string) => void;
  interestSent: boolean;
  isShortlisted: boolean;
  onToggleShortlist: (profileId: string) => void;
  onOpenDetails: (profile: Profile) => void;
  onUpgradePrompt: () => void;
}

export default function ProfileCard({
  profile,
  isUserPremium,
  onExpressInterest,
  interestSent,
  isShortlisted,
  onToggleShortlist,
  onOpenDetails,
  onUpgradePrompt
}: ProfileCardProps) {
  const [showDirectPhone, setShowDirectPhone] = useState(false);

  const handlePhoneUnlock = () => {
    alert("Trusof Privacy Guarantee:\n\nDirect contact numbers (Phone & Email) are hidden to prevent misuse. Please click 'Connect' to trigger an active chat and securely exchange information inside direct private Inbox Chats!");
    setShowDirectPhone(true);
  };

  return (
    <div className={`relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl hover:scale-[1.01] ${
      profile.premium 
        ? 'border-amber-200 shadow-md shadow-amber-50/40 bg-gradient-to-br from-white to-amber-50/20' 
        : 'border-slate-100 shadow-xs'
    }`}>
      
      {/* Shortlist Star Absolute Icon */}
      <button 
        onClick={() => onToggleShortlist(profile.id)}
        className="absolute top-3 right-3 z-20 p-1.5 bg-white/85 hover:bg-white rounded-full border border-slate-100 shadow-sm transition-colors text-slate-400 hover:text-amber-500 cursor-pointer"
        title="Shortlist/Bookmark this profile"
      >
        <Star className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-amber-400 stroke-amber-500 text-amber-500' : ''}`} />
      </button>

      {/* Tags Wrapper (Verified / Premium Premium Sashes) */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 items-start">
        {profile.verified && (
          <span className="bg-emerald-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md flex items-center space-x-1 shadow-sm">
            <ShieldCheck className="w-3 h-3 fill-white stroke-emerald-600" />
            <span>VERIFIED</span>
          </span>
        )}
        
        {profile.premium && (
          <span className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md flex items-center space-x-1 shadow-sm uppercase tracking-wider">
            <span>PREMIUM</span>
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row p-4 gap-4">
        
        {/* Profile Image Column */}
        <div className="flex-shrink-0 mx-auto sm:mx-0">
          <div className="relative w-28 h-36 sm:w-36 sm:h-48 rounded-xl overflow-hidden border border-slate-150 shadow-inner bg-slate-100">
            {profile.hasPhoto !== false ? (
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition duration-500" 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-150 p-3 text-center border-b border-slate-205">
                <Lock className="w-6 h-6 text-rose-450 mb-1.5 shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 leading-tight">Photo Hidden</span>
                <span className="text-[8px] text-gray-500 mt-1 leading-normal font-sans">Connect with profile to request photo view</span>
              </div>
            )}
            
            {/* Compatibility Badge Circle Overlay */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-slate-900/85 backdrop-blur-xs px-2 py-0.5 rounded-full text-white text-[9.5px] font-black tracking-wider flex items-center space-x-0.5 border border-white/15">
              <span className="text-pink-400">Match:</span>
              <span>{profile.compatibilityScore}%</span>
            </div>
          </div>
        </div>

        {/* Profile Information details segment */}
        <div className="flex-grow space-y-2.5">
          
          {/* Header row with Name, Age, Profession */}
          <div>
            <div className="flex items-center space-x-1.5 flex-wrap gap-y-1.5">
              <h4 className="font-display font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                {profile.name}
              </h4>
              <span className="inline-block w-1 h-1 rounded-full bg-slate-300 shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-rose-600 shrink-0">
                {profile.age} Yrs
              </span>
              <span className="text-[11px] sm:text-xs text-gray-400 shrink-0">({profile.height})</span>
              
              {/* Online / Offline dynamic status indicator dot */}
              <span className="inline-flex items-center space-x-1 text-[9.5px] font-bold bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full shadow-2xs">
                <span className={`w-2 h-2 rounded-full shrink-0 ${profile.online ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className={profile.online ? 'text-green-700' : 'text-slate-550'}>
                  {profile.lastActiveText || (profile.online ? 'Online' : 'Offline')}
                </span>
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium font-mono mt-0.5">
              Ref ID: #{profile.id.replace('prof_', 'TS-')}
            </p>
          </div>

          {/* Quick Stats Grid Info */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] sm:text-xs">
            <div className="flex items-center space-x-1.5 text-gray-600">
              <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
              <span className="truncate">{profile.location}</span>
            </div>
            
            <div className="flex items-center space-x-1.5 text-gray-600">
              <Briefcase className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
              <span className="truncate">{profile.occupation}</span>
            </div>

            <div className="flex items-center space-x-1.5 text-gray-600">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span className="truncate">{profile.education}</span>
            </div>

            <div className="flex items-center space-x-1.5 text-gray-600">
              <Coins className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <span className="truncate">{profile.income}</span>
            </div>
          </div>

          {/* Key Cultural Specs Info Row */}
          <div className="flex flex-wrap gap-1">
            <span className="bg-slate-50 border border-slate-150 text-slate-700 text-[9.5px] font-bold px-2 py-0.5 rounded-md">
              Bio: {profile.religion}
            </span>
            <span className="bg-slate-50 border border-slate-150 text-slate-700 text-[9.5px] font-bold px-2 py-0.5 rounded-md">
              Caste: {profile.caste} {profile.subCaste ? `(${profile.subCaste})` : ''}
            </span>
            <span className="bg-slate-50 border border-slate-150 text-slate-700 text-[9.5px] font-bold px-2 py-0.5 rounded-md">
              Mother Tongue: {profile.motherTongue}
            </span>
            {profile.horoscopeMatch && profile.horoscopeMatch !== 'None' && (
              <span className="bg-rose-50 border border-rose-100 text-rose-700 text-[9.5px] font-bold px-2 py-0.5 rounded-md">
                Astro: {profile.horoscopeMatch}
              </span>
            )}
          </div>

          {/* Small customized short bio summary */}
          <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed italic line-clamp-2">
            &quot;{profile.bio}&quot;
          </p>

        </div>

      </div>

      {/* Action Footer Bar */}
      <div className="border-t border-slate-100 px-3 py-2.5 sm:px-5 sm:py-3 bg-slate-50/50 rounded-b-2xl grid grid-cols-3 gap-1.5">
        
        {/* 1. Details Viewer Button */}
        <button
          onClick={() => onOpenDetails(profile)}
          className="text-[11px] sm:text-xs font-bold text-slate-700 bg-white border border-slate-250 py-2 sm:py-2.5 px-1 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center space-x-0.5 cursor-pointer shadow-2xs"
        >
          <span>More details</span>
        </button>

        {/* 2. Chat / Express interest buttons */}
        <button
          onClick={() => onExpressInterest(profile.id)}
          className={`text-[11px] sm:text-xs font-bold py-2 sm:py-2.5 px-1 rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer shadow-sm ${
            interestSent
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-2 focus:ring-rose-500'
          }`}
        >
          {interestSent ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Requested</span>
            </>
          ) : (
            <>
              <Heart className="w-3.5 h-3.5 fill-current shrink-0" />
              <span>Connect</span>
            </>
          )}
        </button>

        {/* 3. Unlock phone number trigger */}
        <button
          onClick={handlePhoneUnlock}
          className={`text-[11px] sm:text-xs font-bold py-2 sm:py-2.5 px-1 rounded-xl transition-all flex items-center justify-center space-x-0.5 cursor-pointer border shadow-2xs ${
            showDirectPhone 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-250' 
              : 'bg-white text-indigo-700 border-indigo-250 hover:bg-indigo-50/50'
          }`}
        >
          <Phone className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">
            {showDirectPhone ? "🔒 Ask in Chat" : (
              <span>Contact</span>
            )}
          </span>
        </button>

      </div>

    </div>
  );
}
