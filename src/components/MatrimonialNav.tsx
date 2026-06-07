/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Flame, Heart, MessageSquare, ShieldCheck, User, CreditCard, CloudLightning, HelpCircle, Search, Cloud, LogIn, LogOut } from 'lucide-react';

interface MatrimonialNavProps {
  currentTab: 'find' | 'register' | 'chats' | 'membership' | 'workspace';
  onTabChange: (tab: 'find' | 'register' | 'chats' | 'membership' | 'workspace') => void;
  isUserPremium: boolean;
  premiumTier: string;
  userProfileName?: string;
  chatsCount: number;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  isGuest: boolean;
  onLogout: () => void;
}

export default function MatrimonialNav({
  currentTab,
  onTabChange,
  isUserPremium,
  premiumTier,
  userProfileName,
  chatsCount,
  searchQuery,
  onSearchQueryChange,
  onOpenLogin,
  onOpenRegister,
  isGuest,
  onLogout
}: MatrimonialNavProps) {
  const handleQueryChange = (val: string) => {
    onSearchQueryChange(val);
    if (val && currentTab !== 'find') {
      onTabChange('find');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-rose-100 shadow-sm backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-15">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-2 cursor-pointer shrink-0" onClick={() => onTabChange('find')}>
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              <Heart className="w-4.5 h-4.5 fill-white stroke-rose-600 stroke-2" />
            </div>
            <div className="hidden xs:block">
              <div className="flex items-baseline space-x-1">
                <span className="font-display font-black text-base tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-700 to-pink-600">
                  TRUSOF
                </span>
                <span className="text-[8px] bg-amber-500 text-white font-extrabold px-1 py-0.5 rounded-sm uppercase tracking-wide">
                  Shaadi
                </span>
              </div>
              <p className="text-[7.5px] text-gray-400 font-mono tracking-wider uppercase leading-none">Matrimony</p>
            </div>
          </div>

          {/* Integrated Compact Header Search Input */}
          <div className="flex-grow max-w-xs md:max-w-sm mx-2 md:mx-4 relative">
            <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search caste, name, city..."
              className="w-full bg-slate-50 border border-slate-150 focus:border-rose-300 focus:ring-1 focus:ring-rose-200 hover:bg-slate-100/50 focus:bg-white text-xs font-semibold pl-8 pr-8 py-1 rounded-lg transition-all placeholder:text-gray-400 text-slate-800 h-8"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleQueryChange('')}
                className="absolute inset-y-0 right-2 flex items-center text-[9px] bg-slate-150 hover:bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-md my-auto h-5 font-bold cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            <button
              id="nav-tab-find"
              onClick={() => onTabChange('find')}
              className={`flex items-center space-x-1 py-1 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'find'
                  ? 'bg-rose-50 text-rose-700 shadow-3xs'
                  : 'text-gray-650 hover:bg-slate-50 hover:text-gray-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>Find Matches</span>
            </button>

            <button
              id="nav-tab-register"
              onClick={() => onTabChange('register')}
              className={`flex items-center space-x-1 py-1 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'register'
                  ? 'bg-rose-50 text-rose-700 shadow-3xs'
                  : 'text-gray-650 hover:bg-slate-50 hover:text-gray-900'
              }`}
            >
              <User className="w-3.5 h-3.5 text-blue-500" />
              <span>Biodata</span>
            </button>

            <button
              id="nav-tab-chats"
              onClick={() => onTabChange('chats')}
              className={`flex items-center space-x-1 py-1 px-2.5 rounded-lg text-xs font-semibold transition-all relative ${
                currentTab === 'chats'
                  ? 'bg-rose-50 text-rose-700 shadow-3xs'
                  : 'text-gray-650 hover:bg-slate-50 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
              <span>Inbox Chats</span>
              {chatsCount > 0 && (
                <span className="absolute -top-1 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-650 text-[8px] font-black text-white ring-1 ring-white animate-pulse">
                  {chatsCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-membership"
              onClick={() => onTabChange('membership')}
              className={`flex items-center space-x-1 py-1 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'membership'
                  ? 'bg-rose-50 text-rose-700 shadow-3xs'
                  : 'text-gray-650 hover:bg-slate-50 hover:text-gray-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-purple-500" />
              <span>Premium Plans</span>
            </button>

            <button
              id="nav-tab-workspace"
              onClick={() => onTabChange('workspace')}
              className={`flex items-center space-x-1 py-1 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'workspace'
                  ? 'bg-rose-50 text-rose-700 shadow-3xs'
                  : 'text-gray-650 hover:bg-slate-50 hover:text-gray-900'
              }`}
            >
              <Cloud className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
              <span>Workspace Hub</span>
            </button>

            <a
              href="https://wa.me/919015558820?text=Hello%20Trusof%20Matrimony%20Consultant,%20I%20need%20assistance%20with%20my%20matrimonial%20search"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 py-1 px-2.5 rounded-lg text-[10px] font-black bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-xs transition-all cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 shrink-0 animate-bounce" />
              <div className="text-left leading-none">
                <span className="block text-[8px] uppercase tracking-wide font-black opacity-95">Consultant</span>
                <span className="block text-[9.5px] font-mono mt-0.5">9015558820</span>
              </div>
            </a>
          </nav>

          {/* User Account / Status Segment */}
          <div className="flex items-center space-x-2 shrink-0">
            {isUserPremium ? (
              <div className="flex items-center space-x-1 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-xs">
                <ShieldCheck className="w-3 h-3 text-yellow-100" />
                <span>{premiumTier}</span>
              </div>
            ) : (
              <button
                onClick={() => onTabChange('membership')}
                className="hidden sm:flex items-center space-x-0.5 bg-amber-50 border border-amber-150 text-amber-700 text-[10.5px] font-bold px-2 py-1 rounded-full hover:bg-amber-100 transition-colors"
              >
                <span>Upgrade</span>
              </button>
            )}

            {/* User Account Head (Login / Sign Up or Authenticated Mode) */}
            {isGuest ? (
              <div className="flex items-center space-x-1.5 shrink-0">
                <button
                  onClick={onOpenLogin}
                  className="bg-rose-50 border border-rose-150 text-rose-700 text-[10.5px] font-bold px-2.5 py-1 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer flex items-center space-x-1 h-8"
                  id="nav-btn-login"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </button>
                <button
                  onClick={onOpenRegister}
                  className="hidden xs:flex bg-gradient-to-r from-rose-700 to-pink-600 text-white text-[10.5px] font-bold px-2.5 py-1 rounded-lg hover:opacity-90 transition-opacity cursor-pointer items-center space-x-1 h-8 shadow-xs border border-rose-100"
                  id="nav-btn-register"
                >
                  <span>Mera Account</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 shrink-0">
                {/* User Info avatar clickable to go edit biodata */}
                <div 
                  className="flex items-center space-x-1.5 bg-slate-50 border border-slate-150 rounded-lg p-1 hover:bg-slate-100 transition-colors cursor-pointer h-8"
                  onClick={() => onTabChange('register')}
                  title="View / Edit Biodata"
                >
                  <div className="hidden lg:block text-right leading-none">
                    <p className="text-[10px] font-black text-rose-800">
                      {userProfileName || 'Logged In'}
                    </p>
                    <p className="text-[7px] text-gray-400 mt-0.5 tracking-wider font-extrabold uppercase leading-none">My Profile</p>
                  </div>
                  <div className="w-6.5 h-6.5 bg-rose-600 text-white rounded-md flex items-center justify-center font-black text-xs border border-rose-750">
                    {userProfileName ? userProfileName.charAt(0).toUpperCase() : 'U'}
                  </div>
                </div>

                {/* Direct quick Logout action */}
                <button
                  onClick={onLogout}
                  className="bg-slate-100 border border-slate-200 hover:bg-rose-50 hover:border-rose-150 hover:text-rose-700 text-slate-500 p-1.5 rounded-lg transition-colors cursor-pointer h-8"
                  title="Logout Account"
                  id="nav-btn-logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Sticky Shortcut Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-rose-50 bg-rose-50/50 py-2.5 px-3">
        <button
          onClick={() => onTabChange('find')}
          className={`flex flex-col items-center space-y-0.5 text-[10px] font-bold transition-all ${
            currentTab === 'find' ? 'text-rose-600 scale-105' : 'text-gray-500'
          }`}
        >
          <Flame className="w-4.5 h-4.5" />
          <span>Matches</span>
        </button>

        <button
          onClick={() => onTabChange('register')}
          className={`flex flex-col items-center space-y-0.5 text-[10px] font-bold transition-all ${
            currentTab === 'register' ? 'text-rose-600 scale-105' : 'text-gray-500'
          }`}
        >
          <User className="w-4.5 h-4.5" />
          <span>Biodata</span>
        </button>

        <button
          onClick={() => onTabChange('chats')}
          className={`flex flex-col items-center space-y-0.5 text-[10px] font-bold transition-all relative ${
            currentTab === 'chats' ? 'text-rose-600 scale-105' : 'text-gray-500'
          }`}
        >
          <MessageSquare className="w-4.5 h-4.5" />
          <span>Chats</span>
          {chatsCount > 0 && (
            <span className="absolute -top-1 right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white">
              {chatsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onTabChange('membership')}
          className={`flex flex-col items-center space-y-0.5 text-[10px] font-bold transition-all ${
            currentTab === 'membership' ? 'text-rose-600 scale-105' : 'text-gray-500'
          }`}
        >
          <CreditCard className="w-4.5 h-4.5" />
          <span>Premium</span>
        </button>

        <button
          onClick={() => onTabChange('workspace')}
          className={`flex flex-col items-center space-y-0.5 text-[10px] font-bold transition-all ${
            currentTab === 'workspace' ? 'text-rose-600 scale-105' : 'text-gray-500'
          }`}
        >
          <Cloud className="w-4.5 h-4.5 text-cyan-500" />
          <span>Sync</span>
        </button>

      </div>
    </header>
  );
}
