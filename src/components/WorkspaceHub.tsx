/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Cloud, 
  Sparkles, 
  Database, 
  Calendar, 
  CheckSquare, 
  Mail, 
  FileSpreadsheet, 
  BookOpen, 
  Plus, 
  Trash2, 
  Check, 
  ShieldCheck, 
  ArrowRight, 
  Video, 
  ListTodo, 
  CheckCircle2, 
  AlertCircle, 
  UserPlus, 
  ExternalLink,
  Users
} from 'lucide-react';
import { Profile } from '../types';

interface WorkspaceHubProps {
  profiles: Profile[];
  interestSentMap: Record<string, boolean>;
  shortlistMap: Record<string, boolean>;
  googleAccessToken: string | null;
  onConnectGoogleDrive: () => Promise<string | null>;
}

export default function WorkspaceHub({
  profiles,
  interestSentMap,
  shortlistMap,
  googleAccessToken,
  onConnectGoogleDrive
}: WorkspaceHubProps) {
  // Syncing states
  const [driveSyncing, setDriveSyncing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Active workspace active sub-panel
  const [activeTab, setActiveTab] = useState<'sheets' | 'contacts' | 'calendar' | 'tasks' | 'gmail'>('sheets');

  // Selected candidate filter for various interactions
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('');

  // 1. Google Sheets State
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(null);

  // 2. Google Contacts State
  const [createdContacts, setCreatedContacts] = useState<{ name: string; email: string }[]>([]);

  // 3. Google Calendar (with Meet) State
  const [meetTitle, setMeetTitle] = useState('Matrimonial Discussion / Kundali Milap');
  const [meetDate, setMeetDate] = useState('2026-06-15');
  const [meetTime, setMeetTime] = useState('11:00');
  const [durationMins, setDurationMins] = useState(30);
  const [scheduledMeetLink, setScheduledMeetLink] = useState<string | null>(null);
  const [scheduledCalLink, setScheduledCalLink] = useState<string | null>(null);

  // 4. Google Tasks State
  const [customTaskTitle, setCustomTaskTitle] = useState('');
  const [taskNotes, setTaskNotes] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('2026-06-10');
  const [tasksList, setTasksList] = useState<{ id: string; title: string; notes?: string; due?: string }[]>([
    { id: '1', title: 'Verify family match background & caste certificates' },
    { id: '2', title: 'Schedule Kundali match with family astrologer' },
    { id: '3', title: 'Initiate formal matrimonial chat on Trusof Inbox' }
  ]);

  // 5. Gmail State
  const [emailSubject, setEmailSubject] = useState('Match Proposal with Biodata Portfolio - Trusof Shaadi Matrimonial');
  const [emailBody, setEmailBody] = useState('');

  // Helper lists
  const shortlistedCandidates = profiles.filter(p => shortlistMap[p.id]);
  const connectedCandidates = profiles.filter(p => interestSentMap[p.id]);
  const activeInteractiveCandidates = profiles.filter(p => shortlistMap[p.id] || interestSentMap[p.id]);

  // Set default selected candidate when interactive matches change
  React.useEffect(() => {
    if (activeInteractiveCandidates.length > 0 && !selectedCandidateId) {
      setSelectedCandidateId(activeInteractiveCandidates[0].id);
    }
  }, [activeInteractiveCandidates, selectedCandidateId]);

  // Set preset email contents when recipient changes
  const targetProfile = profiles.find(p => p.id === selectedCandidateId);
  React.useEffect(() => {
    if (targetProfile) {
      const emailText = `Namaste,

We came across the verified profile of ${targetProfile.name} on Trusof Shaadi Matrimony and find it to be an excellent match. We would like to initiate a conversation between the families.

Below are our registered candidate details for your consideration:
- Religion/Caste: ${targetProfile.religion} / ${targetProfile.caste}
- Height/Age: ${targetProfile.height} / ${targetProfile.age} Years
- Occupation: ${targetProfile.occupation}
- Annual Income: ${targetProfile.income}

You can also view our complete interactive biological details and portfolio directly in your inbox. 

Looking forward to your favorable response.

Warm regards,
Trusof Shaadi Registered Family User
Contact support: +91 9015558820`;
      setEmailBody(emailText);
    }
  }, [selectedCandidateId, targetProfile]);

  const getOrRequestToken = async (): Promise<string | null> => {
    if (googleAccessToken) return googleAccessToken;
    const token = await onConnectGoogleDrive();
    return token;
  };

  // ==========================================
  // 1. Google Sheets: Export shortlisted profiles
  // ==========================================
  const handleExportToSheets = async () => {
    if (shortlistedCandidates.length === 0) {
      setStatusMsg({ text: "Aapke paas koi Shortlisted profile nahi hai. Please search tab me candidates shortlist karein.", type: 'error' });
      return;
    }

    setDriveSyncing(true);
    setStatusMsg(null);
    try {
      const token = await getOrRequestToken();
      if (!token) {
        setStatusMsg({ text: "Google Sheets permission was denied.", type: 'error' });
        setDriveSyncing(false);
        return;
      }

      // Create new Spreadsheet
      const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: {
            title: `Trusof Shaadi - Matrimonial TrackSheet (${new Date().toLocaleDateString()})`
          }
        })
      });

      if (!createRes.ok) {
        throw new Error(`Spreadsheet creation failed: ${createRes.statusText}`);
      }

      const sheetData = await createRes.json();
      const spreadsheetId = sheetData.spreadsheetId;
      const sheetUrlStr = sheetData.spreadsheetUrl;

      // Map values
      const rows = shortlistedCandidates.map(c => [
        c.name,
        c.gender,
        c.age,
        c.height,
        c.religion,
        c.caste,
        c.education,
        c.occupation,
        c.income,
        c.location,
        c.phone || '+91 9015558820',
        c.email || 'support@trusof.com',
        `${c.compatibilityScore || 90}% Match`,
        c.verified ? 'Verified ✓' : 'Standard'
      ]);

      const headers = [
        "Candidate Name", "Gender", "Age", "Height", "Religion", "Caste", 
        "Education Qualification", "Current Occupation", "Annual Income", "Current City",
        "Phone Contact", "Email Contact", "Kundali Compatibility", "Profile Trust Level"
      ];

      // Insert headers and rows
      const appendRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:append?valueInputOption=RAW`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            values: [headers, ...rows]
          })
        }
      );

      if (!appendRes.ok) {
        throw new Error(`Data write failed: ${appendRes.statusText}`);
      }

      setSpreadsheetUrl(sheetUrlStr);
      setStatusMsg({ text: `Shortlist of ${shortlistedCandidates.length} candidate(s) written successfully to Google Sheets spreadsheet!`, type: 'success' });
    } catch (err) {
      console.error(err);
      setStatusMsg({ text: "Failed to export data to Google Sheets.", type: 'error' });
    } finally {
      setDriveSyncing(false);
    }
  };

  // ==========================================
  // 2. Google Contacts: Add Candidate Contact
  // ==========================================
  const handleSyncToContacts = async () => {
    if (!selectedCandidateId) {
      setStatusMsg({ text: "Please select a candidate to sync contact info.", type: 'error' });
      return;
    }

    const candidate = profiles.find(p => p.id === selectedCandidateId);
    if (!candidate) return;

    setDriveSyncing(true);
    setStatusMsg(null);
    try {
      const token = await getOrRequestToken();
      if (!token) {
        setStatusMsg({ text: "Google Contacts permission was denied.", type: 'error' });
        setDriveSyncing(false);
        return;
      }

      // People API create contact
      const res = await fetch('https://people.googleapis.com/v1/people:createContact', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          names: [
            {
              givenName: candidate.name,
              familyName: 'Shaadi prospect'
            }
          ],
          phoneNumbers: [
            {
              value: candidate.phone || '+91 9015558820',
              type: 'mobile'
            }
          ],
          emailAddresses: [
            {
              value: candidate.email || 'support@trusof.com',
              type: 'home'
            }
          ],
          biographies: [
            {
              value: `Trusof Shaadi matchmaking candidate. Religion: ${candidate.religion}. Occupation: ${candidate.occupation}`
            }
          ],
          userDefined: [
            {
              key: 'Source',
              value: 'Trusof Matrimony Sync'
            }
          ]
        })
      });

      if (!res.ok) {
        throw new Error(`Contact creation failed: ${res.statusText}`);
      }

      setCreatedContacts(prev => [
        ...prev, 
        { name: candidate.name, email: candidate.email || 'support@trusof.com' }
      ]);
      setStatusMsg({ text: `Successfully synced contact '${candidate.name} (Shaadi Prospect)' into your Google Contacts!`, type: 'success' });
    } catch (err) {
      console.error(err);
      setStatusMsg({ text: "Failed to save prospect to Google Contacts.", type: 'error' });
    } finally {
      setDriveSyncing(false);
    }
  };

  // ==========================================
  // 3. Google Calendar & Meet: Schedule virtual meet
  // ==========================================
  const handleScheduleMeeting = async () => {
    if (!selectedCandidateId) {
      setStatusMsg({ text: "Please select a candidate for scheduling the physical/virtual meet.", type: 'error' });
      return;
    }

    const candidate = profiles.find(p => p.id === selectedCandidateId);
    if (!candidate) return;

    setDriveSyncing(true);
    setStatusMsg(null);
    setScheduledMeetLink(null);
    setScheduledCalLink(null);

    try {
      const token = await getOrRequestToken();
      if (!token) {
        setStatusMsg({ text: "Google Calendar permission was denied.", type: 'error' });
        setDriveSyncing(false);
        return;
      }

      // Draft timings
      const startDateTimeStr = `${meetDate}T${meetTime}:00`;
      const startObj = new Date(startDateTimeStr);
      const endObj = new Date(startObj.getTime() + durationMins * 60 * 1000);
      
      const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          summary: `${meetTitle} - ${candidate.name}`,
          description: `Matrimonial matchmaking call scheduled via Trusof Shaadi portal. Looking for mutual suitability matching. Verified ID: ${candidate.id}`,
          start: {
            dateTime: startObj.toISOString(),
            timeZone: 'Asia/Kolkata'
          },
          end: {
            dateTime: endObj.toISOString(),
            timeZone: 'Asia/Kolkata'
          },
          attendees: [
            { email: candidate.email || 'priyapuritrusof@gmail.com' }
          ],
          conferenceData: {
            createRequest: {
              requestId: `meet-request-${Date.now()}`,
              conferenceSolutionKey: {
                type: 'hangoutsMeet'
              }
            }
          }
        })
      });

      if (!res.ok) {
        throw new Error(`Calendar scheduling failed: ${res.statusText}`);
      }

      const eventData = await res.json();
      
      // Attempt extract meet URL
      let meetUrl = null;
      if (eventData.conferenceData && eventData.conferenceData.entryPoints) {
        const point = eventData.conferenceData.entryPoints.find((ep: any) => ep.entryPointType === 'video');
        if (point) meetUrl = point.uri;
      }
      
      setScheduledMeetLink(meetUrl || eventData.hangoutLink || null);
      setScheduledCalLink(eventData.htmlLink || null);
      
      setStatusMsg({ 
        text: `Matrimonial meeting scheduled on your Google Calendar! Google Meet room created.`, 
        type: 'success' 
      });
    } catch (err) {
      console.error(err);
      setStatusMsg({ text: "Failed to schedule virtual meeting in Google Calendar.", type: 'error' });
    } finally {
      setDriveSyncing(false);
    }
  };

  // ==========================================
  // 4. Google Tasks: Sync checklist item
  // ==========================================
  const handleSyncTaskToGoogle = async (title: string, notes?: string, due?: string) => {
    setDriveSyncing(true);
    setStatusMsg(null);
    try {
      const token = await getOrRequestToken();
      if (!token) {
        setStatusMsg({ text: "Google Tasks authorization failed.", type: 'error' });
        setDriveSyncing(false);
        return;
      }

      const res = await fetch('https://www.googleapis.com/api/tasks/v1/lists/@default/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title,
          notes: notes || 'Trusof Matrimony Sync process checklist item.',
          due: due ? `${due}T12:00:00Z` : undefined
        })
      });

      if (!res.ok) {
        throw new Error(`Tasks push failed: ${res.statusText}`);
      }

      setStatusMsg({ text: `Checklist task '${title}' added successfully inside your native Google Tasks application!`, type: 'success' });
    } catch (err) {
      console.error(err);
      setStatusMsg({ text: "Failed to sync task with Google Tasks.", type: 'error' });
    } finally {
      setDriveSyncing(false);
    }
  };

  const handleAddNewTask = () => {
    if (!customTaskTitle.trim()) return;
    const newTask = {
      id: 'local_' + Date.now(),
      title: customTaskTitle,
      notes: taskNotes,
      due: taskDueDate
    };
    setTasksList(prev => [...prev, newTask]);
    setCustomTaskTitle('');
    setTaskNotes('');
  };

  const handleRemoveTask = (id: string) => {
    setTasksList(prev => prev.filter(t => t.id !== id));
  };

  // ==========================================
  // 5. Gmail: Send invitation proposal email
  // ==========================================
  const handleSendGmailProposal = async () => {
    if (!selectedCandidateId) {
      setStatusMsg({ text: "Please select a candidate to send a proposal email.", type: 'error' });
      return;
    }

    const candidate = profiles.find(p => p.id === selectedCandidateId);
    if (!candidate) return;

    if (!window.confirm(`Are you sure you want to send a proposal email to ${candidate.name}'s family? This sends a real email from your logged-in Gmail account.`)) {
      return;
    }

    setDriveSyncing(true);
    setStatusMsg(null);
    try {
      const token = await getOrRequestToken();
      if (!token) {
        setStatusMsg({ text: "Gmail permission was denied.", type: 'error' });
        setDriveSyncing(false);
        return;
      }

      // Formulate raw RFC-822 email layout
      const recipient = candidate.email || 'priyapuritrusof@gmail.com';
      const emailLines = [
        `To: ${recipient}`,
        `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(emailSubject)))}?=`,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=utf-8',
        'Content-Transfer-Encoding: 7bit',
        '',
        emailBody
      ];
      const rawEmail = emailLines.join('\r\n');
      
      // Base64URL encoding
      const base64SafeEmail = btoa(unescape(encodeURIComponent(rawEmail)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const res = await fetch('https://gmail.googleapis.com/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          raw: base64SafeEmail
        })
      });

      if (!res.ok) {
        throw new Error(`Gmail sending failed: ${res.statusText}`);
      }

      setStatusMsg({ text: `Biodata email successfully delivered to ${candidate.name}'s parents via Gmail API!`, type: 'success' });
    } catch (err) {
      console.error(err);
      setStatusMsg({ text: "Failed to dispatch email. Verify Gmail permission is enabled in connection.", type: 'error' });
    } finally {
      setDriveSyncing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      
      {/* Traditional Ribbon Banner Header */}
      <div className="bg-gradient-to-r from-rose-900 to-amber-950 p-6 rounded-3xl border border-rose-800 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 flex text-amber-300">
          <Sparkles className="w-64 h-64 scale-150 rotate-12" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-widest bg-amber-500 text-slate-900 px-2.5 py-1 rounded-md">
                Google Workspace Synergy
              </span>
              <span className={`inline-flex items-center py-0.5 px-2.5 rounded-full text-[10px] font-bold ${
                googleAccessToken ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
              }`}>
                {googleAccessToken ? 'Workspace Connected ✓' : 'Connecting to Workspace APIs'}
              </span>
            </div>
            
            <h2 className="font-display font-black text-2xl tracking-tight">
              Google Workspace Sync Center
            </h2>
            
            <p className="text-xs text-rose-100 max-w-xl">
              Export prospects to Sheets, insert leads to Contacts, schedule Meet video consultations on Calendar, task wedding planning steps, and email match proposals instantly.
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            {googleAccessToken ? (
              <div className="bg-white/10 border border-white/20 p-3 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 text-emerald-300 rounded-xl flex items-center justify-center border border-emerald-500/30">
                  <ShieldCheck className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-amber-200">Synchronized Portal</h4>
                  <p className="text-[10px] text-gray-300">All 6 Products Live</p>
                </div>
              </div>
            ) : (
              <button
                onClick={getOrRequestToken}
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-md hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Cloud className="w-4 h-4 animate-pulse" />
                <span>Authorize Workspace Accounts</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Global Toast Messaging Banner */}
      {statusMsg && (
        <div className={`p-4 rounded-2xl border mb-6 flex items-start gap-3 animate-fadeIn ${
          statusMsg.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border-emerald-150' 
            : 'bg-rose-50 text-rose-900 border-rose-150'
        }`}>
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-extrabold text-xs block mb-0.5">
              {statusMsg.type === 'success' ? 'Task Succeeded' : 'Operation Interrupted'}
            </span>
            <p className="text-[11px] leading-relaxed font-sans">{statusMsg.text}</p>
          </div>
        </div>
      )}

      {/* Horizontal Interactive Tab Navigation */}
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2.5 mb-8">
        
        <button
          onClick={() => { setActiveTab('sheets'); setStatusMsg(null); }}
          className={`px-4 py-3 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'sheets'
              ? 'bg-rose-900 text-white border-rose-950 shadow-md scale-102'
              : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
          }`}
        >
          <FileSpreadsheet className={`w-4 h-4 ${activeTab === 'sheets' ? 'text-amber-300' : 'text-emerald-600'}`} />
          <span>Google Sheets</span>
        </button>

        <button
          onClick={() => { setActiveTab('contacts'); setStatusMsg(null); }}
          className={`px-4 py-3 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'contacts'
              ? 'bg-rose-900 text-white border-rose-950 shadow-md scale-102'
              : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
          }`}
        >
          <Users className={`w-4 h-4 ${activeTab === 'contacts' ? 'text-amber-300' : 'text-blue-500'}`} />
          <span>Contacts</span>
        </button>

        <button
          onClick={() => { setActiveTab('calendar'); setStatusMsg(null); }}
          className={`px-4 py-3 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'calendar'
              ? 'bg-rose-900 text-white border-rose-950 shadow-md scale-102'
              : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
          }`}
        >
          <Calendar className={`w-4 h-4 ${activeTab === 'calendar' ? 'text-amber-300' : 'text-purple-500'}`} />
          <span>Calendar &amp; Meet</span>
        </button>

        <button
          onClick={() => { setActiveTab('tasks'); setStatusMsg(null); }}
          className={`px-4 py-3 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'tasks'
              ? 'bg-rose-900 text-white border-rose-950 shadow-md scale-102'
              : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
          }`}
        >
          <ListTodo className={`w-4 h-4 ${activeTab === 'tasks' ? 'text-amber-300' : 'text-indigo-600'}`} />
          <span>Google Tasks</span>
        </button>

        <button
          onClick={() => { setActiveTab('gmail'); setStatusMsg(null); }}
          className={`px-4 py-3 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'gmail'
              ? 'bg-rose-900 text-white border-rose-950 shadow-md scale-102'
              : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
          }`}
        >
          <Mail className={`w-4 h-4 ${activeTab === 'gmail' ? 'text-amber-300' : 'text-rose-500'}`} />
          <span>Gmail Proposal</span>
        </button>

      </div>

      {/* Main Operational Card */}
      <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-xl">
        
        {/* ======================================================== */}
        {/* 1. GOOGLE SHEETS DASHBOARD SECTION */}
        {/* ======================================================== */}
        {activeTab === 'sheets' && (
          <div className="space-y-6">
            <div className="border-b border-rose-50 pb-4">
              <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Prospect List Spreadsheet Manager
              </span>
              <h3 className="font-display font-black text-lg text-slate-800">
                Shortlisted Candidates Export Hub
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Apne shortlist kiye gaye candidates ke data list ko Google Sheets me single click me export kijiye, family reviews ke liye.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-4 text-left">
                <h4 className="font-bold text-xs text-slate-800">Aapki Active Shortlist Info</h4>
                
                {shortlistedCandidates.length === 0 ? (
                  <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl text-center">
                    <p className="text-xs font-semibold text-amber-800">Koi candidates shortlist nahi hai.</p>
                    <p className="text-[10px] text-slate-500 mt-1">"Find Matches" screen par jakar star button par click karke shortlists add karein!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-600">
                      Export hone wale <strong className="text-rose-600">{shortlistedCandidates.length} profiles</strong> ki brief list:
                    </p>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {shortlistedCandidates.map(c => (
                        <div key={c.id} className="flex items-center gap-2 bg-white border border-slate-100 p-2 rounded-xl text-xs text-slate-700 font-sans">
                          <img src={c.avatar} alt="candidate avatar" referrerPolicy="no-referrer" className="w-6 h-6 rounded-md object-cover flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="font-bold block truncate">{c.name}</span>
                            <span className="text-[10px] text-slate-450">{c.age} Yrs • {c.religion} ({c.caste}) • {c.location}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleExportToSheets}
                  disabled={driveSyncing || shortlistedCandidates.length === 0}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {driveSyncing ? (
                    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  ) : (
                    <FileSpreadsheet className="w-4 h-4 text-amber-200" />
                  )}
                  <span>Export to Google Sheets Now</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-emerald-50/20 border border-emerald-150 rounded-2xl p-5 text-left text-xs text-slate-700 space-y-3.5">
                  <h4 className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    How to utilize Spreadsheet Export
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-600 text-[11px] leading-relaxed">
                    <li>Creates high-fidelity table arrays containing age, height, education qualification details, and verified phone numbers/emails of candidates.</li>
                    <li>Allows offline sharing, formatting Excel structures, and maintaining clean historic records.</li>
                    <li>Real-time updates directly linked with your primary Google cloud storage portfolio.</li>
                  </ul>
                </div>

                {spreadsheetUrl && (
                  <div className="bg-teal-50 border border-teal-150 p-4 rounded-2xl text-left space-y-2 animate-fadeIn">
                    <p className="text-[11px] font-bold text-teal-800">Your Google Sheets spreadsheet is ready!</p>
                    <a
                      href={spreadsheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold bg-teal-600 text-white hover:bg-teal-700 px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      <span>Open Google Sheets Spreadsheet</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. GOOGLE CONTACTS DASHBOARD SECTION */}
        {/* ======================================================== */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div className="border-b border-rose-50 pb-4">
              <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <Users className="w-3.5 h-3.5" />
                Matrimonial Lead Synergetic Contacts
              </span>
              <h3 className="font-display font-black text-lg text-slate-800">
                Candidate Contact Directory Sync
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Verify and auto-inject active matrimonial leads right into your mobile device directory via Google Contacts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-4 text-left">
                <label className="block text-xs font-bold text-slate-700">Select candidate from matches/shortlists:</label>
                
                {activeInteractiveCandidates.length === 0 ? (
                  <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl text-center">
                    <p className="text-xs font-semibold text-amber-800">No candidates shortlisted yet.</p>
                    <p className="text-[10px] text-slate-500 mt-1">Sync requires interacting or shortlisting profile first.</p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <select
                      value={selectedCandidateId}
                      onChange={(e) => setSelectedCandidateId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 cursor-pointer"
                    >
                      {activeInteractiveCandidates.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.religion} - {c.caste})
                        </option>
                      ))}
                    </select>

                    {targetProfile && (
                      <div className="bg-white border border-slate-150 rounded-xl p-3.5 text-xs text-slate-700 space-y-2">
                        <div className="flex items-center gap-2">
                          <img src={targetProfile.avatar} alt="pic" referrerPolicy="no-referrer" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                          <div>
                            <span className="font-bold block text-slate-800">{targetProfile.name}</span>
                            <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">Verified Profile lead</span>
                          </div>
                        </div>
                        <div className="border-t border-slate-100 pt-2 space-y-1 text-slate-600 text-[11px]">
                          <p><strong>Proposed Phone:</strong> {targetProfile.phone || '+91 9015558820'}</p>
                          <p><strong>Proposed Email:</strong> {targetProfile.email || 'support@trusof.com'}</p>
                          <p><strong>Location:</strong> {targetProfile.location}</p>
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleSyncToContacts}
                      disabled={driveSyncing || !selectedCandidateId}
                      className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {driveSyncing ? (
                        <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                      ) : (
                        <UserPlus className="w-4 h-4" />
                      )}
                      <span>Sync to Google Contacts</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-white border border-slate-150 rounded-2xl p-5 text-left space-y-4">
                <h4 className="font-bold text-xs text-slate-800 flex items-center justify-between">
                  <span>Matched Sync History list</span>
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[9px] font-mono">{createdContacts.length} added</span>
                </h4>

                {createdContacts.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">No contacts added during this session yet.</p>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {createdContacts.map((c, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl flex items-center gap-2 text-xs font-sans text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <strong className="block truncate">{c.name}</strong>
                          <span className="text-[10px] text-slate-400 truncate">{c.email}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. GOOGLE CALENDAR & MEET SCHEDULING SECTION */}
        {/* ======================================================== */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="border-b border-rose-50 pb-4">
              <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <Video className="w-3.5 h-3.5" />
                Google Calendar &amp; Meet Virtual Kundali Scheduler
              </span>
              <h3 className="font-display font-black text-lg text-slate-800">
                Setup Virtual Matrimonial Consultations
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Kanditate ke sath virtual meetings aur video consultations schedule kijiye, auto-generating standard Google Meet video links in real time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-4 text-left">
                <div className="space-y-3.5 text-xs text-slate-700">
                  
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Select Candidate / Family Match:</label>
                    {activeInteractiveCandidates.length === 0 ? (
                      <p className="text-[11px] text-amber-800 font-semibold p-2 bg-amber-50 rounded">Shortlist a candidate first.</p>
                    ) : (
                      <select
                        value={selectedCandidateId}
                        onChange={(e) => setSelectedCandidateId(e.target.value)}
                        className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-hidden"
                      >
                        {activeInteractiveCandidates.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Meeting Title:</label>
                    <input
                      type="text"
                      value={meetTitle}
                      onChange={(e) => setMeetTitle(e.target.value)}
                      placeholder="e.g. Virtual Kundali matchmaking meeting"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Date:</label>
                      <input
                        type="date"
                        value={meetDate}
                        onChange={(e) => setMeetDate(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Time:</label>
                      <input
                        type="time"
                        value={meetTime}
                        onChange={(e) => setMeetTime(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Duration (Minutes):</label>
                    <select
                      value={durationMins}
                      onChange={(e) => setDurationMins(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-850 cursor-pointer text-slate-800 font-semibold"
                    >
                      <option value={15}>15 Minutes (Brief Intro)</option>
                      <option value={30}>30 Minutes (Formal Discussion)</option>
                      <option value={60}>60 Minutes (Detailed Kundali matchmaking)</option>
                    </select>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={handleScheduleMeeting}
                  disabled={driveSyncing || !selectedCandidateId}
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {driveSyncing ? (
                    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  ) : (
                    <Calendar className="w-4 h-4" />
                  )}
                  <span>Create Meet on Google Calendar</span>
                </button>
              </div>

              {/* Dynamic Meet Link Delivery */}
              <div className="space-y-4">
                <div className="bg-purple-50/25 border border-purple-150 rounded-2xl p-5 text-left text-xs space-y-3.5">
                  <h4 className="font-bold text-xs text-purple-900 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-purple-600 animate-pulse" />
                    How Virtual Matrimony Meet works
                  </h4>
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    Schedules standard entry on your active primary Google Calendar, and invites the candidate's verified email concurrently. Real video hangout links (Google Meet) are auto-attached immediately.
                  </p>
                </div>

                {scheduledMeetLink && (
                  <div className="bg-emerald-50 border border-emerald-150 rounded-2xl p-5 text-left space-y-3.5 animate-fadeIn">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-800 block mb-0.5">Meeting Successfully Generated!</span>
                      <strong className="text-slate-800 block text-xs">{meetTitle}</strong>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <a
                        href={scheduledMeetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Video className="w-4 h-4" />
                        <span>Join Google Meet Room Now</span>
                      </a>
                      
                      <a
                        href={scheduledCalLink || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        <span>View Calendar Entry</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. GOOGLE TASKS SCHEDULER SECTION */}
        {/* ======================================================== */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="border-b border-rose-50 pb-4">
              <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <ListTodo className="w-3.5 h-3.5" />
                Matrimonial Verification Checklist Task Planner
              </span>
              <h3 className="font-display font-black text-lg text-slate-800">
                Matchmaking Follow-up Google Tasks
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Apni marriage prep ya matchmaking steps checklist banayein aur unhe standard Google Tasks application me dispatch kijiye taaki mobile apps pe reminder aayein.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-4 text-left">
                <h4 className="font-bold text-xs text-slate-800">Add New Personal Checklist Item</h4>
                
                <div className="space-y-3.5 text-xs text-slate-700">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Task Title:</label>
                    <input
                      type="text"
                      value={customTaskTitle}
                      onChange={(e) => setCustomTaskTitle(e.target.value)}
                      placeholder="e.g. Schedule family call with Priya's father"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Context Notes:</label>
                    <textarea
                      value={taskNotes}
                      onChange={(e) => setTaskNotes(e.target.value)}
                      placeholder="Optional notes, verification points, questions to ask..."
                      rows={2}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Target Due Date:</label>
                    <input
                      type="date"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddNewTask}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Insert to Active Checklist</span>
                </button>
              </div>

              {/* Task Items list display */}
              <div className="space-y-4">
                <h4 className="font-bold text-xs text-slate-800">Your Marriage Checklist items ({tasksList.length})</h4>
                
                {tasksList.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic text-left">Checklist empty. Add customized steps on left.</p>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1 text-left">
                    {tasksList.map((t) => (
                      <div key={t.id} className="bg-white border border-slate-150 rounded-2xl p-4 space-y-3 hover:border-indigo-200 transition-all shadow-2xs">
                        <div className="flex items-start justify-between gap-1.5">
                          <p className="font-extrabold text-xs text-slate-800 leading-tight">{t.title}</p>
                          <button
                            type="button"
                            onClick={() => handleRemoveTask(t.id)}
                            className="bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 p-1.5 rounded-lg border border-slate-100 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {t.notes && <p className="text-[10px] text-slate-500 font-sans line-clamp-2">{t.notes}</p>}
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 border-t border-slate-100 pt-3">
                          {t.due && <span className="text-[9.5px] text-slate-400 font-mono">📅 Due: {t.due}</span>}
                          <button
                            type="button"
                            onClick={() => handleSyncTaskToGoogle(t.title, t.notes, t.due)}
                            disabled={driveSyncing}
                            className="bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-indigo-700 hover:scale-[1.02] text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 ml-auto"
                          >
                            <Cloud className="w-3 h-3 text-cyan-500 animate-pulse" />
                            <span>Add to Google Tasks app</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 5. GMAIL PROPOSAL DISPATCHING SECTION */}
        {/* ======================================================== */}
        {activeTab === 'gmail' && (
          <div className="space-y-6">
            <div className="border-b border-rose-50 pb-4">
              <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <Mail className="w-3.5 h-3.5" />
                Matrimonial Proposal Message Delivery
              </span>
              <h3 className="font-display font-black text-lg text-slate-800">
                Gmail Official Proposal Despatcher
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Selected profile ke verify email ya family support mailbox me clean formal matchmaking letter direct dispatch kijiye.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-4 text-left">
                <div className="space-y-3.5 text-xs text-slate-700">
                  
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Sender Profile (For context):</label>
                    {activeInteractiveCandidates.length === 0 ? (
                      <p className="text-[11px] text-rose-700 font-semibold p-2 bg-rose-50 rounded">List matches on "Find Matches" tab.</p>
                    ) : (
                      <select
                        value={selectedCandidateId}
                        onChange={(e) => setSelectedCandidateId(e.target.value)}
                        className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 cursor-pointer outline-none"
                      >
                        {activeInteractiveCandidates.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Recipient Mailbox:</label>
                    <input
                      type="email"
                      readOnly
                      value={targetProfile?.email || 'priyapuritrusof@gmail.com'}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Subject Header:</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Body Letter Content:</label>
                    <textarea
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      rows={8}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-[11px] leading-relaxed text-slate-800 focus:outline-hidden font-sans"
                    />
                  </div>

                </div>

                <button
                  type="button"
                  onClick={handleSendGmailProposal}
                  disabled={driveSyncing || !selectedCandidateId}
                  className="w-full bg-rose-650 hover:bg-rose-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {driveSyncing ? (
                    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  ) : (
                    <Mail className="w-4 h-4 text-white" />
                  )}
                  <span>Send Proposal via Personal Gmail</span>
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs text-slate-700 space-y-4">
                <h4 className="font-bold text-xs text-slate-800">Gmail Delivery Regulations</h4>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  This feature dispatches real emails directly using Gmail's Secure API integration on behalf of your authorized mailbox. 
                </p>
                
                <div className="p-3.5 bg-yellow-50 border border-yellow-200 rounded-xl space-y-2">
                  <span className="font-extrabold text-amber-900 block text-[10px] uppercase">Safety Note:</span>
                  <p className="text-[10.5px] leading-relaxed text-slate-600">
                    Always verify recipient details before sending matrimonial proposals to prevent mistakes. Sending spam or unsolicited emails is strongly discouraged.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
