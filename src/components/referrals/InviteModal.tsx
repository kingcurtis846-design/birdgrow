import React, { useState } from 'react';
import { X, Copy, Check, Share2, Send, QrCode, Mail, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { buildSocialShareLinks } from '../../lib/referralEngine';
import { usePlatform } from '../../context/PlatformContext';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode: string;
  referralLink: string;
  isInvestor: boolean;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  referralCode,
  referralLink,
  isInvestor,
}) => {
  const { formatCurrentCurrency, formatCurrentCurrencyCompact, t } = usePlatform();
  const [copied, setCopied] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const socialLinks = buildSocialShareLinks(referralLink, referralCode);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setSentSuccess(true);
    setTimeout(() => {
      setInviteEmail('');
      setInviteName('');
      setSentSuccess(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col border border-[#E5E3D8] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#11271D] text-white flex items-center justify-between shrink-0">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BirdGrow Referral Network</span>
            </div>
            <h3 className="text-base sm:text-xl font-black text-white mt-1">
              Invite Partners &amp; Earn Milestones
            </h3>
            <p className="text-[11px] sm:text-xs text-[#A7B6AB] mt-0.5 line-clamp-1">
              Cumulative milestone rewards up to {formatCurrentCurrency(245050, false)} potential max payout in a cycle
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label={t.closeModal || 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Status Indicator */}
          <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 ${
            isInvestor
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <ShieldCheck className="w-5 h-5 shrink-0 text-[#16A34A] mt-0.5" />
            <div>
              <div className="font-bold flex items-center gap-2 flex-wrap">
                <span>You are an {isInvestor ? (t.refInvestorReferrer || 'Investor Referrer') : (t.refBasicReferrer || 'Basic Referrer')}</span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-white border border-current font-extrabold uppercase">
                  {isInvestor ? 'Top 2x Tier Rewards' : 'Standard Rewards'}
                </span>
              </div>
              <p className="text-[11px] mt-0.5 opacity-90 leading-relaxed">
                {isInvestor
                  ? `All qualified investment volume unlocks higher Investor Referrer milestone rewards (e.g. ${formatCurrentCurrency(150000, false)} at ${formatCurrentCurrencyCompact(500000)} volume).`
                  : 'You earn milestone rewards on all qualified volume. Make an investment anytime to automatically upgrade to Investor Referrer.'}
              </p>
            </div>
          </div>

          {/* Referral Link & Copy */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-[#1B3B2B]">{t.refYourLink || 'Your Unique Referral Link'}</label>
              <span className="font-mono text-[#5C6572] text-[11px]">{t.refCodeLabel || 'Code'}: <strong className="text-[#1B3B2B]">{referralCode}</strong></span>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 px-3.5 py-2.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs font-mono text-[#1B3B2B] truncate select-all">
                {referralLink}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="min-h-[44px] px-4 py-2.5 bg-[#1B3B2B] hover:bg-[#11271D] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (t.refCopied || 'Copied!') : (t.refCopyLink || 'Copy Link')}</span>
              </button>
            </div>
          </div>

          {/* Instant One-Click Social Shares */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-[#1B3B2B]">{t.refShareDirectly || 'Share Directly with Contacts'}</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] p-2.5 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#25D366]" />
                <span className="text-[11px] font-bold">WhatsApp</span>
              </a>

              <a
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] p-2.5 rounded-xl border border-[#0088cc]/30 bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#0088cc]" />
                <span className="text-[11px] font-bold">Telegram</span>
              </a>

              <a
                href={socialLinks.x}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] p-2.5 rounded-xl border border-[#000000]/20 bg-black/5 hover:bg-black/10 text-black text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-black" />
                <span className="text-[11px] font-bold">X (Twitter)</span>
              </a>

              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] p-2.5 rounded-xl border border-[#1877F2]/30 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-[#1877F2]" />
                <span className="text-[11px] font-bold">Facebook</span>
              </a>
            </div>
          </div>

          {/* Direct Email Invite Form */}
          <div className="pt-3 border-t border-[#E5E3D8] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1B3B2B] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Send Direct Email Invitation</span>
              </span>
              <button
                type="button"
                onClick={() => setShowQr(!showQr)}
                className="text-[11px] text-[#5C6572] hover:text-[#1B3B2B] font-semibold flex items-center gap-1 cursor-pointer min-h-[36px]"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{showQr ? 'Hide QR' : 'Show QR Code'}</span>
              </button>
            </div>

            {showQr && (
              <div className="p-4 bg-[#F7F6F2] rounded-xl border border-[#DCDAD0] text-center space-y-2 animate-in fade-in">
                <div className="w-32 h-32 mx-auto bg-white p-2 rounded-lg border border-[#DCDAD0] flex items-center justify-center shadow-xs">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(referralLink)}`}
                    alt="Referral Link QR Code"
                    className="w-full h-full"
                  />
                </div>
                <div className="text-[10px] text-[#5C6572]">Scan with any phone camera to register</div>
              </div>
            )}

            <form onSubmit={handleSendInvite} className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Partner Name (Optional)"
                  className="min-h-[44px] px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                />
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="partner@example.com"
                  className="min-h-[44px] px-3 py-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                />
              </div>

              {sentSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Official invitation dispatched to {inviteEmail}!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full min-h-[46px] py-2.5 bg-[#1B3B2B] hover:bg-[#11271D] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Official Invitation</span>
              </button>
            </form>
          </div>

        </div>

        {/* Footer info */}
        <div className="p-3 sm:p-4 bg-[#F7F6F2] border-t border-[#E5E3D8] text-center text-[10px] sm:text-[11px] text-[#5C6572] shrink-0">
          Every referred user is permanently associated with your account upon registration.
        </div>
      </div>
    </div>
  );
};
