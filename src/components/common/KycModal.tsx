import React, { useState, useEffect, useMemo } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { ALL_COUNTRIES, CountryItem } from '../../lib/countries';
import { COUNTRIES_WITH_STATES } from '../../lib/countryData';
import { X, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, UserCheck, Globe, Phone } from 'lucide-react';

interface KycModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KycModal: React.FC<KycModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, submitKyc, t } = usePlatform();

  // 1. Structured Name Fields
  const [prefix, setPrefix] = useState(''); // Optional Title
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [suffix, setSuffix] = useState(''); // Optional Suffix

  // 2. Country & State Selection (All 195+ Countries)
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    currentUser?.country_code || 'GB'
  );

  const selectedCountry = useMemo<CountryItem>(() => {
    return (
      ALL_COUNTRIES.find((c) => c.code === selectedCountryCode) ||
      ALL_COUNTRIES.find((c) => c.name.toLowerCase() === (currentUser?.kyc_data?.country || '').toLowerCase()) ||
      ALL_COUNTRIES[0]
    );
  }, [selectedCountryCode, currentUser]);

  const countryStatesData = useMemo(() => {
    return COUNTRIES_WITH_STATES.find(
      (c) => c.country.toLowerCase() === selectedCountry.name.toLowerCase()
    );
  }, [selectedCountry]);

  const [selectedCity, setSelectedCity] = useState(
    currentUser?.kyc_data?.city || countryStatesData?.states[0] || ''
  );
  const [address, setAddress] = useState(currentUser?.kyc_data?.address || '');

  // 3. Locked Phone Number State (only local digits typed)
  const [localPhone, setLocalPhone] = useState(() => {
    const raw = currentUser?.kyc_data?.phoneNumber || currentUser?.phone || '';
    // Strip dial code if already stored
    return raw.replace(/^\+\d+[\s-]*/, '').trim();
  });

  // Status, Loading & Jitter Shake Key
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [shakeKey, setShakeKey] = useState(0);

  // Pre-fill initial name parts from user profile on open
  useEffect(() => {
    if (isOpen) {
      if (currentUser?.full_name && !firstName && !lastName) {
        const parts = currentUser.full_name.trim().split(/\s+/);
        if (parts.length === 1) {
          setFirstName(parts[0]);
        } else if (parts.length >= 2) {
          setFirstName(parts[0]);
          setLastName(parts.slice(1).join(' '));
        }
      }
      if (currentUser?.country_code) {
        setSelectedCountryCode(currentUser.country_code);
      }
    }
  }, [isOpen, currentUser]);

  // Sync city state when country changes
  useEffect(() => {
    if (countryStatesData && countryStatesData.states.length > 0) {
      setSelectedCity(countryStatesData.states[0]);
    } else {
      setSelectedCity('');
    }
  }, [countryStatesData]);

  if (!isOpen) return null;

  const triggerError = (message: string) => {
    setFeedback({ type: 'error', message });
    setShakeKey((prev) => prev + 1); // Triggers CSS jitter animation
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    // Validation
    if (!firstName.trim()) {
      triggerError('First name is required.');
      return;
    }

    if (!lastName.trim()) {
      triggerError('Last name is required.');
      return;
    }

    if (!address.trim()) {
      triggerError('Residential address is required.');
      return;
    }

    if (!localPhone.trim()) {
      triggerError('Phone number is required for verification.');
      return;
    }

    // Assemble Formal Legal Name (e.g. "Dr. Alexander Vance Jr." or "Alexander Vance")
    const assembledLegalName = [
      prefix,
      firstName.trim(),
      lastName.trim(),
      suffix,
    ].filter(Boolean).join(' ');

    const fullPhoneNumber = `${selectedCountry.dialCode} ${localPhone.trim()}`;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const res = await submitKyc({
        title: prefix || undefined,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        suffix: suffix || undefined,
        legalName: assembledLegalName,
        address: address.trim(),
        country: selectedCountry.name,
        countryCode: selectedCountry.code,
        city: selectedCity || 'Capital District',
        phoneNumber: fullPhoneNumber,
      } as any);

      if (res && res.success) {
        setFeedback({
          type: 'success',
          message: 'Investor registration verified successfully under European AML standards.',
        });
        setTimeout(() => {
          onClose();
        }, 1400);
      } else {
        triggerError(res?.message || 'Submission error occurred. Please try again.');
      }
    } catch (err: any) {
      triggerError(err.message || 'Failed to submit KYC dossier.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Inline Keyframe for Error Jitter/Shake Animation */}
      <style>{`
        @keyframes kycErrorJitter {
          0%, 100% { transform: translateX(0); }
          15%, 45%, 75% { transform: translateX(-6px); }
          30%, 60%, 90% { transform: translateX(6px); }
        }
        .animate-kyc-jitter {
          animation: kycErrorJitter 0.4s ease-in-out;
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
        <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col border border-[#E5E3D8] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-4 sm:p-6 bg-[#11271D] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059] text-[#11271D] flex items-center justify-center font-bold shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold text-white">
                  {t.kycTitle || 'Investor Identity Verification'}
                </div>
                <div className="text-[11px] sm:text-xs text-white/75 line-clamp-1">
                  {t.kycSub || 'European Agricultural Compliance & Account Validation'}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label={t.closeModal || 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            
            {/* Feedback Alert with Jitter Animation */}
            {feedback && (
              <div
                key={shakeKey}
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'animate-kyc-jitter bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            {/* --- LEGAL NAME ROW: Title (Opt), First Name, Last Name, Suffix (Opt) --- */}
            <div>
              <label className="text-xs font-semibold text-[#1B3B2B] block mb-1.5">
                Full Legal Name *
              </label>
              
              <div className="grid grid-cols-12 gap-2">
                {/* Prefix / Title (Optional) */}
                <div className="col-span-4 sm:col-span-3">
                  <select
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    className="w-full min-h-[44px] px-2 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                  >
                    <option value="">Title (Opt)</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Miss">Miss</option>
                    <option value="Mx.">Mx.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                    <option value="Rev.">Rev.</option>
                    <option value="Hon.">Hon.</option>
                  </select>
                </div>

                {/* First Name (Required) */}
                <div className="col-span-8 sm:col-span-4">
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name *"
                    className="w-full min-h-[44px] px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-sm text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                  />
                </div>

                {/* Last Name (Required) */}
                <div className="col-span-8 sm:col-span-3">
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name *"
                    className="w-full min-h-[44px] px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-sm text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                  />
                </div>

                {/* Suffix (Optional) */}
                <div className="col-span-4 sm:col-span-2">
                  <select
                    value={suffix}
                    onChange={(e) => setSuffix(e.target.value)}
                    className="w-full min-h-[44px] px-2 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                  >
                    <option value="">Suffix</option>
                    <option value="Jr.">Jr.</option>
                    <option value="Sr.">Sr.</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                    <option value="V">V</option>
                    <option value="Esq.">Esq.</option>
                  </select>
                </div>
              </div>
              <p className="text-[11px] text-[#5C6572] mt-1">
                Title and Suffix are optional. First and Last Name must match your official ID.
              </p>
            </div>

            {/* --- COUNTRY SELECTION (ALL 195+ COUNTRIES) & CITY --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#1B3B2B] block mb-1">
                  {t.kycCountry || 'Country'} *
                </label>
                <div className="relative">
                  <select
                    value={selectedCountryCode}
                    onChange={(e) => setSelectedCountryCode(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                  >
                    {ALL_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name} ({c.dialCode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* City / State Selection */}
              <div>
                <label className="text-xs font-semibold text-[#1B3B2B] block mb-1">
                  {t.kycCity || 'City / State'} *
                </label>
                {countryStatesData && countryStatesData.states.length > 0 ? (
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                  >
                    {countryStatesData.states.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    placeholder="Enter City"
                    className="w-full min-h-[44px] px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                  />
                )}
              </div>
            </div>

            {/* --- RESIDENTIAL ADDRESS --- */}
            <div>
              <label className="text-xs font-semibold text-[#1B3B2B] block mb-1">
                {t.kycAddress || 'Residential Address'} *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 14 Berkeley Square, W1J 6BL"
                className="w-full min-h-[44px] px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-sm text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
              />
            </div>

            {/* --- PHONE NUMBER: LOCKED TO SELECTED COUNTRY DIAL CODE --- */}
            <div>
              <label className="text-xs font-semibold text-[#1B3B2B] block mb-1">
                {t.kycPhone || 'Contact Phone / WhatsApp'} *
              </label>
              <div className="flex rounded-xl border border-[#DCDAD0] bg-[#F7F6F2] overflow-hidden focus-within:border-[#1B3B2B] focus-within:bg-white transition-colors">
                {/* Locked Dial Code Badge */}
                <div className="flex items-center gap-1.5 px-3 py-2 bg-[#EAE8E0] border-r border-[#DCDAD0] text-xs font-bold text-[#1B3B2B] select-none shrink-0">
                  <span>{selectedCountry.flag}</span>
                  <span className="font-mono text-emerald-800">{selectedCountry.dialCode}</span>
                </div>
                {/* Local Number Input */}
                <input
                  type="tel"
                  required
                  value={localPhone}
                  onChange={(e) => setLocalPhone(e.target.value.replace(/[^0-9 ]/g, ''))}
                  placeholder="20 7946 0912"
                  className="w-full min-h-[44px] px-3 py-2 bg-transparent text-sm text-[#1B3B2B] outline-none"
                />
              </div>
              <p className="text-[11px] text-[#5C6572] mt-1">
                Dial code is auto-locked to {selectedCountry.name} ({selectedCountry.dialCode}).
              </p>
            </div>

            {/* Compliance Badge */}
            <div className="p-3.5 rounded-xl bg-[#F7F6F2] border border-[#E5E3D8] text-xs text-[#5C6572] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                Your details are securely verified against European agricultural investment registries under GDPR compliance.
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[46px] py-3.5 bg-[#1B3B2B] hover:bg-[#11271D] disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-2"
            >
              {isSubmitting ? 'Verifying Account...' : (t.kycSubmit || 'Submit Identity Verification')}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      </div>
    </>
  );
};