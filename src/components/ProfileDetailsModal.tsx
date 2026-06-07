/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { X, Heart, Phone, ShieldCheck, Mail, MapPin, HeartCrack, Clipboard, UserCircle2, Briefcase, GraduationCap, Cloud, FileText } from 'lucide-react';
import { Profile } from '../types';
import { saveProfileSummaryToDrive } from '../lib/driveService';

interface ProfileDetailsModalProps {
  profile: Profile | null;
  onClose: () => void;
  isUserPremium: boolean;
  interestSent: boolean;
  onExpressInterest: (profileId: string) => void;
  onUpgradePrompt: () => void;
  googleAccessToken: string | null;
  onConnectGoogleDrive: () => Promise<string | null>;
}

export default function ProfileDetailsModal({
  profile,
  onClose,
  isUserPremium,
  interestSent,
  onExpressInterest,
  onUpgradePrompt,
  googleAccessToken,
  onConnectGoogleDrive
}: ProfileDetailsModalProps) {
  if (!profile) return null;

  const [contact, setContact] = useState<{ phone: string; email: string } | null>(null);
  const [savingToDrive, setSavingToDrive] = useState(false);
  const [driveSaveMsg, setDriveSaveMsg] = useState<string | null>(null);

  const handleSaveToDrive = async () => {
    setSavingToDrive(true);
    setDriveSaveMsg(null);
    try {
      let token = googleAccessToken;
      if (!token) {
        token = await onConnectGoogleDrive();
      }
      if (!token) {
        setDriveSaveMsg("Google Drive connection was cancelled or denied.");
        setSavingToDrive(false);
        return;
      }

      await saveProfileSummaryToDrive(token, profile);
      setDriveSaveMsg(`Matched candidates bio saved successfully in 'Trusof_Shaadi_Biodatas' folder on Google Drive!`);
    } catch (err) {
      console.error(err);
      setDriveSaveMsg("Failed to transfer biodata to Google Drive.");
    } finally {
      setSavingToDrive(false);
    }
  };

  useEffect(() => {
    if (!profile || !isUserPremium) return;

    const contactRef = doc(db, 'profiles', profile.id, 'private', 'contact');
    const unsubscribe = onSnapshot(contactRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setContact({
          phone: data.phone || '',
          email: data.email || ''
        });
      }
    }, (error) => {
      console.warn("Could not read contact details dynamically", error);
    });

    return () => unsubscribe();
  }, [profile.id, isUserPremium]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Black backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal structure */}
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-scaleUp z-50">
        
        {/* Header decoration */}
        <div className="h-32 bg-gradient-to-r from-rose-800 to-pink-700 relative flex items-end p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-950/25 hover:bg-slate-950/40 text-white rounded-full p-2 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 rounded-2xl border-4 border-white overflow-hidden shadow-md bg-slate-50">
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center" 
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="pt-16 pb-6 px-6 sm:px-8 space-y-6 text-slate-800">
          
          {/* Main Title Name & Score */}
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <div className="flex items-center space-x-2.5">
                <h3 className="font-display font-black text-2xl text-slate-900 tracking-tight">
                  {profile.name}
                </h3>
                {profile.verified && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider">
                    Verified ID
                  </span>
                )}
              </div>
              
              <p className="text-sm font-semibold text-rose-600 mt-1">
                {profile.age} Years Old &bull; {profile.height} &bull; {profile.motherTongue}
              </p>
            </div>

            <div className="bg-rose-50 border border-rose-100 text-rose-800 py-2 px-4 rounded-xl text-center">
              <p className="text-xs uppercase font-mono font-bold tracking-wider text-rose-500">Compatibility</p>
              <p className="text-xl font-extrabold">{profile.compatibilityScore}% Score</p>
            </div>
          </div>

          {/* Core Biography paragraph */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <h4 className="font-display font-bold text-slate-900 border-b border-slate-200/60 pb-1.5 mb-2 text-sm flex items-center gap-1.5">
              <UserCircle2 className="w-4 h-4 text-rose-600" />
              <span>Bio &amp; Personality Overview</span>
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans italic">
              &quot;{profile.bio}&quot;
            </p>
          </div>

          {/* Details segment grids */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Column 1: Match Credentials */}
            <div className="space-y-3.5">
              <h4 className="font-display font-bold text-slate-900 border-b border-slate-200/60 pb-1.5 text-xs uppercase tracking-wider text-gray-400">
                Education &amp; Profession
              </h4>
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center space-x-3 text-gray-600">
                  <GraduationCap className="w-4 h-4 text-emerald-500" />
                  <span><strong>Education:</strong> {profile.education}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Briefcase className="w-4 h-4 text-indigo-500" />
                  <span><strong>Occupation:</strong> {profile.occupation}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600 flex-wrap">
                  <span className="bg-slate-100 font-bold px-2 py-0.5 rounded-md text-[10.5px]">Income: {profile.income}</span>
                </div>
              </div>
            </div>

            {/* Column 2: Family & Astro */}
            <div className="space-y-3.5">
              <h4 className="font-display font-bold text-slate-900 border-b border-slate-200/60 pb-1.5 text-xs uppercase tracking-wider text-gray-400">
                Religious / Astro Specs
              </h4>
              <div className="space-y-2.5 text-xs sm:text-sm text-gray-600">
                <p><strong>Religion:</strong> {profile.religion}</p>
                <p><strong>Caste:</strong> {profile.caste} {profile.subCaste ? `(Subcaste: ${profile.subCaste})` : ''}</p>
                <p><strong>Mother Tongue:</strong> {profile.motherTongue}</p>
                <p><strong>Astro / Horoscope Match:</strong> {profile.horoscopeMatch || 'Not Specified (Gothra Guna general fit)'}</p>
              </div>
            </div>

          </div>

          {/* Dynamic Contact details layout */}
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <h4 className="font-display font-bold text-slate-900 text-sm">
              Contact &amp; Verification Address details
            </h4>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3 text-xs sm:text-sm text-gray-650 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <MapPin className="w-4 h-4 text-pink-500" />
                <span><strong>General Location / City State:</strong> {profile.location}</span>
              </div>

              <div className="bg-rose-50/55 text-rose-950 p-4 rounded-xl border border-rose-100 space-y-2">
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-5 h-5 text-rose-600 shrink-0" />
                  <span className="font-display font-extrabold text-sm text-rose-950">Trusof 100% Premium Privacy Guarantee</span>
                </div>
                <p className="text-xs text-rose-900 leading-relaxed">
                  To ensure complete security and eliminate unauthorized access, <strong>direct mobile numbers, verification addresses, and email IDs are kept completely hidden from matrimonial profile cards or general search screens.</strong>
                </p>
                <p className="text-xs text-rose-900/90 font-medium">
                  🌟 <strong>How to view contact details:</strong> Simply click <strong>&quot;Connect with Profile&quot;</strong> below to express interest. Once connected, participants can securely share and exchange biodatas, phone numbers, and addresses directly through our live chat system.
                </p>
              </div>
            </div>
          </div>

          {/* Primary Dialog Actions banner */}
          <div className="flex flex-col space-y-3 pt-4 border-t border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              
              {/* Left Action: Google Drive Save */}
              <button
                type="button"
                onClick={handleSaveToDrive}
                disabled={savingToDrive}
                className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-cyan-800 bg-cyan-50/50 hover:bg-cyan-100/60 border border-cyan-150 transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {savingToDrive ? (
                  <div className="w-3.5 h-3.5 border-2 border-t-transparent border-cyan-700 rounded-full animate-spin" />
                ) : (
                  <Cloud className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
                )}
                <span>{savingToDrive ? 'Exporting CV...' : 'Save copy to Google Drive'}</span>
              </button>

              <div className="flex space-x-2.5 ml-auto">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Close Info Box
                </button>
                
                <button
                  onClick={() => {
                    onExpressInterest(profile.id);
                    onClose();
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all cursor-pointer shadow-sm ${
                    interestSent
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-600 text-white hover:bg-rose-700'
                  }`}
                >
                  <Heart className="w-4 h-4 fill-current text-white" />
                  <span>{interestSent ? 'Request Active' : 'Connect with Profile'}</span>
                </button>
              </div>

            </div>

            {driveSaveMsg && (
              <div className={`text-[11px] p-2.5 rounded-lg border flex items-start gap-1.5 animate-fadeIn ${
                driveSaveMsg.includes('successfully') 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-150' 
                  : 'bg-rose-50 text-rose-800 border-rose-150'
              }`}>
                <ShieldCheck className={`w-4 h-4 mt-0.5 flex-shrink-0 ${driveSaveMsg.includes('successfully') ? 'text-emerald-600' : 'text-rose-600'}`} />
                <span>{driveSaveMsg}</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
