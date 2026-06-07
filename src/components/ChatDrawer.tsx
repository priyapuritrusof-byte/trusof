import { useState, useEffect, useRef, FormEvent } from 'react';
import { Profile } from '../types';
import { MessageSquare, Send, X, ShieldCheck, CheckCheck } from 'lucide-react';

interface ChatDrawerProps {
  profile: Profile | null;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'me' | 'partner';
  text: string;
  timestamp: string;
}

export default function ChatDrawer({ profile, onClose }: ChatDrawerProps) {
  if (!profile) return null;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'partner',
      text: `Namaste! Main ${profile.name} hun. Aapne mere profile par shaadi interest express kiya. Mujhe aapka profile accha laga. Hum bare me baat kar sakte hain?`,
      timestamp: 'Just now'
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll chats to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: 'me',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Trigger auto replies representing dynamic matrimonial matchmaking responses
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const AUTO_REPLIES = [
        `Mujhe bahut khushi hui aapse baat karke! Kya aap Noida/Delhi NCR se hain? Mere parivaar wale bhi mere jeevan saathi ki talaash me hain.`,
        `Ji bilkul, mere parents ne ye profile manage kiya h. Aapko biodata match kaisa laga?`,
        `Bahut sahi! Aap custom cPanel guide tab me Trusof Matrimony upload karne ki details check karein, hum direct WhatsApp par call par baat kar sakte hain!`
      ];
      
      const randomReply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'partner',
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1800);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm bg-white border border-rose-100 rounded-2xl shadow-2xl flex flex-col h-96 overflow-hidden animate-slideUp">
      
      {/* Header bar */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-3.5 text-white flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden bg-white/10 flex-shrink-0">
            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h4 className="font-bold text-xs tracking-tight">{profile.name} (Chat Live)</h4>
            <span className="text-[9px] text-pink-100 font-medium block">Active Matrimonial Matchmaker</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Safety Info warning */}
      <div className="bg-rose-50 border-b border-rose-100 text-[10px] text-rose-900 py-2 px-3 flex items-center gap-1">
        <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
        <span>Trusof Safety Verification active. Don&apos;t share passwords inside chats.</span>
      </div>

      {/* Messages block */}
      <div
        ref={scrollRef}
        className="flex-grow p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs text-slate-800"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[80%] ${
              msg.sender === 'me' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            <div
              className={`p-3 rounded-2xl ${
                msg.sender === 'me'
                  ? 'bg-rose-600 text-white rounded-tr-none'
                  : 'bg-white border border-gray-150 text-gray-800 rounded-tl-none'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
            </div>
            
            <span className="text-[9px] text-gray-400 mt-1 flex items-center gap-0.5">
              {msg.timestamp} {msg.sender === 'me' && <CheckCheck className="w-3 h-3 text-emerald-600" />}
            </span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1 text-slate-400 font-medium text-[10px]">
            <span className="inline-block animate-bounce font-bold">●</span>
            <span className="inline-block animate-bounce delay-100 font-bold">●</span>
            <span className="inline-block animate-bounce delay-200 font-bold">●</span>
            <span className="italic">{profile.name} is typing...</span>
          </div>
        )}
      </div>

      {/* Input Submit */}
      <form onSubmit={handleSend} className="p-2 border-t border-gray-100 flex items-center gap-1.5 flex-shrink-0 bg-white">
        <input
          type="text"
          placeholder="Apna reply type karein..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 p-2.5 outline-none rounded-xl border border-gray-150 focus:border-rose-500 text-xs"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-40 transition-colors flex-shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
