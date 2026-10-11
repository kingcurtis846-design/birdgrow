import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  Bug,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Send,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  LifeBuoy,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import { BugReport } from '../../types';

export const ReportBugSection: React.FC = () => {
  const { bugReports, submitBugReport, currentUser } = usePlatform();

  // Form fields
  const [reporterName, setReporterName] = useState(currentUser?.full_name || '');
  const [reporterEmail, setReporterEmail] = useState(currentUser?.email || '');
  const [category, setCategory] = useState('Yield Horizon & Plan Limits (£4,499 / £99,999)');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [title, setTitle] = useState('');
  const [pageUrl, setPageUrl] = useState(typeof window !== 'undefined' ? window.location.pathname + window.location.hash : '/');
  const [description, setDescription] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{ id: string; message: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter for display list
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'resolved'>('all');

  const filteredReports = bugReports.filter((report) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'open') return report.status === 'open' || report.status === 'investigating';
    if (filterStatus === 'resolved') return report.status === 'resolved';
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!reporterName.trim()) {
      setErrorMessage('Please provide your name or investor handle.');
      return;
    }

    if (!reporterEmail.trim() || !reporterEmail.includes('@')) {
      setErrorMessage('Please provide a valid email address so our team can follow up with resolution updates.');
      return;
    }

    if (!title.trim() || title.length < 5) {
      setErrorMessage('Please provide a descriptive title for the issue (at least 5 characters).');
      return;
    }

    if (!description.trim() || description.length < 15) {
      setErrorMessage('Please describe the issue in detail (at least 15 characters).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitBugReport({
        name: reporterName,
        email: reporterEmail,
        category,
        severity,
        title,
        description,
        pageUrl,
        stepsToReproduce: stepsToReproduce.trim() || undefined,
      });

      if (res.success) {
        setSubmittedTicket({ id: res.ticketId, message: res.message });
        setTitle('');
        setDescription('');
        setStepsToReproduce('');
      } else {
        setErrorMessage(res.message || 'Failed to submit bug report. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyTicket = (ticketId: string) => {
    navigator.clipboard.writeText(ticketId);
    setCopiedId(ticketId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="report-bug" className="py-24 bg-[#FAF9F5] border-t border-b border-[#E5E3D8] scroll-mt-20 relative overflow-hidden">
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1B3B2B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1B3B2B]/5 border border-[#1B3B2B]/15 text-[#1B3B2B] text-xs font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Platform Health &amp; Incident Triage Desk</span>
            <span className="text-[#C5A059]">·</span>
            <span>24/7 Operations</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B3B2B] tracking-tight">
            Report an Issue or Platform Bug
          </h2>

          <p className="text-base text-[#5C6572] leading-relaxed">
            Spotted an unexpected behavior, calculation glitch, or transaction discrepancy?
            Submit your report directly to our technical infrastructure desk. All submissions
            are prioritized, logged with an immutable ticket reference, and transmitted to on-duty engineers in real time.
          </p>

          {/* Quick Metrics & SLA commitment */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-[#5C6572]">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#E5E3D8] shadow-2xs font-mono">
              <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Target Triage: <strong>&lt; 15 mins</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#E5E3D8] shadow-2xs font-mono">
              <ShieldAlert className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Real-Time Admin Dispatch: <strong>Active</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#E5E3D8] shadow-2xs font-mono">
              <Terminal className="w-3.5 h-3.5 text-[#1B3B2B]" />
              <span>System Uptime: <strong>99.98%</strong></span>
            </div>
          </div>
        </div>

        {/* 2-Column Layout: Report Form + Live Triage Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Interactive Submission Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E5E3D8] shadow-md p-6 sm:p-8">
            <div className="flex items-center justify-between pb-6 border-b border-[#F0EFEA] mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Bug className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1B3B2B]">Submit Technical Report</h3>
                  <p className="text-xs text-[#5C6572]">Direct link to engineering operations console</p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded bg-[#F7F6F2] text-[#1B3B2B] border border-[#E5E3D8]">
                SSL Encrypted
              </span>
            </div>

            {submittedTicket ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-emerald-900">Incident Ticket Successfully Logged</h4>
                    <p className="text-xs text-emerald-700">Our engineering team has received your submission.</p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#5C6572] font-medium">Ticket Reference ID:</span>
                    <button
                      type="button"
                      onClick={() => handleCopyTicket(submittedTicket.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-mono text-xs font-bold transition-colors cursor-pointer"
                      title="Copy Ticket ID"
                    >
                      <span>{submittedTicket.id}</span>
                      {copiedId === submittedTicket.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-emerald-700" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-[#3D4A41] leading-relaxed pt-1">
                    {submittedTicket.message}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSubmittedTicket(null)}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Report Another Issue</span>
                  </button>
                  <span className="text-[11px] font-mono text-emerald-700">
                    Status: <strong className="uppercase">Open · High Priority</strong>
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-in fade-in">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div className="leading-relaxed font-medium">{errorMessage}</div>
                  </div>
                )}

                {/* Reporter Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1B3B2B] mb-1">
                      Your Name / Handle <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Curtis King"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDAD0] text-sm focus:border-[#1B3B2B] focus:ring-1 focus:ring-[#1B3B2B] outline-none transition-all bg-[#FAF9F5]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1B3B2B] mb-1">
                      Contact Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. investor@example.eu"
                      value={reporterEmail}
                      onChange={(e) => setReporterEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDAD0] text-sm focus:border-[#1B3B2B] focus:ring-1 focus:ring-[#1B3B2B] outline-none transition-all bg-[#FAF9F5]"
                    />
                  </div>
                </div>

                {/* Category & Severity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1B3B2B] mb-1">
                      Issue Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDAD0] text-sm focus:border-[#1B3B2B] focus:ring-1 focus:ring-[#1B3B2B] outline-none transition-all bg-[#FAF9F5] cursor-pointer"
                    >
                      <option value="Yield Horizon & Plan Limits (£4,499 / £99,999)">
                        📈 Yield Horizon &amp; Plan Limits (£4,499 / £99,999)
                      </option>
                      <option value="Interactive Yield Calculator">
                        🧮 Interactive Yield Calculator
                      </option>
                      <option value="Wallet, Deposit & Crypto Settlement">
                        💳 Wallet, Deposit &amp; Crypto Settlement
                      </option>
                      <option value="Withdrawal & Payout Processing">
                        🏦 Withdrawal &amp; Payout Processing
                      </option>
                      <option value="Farm Facilities & Live Photography">
                        🌾 Farm Facilities &amp; Live Photography
                      </option>
                      <option value="KYC & Identity Verification">
                        📋 KYC &amp; Identity Verification
                      </option>
                      <option value="UI Display & Responsive Glitch">
                        🖥️ UI Display &amp; Responsive Glitch
                      </option>
                      <option value="Other System Incident">
                        ⚙️ Other System Incident
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1B3B2B] mb-1">
                      Severity Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDAD0] text-sm focus:border-[#1B3B2B] focus:ring-1 focus:ring-[#1B3B2B] outline-none transition-all bg-[#FAF9F5] cursor-pointer"
                    >
                      <option value="low">🟢 Low (Cosmetic, typo, minor spacing)</option>
                      <option value="medium">🟡 Medium (Functional glitch, workaround exists)</option>
                      <option value="high">🟠 High (Inaccurate calculations or broken form)</option>
                      <option value="critical">🔴 Critical (Blocking payment, withdrawal or login)</option>
                    </select>
                  </div>
                </div>

                {/* Issue Summary */}
                <div>
                  <label className="block text-xs font-bold text-[#1B3B2B] mb-1">
                    Issue Title / Headline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Starter Plan max limit shows incorrect amount on mobile"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDAD0] text-sm focus:border-[#1B3B2B] focus:ring-1 focus:ring-[#1B3B2B] outline-none transition-all bg-[#FAF9F5]"
                  />
                </div>

                {/* Page / Location */}
                <div>
                  <label className="block text-xs font-bold text-[#1B3B2B] mb-1">
                    Affected Page / Feature Location
                  </label>
                  <input
                    type="text"
                    placeholder="/#plans, /#calculator, Deposit Modal, etc."
                    value={pageUrl}
                    onChange={(e) => setPageUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDAD0] text-sm font-mono text-xs focus:border-[#1B3B2B] focus:ring-1 focus:ring-[#1B3B2B] outline-none transition-all bg-[#FAF9F5]"
                  />
                </div>

                {/* Detailed Description */}
                <div>
                  <label className="block text-xs font-bold text-[#1B3B2B] mb-1">
                    Detailed Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Please explain what happened, what you expected to see, and any error message displayed..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDAD0] text-sm focus:border-[#1B3B2B] focus:ring-1 focus:ring-[#1B3B2B] outline-none transition-all bg-[#FAF9F5]"
                  />
                </div>

                {/* Steps to Reproduce (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-[#1B3B2B] mb-1">
                    Steps to Reproduce <span className="text-[#5C6572] font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="1. Go to Yield Calculator&#10;2. Type £4,500&#10;3. Observe tier switch..."
                    value={stepsToReproduce}
                    onChange={(e) => setStepsToReproduce(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDAD0] text-xs font-mono focus:border-[#1B3B2B] focus:ring-1 focus:ring-[#1B3B2B] outline-none transition-all bg-[#FAF9F5]"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#1B3B2B] hover:bg-[#11271D] disabled:bg-[#1B3B2B]/50 text-white font-bold text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#C5A059]" />
                        <span>Transmitting Bug Report to Operations...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-[#C5A059]" />
                        <span>Transmit Bug Report to Engineering Desk</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-[#7A857D] pt-2">
                    A copy of your report will be dispatched to the administrative operations console with real-time audit logging.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Confidential Triage & Security SLA (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Triage Status Banner Card */}
            <div className="bg-[#11271D] text-white p-6 rounded-2xl border border-[#C5A059]/30 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <LifeBuoy className="w-32 h-32" />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#C5A059] font-bold">
                    Engineering SLA &amp; Privacy
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                    Confidential Triage
                  </span>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-white">
                  Direct Engineering Dispatch
                </h3>

                <p className="text-xs text-[#A7B6AB] leading-relaxed">
                  Every issue filed via this console is encrypted and assigned directly to internal infrastructure engineering. To protect investor privacy and platform security, ticket histories are securely maintained within the admin operations desk and are never publicly broadcast.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[10px] text-[#A7B6AB] uppercase font-mono">Starter Plan Cap</div>
                    <div className="text-base font-extrabold font-mono text-[#C5A059] mt-0.5">£4,499</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[10px] text-[#A7B6AB] uppercase font-mono">Commercial Cap</div>
                    <div className="text-base font-extrabold font-mono text-[#C5A059] mt-0.5">£99,999</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy & Confidentiality Guarantee Box */}
            <div className="bg-white rounded-2xl border border-[#E5E3D8] shadow-sm p-6 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-bold text-[#1B3B2B]">Zero Public Exposure</h4>
              </div>
              <p className="text-xs text-[#5C6572] leading-relaxed">
                Platform vulnerabilities, feedback logs, and bug submissions are confidential. Our automated monitoring and administrative console triage issues directly to senior maintainers with sub-hour response times.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
