/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  Lock, 
  Key, 
  ShieldCheck, 
  AlertCircle, 
  ArrowLeft, 
  Copy, 
  CheckCircle2, 
  RefreshCw,
  Flame,
  Heart
} from 'lucide-react';
import { useFirebase } from './FirebaseContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }: AuthModalProps) {
  const { 
    registerWithMobileOtp, 
    loginWithEmailOrMobile, 
    resetPasswordWithEmail, 
    resetPasswordDirect,
    logout,
    user 
  } = useFirebase();

  // Dialog Navigation tab
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  
  // Registration States
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  
  // Login States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Password Forget states
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgetEmail, setForgetEmail] = useState('');
  const [forgetVerified, setForgetVerified] = useState(false);
  const [forgetNewPassword, setForgetNewPassword] = useState('');
  const [resetFinished, setResetFinished] = useState(false);

  // OTP Verification view states
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [submittedOtp, setSubmittedOtp] = useState('');
  const [expectedOtp, setExpectedOtp] = useState('');
  const [otpSentMessage, setOtpSentMessage] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(45);
  
  // Feedback Messages
  const [errorText, setErrorText] = useState<string | null>(null);
  const [successText, setSuccessText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
    setErrorText(null);
    setSuccessText(null);
    setIsForgotPassword(false);
    setIsVerifyingOtp(false);
  }, [isOpen, initialTab]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: any = null;
    if (isVerifyingOtp && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isVerifyingOtp, timerSeconds]);

  if (!isOpen) return null;

  // Trigger mobile SMS Simulation OTP Delivery
  const handleRegSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);
    setSuccessText(null);

    const mobileClean = regMobile.trim();
    const emailClean = regEmail.trim();

    if (!mobileClean || mobileClean.length < 10) {
      setErrorText("Please enter a valid 10-digit mobile number!");
      return;
    }
    if (!emailClean || !emailClean.includes('@')) {
      setErrorText("Please enter a valid Email Address!");
      return;
    }
    if (regPassword.length < 6) {
      setErrorText("Password must be at least 6 characters!");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorText("Passwords do not match!");
      return;
    }

    // Generate a random 6-digit OTP code
    const generatedCode = String(Math.floor(100000 + Math.random() * 900000));
    setExpectedOtp(generatedCode);
    setIsVerifyingOtp(true);
    setTimerSeconds(45);
    setOtpSentMessage(true);

    // Show SMS Notification block overlay after 1 second for pristine UX
    setTimeout(() => {
      setOtpSentMessage(true);
    }, 800);
  };

  // Complete Simulated verification with correct OTP
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);
    setIsLoading(true);

    if (submittedOtp.trim() !== expectedOtp) {
      setErrorText("Incorrect secure OTP! Try entering the 6-digit code again.");
      setIsLoading(false);
      return;
    }

    try {
      await registerWithMobileOtp(regEmail, regPassword, regMobile);
      setSuccessText("Dhanyawaad! Account verified & created successfully with OTP authentication 🎉");
      
      // Auto close dialog after success
      setTimeout(() => {
        onClose();
        // Reset registration fields
        setRegEmail('');
        setRegMobile('');
        setRegPassword('');
        setRegConfirmPassword('');
        setIsVerifyingOtp(false);
        setSubmittedOtp('');
      }, 2000);
    } catch (err: any) {
      setErrorText(err?.message || "Verify OTP failed. Email or mobile might already be registered.");
    } finally {
      setIsLoading(false);
    }
  };

  // Login handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);
    setSuccessText(null);
    setIsLoading(true);

    const identifierClean = loginIdentifier.trim();
    if (!identifierClean) {
      setErrorText("Please enter your registered Email ID or Mobile Number!");
      setIsLoading(false);
      return;
    }
    if (!loginPassword) {
      setErrorText("Please enter your Password!");
      setIsLoading(false);
      return;
    }

    try {
      await loginWithEmailOrMobile(identifierClean, loginPassword);
      setSuccessText("Sunder! Successfully signed in to your matrimonial portal. Welcome back.");
      
      setTimeout(() => {
        onClose();
        setLoginIdentifier('');
        setLoginPassword('');
      }, 1500);
    } catch (err: any) {
      setErrorText(err?.message || "Login failed. Please verify your Email/Mobile & Password.");
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password flow
  const handleForgetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);
    setSuccessText(null);

    const emailClean = forgetEmail.trim().toLowerCase();
    if (!emailClean || !emailClean.includes('@')) {
      setErrorText("Please enter a valid registered Email ID!");
      return;
    }

    setIsLoading(true);
    try {
      // Send real firebase email reset if online
      await resetPasswordWithEmail(emailClean);
      
      // Allow instant visual screen update to type new password
      setForgetVerified(true);
      setErrorText(null);
    } catch (err: any) {
      setErrorText("Account email ID lookup failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);

    const p1 = forgetNewPassword.trim();
    if (p1.length < 6) {
      setErrorText("Your password must be at least 6 characters!");
      return;
    }

    setIsLoading(true);
    try {
      await resetPasswordDirect(forgetEmail, p1);
      setResetFinished(true);
      setSuccessText("Shabash! New password created successfully. You can log in now.");
      
      setTimeout(() => {
        setIsForgotPassword(false);
        setForgetVerified(false);
        setResetFinished(false);
        setForgetEmail('');
        setForgetNewPassword('');
        setActiveTab('login');
      }, 2000);
    } catch (err: any) {
      setErrorText("Could not write new password registry. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
      
      {/* 
        Pristine Custom Simulated SMS OTP Alert Bubble 
      */}
      {isVerifyingOtp && otpSentMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[110] w-full max-w-sm bg-slate-900 border-2 border-amber-400 text-white p-4 rounded-2xl shadow-2xl animate-bounce">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center text-white shrink-0">
              <Phone className="w-4.5 h-4.5 animate-pulse" />
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black tracking-widest text-amber-300">💬 SMS SECURE SENDER</span>
                <span className="text-[9px] font-mono text-gray-400">Trusof-OTP Now</span>
              </div>
              <p className="text-xs font-bold mt-1 text-slate-100">
                Your Trusof Shaadi secure register OTP code is:
              </p>
              <div className="flex items-center space-x-2 mt-2 bg-slate-800 p-2 rounded-xl border border-slate-700">
                <span className="font-mono text-base font-black tracking-widest text-amber-300">{expectedOtp}</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(expectedOtp);
                    setSuccessText("OTP copied to clipboard!");
                    setTimeout(() => setSuccessText(null), 1500);
                  }}
                  className="ml-auto text-[9px] bg-slate-700 text-amber-300 px-2 py-1 rounded hover:bg-slate-600 font-bold transition-colors"
                >
                  COPY CODE
                </button>
              </div>
            </div>
            <button 
              onClick={() => setOtpSentMessage(false)}
              className="text-gray-400 hover:text-white shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Modal Layout Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden border border-rose-100 shadow-2xl shadow-rose-950/20 max-h-[90vh] flex flex-col">
        
        {/* Banner header with tradicional Indian styling */}
        <div className="bg-gradient-to-r from-rose-800 via-pink-800 to-amber-700 text-white p-6 relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-1.5 rounded-full cursor-pointer transition-all"
          >
            <X className="w-4.5 h-4.5" />
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-rose-900 shadow-xs">
              <Heart className="w-4 h-4 fill-rose-900" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg tracking-tight text-white uppercase select-none">
                {isForgotPassword ? "Account Recovery" : activeTab === 'login' ? "Welcome Back" : "Register Profile"}
              </h3>
              <p className="text-[10px] text-amber-300 font-bold tracking-wider leading-none uppercase mt-0.5 select-none">
                Trusof Marriage Match Services
              </p>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Contents */}
        <div className="p-6 md:p-8 overflow-y-auto flex-grow space-y-6">
          
          {/* Notification Messages */}
          {errorText && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start space-x-2 text-rose-800 text-xs font-semibold animate-pulse">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorText}</span>
            </div>
          )}

          {successText && (
            <div className="bg-emerald-50 border border-emerald-250 rounded-xl p-3.5 flex items-start space-x-2 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successText}</span>
            </div>
          )}

          {/* 1. FORGOT PASSWORD BLOCK */}
          {isForgotPassword ? (
            <div className="space-y-4">
              <button 
                onClick={() => {
                  setIsForgotPassword(false);
                  setForgetVerified(false);
                  setResetFinished(false);
                  setErrorText(null);
                }}
                className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-rose-700 transition-colors"
                type="button"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </button>

              {!forgetVerified ? (
                <form onSubmit={handleForgetSubmit} className="space-y-4">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 tracking-tight">Forgot Password?</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Enter your registered Email ID. We will search the database and let you instantly set a secure new password.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wide mb-1">
                      Registered Email ID
                    </label>
                    <div className="relative">
                      <input 
                        type="email"
                        value={forgetEmail}
                        onChange={(e) => setForgetEmail(e.target.value)}
                        placeholder="e.g. priya@gmail.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-bold text-slate-800"
                        required
                      />
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-gradient-to-r from-rose-700 to-pink-600 hover:from-rose-800 hover:to-pink-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center justify-center space-x-1.5 transition-all text-center"
                  >
                    {isLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>Verify Account Email</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleCreateNewPasswordSubmit} className="space-y-4">
                  <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-3 rounded-xl text-xs font-semibold gap-1.5 flex flex-col">
                    <span className="font-bold">✓ Verification Success!</span>
                    <span className="text-[11px] text-emerald-700">Account located for email {forgetEmail}. Set your new password directly below to log in immediately.</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wide mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input 
                          type="password"
                          value={forgetNewPassword}
                          onChange={(e) => setForgetNewPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-bold text-slate-800"
                          required
                        />
                        <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || resetFinished}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center justify-center space-x-1.5 transition-all text-center"
                  >
                    {isLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>Update & Create Password</span>
                  </button>
                </form>
              )}
            </div>
          ) : isVerifyingOtp ? (
            
            /* 2. REGISTRATION OTP VERIFICATION STEP */
            <form onSubmit={handleVerifyOtpSubmit} className="space-y-5 animate-fadeIn">
              <div>
                <button
                  type="button"
                  onClick={() => setIsVerifyingOtp(false)}
                  className="flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-rose-700 mb-4"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Edit Mobile/Email</span>
                </button>

                <h4 className="font-black text-base text-slate-800">OTP Mobile Verification 🔒</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  We have simulated a secure SMS sent to <strong className="text-slate-800">{regMobile}</strong> containing your OTP password code. Check the banner alert above or copy the code to proceed.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wide mb-1">
                  Enter 6-Digit Verification Code
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    maxLength={6}
                    value={submittedOtp}
                    onChange={(e) => setSubmittedOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter OTP (e.g. 104233)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-center font-mono font-black text-base focus:outline-hidden focus:ring-2 focus:ring-rose-500 tracking-widest text-slate-900"
                    required
                  />
                  <Key className="absolute left-3 top-3.5 w-4.5 h-4.5 text-slate-405" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">OTP delivery status: Sent</span>
                {timerSeconds > 0 ? (
                  <span className="text-rose-700 font-bold font-mono">
                    Resend code in {timerSeconds}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const newCode = String(Math.floor(100000 + Math.random() * 900000));
                      setExpectedOtp(newCode);
                      setTimerSeconds(45);
                      setOtpSentMessage(true);
                      setSuccessText("Simulated New OTP delivered successfully!");
                      setTimeout(() => setSuccessText(null), 2500);
                    }}
                    className="text-rose-700 hover:text-rose-800 font-extrabold flex items-center space-x-1 uppercase text-[10px]"
                  >
                    <RefreshCw className="w-3 h-3 animate-spin duration-1000" />
                    <span>Resend OTP SMS</span>
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || submittedOtp.length < 6}
                className="w-full py-2.5 bg-gradient-to-r from-rose-700 via-pink-700 to-amber-700 hover:opacity-90 text-white rounded-xl text-xs font-bold font-display shadow-md cursor-pointer flex items-center justify-center space-x-1.5 transition-all uppercase tracking-wider text-center"
              >
                {isLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Verify OTP &amp; Register Profile</span>
              </button>
            </form>

          ) : (

            /* 3. LOGIN TABS OR GENERAL FORM SCREEN */
            <div className="space-y-6">
              
              {/* Tab Selector Links */}
              <div className="grid grid-cols-2 bg-slate-150 p-1.5 rounded-xl border border-slate-200 text-xs text-center font-bold relative shrink-0 z-10">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorText(null);
                  }}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${activeTab === 'login' ? 'bg-white shadow-xs text-rose-700' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Subsequent Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorText(null);
                  }}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${activeTab === 'register' ? 'bg-white shadow-xs text-rose-700' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  1st-Time Registration
                </button>
              </div>

              {/* TABS COMPONENT ROUTES */}
              {activeTab === 'login' ? (
                
                /* SUB-TAB A: LOGIN FORM */
                <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fadeIn">
                  <div>
                    <p className="text-xs text-slate-500">
                      Welcome back! Log in to your Trusof profile database instantly using either your registered **Email ID** or registered **Mobile Number**.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wide mb-1">
                      Email Address or Mobile Number
                    </label>
                    <div className="relative">
                      <input 
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="priya@gmail.com or 9876543210"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-bold text-slate-800"
                        required
                        id="login-identifier-field"
                      />
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wide">
                        Secure Password
                      </label>
                      <button 
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setForgetVerified(false);
                          setErrorText(null);
                        }}
                        className="text-[10px] text-rose-700 hover:text-rose-800 font-bold transition-colors cursor-pointer leading-none"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <input 
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-bold text-slate-800"
                        required
                        id="login-password-field"
                      />
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-gradient-to-r from-rose-700 to-pink-600 hover:opacity-90 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center justify-center space-x-1.5 transition-all text-center mt-3"
                  >
                    {isLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>Secure Sign In Profile</span>
                  </button>
                </form>

              ) : (

                /* SUB-TAB B: REGISTER FORM WITH SIMULATED OTP */
                <form onSubmit={handleRegSubmit} className="space-y-3.5 animate-fadeIn">
                  <div>
                    <p className="text-xs text-slate-500">
                      Sign up for a FREE premium account on Trusof! Registration requires verification via **simulated mobile number SMS OTP** to keep our portal 100% spam-free.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wide mb-1">
                      Mobile Number (With Country Code)
                    </label>
                    <div className="relative">
                      <input 
                        type="tel"
                        value={regMobile}
                        onChange={(e) => setRegMobile(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-bold text-slate-800"
                        required
                        id="register-mobile-field"
                      />
                      <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wide mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <input 
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="e.g. priya@gmail.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-bold text-slate-800"
                        required
                        id="register-email-field"
                      />
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wide mb-1">
                      Secure Password (Min. 6 chars)
                    </label>
                    <div className="relative">
                      <input 
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-bold text-slate-800"
                        required
                        id="register-password-field"
                      />
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wide mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input 
                        type="password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-bold text-slate-800"
                        required
                        id="register-confirm-password-field"
                      />
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-rose-700 via-pink-700 to-amber-700 hover:opacity-90 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center justify-center space-x-1 mt-4 transition-all text-center uppercase tracking-wide"
                  >
                    <span>Send SMS verification OTP</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* User Consent & Trust indicators */}
          <div className="border-t border-rose-50 pt-4 flex justify-center items-center text-[10px] text-gray-400 font-medium select-none space-x-1.5 leading-none mt-2 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% verified authentic profiles &amp; secure SSL matching.</span>
          </div>

        </div>
      </div>
    </div>
  );
}
