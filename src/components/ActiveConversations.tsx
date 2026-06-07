/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Send, CheckCheck, Landmark, MessageSquareCode, PhoneCall, Sparkles, User, BadgeAlert } from 'lucide-react';
import { Profile } from '../types';
import { useFirebase } from './FirebaseContext';

interface Message {
  id: string;
  sender: 'user' | 'match';
  text: string;
  timestamp: string;
}

interface ActiveConversationsProps {
  connectedProfiles: Profile[];
  activeProfileId: string | null;
  onSelectProfile: (id: string) => void;
  isUserPremium: boolean;
  onUpgradePrompt: () => void;
}

export default function ActiveConversations({
  connectedProfiles,
  activeProfileId,
  onSelectProfile,
  isUserPremium,
  onUpgradePrompt
}: ActiveConversationsProps) {
  const { messagesMap, sendChatMessage } = useFirebase();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebarOnMobile, setShowSidebarOnMobile] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeProfile = connectedProfiles.find(p => p.id === activeProfileId);

  // Set default active if none selected but there are conversations.
  useEffect(() => {
    if (!activeProfileId && connectedProfiles.length > 0) {
      onSelectProfile(connectedProfiles[0].id);
    }
  }, [connectedProfiles, activeProfileId]);

  // Handle message sending
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeProfileId) return;

    const messageText = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      await sendChatMessage(activeProfileId, messageText);
    } catch (err) {
      console.error("Error communicating with candidate of interest", err);
    } finally {
      setIsTyping(false);
    }
  };

  // Auto-scroll chats down
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messagesMap, activeProfileId, isTyping]);

  const currentMessages = activeProfileId ? (messagesMap[activeProfileId] || []) : [];

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-3xl border border-rose-100 shadow-xl overflow-hidden min-h-[500px] sm:min-h-[600px] flex flex-col md:flex-row">
      
      {/* 1. Sidebar list of active matches */}
      <div className={`${showSidebarOnMobile ? 'block' : 'hidden md:block'} w-full md:w-80 border-r border-rose-50 flex flex-col bg-rose-50/10`}>
        <div className="p-4 border-b border-rose-50 bg-white">
          <h4 className="font-display font-black text-lg text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-rose-600 animate-spin-slow" />
            <span>Interactive Inbox</span>
          </h4>
          <p className="text-xs text-slate-500 mt-1">Chatting with prospective partners</p>
        </div>

        <div className="flex-grow overflow-y-auto p-2 space-y-1.5">
          {connectedProfiles.length === 0 ? (
            <div className="text-center p-6 sm:p-8 space-y-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mx-auto">
                <BadgeAlert className="w-5 h-5 text-rose-400" />
              </div>
              <p className="text-xs font-bold text-slate-700">No active interactions yet</p>
              <p className="text-[11px] text-gray-500">
                Go to the &quot;Find Matches&quot; search section, pick dynamic profiles and click <strong>&quot;Connect Live&quot;</strong> to establish chat instantly!
              </p>
            </div>
          ) : (
            connectedProfiles.map((p) => {
              const lastMsg = messagesMap[p.id]?.[messagesMap[p.id].length - 1]?.text || 'No messages yet';
              const isActive = p.id === activeProfileId;

              return (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectProfile(p.id);
                    setShowSidebarOnMobile(false);
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-center space-x-3 cursor-pointer ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'hover:bg-rose-50/80 bg-white border border-rose-50/40 text-slate-800'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={p.avatar}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-xl object-cover object-top border border-white/20"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-extrabold truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                        {p.name}
                      </p>
                      <span className={`text-[9px] font-mono ${isActive ? 'text-rose-100' : 'text-gray-400'}`}>
                        {p.age} Yrs
                      </span>
                    </div>
                    <p className={`text-[11px] truncate mt-0.5 ${isActive ? 'text-pink-100' : 'text-gray-500'}`}>
                      {lastMsg}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Primary Chat interface console */}
      <div className={`${!showSidebarOnMobile ? 'flex' : 'hidden md:flex'} flex-grow flex flex-col bg-slate-50 min-h-[450px]`}>
        {activeProfile ? (
          <>
            {/* Active chat title header */}
            <div className="bg-white px-3 py-2.5 sm:px-6 sm:py-4 border-b border-rose-50 flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-2.5">
                <button
                  type="button"
                  onClick={() => setShowSidebarOnMobile(true)}
                  className="md:hidden text-gray-500 hover:text-rose-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-lg cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <img
                  src={activeProfile.avatar}
                  alt={activeProfile.name}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover object-top border border-rose-100"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">{activeProfile.name}</h4>
                  <p className="text-[10px] text-gray-500 font-bold leading-none mt-1">
                    {activeProfile.occupation} &bull; {activeProfile.location}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-2">
                {isUserPremium ? (
                  <div className="flex items-center space-x-1 bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] sm:text-xs font-bold px-2 px-1.5 sm:py-2 rounded-lg">
                    <PhoneCall className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="truncate">{activeProfile.phone}</span>
                  </div>
                ) : (
                  <button
                    onClick={onUpgradePrompt}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] sm:text-xs font-extrabold px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg transition-colors border border-indigo-150 cursor-pointer flex items-center space-x-1"
                  >
                    <PhoneCall className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>Call VIP</span>
                  </button>
                )}
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-grow overflow-y-auto p-5 space-y-4" ref={scrollRef}>
              {currentMessages.map((msg) => {
                const isMe = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                  >
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-2xs ${
                      isMe
                        ? 'bg-rose-600 text-white rounded-tr-none'
                        : 'bg-white border border-rose-50 text-slate-800 rounded-tl-none'
                    }`}>
                      <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                      
                      <div className="flex items-center justify-end space-x-1 mt-1">
                        <span className={`text-[9px] font-mono select-none ${isMe ? 'text-rose-200' : 'text-gray-400'}`}>
                          {msg.timestamp}
                        </span>
                        {isMe && <CheckCheck className="w-3.5 h-3.5 text-rose-200" />}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-rose-50 rounded-2xl rounded-tl-none px-4 py-3 shadow-2xs text-xs text-gray-400 animate-pulse flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce [animation-delay:0.4s]" />
                    <span>{activeProfile.name} lines are typing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Footer Bar */}
            <form onSubmit={handleSendMessage} className="bg-white p-4 border-t border-rose-50 flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Type a response message to ${activeProfile.name}...`}
                className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:bg-white text-slate-850"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="bg-rose-600 hover:bg-rose-700 text-white p-2.5 rounded-xl transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
              <MessageSquareCode className="w-8 h-8 stroke-1" />
            </div>
            <div>
              <h4 className="font-display font-black text-lg text-slate-800">No Profile Selected</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Establish direct chats by sending matches requests from the catalog. Click on any contact card profile in the left sidebar directory to initiate chatting dynamically.
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
