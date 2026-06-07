import { useState } from 'react';
import { Heart, Star, Sparkles, MessageCircle } from 'lucide-react';

export default function SuccessStories() {
  const [likes, setLikes] = useState<Record<string, number>>({
    'couple-1': 142,
    'couple-2': 98,
    'couple-3': 214
  });

  const STORIES = [
    {
      id: 'couple-1',
      name: 'Priyanka & Amit',
      date: 'Married March 2025',
      image: 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&q=80&w=400',
      text: 'Trusof Matrimony made it so easy! We both matched in sub-caste and professional parameters. From our first chat online to standard kundali matches, everything matched seamlessly. Thank you!'
    },
    {
      id: 'couple-2',
      name: 'Rohan & Suman',
      date: 'Married December 2025',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=400',
      text: 'I was looking for a partner who understood my busy software development schedule. Her profile popped up as a 94% Compatibility Match! Highly recommend Trusof search engine filters.'
    },
    {
      id: 'couple-3',
      name: 'Anjali & Vivek',
      date: 'Married October 2025',
      image: 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&q=80&w=400', // standard couple portraits
      text: 'Our parent-led meeting started from Trusof Matrimony profile creation page. We appreciated the premium direct contact verification features which filtered spam bots!'
    }
  ];

  const handleLike = (id: string) => {
    setLikes((prev) => ({
      ...prev,
      [id]: prev[id] + 1
    }));
  };

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-b border-gray-150" id="successs-stories-section">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Title */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1">
            🎈 Success Timeline
          </span>
          <h3 className="font-display font-black text-2xl sm:text-3xl text-gray-900 tracking-tight">
            Loved By Uncountable Millions: Match Success Stories
          </h3>
          <p className="text-gray-500 text-xs sm:text-sm">
            Check out real life dynamic marriage connections formed right here on Trusof.
          </p>
        </div>

        {/* Story grids */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {STORIES.map((story) => (
            <div
              key={story.id}
              className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                {/* Photo profile */}
                <div className="relative h-44 rounded-xl overflow-hidden bg-slate-150">
                  <img
                    src={story.image}
                    alt={story.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <h4 className="font-bold text-sm tracking-tight">{story.name}</h4>
                    <p className="text-[10px] text-zinc-300">{story.date}</p>
                  </div>
                </div>

                {/* Text quote */}
                <p className="text-xs text-gray-600 leading-relaxed italic">
                  &quot;{story.text}&quot;
                </p>
              </div>

              {/* Like / Wish congratulations */}
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[11px] text-rose-600 font-semibold inline-flex items-center gap-1/2">
                  💖 {likes[story.id]} Blessings
                </span>
                
                <button
                  type="button"
                  onClick={() => handleLike(story.id)}
                  className="py-1 px-3 bg-white text-gray-750 border border-gray-200 rounded-lg text-xs font-bold shadow-sm hover:border-rose-400 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Congratulate Them
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
