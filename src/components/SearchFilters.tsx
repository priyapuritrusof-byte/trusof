import { INDIAN_RELIGIONS, MOTHER_TONGUES, INDIAN_STATES } from '../data/profiles';
import { Search, Filter, RefreshCw, Sparkles } from 'lucide-react';

interface SearchFiltersProps {
  filters: {
    gender: 'All' | 'Male' | 'Female';
    ageMin: number;
    ageMax: number;
    religion: string;
    motherTongue: string;
    location: string;
    query: string;
  };
  onChange: (filters: any) => void;
  onReset: () => void;
  totalResults: number;
}

export default function SearchFiltersComponent({ filters, onChange, onReset, totalResults }: SearchFiltersProps) {
  return (
    <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-4" id="matrimony-filters-panel">
      
      {/* Search text input */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-450 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Caste, Job, Location ya Naam search karein..."
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          className="w-full text-xs p-3.5 pl-10 border border-gray-200 rounded-xl focus:border-rose-500 outline-none transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        
        {/* Gender Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-tight block">Talaash (Looking For)</label>
          <select
            value={filters.gender}
            onChange={(e) => onChange({ ...filters, gender: e.target.value })}
            className="w-full text-xs p-2.5 border border-gray-200 rounded-lg outline-none bg-white text-gray-700 focus:border-rose-500"
          >
            <option value="All">All Partners</option>
            <option value="Female">Bride (Ladki)</option>
            <option value="Male">Groom (Ladka)</option>
          </select>
        </div>

        {/* Religion Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-tight block">Religion (Dharam)</label>
          <select
            value={filters.religion}
            onChange={(e) => onChange({ ...filters, religion: e.target.value })}
            className="w-full text-xs p-2.5 border border-gray-200 rounded-lg outline-none bg-white text-gray-700 focus:border-rose-500"
          >
            {INDIAN_RELIGIONS.map((rel) => (
              <option key={rel} value={rel}>{rel === 'All' ? 'All Religions' : rel}</option>
            ))}
          </select>
        </div>

        {/* Mother Tongue Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-tight block">Mother Tongue</label>
          <select
            value={filters.motherTongue}
            onChange={(e) => onChange({ ...filters, motherTongue: e.target.value })}
            className="w-full text-xs p-2.5 border border-gray-200 rounded-lg outline-none bg-white text-gray-700 focus:border-rose-500"
          >
            {MOTHER_TONGUES.map((lang) => (
              <option key={lang} value={lang}>{lang === 'All' ? 'All Mother Tongues' : lang}</option>
            ))}
          </select>
        </div>

        {/* State/Location Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-tight block">State / Region</label>
          <select
            value={filters.location}
            onChange={(e) => onChange({ ...filters, location: e.target.value })}
            className="w-full text-xs p-2.5 border border-gray-200 rounded-lg outline-none bg-white text-gray-700 focus:border-rose-500"
          >
            {INDIAN_STATES.map((st) => (
              <option key={st} value={st}>{st === 'All' ? 'All Regions' : st}</option>
            ))}
          </select>
        </div>

        {/* Age Filter Range */}
        <div className="space-y-1 col-span-2 sm:col-span-1">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-tight block">Age Scope</label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="18"
              max="65"
              value={filters.ageMin}
              onChange={(e) => onChange({ ...filters, ageMin: Number(e.target.value) })}
              className="w-full text-xs p-2 border border-gray-200 rounded-lg outline-none text-center"
              title="Min Age"
            />
            <span className="text-gray-400 font-bold">-</span>
            <input
              type="number"
              min="18"
              max="65"
              value={filters.ageMax}
              onChange={(e) => onChange({ ...filters, ageMax: Number(e.target.value) })}
              className="w-full text-xs p-2 border border-gray-200 rounded-lg outline-none text-center"
              title="Max Age"
            />
          </div>
        </div>

      </div>

      {/* Statistics and Quick actions bar */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-rose-500" />
          <span>Found <strong className="text-gray-800">{totalResults} Verified Profiles</strong> matching your criteria</span>
        </div>
        
        <button
          onClick={onReset}
          className="flex items-center gap-1 py-1 px-2.5 rounded-md hover:bg-gray-100 hover:text-rose-600 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Filters</span>
        </button>
      </div>

    </div>
  );
}
