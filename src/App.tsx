/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { SearchFilters, Profile } from './types';
import { RELIGIONS, MOTHER_TONGUES, LOCATIONS } from './data';
import MatrimonialNav from './components/MatrimonialNav';
import MatrimonialHero from './components/MatrimonialHero';
import ProfileCard from './components/ProfileCard';
import ProfileDetailsModal from './components/ProfileDetailsModal';
import ActiveConversations from './components/ActiveConversations';
import RegisterForm from './components/RegisterForm';
import MembershipPlans from './components/MembershipPlans';
import GuidanceCpanel from './components/GuidanceCpanel';
import FeaturedScrollTray from './components/FeaturedScrollTray';
import WorkspaceHub from './components/WorkspaceHub';
import AuthModal from './components/AuthModal';
import { Heart, Star, Search, Filter, ShieldCheck, HelpCircle, Flame, Mail, Award, AlertCircle, User, Cloud } from 'lucide-react';
import { useFirebase } from './components/FirebaseContext';

export default function App() {
  const {
    user,
    loading,
    profiles,
    interestSentMap,
    shortlistMap,
    activeConversations,
    isUserPremium,
    premiumTier,
    googleAccessToken,
    isOfflineLocalMode,
    loginWithGoogle,
    connectGoogleDrive,
    logout,
    registerProfile,
    resetRegistration,
    toggleShortlist,
    expressInterest,
    changePremiumLevel
  } = useFirebase();

  // Navigation & Screen Control state
  const [currentTab, setCurrentTab] = useState<'find' | 'register' | 'chats' | 'membership' | 'workspace'>('find');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Auth modal triggering states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'login' | 'register'>('login');

  // Filter conditions
  const [filters, setFilters] = useState<SearchFilters>({
    gender: 'All',
    ageMin: 18,
    ageMax: 45,
    religion: 'All',
    motherTongue: 'All',
    location: 'All',
    query: ''
  });

  // Active modal or selected profile reference states
  const [selectedDetailsProfile, setSelectedDetailsProfile] = useState<Profile | null>(null);
  const [activeChatProfileId, setActiveChatProfileId] = useState<string | null>(null);

  const registeredProfile = user ? profiles.find(p => p.ownerId === user.uid) || null : null;
  const isRegistered = !!registeredProfile;

  // Handle registrations
  const handleRegisterProfile = async (newProfile: Profile) => {
    await registerProfile(newProfile);
  };

  const handleResetRegistration = async () => {
    if (registeredProfile) {
      await resetRegistration(registeredProfile.id);
    }
  };

  // Upgrades free plans
  const handleUpgradeSuccess = async (tierName: string) => {
    await changePremiumLevel(tierName);
  };

  // Expresses Match Connection Interest
  const handleExpressInterest = async (profileId: string) => {
    const isGuest = !user || user.uid === 'local_guest_user';
    if (isGuest) {
      setAuthModalInitialTab('login');
      setIsAuthModalOpen(true);
      return;
    }
    
    await expressInterest(profileId);
    
    // Auto-select chat profile and switch tab with positive notification
    setActiveChatProfileId(profileId);
    
    // Setup simulated delay before showing live interaction notification dialog
    setTimeout(() => {
      setCurrentTab('chats');
    }, 450);
  };

  // Toggle Shortlist/Stars State
  const handleToggleShortlist = async (profileId: string) => {
    const isGuest = !user || user.uid === 'local_guest_user';
    if (isGuest) {
      setAuthModalInitialTab('login');
      setIsAuthModalOpen(true);
      return;
    }
    await toggleShortlist(profileId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcf9fb] flex flex-col items-center justify-center space-y-4">
        <Heart className="w-12 h-12 text-rose-600 animate-pulse fill-rose-650" />
        <h3 className="font-display font-black text-xl text-slate-900">Trusof Matrimony</h3>
        <p className="font-sans font-medium text-xs text-gray-500">Synchronizing secure Firebase profiles...</p>
      </div>
    );
  }

  // Filter application calculation logic
  const filteredProfiles = profiles.filter((profile) => {
    // Remove individual user's own profile card from search outputs
    if (registeredProfile && profile.id === registeredProfile.id) {
      return false;
    }

    // Apply gender bounds
    if (filters.gender !== 'All' && profile.gender !== filters.gender) {
      return false;
    }

    // Apply age bounds
    if (profile.age < filters.ageMin || profile.age > filters.ageMax) {
      return false;
    }

    // Apply religion bounds
    if (filters.religion !== 'All' && profile.religion !== filters.religion) {
      return false;
    }

    // Apply mother tongue bounds
    if (filters.motherTongue !== 'All' && profile.motherTongue !== filters.motherTongue) {
      return false;
    }

    // Apply location country states
    if (filters.location !== 'All' && profile.location !== filters.location) {
      return false;
    }

    // Apply text search queries
    if (filters.query.trim()) {
      const q = filters.query.toLowerCase();
      const nameMatch = profile.name.toLowerCase().includes(q);
      const castMatch = profile.caste.toLowerCase().includes(q);
      const subCastMatch = profile.subCaste?.toLowerCase().includes(q) || false;
      const jobMatch = profile.occupation.toLowerCase().includes(q);
      const locMatch = profile.location.toLowerCase().includes(q);

      if (!nameMatch && !castMatch && !subCastMatch && !jobMatch && !locMatch) {
        return false;
      }
    }

    return true;
  });

  // Calculate stats count
  const totalVerifiedCount = profiles.filter(p => p.verified).length;
  const connectedProfiles = profiles.filter(p => interestSentMap[p.id]);

  return (
    <div className="relative min-h-screen bg-[#fcf9fb] flex flex-col selection:bg-rose-600 selection:text-white pb-12">
      
      {/* 
        Burgundy & Gold Traditional Themed Matrimonial Navbar
      */}
      <MatrimonialNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isUserPremium={isUserPremium}
        premiumTier={premiumTier}
        userProfileName={registeredProfile?.name}
        chatsCount={connectedProfiles.length}
        searchQuery={filters.query}
        onSearchQueryChange={(q) => setFilters(prev => ({ ...prev, query: q }))}
        onOpenLogin={() => {
          setAuthModalInitialTab('login');
          setIsAuthModalOpen(true);
        }}
        onOpenRegister={() => {
          setAuthModalInitialTab('register');
          setIsAuthModalOpen(true);
        }}
        isGuest={!user || user.uid === 'local_guest_user'}
        onLogout={logout}
      />

      {/* Global Secure Authentication Dialog */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalInitialTab}
      />

      {/* Main Contents Screens router controller */}
      <main className="flex-grow">
        
        {currentTab === 'find' && (
          <div className="space-y-4 md:space-y-6 animate-fadeIn">
            
            {/* Elegant Header Hero Search Block */}
            <MatrimonialHero 
              filters={filters}
              onSearchChange={setFilters}
              totalProfilesCount={filteredProfiles.length}
              totalVerifiedCount={totalVerifiedCount}
            />

            {/* 100% Free Value Proposition Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-rose-800 via-pink-800 to-amber-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border-2 border-amber-300">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Heart className="w-40 h-40 fill-white" />
                </div>
                
                <div className="relative z-10 space-y-4">
                  <div className="inline-flex items-center space-x-2 bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                    <span>TRUSOF MATRIMONY SERVICES</span>
                  </div>
                  
                  <h3 className="font-display font-black text-xl sm:text-2xl tracking-tight text-white leading-tight">
                    Matrimonial Services at its Best &amp; 100% Completely &amp; Totally FREE! 🌟
                  </h3>
                  
                  <p className="text-rose-100 text-xs sm:text-sm font-medium leading-relaxed max-w-2xl">
                    Trusof is among the top marriage service portals, providing a premium database of thousands of Indian and Desi bride &amp; groom marriage profiles with clear photographs. We are known for our 100% FREE matchmaking service, and we plan to keep it this way forever.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-3 text-center">
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-rose-300">Registration</p>
                      <p className="text-xs font-black text-amber-300 mt-1">100% FREE!!</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-rose-300">Search Filters</p>
                      <p className="text-xs font-black text-amber-300 mt-1">100% FREE!!</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-rose-300">View Contact/Mobile</p>
                      <p className="text-xs font-black text-amber-300 mt-1">100% FREE!!</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-rose-300">Send Contact Messages</p>
                      <p className="text-xs font-black text-amber-300 mt-1">100% FREE!!</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 col-span-2 md:col-span-1">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-rose-300">Unlimited Chats</p>
                      <p className="text-xs font-black text-amber-300 mt-1">100% FREE!!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Members Horizontal Carousel Slider */}
            <FeaturedScrollTray 
              profiles={profiles}
              interestSentMap={interestSentMap}
              onExpressInterest={handleExpressInterest}
              onOpenDetails={setSelectedDetailsProfile}
            />

            {/* Catalog list result container */}
            <div id="search-results-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              
              {/* Mobile Filter Toggle Button */}
              <div className="lg:hidden mb-4">
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="w-full flex items-center justify-between bg-white border border-rose-100 px-4 py-3 rounded-xl shadow-xs text-xs font-bold text-slate-800 hover:bg-slate-50 cursor-pointer"
                >
                  <span className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-rose-600" />
                    <span className="font-sans">Filter &amp; Preferences</span>
                  </span>
                  <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md text-[10px] font-mono">
                    {showMobileFilters ? 'HIDE ▲' : 'SHOW ▼'}
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
                
                {/* Side filtering panel controls */}
                <aside className={`${showMobileFilters ? 'block' : 'hidden lg:block'} lg:col-span-4 bg-white border border-rose-100 p-4 sm:p-6 rounded-2xl shadow-xs space-y-4 sm:space-y-6 sticky top-24`}>
                  
                  <div className="flex items-center justify-between border-b border-rose-50 pb-4">
                    <h4 className="font-display font-extrabold text-sm text-slate-900 tracking-tight flex items-center space-x-1.5">
                      <Filter className="w-4 h-4 text-rose-600" />
                      <span>Advanced Match Filters</span>
                    </h4>
                    <button
                      onClick={() => setFilters({
                        gender: 'All',
                        ageMin: 18,
                        ageMax: 45,
                        religion: 'All',
                        motherTongue: 'All',
                        location: 'All',
                        query: ''
                      })}
                      className="text-[10px] text-gray-400 hover:text-rose-600 font-bold uppercase transition-colors"
                    >
                      Reset All
                    </button>
                  </div>

                  {/* text field query finder */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                      Search Name, Caste or Job
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={filters.query}
                        onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                        placeholder="Search e.g. Sharma, CA, Mumbai..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500 text-slate-800"
                        id="filter-query-field"
                      />
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-450" />
                    </div>
                  </div>

                  {/* Gender filter switcher */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Show Profiles</label>
                    <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-150 text-xs text-center font-bold">
                      <button
                        type="button"
                        onClick={() => setFilters({ ...filters, gender: 'All' })}
                        className={`py-1.5 rounded-lg transition-all cursor-pointer ${filters.gender === 'All' ? 'bg-white shadow-3xs text-rose-700' : 'text-slate-550'}`}
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onClick={() => setFilters({ ...filters, gender: 'Female' })}
                        className={`py-1.5 rounded-lg transition-all cursor-pointer ${filters.gender === 'Female' ? 'bg-white shadow-3xs text-rose-700' : 'text-slate-550'}`}
                      >
                        Brides
                      </button>
                      <button
                        type="button"
                        onClick={() => setFilters({ ...filters, gender: 'Male' })}
                        className={`py-1.5 rounded-lg transition-all cursor-pointer ${filters.gender === 'Male' ? 'bg-white shadow-3xs text-rose-700' : 'text-slate-550'}`}
                      >
                        Grooms
                      </button>
                    </div>
                  </div>

                  {/* Religious specs */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Religion Preferred</label>
                    <select
                      value={filters.religion}
                      onChange={(e) => setFilters({ ...filters, religion: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                      id="filter-religion-select"
                    >
                      {RELIGIONS.map((rel) => (
                        <option key={rel} value={rel}>{rel === 'All' ? 'All Religions' : rel}</option>
                      ))}
                    </select>
                  </div>

                  {/* Mother tongues selection */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mother Tongues</label>
                    <select
                      value={filters.motherTongue}
                      onChange={(e) => setFilters({ ...filters, motherTongue: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                      id="filter-tongue-select"
                    >
                      {MOTHER_TONGUES.map((lang) => (
                        <option key={lang} value={lang}>{lang === 'All' ? 'All Languages' : lang}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location selection */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Current Location</label>
                    <select
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                      id="filter-location-select"
                    >
                      {LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>{loc === 'All' ? 'All Locations' : loc}</option>
                      ))}
                    </select>
                  </div>

                </aside>

                {/* Main profiles directory grid view */}
                <div className="lg:col-span-8 space-y-5">
                  
                  <div className="flex justify-between items-center bg-white p-4 border border-rose-100 rounded-2xl shadow-2xs">
                    <p className="text-xs font-bold text-slate-700">
                      Showing <span className="text-rose-600 font-extrabold">{filteredProfiles.length} matching brides &amp; grooms</span> based on criteria
                    </p>
                    
                    {connectedProfiles.length > 0 && (
                      <span className="text-[10.5px] bg-emerald-50 text-emerald-800 border border-emerald-150 px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        <span>{connectedProfiles.length} active live chats</span>
                      </span>
                    )}
                  </div>

                  {filteredProfiles.length === 0 ? (
                    <div className="text-center bg-white border border-rose-100 p-12 rounded-3xl space-y-4">
                      <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-7 h-7 stroke-1" />
                      </div>
                      <div>
                        <h4 className="font-display font-black text-lg text-slate-900 leading-snug">No matching profiles found</h4>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                          Try resetting filters or expanding age bounds. You can also generate your own biodata to list yourself dynamically in the directory.
                        </p>
                        <button
                          onClick={() => setFilters({
                            gender: 'All',
                            ageMin: 18,
                            ageMax: 45,
                            religion: 'All',
                            motherTongue: 'All',
                            location: 'All',
                            query: ''
                          })}
                          className="bg-rose-50 text-rose-700 font-bold border border-rose-100 py-2 px-4 rounded-xl text-xs mt-4 cursor-pointer"
                        >
                          Clear Active Filters
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-5">
                      {filteredProfiles.map((p) => {
                        return (
                          <ProfileCard
                            key={p.id}
                            profile={p}
                            isUserPremium={isUserPremium}
                            interestSent={!!interestSentMap[p.id]}
                            onExpressInterest={handleExpressInterest}
                            isShortlisted={!!shortlistMap[p.id]}
                            onToggleShortlist={handleToggleShortlist}
                            onOpenDetails={setSelectedDetailsProfile}
                            onUpgradePrompt={() => setCurrentTab('membership')}
                          />
                        );
                      })}
                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>
        )}

        {/* Tab route 2: Register Bios Form  */}
        {currentTab === 'register' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
            {!user || user.uid === 'local_guest_user' ? (
              <div className="max-w-md mx-auto bg-white rounded-3xl border border-rose-100 p-8 text-center space-y-6 shadow-xl shadow-rose-950/5">
                <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <User className="w-8 h-8 text-rose-700" />
                </div>
                <div>
                  <h3 className="font-display font-black text-xl text-slate-800">Create Private Biodata</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Apna registered matrimonial profile create karne ke liye login karein ya naya account register karein. Mobile OTP validation helps to keep candidates 100% verified.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setAuthModalInitialTab('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="py-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl hover:bg-rose-100 cursor-pointer h-10 transition-colors"
                  >
                    Sign In First
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalInitialTab('register');
                      setIsAuthModalOpen(true);
                    }}
                    className="py-2.5 bg-gradient-to-r from-rose-700 to-pink-600 text-white text-xs font-bold rounded-xl hover:opacity-90 cursor-pointer shadow-xs border border-rose-100 h-10 transition-opacity"
                  >
                    1st-Time Register
                  </button>
                </div>
              </div>
            ) : (
              <RegisterForm
                onRegisterProfile={handleRegisterProfile}
                isRegistered={isRegistered}
                registeredProfile={registeredProfile}
                onResetRegistration={handleResetRegistration}
                googleAccessToken={googleAccessToken}
                onConnectGoogleDrive={connectGoogleDrive}
              />
            )}
          </div>
        )}

        {/* Tab route 3: Conversations chat inbox */}
        {currentTab === 'chats' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
            {!user || user.uid === 'local_guest_user' ? (
              <div className="max-w-md mx-auto bg-white rounded-3xl border border-rose-100 p-8 text-center space-y-6 shadow-xl shadow-rose-950/5">
                <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner border border-rose-100">
                  <Mail className="w-8 h-8 text-rose-700" />
                </div>
                <div>
                  <h3 className="font-display font-black text-xl text-slate-800">Your Conversations</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Apni incoming live matches conversations & chats padhne ke liye apne account me login karein ya naya account register karein.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setAuthModalInitialTab('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="py-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl hover:bg-rose-100 cursor-pointer h-10 transition-colors"
                  >
                    Sign In First
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalInitialTab('register');
                      setIsAuthModalOpen(true);
                    }}
                    className="py-2.5 bg-gradient-to-r from-rose-700 to-pink-600 text-white text-xs font-bold rounded-xl hover:opacity-90 cursor-pointer shadow-xs border border-rose-100 h-10 transition-opacity"
                  >
                    1st-Time Register
                  </button>
                </div>
              </div>
            ) : (
              <ActiveConversations
                connectedProfiles={connectedProfiles}
                activeProfileId={activeChatProfileId}
                onSelectProfile={setActiveChatProfileId}
                isUserPremium={isUserPremium}
                onUpgradePrompt={() => setCurrentTab('membership')}
              />
            )}
          </div>
        )}

        {/* Tab route 4: Premium upgrade pricing section */}
        {currentTab === 'membership' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
            <MembershipPlans
              onUpgradeSuccess={handleUpgradeSuccess}
              isUserPremium={isUserPremium}
              premiumTier={premiumTier}
            />
          </div>
        )}

        {/* Tab route 5: Google Workspace Synchronization Hub */}
        {currentTab === 'workspace' && (
          <div className="py-10 animate-fadeIn">
            {!user || user.uid === 'local_guest_user' ? (
              <div className="max-w-md mx-auto bg-white rounded-3xl border border-rose-100 p-8 text-center space-y-6 shadow-xl shadow-rose-950/5 animate-fadeIn">
                <div className="w-16 h-16 bg-slate-50 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner border border-slate-100">
                  <Cloud className="w-8 h-8 text-cyan-600 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display font-black text-xl text-slate-800">Google Workspace Sync</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Sync your matrimony profiles directly with your Google Sheets, Contacts, Calendar, and Drive backup systems safely. Login required.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setAuthModalInitialTab('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="py-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl hover:bg-rose-100 cursor-pointer h-10 transition-colors"
                  >
                    Sign In First
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalInitialTab('register');
                      setIsAuthModalOpen(true);
                    }}
                    className="py-2.5 bg-gradient-to-r from-rose-700 to-pink-600 text-white text-xs font-bold rounded-xl hover:opacity-90 cursor-pointer shadow-xs border border-rose-100 h-10 transition-opacity"
                  >
                    1st-Time Register
                  </button>
                </div>
              </div>
            ) : (
              <WorkspaceHub
                profiles={profiles}
                interestSentMap={interestSentMap}
                shortlistMap={shortlistMap}
                googleAccessToken={googleAccessToken}
                onConnectGoogleDrive={connectGoogleDrive}
              />
            )}
          </div>
        )}

       </main>

      {/* Modern footer details */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-rose-100 pt-8 mt-16 text-center text-xs text-gray-400 font-medium">
        <p>© {new Date().getFullYear()} Trusof Technologies Private Limited. Verified dynamic matrimonial systems live on shaadi.trusof.com. </p>
        <p className="mt-1 font-mono text-[10px]">Version PRO-3.1 Stable. Optimized for direct cPanel deployment.</p>
      </footer>

      {/* Detailed Match Bio Profile Viewer Modal Popup */}
      {selectedDetailsProfile && (
        <ProfileDetailsModal
          profile={selectedDetailsProfile}
          onClose={() => setSelectedDetailsProfile(null)}
          isUserPremium={isUserPremium}
          interestSent={!!interestSentMap[selectedDetailsProfile.id]}
          onExpressInterest={handleExpressInterest}
          onUpgradePrompt={() => {
            setSelectedDetailsProfile(null);
            setCurrentTab('membership');
          }}
          googleAccessToken={googleAccessToken}
          onConnectGoogleDrive={connectGoogleDrive}
        />
      )}

    </div>
  );
}
