import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, ArrowRight, ArrowLeft, ShieldCheck, KeyRound, Eye, EyeOff, CheckCircle2, RotateCw, Shield, Globe } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { ALL_COUNTRIES } from '../../lib/countries';

const sendAuthEmail = async (email: string, payload: { otp?: string; type: 'register' | 'reset' | 'welcome'; name?: string }) => {
  const response = await fetch('/api/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, ...payload }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to send email.');
  }
  return data;
};

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (targetRole?: 'admin' | 'dashboard') => void;
  initialStep?: AuthStep;
  initialIsAdmin?: boolean;
}

export type AuthStep =
  | 'login'
  | 'register'
  | 'verify-register-otp'
  | 'forgot-password'
  | 'verify-reset-otp'
  | 'new-password';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialStep = 'login',
  initialIsAdmin = false,
}) => {
  const platform = usePlatform() as unknown as {
    login: (email: string, role?: 'user' | 'admin', password?: string) => any;
    register: (fullName: string, email: string, password?: string, countryCode?: string, referrerCode?: string) => any;
    resetPassword?: (email: string, newPassword: string) => Promise<any>;
    profiles: Array<{ email: string; [key: string]: any }>;
    adminCredentials?: { email: string };
    [key: string]: any;
  };
  const { login, register, profiles } = platform;

  const [authStep, setAuthStep] = useState<AuthStep>(initialStep);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(initialIsAdmin);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [selectedCountryCode, setSelectedCountryCode] = useState('DE');
  const [localPhone, setLocalPhone] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [sentOtp, setSentOtp] = useState('');
  const [userEnteredOtp, setUserEnteredOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const [error, setError] = useState('');
  const [shakeKey, setShakeKey] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedCountry = ALL_COUNTRIES.find((c) => c.code === selectedCountryCode) || ALL_COUNTRIES[0];

  const triggerError = (msg: string) => {
    setError(msg);
    setShakeKey((k) => k + 1);
  };

  useEffect(() => {
    if (isOpen) {
      setAuthStep(initialStep);
      setIsAdminMode(initialIsAdmin);
      setError('');
      setSuccessMessage('');
    }
  }, [isOpen, initialStep, initialIsAdmin]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!isOpen) return null;

  const resetState = () => {
    setError('');
    setSuccessMessage('');
    setLoading(false);
    setUserEnteredOtp('');
  };

  // Back Button Navigation Logic
  const handleGoBack = () => {
    resetState();
    if (authStep === 'verify-register-otp') {
      setAuthStep('register');
    } else if (authStep === 'verify-reset-otp') {
      setAuthStep('forgot-password');
    } else if (authStep === 'new-password') {
      setAuthStep('verify-reset-otp');
    } else if (authStep === 'register' || authStep === 'forgot-password') {
      setAuthStep('login');
    } else if (authStep === 'login' && isAdminMode) {
      setIsAdminMode(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();
    setLoading(true);

    try {
      const targetRole = isAdminMode ? 'admin' : 'user';
      const response: any = await login(email, targetRole, password);
      
      if (response) {
        onSuccess(isAdminMode ? 'admin' : 'dashboard');
        onClose();
      } else {
        triggerError(isAdminMode ? 'Invalid admin credentials.' : 'Invalid email or password.');
      }
    } catch (err) {
      triggerError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Register Submit: Strict Phone Number & Country Digit Length Check
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();

    if (!fullName.trim() || !email.trim() || !password) {
      triggerError('Please fill in all required fields.');
      return;
    }

    // 1. Phone number is compulsory
    const cleanDigits = localPhone.replace(/\D/g, '');
    if (!cleanDigits) {
      triggerError('Phone number is required to create an investor account.');
      return;
    }

    // 2. Validate exact digit count for the selected country
    const minD = selectedCountry.minDigits || 8;
    const maxD = selectedCountry.maxDigits || 12;

    if (cleanDigits.length < minD || cleanDigits.length > maxD) {
      if (minD === maxD) {
        triggerError(`Phone number for ${selectedCountry.name} must be exactly ${minD} digits (you entered ${cleanDigits.length}).`);
      } else {
        triggerError(`Phone number for ${selectedCountry.name} must be between ${minD} and ${maxD} digits (you entered ${cleanDigits.length}).`);
      }
      return;
    }

    if (password.length < 6) {
      triggerError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setSentOtp(generatedOtp);

      await sendAuthEmail(email, { otp: generatedOtp, type: 'register', name: fullName.trim() });
      setResendCooldown(45);
      setSuccessMessage(`A verification code was sent to ${email}`);
      setAuthStep('verify-register-otp');
    } catch (err) {
      triggerError('Failed to send verification code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP, Register Account & Dispatch Welcome Email via Resend
  const handleVerifyRegisterOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();

    if (userEnteredOtp.trim() !== sentOtp.trim()) {
      triggerError('Invalid OTP code. Please check and try again.');
      return;
    }

    setLoading(true);
    try {
      const newUser = await register(fullName, email, password, selectedCountryCode);

      if (newUser) {
        // Dispatch Welcome Email via Resend in the background
        try {
          await sendAuthEmail(email, { type: 'welcome', name: fullName.trim() });
        } catch (welcomeErr) {
          console.warn('Welcome email dispatch warning:', welcomeErr);
        }

        onSuccess('dashboard');
        onClose();
      } else {
        triggerError('Registration failed. This email is already registered.');
      }
    } catch (err) {
      triggerError('Could not complete registration.');
    } finally {
      setLoading(false);
    }
  };

  // Password Reset: Check if email exists before sending OTP
  const handleRequestResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      triggerError('Please enter your email address.');
      return;
    }

    // CHECK: Email MUST exist in registered profiles or admin credentials
    const isRegisteredUser = (profiles || []).some(
      (p) => p.email && p.email.trim().toLowerCase() === cleanEmail
    );
    const isRegisteredAdmin =
      platform.adminCredentials?.email &&
      platform.adminCredentials.email.trim().toLowerCase() === cleanEmail;

    if (!isRegisteredUser && !isRegisteredAdmin) {
      triggerError('This email address has not been registered.');
      return;
    }

    setLoading(true);
    try {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setSentOtp(generatedOtp);

      await sendAuthEmail(cleanEmail, { otp: generatedOtp, type: 'reset' });
      setResendCooldown(45);
      setSuccessMessage(`Reset code sent to ${cleanEmail}`);
      setAuthStep('verify-reset-otp');
    } catch (err) {
      triggerError('Failed to send reset code. Verify email address.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResetOtp = (e: React.FormEvent) => {
    e.preventDefault();
    resetState();

    if (userEnteredOtp.trim() === sentOtp.trim()) {
      setAuthStep('new-password');
    } else {
      triggerError('Invalid OTP code. Check your inbox and try again.');
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();

    if (newPassword.length < 6) {
      triggerError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      triggerError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      if (typeof platform.resetPassword === 'function') {
        await platform.resetPassword(email, newPassword);
      }
      setAuthStep('login');
      setPassword('');
      setSuccessMessage('Password reset successfully! Please sign in with your new password.');
    } catch (err) {
      triggerError('Could not reset password. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async (purpose: 'register' | 'reset') => {
    if (resendCooldown > 0) return;
    setError('');

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      await sendAuthEmail(email, { otp: newOtp, type: purpose, name: fullName });
      setSentOtp(newOtp);
      setResendCooldown(60);
      setSuccessMessage(`A new verification code was sent to ${email}`);
    } catch (err: any) {
      triggerError(err?.message || 'Could not resend OTP. Please try again.');
    }
  };

  const showBackButton = authStep !== 'login' || isAdminMode;

  return (
    <>
      <style>{`
        @keyframes errorJitter {
          0%, 100% { transform: translateX(0); }
          15%, 45%, 75% { transform: translateX(-6px); }
          30%, 60%, 90% { transform: translateX(6px); }
        }
        .animate-jitter {
          animation: errorJitter 0.4s ease-in-out;
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 my-8">
          
          {/* Header Banner */}
          <div className="bg-[#1B3B2B] p-6 text-white relative">
            
            {/* BACK ARROW BUTTON */}
            {showBackButton && (
              <button
                type="button"
                onClick={handleGoBack}
                className="absolute top-4 left-4 text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition cursor-pointer flex items-center gap-1 text-xs"
                title="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            {/* CLOSE (X) BUTTON */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className={`flex items-center space-x-2 text-[#C5A059] font-medium text-xs tracking-wider uppercase mb-1 ${showBackButton ? 'pl-8' : ''}`}>
              {isAdminMode ? <Shield className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{isAdminMode ? 'Admin Portal Authentication' : 'BirdGrow Portal'}</span>
            </div>
            
            <h2 className={`text-2xl font-bold tracking-tight ${showBackButton ? 'pl-8' : ''}`}>
              {authStep === 'login' && (isAdminMode ? 'Admin Portal Access' : 'Welcome Back')}
              {authStep === 'register' && 'Create Investor Account'}
              {authStep === 'verify-register-otp' && 'Verify Your Email'}
              {authStep === 'forgot-password' && 'Reset Password'}
              {authStep === 'verify-reset-otp' && 'Verify Security Code'}
              {authStep === 'new-password' && 'Set New Password'}
            </h2>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            {error && (
              <div
                key={shakeKey}
                className="animate-jitter mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2"
              >
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* VIEW: LOGIN */}
            {authStep === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    {isAdminMode ? 'Admin Username or Email' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={isAdminMode ? 'admin@birdgrow.net' : 'you@example.com'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B3B2B] focus:border-transparent outline-none text-sm transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Password
                    </label>
                    {!isAdminMode && (
                      <button
                        type="button"
                        onClick={() => {
                          resetState();
                          setAuthStep('forgot-password');
                        }}
                        className="text-xs text-[#1B3B2B] font-medium hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B3B2B] focus:border-transparent outline-none text-sm transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 bg-[#1B3B2B] text-white font-medium rounded-lg hover:bg-[#132B1F] transition duration-200 flex items-center justify-center space-x-2 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  <span>{loading ? 'Authenticating...' : isAdminMode ? 'Sign In to Admin Portal' : 'Sign In to Dashboard'}</span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>

                <div className="mt-4 pt-4 border-t border-gray-100 text-center space-y-2 text-sm text-gray-600">
                  {!isAdminMode ? (
                    <>
                      <p>
                        Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setAuthStep('register');
                            resetState();
                          }}
                          className="font-semibold text-[#1B3B2B] hover:underline cursor-pointer"
                        >
                          Create one now
                        </button>
                      </p>
                      <p>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAdminMode(true);
                            resetState();
                          }}
                          className="text-xs font-semibold text-amber-800 hover:underline inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <span>Log into Admin portal</span>
                        </button>
                      </p>
                    </>
                  ) : (
                    <p>
                      Standard user?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setIsAdminMode(false);
                          resetState();
                        }}
                        className="font-semibold text-[#1B3B2B] hover:underline cursor-pointer"
                      >
                        Back to User Login
                      </button>
                    </p>
                  )}
                </div>
              </form>
            )}

            {/* VIEW: REGISTER */}
            {authStep === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B3B2B] focus:border-transparent outline-none text-sm transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B3B2B] focus:border-transparent outline-none text-sm transition"
                    />
                  </div>
                </div>

                {/* COUNTRY SELECTION DROPDOWN */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Country of Residence
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <select
                      value={selectedCountryCode}
                      onChange={(e) => setSelectedCountryCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B3B2B] focus:border-transparent outline-none text-sm transition bg-white"
                    >
                      {ALL_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.name} ({c.dialCode})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* PHONE NUMBER (MANDATORY & VALIDATED) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Phone Number *
                    </label>
                    <span className="text-[11px] text-gray-500 font-mono">
                      Req: {selectedCountry.minDigits === selectedCountry.maxDigits ? `${selectedCountry.minDigits} digits` : `${selectedCountry.minDigits}-${selectedCountry.maxDigits} digits`}
                    </span>
                  </div>
                  <div className="flex rounded-lg border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#1B3B2B] focus-within:border-transparent">
                    <div className="flex items-center gap-1.5 px-3 bg-gray-100 border-r border-gray-300 text-gray-800 text-sm font-semibold select-none shrink-0">
                      <span>{selectedCountry.flag}</span>
                      <span className="font-mono text-[#1B3B2B]">{selectedCountry.dialCode}</span>
                    </div>
                    <input
                      type="tel"
                      required
                      value={localPhone}
                      onChange={(e) => setLocalPhone(e.target.value.replace(/[^0-9 ]/g, ''))}
                      placeholder={selectedCountry.minDigits === 10 ? '123 456 7890' : 'Phone digits'}
                      className="w-full px-3 py-2.5 outline-none text-sm bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B3B2B] focus:border-transparent outline-none text-sm transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 bg-[#1B3B2B] text-white font-medium rounded-lg hover:bg-[#132B1F] transition duration-200 flex items-center justify-center space-x-2 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  <span>{loading ? 'Sending Code...' : 'Send Verification OTP'}</span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>

                <div className="mt-3 pt-3 border-t border-gray-100 text-center text-sm text-gray-600">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthStep('login');
                      resetState();
                    }}
                    className="font-semibold text-[#1B3B2B] hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            )}

            {/* VIEW: VERIFY REGISTER OTP */}
            {authStep === 'verify-register-otp' && (
              <form onSubmit={handleVerifyRegisterOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Enter 6-Digit OTP Code
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={userEnteredOtp}
                      onChange={(e) => setUserEnteredOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B3B2B] focus:border-transparent outline-none text-center font-mono tracking-widest text-lg transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#1B3B2B] text-white font-medium rounded-lg hover:bg-[#132B1F] transition duration-200 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Verifying...' : 'Complete Account Registration'}
                </button>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                  <button
                    type="button"
                    onClick={() => handleResendOtp('register')}
                    disabled={resendCooldown > 0}
                    className="text-[#1B3B2B] hover:underline flex items-center space-x-1 disabled:opacity-50 cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>{resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthStep('register')}
                    className="hover:underline text-gray-600 cursor-pointer"
                  >
                    Change Email
                  </button>
                </div>
              </form>
            )}

            {/* VIEW: FORGOT PASSWORD */}
            {authStep === 'forgot-password' && (
              <form onSubmit={handleRequestResetOtp} className="space-y-4">
                <p className="text-sm text-gray-600 mb-2">
                  Enter your registered email address below and we'll send you a security OTP code to reset your password.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B3B2B] focus:border-transparent outline-none text-sm transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#1B3B2B] text-white font-medium rounded-lg hover:bg-[#132B1F] transition duration-200 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Sending Code...' : 'Send Reset Code'}
                </button>

                <div className="text-center text-xs text-gray-500 pt-2">
                  Remembered your password?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      resetState();
                      setAuthStep('login');
                    }}
                    className="text-[#1B3B2B] font-semibold hover:underline cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {/* VIEW: VERIFY RESET OTP */}
            {authStep === 'verify-reset-otp' && (
              <form onSubmit={handleVerifyResetOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Enter Reset OTP Code
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={userEnteredOtp}
                      onChange={(e) => setUserEnteredOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B3B2B] focus:border-transparent outline-none text-center font-mono tracking-widest text-lg transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1B3B2B] text-white font-medium rounded-lg hover:bg-[#132B1F] transition duration-200 shadow-md cursor-pointer"
                >
                  Verify Code
                </button>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                  <button
                    type="button"
                    onClick={() => handleResendOtp('reset')}
                    disabled={resendCooldown > 0}
                    className="text-[#1B3B2B] hover:underline flex items-center space-x-1 disabled:opacity-50 cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>{resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* VIEW: NEW PASSWORD */}
            {authStep === 'new-password' && (
              <form onSubmit={handleSetNewPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B3B2B] focus:border-transparent outline-none text-sm transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B3B2B] focus:border-transparent outline-none text-sm transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#1B3B2B] text-white font-medium rounded-lg hover:bg-[#132B1F] transition duration-200 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Updating Password...' : 'Save New Password & Sign In'}
                </button>
              </form>
            )}

          </div>
        </div>
      </div>
    </>
  );
};