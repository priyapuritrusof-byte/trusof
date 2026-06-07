/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Heart, Shield, Award, Users } from 'lucide-react';
import { SearchFilters } from '../types';
import { RELIGIONS, MOTHER_TONGUES } from '../data';

interface MatrimonialHeroProps {
  filters: SearchFilters;
  onSearchChange: (filters: SearchFilters) => void;
  totalProfilesCount: number;
  totalVerifiedCount: number;
}

export default function MatrimonialHero({
  filters,
  onSearchChange,
  totalProfilesCount,
  totalVerifiedCount
}: MatrimonialHeroProps) {
  const [lookingFor, setLookingFor] = useState<'Male' | 'Female'>(
    filters.gender === 'All' ? 'Female' : (filters.gender as 'Male' | 'Female')
  );
  const [religion, setReligion] = useState<string>(filters.religion);
  const [tongue, setTongue] = useState<string>(filters.motherTongue);
  const [ageRange, setAgeRange] = useState({ min: 21, max: 35 });

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange({
      ...filters,
      gender: lookingFor,
      religion: religion,
      motherTongue: tongue,
      ageMin: ageRange.min,
      ageMax: ageRange.max
    });

    // Elegant auto-scroll down to list section
    const element = document.getElementById('search-results-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-rose-900 via-rose-950 to-slate-950 text-white min-h-0 py-6 md:py-10 flex items-center px-4">
      
      {/* Dynamic Background Motifs / Decorative rings */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-12 right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center relative z-10">

        {/* Left column: Brand Headline and Pitch */}
        <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
          <div className="inline-flex items-center space-x-1.5 bg-rose-500/15 border border-rose-500/30 text-rose-300 px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-rose-400 stroke-rose-400 animate-pulse" />
            <span>India&apos;s Trust-First Matrimony Network</span>
          </div>

          <h1 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-300 to-amber-300 font-serif italic">Perfect Match</span> With Full Trust
          </h1>

          <p className="text-gray-300 text-xs sm:text-sm max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
            Created for verified and elite Indian profiles. Create your personalized live biodata, unlock direct messaging instantly, use our compatibility index engine, and download ready-made builds directly to your server cPanel effortlessly.
          </p>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto lg:mx-0 border-t border-rose-800/50 pt-4 mt-2">
            <div className="text-center lg:text-left">
              <p className="text-xl sm:text-2xl font-extrabold text-amber-400">{totalProfilesCount}+</p>
              <p className="text-[9px] text-gray-400 font-mono font-bold tracking-wider uppercase mt-0.5">Active Matches</p>
            </div>
            <div className="text-center lg:text-left border-l border-rose-800/40 pl-3">
              <p className="text-xl sm:text-2xl font-extrabold text-white">{totalVerifiedCount}+</p>
              <p className="text-[9px] text-gray-400 font-mono font-bold tracking-wider uppercase mt-0.5">Verified Users</p>
            </div>
            <div className="text-center lg:text-left border-l border-rose-800/40 pl-3">
              <p className="text-xl sm:text-2xl font-extrabold text-rose-400">100%</p>
              <p className="text-[9px] text-gray-400 font-mono font-bold tracking-wider uppercase mt-0.5">Privacy Safe</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start pt-1.5">
            <div className="flex items-center space-x-1.5 text-[10px] text-gray-300 bg-slate-900/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-850">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Aadhaar Verified</span>
            </div>
            <div className="flex items-center space-x-1.5 text-[10px] text-gray-300 bg-slate-900/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-850">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Premium Profiles</span>
            </div>
            <div className="flex items-center space-x-1.5 text-[10px] text-gray-300 bg-slate-900/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-850">
              <Users className="w-3.5 h-3.5 text-rose-400" />
              <span>Manual Screening</span>
            </div>
          </div>
        </div>

        {/* Right column: Interactive Quick Search Overlayer Form */}
        <div className="lg:col-span-5 bg-white/95 backdrop-blur-md text-slate-900 border border-rose-100 p-4 sm:p-6 rounded-2xl shadow-xl relative mt-4 lg:mt-0">
          
          <div className="absolute -top-3 right-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider flex items-center space-x-1">
            <span className="h-1 w-1 rounded-full bg-white animate-ping" />
            <span>Find Best Matches</span>
          </div>

          <h3 className="font-display font-black text-lg text-slate-900 tracking-tight mb-4">
            Start Your Matrimonial Search Let&apos;s Match!
          </h3>

          <form onSubmit={handleQuickSearch} className="space-y-3">
            
            {/* Find Selection Toggle */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                I am looking for a
              </label>
              <div className="grid grid-cols-2 gap-2" id="hero-quick-gender">
                <button
                  type="button"
                  onClick={() => setLookingFor('Female')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                    lookingFor === 'Female'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-rose-50'
                  }`}
                >
                  <span>Bride (Female)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLookingFor('Male')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                    lookingFor === 'Male'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-rose-50'
                  }`}
                >
                  <span>Groom (Male)</span>
                </button>
              </div>
            </div>

            {/* Age selector */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Age From
                </label>
                <select
                  value={ageRange.min}
                  onChange={(e) => setAgeRange({ ...ageRange, min: parseInt(e.target.value) })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-slate-800"
                >
                  {Array.from({ length: 18 }, (_, i) => 18 + i).map((num) => (
                    <option key={num} value={num}>
                      {num} Years
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Age To
                </label>
                <select
                  value={ageRange.max}
                  onChange={(e) => setAgeRange({ ...ageRange, max: parseInt(e.target.value) })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-slate-800"
                >
                  {Array.from({ length: 33 }, (_, i) => 23 + i).map((num) => (
                    <option key={num} value={num}>
                      {num} Years
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Religion Box */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Religion Preferred
              </label>
              <select
                value={religion}
                onChange={(e) => setReligion(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-slate-800"
                id="hero-quick-religion"
              >
                {RELIGIONS.map((rel) => (
                  <option key={rel} value={rel}>
                    {rel === 'All' ? 'All Religions' : rel}
                  </option>
                ))}
              </select>
            </div>

            {/* Mother Tongue Option */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Mother Tongue
              </label>
              <select
                value={tongue}
                onChange={(e) => setTongue(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-slate-800"
                id="hero-quick-tongue"
              >
                {MOTHER_TONGUES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang === 'All' ? 'All Languages' : lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white py-2.5 px-3 rounded-lg text-xs font-extrabold shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer mt-2"
              id="hero-search-submit-btn"
            >
              <Search className="w-4 h-4" />
              <span>Perform Matching Search</span>
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}
