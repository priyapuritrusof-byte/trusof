import { useState, FormEvent } from 'react';
import { UserBiodata } from '../types';
import { Sparkles, CheckCircle2, Heart, Award, Key, Phone, HelpCircle } from 'lucide-react';

interface BiodataFormProps {
  onRegister: (biodata: UserBiodata) => void;
}

export default function BiodataForm({ onRegister }: BiodataFormProps) {
  const [formData, setFormData] = useState<UserBiodata>({
    name: '',
    gender: 'Female',
    age: 25,
    height: "5'4\"",
    religion: 'Hindu',
    caste: '',
    subCaste: '',
    motherTongue: 'Hindi',
    location: '',
    education: '',
    occupation: '',
    income: '',
    bio: '',
    horoscope: '',
    phone: ''
  });

  const [registered, setRegistered] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.location || !formData.phone) {
      alert("Kripya Name, Location aur Phone Number jarur bharein!");
      return;
    }
    onRegister(formData);
    setRegistered(true);
  };

  if (registered) {
    return (
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto space-y-5 animate-fadeIn">
        <div className="w-16 h-16 bg-rose-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md scale-110">
          <Heart className="w-8 h-8 fill-white text-rose-100" />
        </div>
        <div className="space-y-1">
          <h3 className="font-display font-black text-2xl text-rose-950">Dhanyawad, {formData.name}!</h3>
          <p className="text-rose-700 text-sm font-semibold">Aapka Matrimonial Profile successfully live kar diya gya h!</p>
        </div>
        
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
          Ab aap &quot;Matches&quot; tab me baki profiles ke sath apni compatibility score, horoscope charts aur matches check kar sakte hain. Humne matches algorithm ko update kar diya h!
        </p>

        <div className="bg-white rounded-2xl p-4 text-left border border-rose-100 divide-y divide-rose-50 text-xs text-gray-700 space-y-2">
          <div className="pt-1 flex justify-between">
            <span className="font-semibold text-gray-500">Gender / Age:</span>
            <span className="font-bold text-gray-900">{formData.gender}, {formData.age} Yrs</span>
          </div>
          <div className="pt-2 flex justify-between">
            <span className="font-semibold text-gray-500">Religion & Caste:</span>
            <span className="font-bold text-gray-900">{formData.religion} ({formData.caste || 'N/A'})</span>
          </div>
          <div className="pt-2 flex justify-between">
            <span className="font-semibold text-gray-500">Occupation / City:</span>
            <span className="font-bold text-gray-900">{formData.occupation || 'N/A'}, {formData.location}</span>
          </div>
          <div className="pt-2 flex justify-between">
            <span className="font-semibold text-gray-500">Protected Mobile:</span>
            <span className="font-bold text-emerald-600">{formData.phone} (Verified)</span>
          </div>
        </div>

        <button
          onClick={() => setRegistered(false)}
          className="mt-2 py-2.5 px-6 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-sm"
        >
          Naya Profile Register Karein
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto shadow-sm" id="matrimony-register-form">
      <div className="flex items-center space-x-2.5 mb-6">
        <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-rose-600" />
        </div>
        <div>
          <h3 className="font-display font-black text-xl text-gray-900 tracking-tight">Create Matrimonial Profile</h3>
          <p className="text-gray-500 text-xs">Apne bare me likhein taaki log aapse direct connect kar sakein</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              placeholder="e.g. Priyapuri Trusof"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:border-rose-500 outline-none transition-colors"
            />
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">Gender <span className="text-red-500">*</span></label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })}
              className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:border-rose-500 outline-none transition-colors bg-white"
            >
              <option value="Female">Female (Ladki)</option>
              <option value="Male">Male (Ladka)</option>
            </select>
          </div>

          {/* Age */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">Age (Umra) <span className="text-red-500">*</span></label>
            <input
              type="number"
              required
              min="18"
              max="70"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
              className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:border-rose-500 outline-none transition-colors"
            />
          </div>

          {/* Height */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">Height (Unchai)</label>
            <input
              type="text"
              placeholder="e.g. 5ft 4in"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:border-rose-500 outline-none transition-colors"
            />
          </div>

          {/* Religion */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">Religion (Dharam) <span className="text-red-500">*</span></label>
            <select
              value={formData.religion}
              onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
              className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:border-rose-500 outline-none transition-colors bg-white"
            >
              <option value="Hindu">Hindu</option>
              <option value="Muslim">Muslim</option>
              <option value="Sikh">Sikh</option>
              <option value="Christian">Christian</option>
              <option value="Jain">Jain</option>
              <option value="Buddhist">Buddhist</option>
              <option value="Parsi">Parsi</option>
            </select>
          </div>

          {/* Caste */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">Caste (Jaati) / SubCaste</label>
            <input
              type="text"
              placeholder="e.g. Rajput (Chauhan) or Brahmin"
              value={formData.caste}
              onChange={(e) => setFormData({ ...formData, caste: e.target.value })}
              className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:border-rose-500 outline-none transition-colors"
            />
          </div>

          {/* Mother Tongue */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">Mother Tongue (Matribhasha)</label>
            <input
              type="text"
              placeholder="e.g. Hindi, Punjabi, Bengali"
              value={formData.motherTongue}
              onChange={(e) => setFormData({ ...formData, motherTongue: e.target.value })}
              className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:border-rose-500 outline-none transition-colors"
            />
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">Location (Shahar & State) <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              placeholder="e.g. Delhi NCR, Lucknow"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:border-rose-500 outline-none transition-colors"
            />
          </div>

          {/* Education */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">Education (Shiksha)</label>
            <input
              type="text"
              placeholder="e.g. B.Tech CS, MBA, M.A."
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:border-rose-500 outline-none transition-colors"
            />
          </div>

          {/* Occupation */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">Occupation (Naukri/Business)</label>
            <input
              type="text"
              placeholder="e.g. Software Engineer, Government Job"
              value={formData.occupation}
              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:border-rose-500 outline-none transition-colors"
            />
          </div>

          {/* Income */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">Annual Income (Salana Kamai)</label>
            <input
              type="text"
              placeholder="e.g. 15 Lakh per annum"
              value={formData.income}
              onChange={(e) => setFormData({ ...formData, income: e.target.value })}
              className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:border-rose-500 outline-none transition-colors"
            />
          </div>

          {/* Horoscope match */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">Horoscope / Gothra / Rashi</label>
            <input
              type="text"
              placeholder="e.g. Aries / Bharani, Gothra - Kashyap"
              value={formData.horoscope}
              onChange={(e) => setFormData({ ...formData, horoscope: e.target.value })}
              className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:border-rose-500 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Phone number */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700 block">Mobile Number <span className="text-red-500">*</span></label>
          <div className="relative">
            <span className="absolute left-3.5 top-3.5 text-xs text-gray-400 font-bold">+91</span>
            <input
              type="tel"
              required
              placeholder="9876543210 (Matrimonial status verification callback)"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full text-xs p-3 pl-12 border border-gray-200 rounded-xl focus:border-rose-500 outline-none transition-colors"
            />
          </div>
          <p className="text-[10px] text-gray-400 italic">Keval premium verified matches hi aapka number request kar sakenge.</p>
        </div>

        {/* Personality/Bio */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700 block">About Me / My Expectations (Apne bare me likhein)</label>
          <textarea
            rows={3}
            placeholder="Introduce yourself, your hobbies, expectations from partner, etc."
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:border-rose-500 outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:shadow-lg transition-all text-center flex items-center justify-center space-x-2 cursor-pointer shadow-md"
        >
          <span>Generate Free Matrimonial Biodata & Save Match</span>
        </button>
      </form>
    </div>
  );
}
