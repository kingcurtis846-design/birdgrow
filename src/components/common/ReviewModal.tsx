import React, { useState, useMemo } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { COUNTRIES_WITH_STATES } from '../../lib/countryData';
import {
  X,
  Star,
  CheckCircle2,
  Sparkles,
  Award,
  AlertCircle,
  MapPin,
} from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    currentUser,
    userEligiblePlansForReview,
    submitReview,
    hasInvested,
    t,
  } = usePlatform();

  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    userEligiblePlansForReview[0]?.id || ''
  );
  const [rating, setRating] = useState<number>(5);
  const [quote, setQuote] = useState('');
  const [role, setRole] = useState('Private Agricultural Investor');

  // Country and City / State dropdown states
  const [selectedCountry, setSelectedCountry] = useState<string>('United Kingdom');
  const currentCountryObj = useMemo(() => {
    return (
      COUNTRIES_WITH_STATES.find((c) => c.country === selectedCountry) ||
      COUNTRIES_WITH_STATES[0]
    );
  }, [selectedCountry]);

  const [selectedCity, setSelectedCity] = useState<string>(
    currentCountryObj.states[0] || 'London'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const currentSelectedPlan =
    userEligiblePlansForReview.find((p) => p.id === selectedPlanId) ||
    userEligiblePlansForReview[0];

  const handleCountryChange = (newCountry: string) => {
    setSelectedCountry(newCountry);
    const found = COUNTRIES_WITH_STATES.find((c) => c.country === newCountry);
    if (found && found.states.length > 0) {
      setSelectedCity(found.states[0]);
    } else {
      setSelectedCity('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasInvested) {
      setErrorMessage('You cannot publish a review until you have made an investment on the platform.');
      return;
    }

    if (!quote.trim()) {
      setErrorMessage('Please enter your testimonial feedback or experience.');
      return;
    }

    if (quote.trim().length < 15) {
      setErrorMessage('Please share at least a few sentences about your investment turnaround and withdrawal experience.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const fullLocationString = selectedCity
        ? `${selectedCity}, ${selectedCountry}`
        : selectedCountry;

      const res = await submitReview({
        quote: quote.trim(),
        rating,
        planId: selectedPlanId,
        role: role.trim() || 'Private Agricultural Investor',
        city: fullLocationString,
      });

      if (res.success) {
        setSuccessMessage('Your review has been submitted for admin approval! Once approved, it will be displayed on the home screen.');
        setTimeout(() => {
          setIsSubmitting(false);
          setSuccessMessage('');
          if (onSuccess) onSuccess();
          onClose();
        }, 1800);
      } else {
        setErrorMessage(res.message || 'Failed to submit review.');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#E5E3D8] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="p-4 sm:p-6 bg-[#11271D] text-white flex items-center justify-between relative shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-[#C5A059] flex items-center justify-center border border-white/20 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-extrabold text-white">{t.reviewTitle || 'Verified Investor Review'}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#16A34A] text-white">
                  VERIFIED HARVEST
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-white/80 mt-0.5 line-clamp-1">
                {t.reviewSub || 'Share your real-asset investment experience with our global community.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label={t.closeModal || 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          
          {/* Eligibility validation notice if user has not invested */}
          {!hasInvested && (
            <div className="p-3.5 sm:p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Investment Verification Required</span>
              </div>
              <p className="leading-relaxed">
                You cannot publish a review until you have actively invested in a poultry production plan. The publish button below is disabled.
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Automatic Investment Option Labeling */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1B3B2B] flex items-center justify-between">
                <span>Associated Investment Option:</span>
                <span className="text-[10px] font-mono text-[#C5A059] uppercase font-semibold">
                  Auto-Labeled Badge
                </span>
              </label>

              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs text-[#1B3B2B] font-semibold focus:outline-none focus:border-[#1B3B2B]"
              >
                {userEligiblePlansForReview.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.title} ({plan.duration_days}d · +{plan.roi_percentage.toFixed(0)}% ROI)
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Stars */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1B3B2B]">Rating:</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center text-[#C5A059] hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'fill-[#C5A059] text-[#C5A059]' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-[#1B3B2B] ml-2">{rating}.0 / 5.0</span>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1B3B2B]">
                {t.reviewQuote || 'Your Review & Experience'}:
              </label>
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Share your experience regarding cycle velocity, telemetry transparency, payout promptness, and European poultry off-take..."
                rows={3}
                className="w-full px-3.5 py-2.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs text-[#1B3B2B] placeholder:text-[#5C6572] focus:outline-none focus:border-[#1B3B2B]"
              />
            </div>

            {/* Investor Role */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1B3B2B]">Investor Title / Role:</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Private Wealth Investor"
                className="w-full min-h-[44px] px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
              />
            </div>

            {/* Country and City Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1B3B2B] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Country:</span>
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs text-[#1B3B2B] font-medium focus:outline-none focus:border-[#1B3B2B]"
                >
                  {COUNTRIES_WITH_STATES.map((c) => (
                    <option key={c.country} value={c.country}>
                      {c.country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1B3B2B]">City / State:</label>
                {currentCountryObj && currentCountryObj.states.length > 0 ? (
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs text-[#1B3B2B] font-medium focus:outline-none focus:border-[#1B3B2B]"
                  >
                    {currentCountryObj.states.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    placeholder="Enter city"
                    className="w-full min-h-[44px] px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                  />
                )}
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#E5E3D8] space-y-3">
              {!hasInvested && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-red-600 leading-tight">
                    Cannot publish review: You must have an active investment before submitting a review.
                  </span>
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl border border-[#DCDAD0] text-[#1B3B2B] text-xs font-semibold hover:bg-[#F7F6F2] transition-colors cursor-pointer text-center"
                >
                  {t.cancelAction || 'Cancel'}
                </button>

                {hasInvested ? (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-[#1B3B2B] hover:bg-[#11271D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{isSubmitting ? 'Submitting to Admin...' : (t.reviewSubmit || 'Submit Review for Approval')}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-gray-300 text-gray-500 text-xs font-bold cursor-not-allowed shadow-none text-center"
                  >
                    Publish Review (Locked)
                  </button>
                )}
              </div>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
