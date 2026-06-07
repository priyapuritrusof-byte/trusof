/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Sparkles, 
  Check, 
  Info, 
  HeartHandshake, 
  UploadCloud,
  Save,
  Download,
  FolderOpen,
  Loader,
  Cloud,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Profile } from '../types';
import { RELIGIONS, MOTHER_TONGUES, LOCATIONS } from '../data';
import { 
  saveBiodataToDrive, 
  saveProfileSummaryToDrive, 
  listBiodataFilesOnDrive, 
  downloadBiodataFromDrive, 
  DriveFileSummary 
} from '../lib/driveService';

interface RegisterFormProps {
  onRegisterProfile: (profile: Profile) => void;
  isRegistered: boolean;
  registeredProfile: Profile | null;
  onResetRegistration: () => void;
  googleAccessToken: string | null;
  onConnectGoogleDrive: () => Promise<string | null>;
}

const PRESET_AVATARS_MALE = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop', // handsome
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop', // corporate look
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop'  // business look
];

const PRESET_AVATARS_FEMALE = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop', // elegant
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop', // casual
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop'  // cute
];

export default function RegisterForm({
  onRegisterProfile,
  isRegistered,
  registeredProfile,
  onResetRegistration,
  googleAccessToken,
  onConnectGoogleDrive
}: RegisterFormProps) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Female');
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState("5'4\"");
  const [religion, setReligion] = useState('Hindu');
  const [caste, setCaste] = useState('');
  const [subCaste, setSubCaste] = useState('');
  const [motherTongue, setMotherTongue] = useState('Hindi');
  const [location, setLocation] = useState('Delhi, India');
  const [education, setEducation] = useState('');
  const [occupation, setOccupation] = useState('');
  const [income, setIncome] = useState('12 LPA');
  const [bio, setBio] = useState('');
  const [horoscope, setHoroscope] = useState('Aries');
  const [phone, setPhone] = useState('+91 99999 88888');
  const [email, setEmail] = useState('user@shaadi.trusof.com');
  const [selectedAvatarIdx, setSelectedAvatarIdx] = useState(0);
  const [customAvatar, setCustomAvatar] = useState('');

  // Google Drive state hooks
  const [driveSyncing, setDriveSyncing] = useState(false);
  const [driveFiles, setDriveFiles] = useState<DriveFileSummary[]>([]);
  const [showDrivePicker, setShowDrivePicker] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const getOrRequestToken = async (): Promise<string | null> => {
    if (googleAccessToken) return googleAccessToken;
    const token = await onConnectGoogleDrive();
    return token;
  };

  const handleLaunchGooglePickerBackup = async () => {
    setDriveSyncing(true);
    setBackupSuccess(null);
    setLoadError(null);
    try {
      const token = await getOrRequestToken();
      if (!token) {
        setLoadError("Google Drive initialization failed.");
        setDriveSyncing(false);
        return;
      }
      
      const { showGooglePicker } = await import('../lib/pickerService');
      await showGooglePicker({
        accessToken: token,
        mimeTypeFilter: 'application/json',
        onSelect: async (fileId, fileName) => {
          try {
            setDriveSyncing(true);
            const data = await downloadBiodataFromDrive(token, fileId);
            
            if (data.name) setName(data.name);
            if (data.gender) setGender(data.gender as 'Male' | 'Female');
            if (data.age) setAge(data.age);
            if (data.height) setHeight(data.height);
            if (data.religion) setReligion(data.religion);
            if (data.caste) setCaste(data.caste);
            if (data.subCaste) setSubCaste(data.subCaste);
            if (data.motherTongue) setMotherTongue(data.motherTongue);
            if (data.location) setLocation(data.location);
            if (data.education) setEducation(data.education);
            if (data.occupation) setOccupation(data.occupation);
            if (data.income) setIncome(data.income);
            if (data.bio) setBio(data.bio);
            if (data.horoscopeMatch) setHoroscope(data.horoscopeMatch);
            if (data.phone) setPhone(data.phone);
            if (data.email) setEmail(data.email);
            if (data.avatar) {
              if (PRESET_AVATARS_MALE.includes(data.avatar) || PRESET_AVATARS_FEMALE.includes(data.avatar)) {
                setCustomAvatar('');
                const isMale = data.gender === 'Male';
                const idx = (isMale ? PRESET_AVATARS_MALE : PRESET_AVATARS_FEMALE).indexOf(data.avatar);
                if (idx !== -1) setSelectedAvatarIdx(idx);
              } else {
                setCustomAvatar(data.avatar);
              }
            }
            setBackupSuccess(`Form successfully auto-filled from Google Picker selection '${fileName}'!`);
          } catch (e) {
            console.error(e);
            setLoadError("Failed to parse the selected file. Please select a valid JSON Biodata backup.");
          } finally {
            setDriveSyncing(false);
          }
        },
        onCancel: () => {
          console.log("Picker cancelled");
        }
      });
    } catch (err) {
      console.error(err);
      setLoadError("Could not display Google Picker UI.");
    } finally {
      setDriveSyncing(false);
    }
  };

  const handleLaunchGooglePickerAvatar = async () => {
    setDriveSyncing(true);
    setBackupSuccess(null);
    setLoadError(null);
    try {
      const token = await getOrRequestToken();
      if (!token) {
        setLoadError("Google Drive connection is required to browse files.");
        setDriveSyncing(false);
        return;
      }

      const { showGooglePicker } = await import('../lib/pickerService');
      await showGooglePicker({
        accessToken: token,
        mimeTypeFilter: 'image/*',
        onSelect: async (fileId, fileName) => {
          const googleImageSrc = `https://drive.google.com/thumbnail?id=${fileId}&sz=w500`;
          setCustomAvatar(googleImageSrc);
          setSelectedAvatarIdx(-1);
          setBackupSuccess(`Profile picture loaded successfully using Google Picker!`);
        },
        onCancel: () => {
          console.log("Avatar Picker cancelled");
        }
      });
    } catch (err) {
      console.error(err);
      setLoadError("Unable to open image Picker.");
    } finally {
      setDriveSyncing(false);
    }
  };

  const handleBackupCurrentForm = async () => {
    setDriveSyncing(true);
    setBackupSuccess(null);
    setLoadError(null);
    try {
      const token = await getOrRequestToken();
      if (!token) {
        setLoadError("Google Drive permission was denied or login failed.");
        setDriveSyncing(false);
        return;
      }

      const activePresetsList = gender === 'Male' ? PRESET_AVATARS_MALE : PRESET_AVATARS_FEMALE;
      const draftProfile: Profile = {
        id: 'draft_' + Math.floor(Math.random() * 100000),
        name: name || 'Draft Profile',
        gender,
        age,
        height,
        religion,
        caste: caste || 'Not Specified',
        subCaste: subCaste || undefined,
        motherTongue,
        location,
        education: education || 'Not Specified',
        occupation: occupation || 'Not Specified',
        income,
        avatar: customAvatar.trim() || activePresetsList[selectedAvatarIdx],
        bio: bio || 'Draft biographical details.',
        verified: false,
        premium: false,
        horoscopeMatch: horoscope,
        compatibilityScore: 90,
        phoneVerified: true,
        phone,
        email
      };

      await saveBiodataToDrive(token, draftProfile, 'My_Biodata_Trusof_Shaadi.json');
      setBackupSuccess("Biodata draft backed up successfully to 'Trusof_Shaadi_Biodatas/My_Biodata_Trusof_Shaadi.json' on Google Drive!");
    } catch (err) {
      console.error(err);
      setLoadError("Failed to backup to Google Drive. Please verify your connection.");
    } finally {
      setDriveSyncing(false);
    }
  };

  const handleBackupRegisteredProfile = async (format: 'json' | 'text') => {
    if (!registeredProfile) return;
    setDriveSyncing(true);
    setBackupSuccess(null);
    setLoadError(null);
    try {
      const token = await getOrRequestToken();
      if (!token) {
        setLoadError("Google Drive authorization failed.");
        setDriveSyncing(false);
        return;
      }

      if (format === 'json') {
        await saveBiodataToDrive(token, registeredProfile, 'Active_Matrimony_Profile_Backup.json');
        setBackupSuccess("Active profile backed up as JSON data file to Google Drive!");
      } else {
        await saveProfileSummaryToDrive(token, registeredProfile);
        const textFileName = `${registeredProfile.name.replace(/\s+/g, '_')}`;
        setBackupSuccess(`Printed Profile text CV file on Google Drive in 'Trusof_Shaadi_Biodatas/Biodata_${textFileName}.txt'!`);
      }
    } catch (err) {
      console.error(err);
      setLoadError("Failed to backup to Google Drive.");
    } finally {
      setDriveSyncing(false);
    }
  };

  const handleFetchDriveFiles = async () => {
    setDriveSyncing(true);
    setBackupSuccess(null);
    setLoadError(null);
    try {
      const token = await getOrRequestToken();
      if (!token) {
        setLoadError("Google Drive authorization required to browse backups.");
        setDriveSyncing(false);
        return;
      }
      const list = await listBiodataFilesOnDrive(token);
      setDriveFiles(list);
      setShowDrivePicker(true);
      if (list.length === 0) {
        setLoadError("No biodata JSON backups found in 'Trusof_Shaadi_Biodatas' folder yet.");
      }
    } catch (err) {
      console.error(err);
      setLoadError("Failed to fetch files from Google Drive.");
    } finally {
      setDriveSyncing(false);
    }
  };

  const handleImportSelectedFile = async (fileId: string) => {
    setDriveSyncing(true);
    setBackupSuccess(null);
    setLoadError(null);
    try {
      const token = await getOrRequestToken();
      if (!token) return;
      const data = await downloadBiodataFromDrive(token, fileId);
      
      if (data.name) setName(data.name);
      if (data.gender) setGender(data.gender as 'Male' | 'Female');
      if (data.age) setAge(data.age);
      if (data.height) setHeight(data.height);
      if (data.religion) setReligion(data.religion);
      if (data.caste) setCaste(data.caste);
      if (data.subCaste) setSubCaste(data.subCaste);
      if (data.motherTongue) setMotherTongue(data.motherTongue);
      if (data.location) setLocation(data.location);
      if (data.education) setEducation(data.education);
      if (data.occupation) setOccupation(data.occupation);
      if (data.income) setIncome(data.income);
      if (data.bio) setBio(data.bio);
      if (data.horoscopeMatch) setHoroscope(data.horoscopeMatch);
      if (data.phone) setPhone(data.phone);
      if (data.email) setEmail(data.email);
      if (data.avatar) {
        if (PRESET_AVATARS_MALE.includes(data.avatar) || PRESET_AVATARS_FEMALE.includes(data.avatar)) {
          setCustomAvatar('');
          const isMale = data.gender === 'Male';
          const idx = (isMale ? PRESET_AVATARS_MALE : PRESET_AVATARS_FEMALE).indexOf(data.avatar);
          if (idx !== -1) setSelectedAvatarIdx(idx);
        } else {
          setCustomAvatar(data.avatar);
        }
      }

      setBackupSuccess("Biodata form auto-populated from Selected Google Drive backup!");
      setShowDrivePicker(false);
    } catch (err) {
      console.error(err);
      setLoadError("Failed to import selected file.");
    } finally {
      setDriveSyncing(false);
    }
  };

  const activePresets = gender === 'Male' ? PRESET_AVATARS_MALE : PRESET_AVATARS_FEMALE;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !caste || !education || !occupation || !bio) {
      alert("Kripya sabhi mandatory fields (marked with *) bharein!");
      return;
    }

    const finalAvatar = customAvatar.trim() || activePresets[selectedAvatarIdx];

    const newProfile: Profile = {
      id: 'prof_registered_' + Math.floor(Math.random() * 100000),
      name,
      gender,
      age,
      height,
      religion,
      caste,
      subCaste: subCaste || undefined,
      motherTongue,
      location,
      education,
      occupation,
      income,
      avatar: finalAvatar,
      bio,
      verified: true, // Auto verified for real user submission
      premium: false, // Start basic, option to upgrade
      horoscopeMatch: horoscope,
      compatibilityScore: 98, // 98% compatible for creator profile matches
      phoneVerified: true,
      phone,
      email
    };

    onRegisterProfile(newProfile);
  };

  if (isRegistered && registeredProfile) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl border border-rose-100 shadow-xl overflow-hidden p-6 sm:p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Check className="w-8 h-8 stroke-[3]" />
        </div>

        <div className="space-y-2">
          <h3 className="font-display font-black text-2xl text-slate-900 tracking-tight">
            Aapka Biodata Live ho gya hai!
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Ab aapka profile matches catalog me represent ho rha hai with 100% security sashes verified.
          </p>
        </div>

        {/* Short Profile Representation */}
        <div className="bg-rose-50/40 rounded-2xl p-5 border border-rose-150 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 text-left">
          <img 
            src={registeredProfile.avatar} 
            alt={registeredProfile.name} 
            className="w-20 h-20 rounded-xl object-cover border border-white shadow-md flex-shrink-0"
          />
          <div className="flex-grow min-w-0">
            <h4 className="font-bold text-slate-900 leading-snug">{registeredProfile.name} ({registeredProfile.age} Yrs)</h4>
            <p className="text-xs text-rose-700 font-bold mt-0.5">{registeredProfile.occupation} &bull; {registeredProfile.income}</p>
            <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 italic">&quot;{registeredProfile.bio}&quot;</p>
            <div className="flex space-x-2 mt-2">
              <span className="bg-white px-2 py-0.5 rounded-md border text-[10px] text-slate-600">Religion: {registeredProfile.religion}</span>
              <span className="bg-white px-2 py-0.5 rounded-md border text-[10px] text-slate-600">Caste: {registeredProfile.caste}</span>
            </div>
          </div>
        </div>

        {/* Google Drive Safe Backup Hub */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-cyan-600 animate-pulse" />
              <div>
                <h5 className="font-bold text-xs text-slate-800 font-sans">Google Drive Cloud Storage</h5>
                <p className="text-[10px] text-slate-500">Securely sync, load, or print your verified bio document</p>
              </div>
            </div>
            
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
              googleAccessToken ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${googleAccessToken ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
              {googleAccessToken ? 'Drive Connected' : 'Not Syncing'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => handleBackupRegisteredProfile('json')}
              disabled={driveSyncing}
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
            >
              {driveSyncing ? (
                <div className="w-3.5 h-3.5 border-2 border-t-transparent border-rose-600 rounded-full animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5 text-rose-600" />
              )}
              <span>Backup JSON (Recovery)</span>
            </button>

            <button
              onClick={() => handleBackupRegisteredProfile('text')}
              disabled={driveSyncing}
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
            >
              {driveSyncing ? (
                <div className="w-3.5 h-3.5 border-2 border-t-transparent border-cyan-600 rounded-full animate-spin" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-cyan-600" />
              )}
              <span>Print Text CV to Drive</span>
            </button>
          </div>

          {backupSuccess && (
            <div className="bg-emerald-50 text-emerald-800 text-[11px] p-2.5 rounded-lg border border-emerald-150 flex items-start gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{backupSuccess}</span>
            </div>
          )}

          {loadError && (
            <div className="bg-rose-50 text-rose-800 text-[11px] p-2.5 rounded-lg border border-rose-150 flex items-start gap-1.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{loadError}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={onResetRegistration}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Edit/Create New Biodata
          </button>
          
          <button
            onClick={() => {
              const element = document.getElementById('search-results-section');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="flex-grow flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl text-xs font-extrabold shadow-md transition-all cursor-pointer"
          >
            View My Profile In Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-rose-100 shadow-xl overflow-hidden p-6 sm:p-8">
      
      <div className="space-y-2 mb-6 text-center sm:text-left">
        <h3 className="font-display font-black text-2xl text-slate-900 tracking-tight flex items-center justify-center sm:justify-start gap-2">
          <ClipboardCheck className="w-6 h-6 text-rose-600" />
          <span>Apna Biodata Form Banayein</span>
        </h3>
        <p className="text-sm text-slate-500">
          Enter custom marital information to list your matrimonial requirements on Shaadi Trusof network dynamically.
        </p>
      </div>

      {/* Google Drive Integration & Recovery Hub */}
      <div className="mb-8 bg-gradient-to-r from-teal-50/40 via-cyan-50/10 to-blue-50/20 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="bg-cyan-100/60 p-2 rounded-xl text-cyan-600 flex-shrink-0 mt-0.5 border border-cyan-150/50">
              <Cloud className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800">Google Drive Cloud Storage</h4>
              <p className="text-xs text-slate-500">
                Apne draft biodata ko safe backup karein ya Google Drive file load karke form complete karein.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
              googleAccessToken ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${googleAccessToken ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
              {googleAccessToken ? 'Google Drive Connected' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleBackupCurrentForm}
            className="flex items-center gap-1.5 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-cyan-200" />
            <span>Backup Current Form to Drive</span>
          </button>

          <button
            type="button"
            onClick={handleFetchDriveFiles}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-150 text-slate-700 border border-slate-200 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5 text-rose-500" />
            <span>Load Backup from Google Drive</span>
          </button>

          <button
            type="button"
            onClick={handleLaunchGooglePickerBackup}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold px-3.5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer border border-emerald-500 hover:scale-[1.02] duration-150"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-100 animate-spin" style={{ animationDuration: '3s' }} />
            <span>Google Picker (Quick Import)</span>
          </button>
        </div>

        {/* Display live backup list picker */}
        {showDrivePicker && (
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 mt-3 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-rose-50 pb-2">
              <span className="font-bold text-xs text-slate-700">Select Biodata Backup from Google Drive:</span>
              <button
                type="button"
                onClick={() => setShowDrivePicker(false)}
                className="text-xs text-rose-600 font-bold hover:underline"
              >
                Close List
              </button>
            </div>

            {driveFiles.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic py-1">No backups found in 'Trusof_Shaadi_Biodatas' folder yet.</p>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {driveFiles.map((f) => (
                  <div key={f.id} className="flex items-center justify-between bg-slate-50 hover:bg-rose-50/20 p-2 rounded-lg border border-slate-100 transition-all">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <FileText className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      <span className="text-xs text-slate-700 font-mono truncate">{f.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleImportSelectedFile(f.id)}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-md transition-all cursor-pointer"
                    >
                      Import &amp; Auto-Fill
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {backupSuccess && (
          <div className="bg-emerald-50 text-emerald-800 text-[11px] p-2.5 rounded-lg border border-emerald-150 flex items-start gap-1.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{backupSuccess}</span>
          </div>
        )}

        {loadError && (
          <div className="bg-rose-50 text-rose-800 text-[11px] p-2.5 rounded-lg border border-rose-150 flex items-start gap-1.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{loadError}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Step 1: Personal Credentials group */}
        <div className="bg-rose-50/10 border border-rose-50/50 p-5 rounded-2xl space-y-4">
          <h4 className="font-bold text-rose-800 text-xs uppercase font-mono tracking-wider">
            1. Personal Info details
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priyapuri Trusof"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Gender Selection <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('Female')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    gender === 'Female'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-slate-50 text-gray-700 hover:bg-rose-50'
                  }`}
                >
                  Bride (Female)
                </button>
                <button
                  type="button"
                  onClick={() => setGender('Male')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    gender === 'Male'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-slate-50 text-gray-700 hover:bg-rose-50'
                  }`}
                >
                  Groom (Male)
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Age</label>
              <select
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
              >
                {Array.from({ length: 25 }, (_, i) => 18 + i).map((n) => (
                  <option key={n} value={n}>{n} Years</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Height</label>
              <input
                type="text"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 5ft 5in"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Religion</label>
              <select
                value={religion}
                onChange={(e) => setReligion(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
              >
                {RELIGIONS.filter(r => r !== 'All').map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Caste / Gotra <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={caste}
                onChange={(e) => setCaste(e.target.value)}
                placeholder="e.g. Sharma / Rajput / Iyer / Gupta"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Gotra / Sub-caste (Optional)</label>
              <input
                type="text"
                value={subCaste}
                onChange={(e) => setSubCaste(e.target.value)}
                placeholder="e.g. Bhardwaj / Saraswat / Mukerjee"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Educational and Profession setup */}
        <div className="bg-slate-55 border border-slate-200/50 p-5 rounded-2xl space-y-4">
          <h4 className="font-bold text-slate-800 text-xs uppercase font-mono tracking-wider">
            2. Professional &amp; Educational Credentials
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Highest Education <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="e.g. B.Tech Computer Science, MBA (IIM), MBBS"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Occupation <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="e.g. Software Engineer, Business Owner, Cardiologist"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Annual Income Package</label>
              <input
                type="text"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="e.g. 15 LPA, 25-30 LPA, Business"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Mother Tongue</label>
              <select
                value={motherTongue}
                onChange={(e) => setMotherTongue(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
              >
                {MOTHER_TONGUES.filter(t => t !== 'All').map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Current Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
              >
                {LOCATIONS.filter(l => l !== 'All').map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step 3: Bio Profile Image and Contact Details */}
        <div className="bg-rose-50/10 border border-rose-50/50 p-5 rounded-2xl space-y-4">
          <h4 className="font-bold text-rose-800 text-xs uppercase font-mono tracking-wider">
            3. Astro, Bio &amp; Profile Picture
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Contact Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 94444 33333"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Contact Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. name@shaadi.trusof.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Horoscope Rashi / Zodiac Stars</label>
              <input
                type="text"
                value={horoscope}
                onChange={(e) => setHoroscope(e.target.value)}
                placeholder="e.g. Vrishabha, Mithun, Singh, Manglik (Anshik)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-800"
              />
            </div>
          </div>

          {/* Preset Avatar Selection Grid */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Select Profile Avatar Image Preset
            </label>
            <div className="grid grid-cols-3 gap-3">
              {activePresets.map((av, index) => (
                <button
                  type="button"
                  key={av}
                  onClick={() => {
                    setSelectedAvatarIdx(index);
                    setCustomAvatar('');
                  }}
                  className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedAvatarIdx === index && !customAvatar
                      ? 'border-rose-600 shadow-md scale-102'
                      : 'border-slate-100 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={av} alt="Preset user" className="w-full h-full object-cover object-top" />
                  {selectedAvatarIdx === index && !customAvatar && (
                    <div className="absolute top-1 right-1 bg-rose-600 text-white p-0.5 rounded-full">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-end gap-3 bg-rose-50/25 border border-dashed border-rose-200 p-3.5 rounded-xl">
              <div className="flex-grow">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Or Specify Custom URL</label>
                <input
                  type="url"
                  value={customAvatar}
                  onChange={(e) => setCustomAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/your-custom-portrait-photo"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 mt-1 focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                />
              </div>
              <button
                type="button"
                onClick={handleLaunchGooglePickerAvatar}
                disabled={driveSyncing}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-rose-300 font-extrabold text-[11px] px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
              >
                {driveSyncing ? (
                  <div className="w-3.5 h-3.5 border-2 border-t-transparent border-rose-600 rounded-full animate-spin" />
                ) : (
                  <Cloud className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                )}
                <span>Select Image from Google Drive (Picker)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Personal Bio Description statement <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Deeply describe yourself, your family and background expectations. (Minimum 25 characters)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-800"
            />
          </div>
        </div>

        {/* Submit action panel */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-8 py-3.5 rounded-xl text-sm font-extrabold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
            id="register-submit-btn"
          >
            <ClipboardCheck className="w-5 h-5 text-pink-100" />
            <span>Generate &amp; Publish Biodata</span>
          </button>
        </div>

      </form>

    </div>
  );
}
