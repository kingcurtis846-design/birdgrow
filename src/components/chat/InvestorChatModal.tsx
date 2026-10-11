import React, { useState, useEffect, useRef } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  MessageSquare,
  Send,
  X,
  Bot,
  Users,
  Clock,
  ShieldCheck,
  Sparkles,
  Search,
  CheckCheck,
  ChevronRight,
  Info,
  Maximize2,
  Minimize2,
  Lock,
  ArrowLeft,
  Circle,
  TrendingUp,
} from 'lucide-react';
import { ChatMessage, InvestorMember } from '../../types';

interface InvestorChatModalProps {
  onOpenInvest?: () => void;
}

export const InvestorChatModal: React.FC<InvestorChatModalProps> = ({ onOpenInvest }) => {
  const {
    isChatOpen,
    closeChat,
    activeChatTab,
    setActiveChatTab,
    chatMembers,
    visibleGroupMessages,
    directChatMessages,
    selectedDirectMemberId,
    setSelectedDirectMemberId,
    sendGroupMessage,
    sendDirectMessage,
    currentUser,
    isAuthenticated,
    investments,
    isAdmin,
    formatCurrentCurrency,
    currencySymbol,
  } = usePlatform();

  const [inputContent, setInputContent] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [replyingTo, setReplyingTo] = useState<ChatMessage['replyTo'] | undefined>(undefined);
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedProfilePreview, setSelectedProfilePreview] = useState<InvestorMember | null>(null);

  const renderAvatar = (
    name: string,
    isBot?: boolean,
    sizeClass: string = 'w-9 h-9 sm:w-10 sm:h-10 text-xs',
    role?: string
  ) => {
    if (isBot) {
      return (
        <div className={`${sizeClass} rounded-full bg-[#1B3B2B] text-[#C5A059] flex items-center justify-center font-bold border border-white/20 shrink-0 shadow-2xs`}>
          <Bot className="w-4 h-4" />
        </div>
      );
    }
    const initials = (name || 'Investor')
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'IN';

    const isRoleAdmin = role === 'admin';

    return (
      <div
        className={`${sizeClass} rounded-full ${
          isRoleAdmin
            ? 'bg-purple-900 text-purple-100 border-purple-300'
            : 'bg-[#1B3B2B] text-[#F7F6F2] border-[#2D5A40]'
        } flex items-center justify-center font-bold border shrink-0 shadow-2xs`}
      >
        <span>{initials}</span>
      </div>
    );
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleGroupMessages, directChatMessages, activeChatTab, selectedDirectMemberId]);

  // Check if current user has active investments
  const userActiveInvestments = investments.filter(
    (i) => (currentUser?.user_id && i.user_id === currentUser.user_id) || i.user_id === 'usr-investor-01'
  );
  const hasActiveInvestments = userActiveInvestments.length > 0 || isAdmin;
  const totalUserInvested = userActiveInvestments.reduce((sum, i) => sum + i.principal_amount, 0);

  // Active recipient in 1-on-1 direct chat
  const activeRecipientId = selectedDirectMemberId || 'usr-agribot';
  const activeRecipient = chatMembers.find((m) => m.id === activeRecipientId) || chatMembers[0];
  const currentDirectThread = directChatMessages[activeRecipientId] || [];

  // Filter members in DM directory
  const filteredMembers = chatMembers.filter((m) => {
    if (m.id === (currentUser?.user_id || 'usr-investor-01')) return false; // don't list self
    if (!memberSearch.trim()) return true;
    const q = memberSearch.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.country.toLowerCase().includes(q) ||
      (m.activePlanTitle || '').toLowerCase().includes(q) ||
      (m.badge || '').toLowerCase().includes(q)
    );
  });

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputContent.trim()) return;

    if (activeChatTab === 'group') {
      if (!hasActiveInvestments) return;
      sendGroupMessage(inputContent, replyingTo);
      setReplyingTo(undefined);
    } else {
      // Direct message (either 'direct' tab or 'bot' tab)
      const targetId = activeChatTab === 'bot' ? 'usr-agribot' : activeRecipientId;
      sendDirectMessage(targetId, inputContent);
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), targetId === 'usr-agribot' ? 800 : 1600);
    }

    setInputContent('');
  };

  const handleStartDirectWithMember = (member: InvestorMember) => {
    setSelectedDirectMemberId(member.id);
    setActiveChatTab('direct');
    setSelectedProfilePreview(null);
  };

  const formatMessageTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const getTimeUntilExpiration = (isoString: string) => {
    try {
      const msgTime = new Date(isoString).getTime();
      const expiresAt = msgTime + 24 * 60 * 60 * 1000;
      const remainingMs = expiresAt - Date.now();
      if (remainingMs <= 0) return 'Expired';
      const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
      const remainingMins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${remainingHours}h ${remainingMins}m left`;
    } catch {
      return '';
    }
  };

  if (!isChatOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div
        className={`bg-white rounded-2xl shadow-2xl border border-[#E5E3D8] flex flex-col overflow-hidden transition-all duration-300 w-full ${
          isExpanded ? 'max-w-6xl h-[92vh]' : 'max-w-4xl h-[85vh]'
        }`}
      >
        {/* HEADER */}
        <div className="bg-[#1B3B2B] text-white p-4 sm:px-6 flex items-center justify-between border-b border-[#2D5A40] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#C5A059] border border-white/15">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  BirdGrow Investor Lounge
                </h3>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>14 Investors Online</span>
                </span>
              </div>
              <p className="text-xs text-white/70">
                Verified Backer Network & 24/7 AgriBot Advisory
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors hidden sm:block cursor-pointer"
              title={isExpanded ? 'Minimize' : 'Maximize'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={closeChat}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="bg-[#F7F6F2] px-4 sm:px-6 py-2 border-b border-[#E5E3D8] flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveChatTab('group')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeChatTab === 'group'
                  ? 'bg-[#1B3B2B] text-white shadow-2xs'
                  : 'bg-white text-[#5C6572] hover:text-[#1B3B2B] border border-[#E5E3D8]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Investor Group (24h)</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeChatTab === 'group' ? 'bg-white/20 text-white' : 'bg-[#E5E3D8] text-[#1B3B2B]'
              }`}>
                {visibleGroupMessages.length}
              </span>
            </button>

            <button
              onClick={() => setActiveChatTab('direct')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 relative ${
                activeChatTab === 'direct'
                  ? 'bg-[#1B3B2B] text-white shadow-2xs'
                  : 'bg-white text-[#5C6572] hover:text-[#1B3B2B] border border-[#E5E3D8]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Direct Messages (1-on-1)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </button>

            <button
              onClick={() => setActiveChatTab('bot')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeChatTab === 'bot'
                  ? 'bg-[#C5A059] text-[#1B3B2B] shadow-2xs'
                  : 'bg-white text-[#5C6572] hover:text-[#1B3B2B] border border-[#E5E3D8]'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AgriBot AI</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 font-bold">24/7</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[11px] text-[#5C6572]">
            <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Group History: 24h Rolling Window</span>
          </div>
        </div>

        {/* TAB 1: INVESTOR GROUP CHAT (24H ROLLING) */}
        {activeChatTab === 'group' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            
            {/* 24-Hour Policy Notice Banner */}
            <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 sm:px-6 py-2 flex items-center justify-between text-xs text-amber-900 shrink-0">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>24-Hour Rolling History:</strong> In compliance with privacy and real-time operational transparency, group chat messages are retained for 24 hours.
                </span>
              </div>
              <span className="hidden sm:inline-block font-mono text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                Auto-Cleared Past 24h
              </span>
            </div>

            {/* Quick Prompt Chips for Chatbot */}
            <div className="bg-[#F7F6F2] px-4 sm:px-6 py-2 border-b border-[#E5E3D8] flex items-center gap-2 overflow-x-auto text-xs shrink-0 no-scrollbar">
              <span className="text-[#5C6572] font-semibold text-[11px] shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#C5A059]" />
                Ask AgriBot:
              </span>
              <button
                onClick={() => setInputContent('@AgriBot what are the minimum entries for each plan?')}
                className="px-2.5 py-1 rounded-md bg-white border border-[#E5E3D8] text-[#1B3B2B] hover:border-[#1B3B2B] text-[11px] font-medium shrink-0 cursor-pointer"
              >
                Plan Minimums
              </button>
              <button
                onClick={() => setInputContent('@AgriBot how do off-platform payment confirmations work?')}
                className="px-2.5 py-1 rounded-md bg-white border border-[#E5E3D8] text-[#1B3B2B] hover:border-[#1B3B2B] text-[11px] font-medium shrink-0 cursor-pointer"
              >
                Off-Platform Deposits
              </button>
              <button
                onClick={() => setInputContent('@AgriBot what is the status of the Alaska facility?')}
                className="px-2.5 py-1 rounded-md bg-white border border-[#E5E3D8] text-[#1B3B2B] hover:border-[#1B3B2B] text-[11px] font-medium shrink-0 cursor-pointer"
              >
                Alaska Sub-Zero Status
              </button>
              <button
                onClick={() => setInputContent(`@AgriBot calculate return on ${formatCurrentCurrency(5000, false)} for 21 days`)}
                className="px-2.5 py-1 rounded-md bg-white border border-[#E5E3D8] text-[#1B3B2B] hover:border-[#1B3B2B] text-[11px] font-medium shrink-0 cursor-pointer"
              >
                Tier 2 ROI Calculation
              </button>
            </div>

            {/* Group Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="text-center py-2">
                <span className="text-[11px] font-mono font-semibold px-3 py-1 rounded-full bg-[#F7F6F2] text-[#5C6572] border border-[#E5E3D8]">
                  Messages older than 24 hours have expired
                </span>
              </div>

              {visibleGroupMessages.map((msg) => {
                const isCurrentUser =
                  msg.senderId === (currentUser?.user_id || 'usr-investor-01');
                const isBot = msg.isAiBot || msg.senderRole === 'bot';
                const isAdminMsg = msg.senderRole === 'admin';

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 group ${
                      isCurrentUser ? 'flex-row-reverse' : ''
                    }`}
                  >
                    {/* Avatar without external images */}
                    <div
                      onClick={() => {
                        const member = chatMembers.find((m) => m.id === msg.senderId);
                        if (member) setSelectedProfilePreview(member);
                      }}
                      className="relative cursor-pointer shrink-0"
                      title="Click to view investor profile & send DM"
                    >
                      {renderAvatar(msg.senderName, isBot, 'w-9 h-9 sm:w-10 sm:h-10 text-xs', msg.senderRole)}
                      {!isBot && (
                        <span className="absolute -bottom-0.5 -right-0.5 text-[10px]">
                          {msg.senderCountry === 'Germany' ? '🇩🇪' : msg.senderCountry === 'France' ? '🇫🇷' : msg.senderCountry === 'Netherlands' ? '🇳🇱' : msg.senderCountry === 'Italy' ? '🇮🇹' : msg.senderCountry === 'Sweden' ? '🇸🇪' : '🇪🇺'}
                        </span>
                      )}
                    </div>

                    {/* Message Bubble Container */}
                    <div className={`max-w-[85%] sm:max-w-[75%] space-y-1 ${isCurrentUser ? 'items-end' : ''}`}>
                      
                      {/* Sender Meta Header */}
                      <div className={`flex items-center gap-2 text-xs ${isCurrentUser ? 'justify-end' : ''}`}>
                        <button
                          type="button"
                          onClick={() => {
                            const member = chatMembers.find((m) => m.id === msg.senderId);
                            if (member) setSelectedProfilePreview(member);
                          }}
                          className="font-bold text-[#1B3B2B] hover:underline cursor-pointer flex items-center gap-1.5"
                        >
                          <span>{msg.senderName}</span>
                          {isCurrentUser && <span className="text-[10px] text-[#5C6572]">(You)</span>}
                        </button>

                        {/* Badges */}
                        {isBot ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#C5A059]/20 text-[#8E702D] border border-[#C5A059]/40 flex items-center gap-1">
                            <Bot className="w-2.5 h-2.5" />
                            <span>AI Advisor</span>
                          </span>
                        ) : isAdminMsg ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            <span>Operations Admin</span>
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {msg.senderBadge || 'Verified Investor'}
                          </span>
                        )}

                        <span className="text-[10px] text-[#5C6572] font-mono">
                          {formatMessageTime(msg.timestamp)}
                        </span>
                      </div>

                      {/* Reply Quoted Container */}
                      {msg.replyTo && (
                        <div className="bg-[#F7F6F2] border-l-2 border-[#C5A059] p-2 rounded text-xs text-[#5C6572] mb-1">
                          <strong className="text-[#1B3B2B]">Replying to {msg.replyTo.senderName}:</strong>{' '}
                          <span className="italic">{msg.replyTo.content}</span>
                        </div>
                      )}

                      {/* Content Bubble */}
                      <div
                        className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                          isCurrentUser
                            ? 'bg-[#1B3B2B] text-white rounded-tr-xs'
                            : isBot
                            ? 'bg-[#F9F7F1] text-[#1B3B2B] border border-[#E5E3D8] rounded-tl-xs'
                            : 'bg-[#F7F6F2] text-[#1B3B2B] border border-[#E5E3D8] rounded-tl-xs'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.content}</p>
                      </div>

                      {/* Footer Actions: Reply & Message Individually */}
                      <div className={`flex items-center gap-2 text-[11px] text-[#5C6572] pt-0.5 ${isCurrentUser ? 'justify-end' : ''}`}>
                        <span className="text-[10px] font-mono text-[#718096]">
                          Expires in {getTimeUntilExpiration(msg.timestamp)}
                        </span>
                        <span>·</span>
                        <button
                          type="button"
                          onClick={() =>
                            setReplyingTo({
                              id: msg.id,
                              senderName: msg.senderName,
                              content: msg.content.slice(0, 60),
                            })
                          }
                          className="hover:text-[#1B3B2B] font-medium cursor-pointer"
                        >
                          Reply
                        </button>

                        {!isCurrentUser && (
                          <>
                            <span>·</span>
                            <button
                              type="button"
                              onClick={() => {
                                const member = chatMembers.find((m) => m.id === msg.senderId);
                                if (member) handleStartDirectWithMember(member);
                              }}
                              className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>Message Individually</span>
                            </button>
                          </>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Replying banner */}
            {replyingTo && (
              <div className="bg-[#F7F6F2] px-4 py-2 border-t border-[#E5E3D8] flex items-center justify-between text-xs text-[#5C6572]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1B3B2B]">Replying to {replyingTo.senderName}:</span>
                  <span className="truncate max-w-md italic">{replyingTo.content}</span>
                </div>
                <button
                  onClick={() => setReplyingTo(undefined)}
                  className="p-1 text-[#5C6572] hover:text-[#1B3B2B]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Input Composer */}
            <div className="p-3 sm:p-4 bg-[#F7F6F2] border-t border-[#E5E3D8]">
              {hasActiveInvestments ? (
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                    placeholder="Message the investor community (or ask @AgriBot)..."
                    className="flex-1 bg-white border border-[#E5E3D8] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B] shadow-2xs"
                  />
                  <button
                    type="submit"
                    disabled={!inputContent.trim()}
                    className="px-4 sm:px-5 py-2.5 rounded-xl bg-[#1B3B2B] hover:bg-[#11271D] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-amber-900">
                    <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>
                      <strong>Verified Backer Access Required:</strong> Posting in the group chat is reserved for investors with an active agricultural cycle.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      closeChat();
                      if (onOpenInvest) onOpenInvest();
                    }}
                    className="px-4 py-1.5 rounded-lg bg-[#1B3B2B] text-white font-bold text-xs hover:bg-[#11271D] cursor-pointer shrink-0"
                  >
                    Explore Investment Plans
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: DIRECT MESSAGES (1-ON-1 INDIVIDUAL MESSAGING) */}
        {activeChatTab === 'direct' && (
          <div className="flex-1 flex overflow-hidden">
            
            {/* Left Member List */}
            <div className="w-72 sm:w-80 border-r border-[#E5E3D8] bg-[#F7F6F2] flex flex-col shrink-0">
              
              {/* Member Search Header */}
              <div className="p-3 border-b border-[#E5E3D8]">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5C6572]" />
                  <input
                    type="text"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder="Search fellow investors..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#E5E3D8] rounded-lg text-xs text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                  />
                </div>
              </div>

              {/* Members List */}
              <div className="flex-1 overflow-y-auto divide-y divide-[#E5E3D8]">
                {filteredMembers.map((member) => {
                  const isSelected = member.id === activeRecipientId;
                  const thread = directChatMessages[member.id] || [];
                  const lastMsg = thread[thread.length - 1];

                  return (
                    <div
                      key={member.id}
                      onClick={() => setSelectedDirectMemberId(member.id)}
                      className={`p-3 flex items-start gap-3 cursor-pointer transition-colors ${
                        isSelected ? 'bg-white border-l-4 border-l-[#1B3B2B]' : 'hover:bg-white/60'
                      }`}
                    >
                      <div className="relative shrink-0">
                        {renderAvatar(member.name, member.role === 'bot', 'w-10 h-10 text-xs font-bold', member.role)}
                        <span
                          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                            member.onlineStatus === 'online'
                              ? 'bg-emerald-500'
                              : member.onlineStatus === 'away'
                              ? 'bg-amber-500'
                              : 'bg-slate-400'
                          }`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-[#1B3B2B] truncate">{member.name}</h4>
                          <span className="text-[10px] text-[#5C6572] shrink-0 font-mono">
                            {member.countryCode}
                          </span>
                        </div>

                        <div className="text-[10px] text-[#5C6572] truncate">
                          {member.badge || member.activePlanTitle}
                        </div>

                        <p className="text-[11px] text-[#4A5568] truncate mt-1">
                          {lastMsg ? lastMsg.content : member.bio}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Active 1-on-1 Conversation */}
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              
              {/* Recipient Profile Header */}
              <div className="p-3 sm:px-6 py-3 bg-[#F7F6F2] border-b border-[#E5E3D8] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  {renderAvatar(activeRecipient.name, activeRecipient.role === 'bot', 'w-10 h-10 text-xs font-bold', activeRecipient.role)}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#1B3B2B]">{activeRecipient.name}</h4>
                      <span className="text-xs">{activeRecipient.countryCode === 'DE' ? '🇩🇪' : activeRecipient.countryCode === 'FR' ? '🇫🇷' : activeRecipient.countryCode === 'NL' ? '🇳🇱' : activeRecipient.countryCode === 'IT' ? '🇮🇹' : activeRecipient.countryCode === 'SE' ? '🇸🇪' : '🇪🇺'}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                        {activeRecipient.badge || 'Verified Investor'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5C6572] mt-0.5">
                      {activeRecipient.investedAmount
                        ? `Allocated ${formatCurrentCurrency(activeRecipient.investedAmount, false)} · ${activeRecipient.activePlanTitle}`
                        : activeRecipient.bio}
                    </p>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 justify-end">
                    <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
                    <span>{activeRecipient.lastSeen || 'Active now'}</span>
                  </span>
                  <span className="text-[10px] text-[#5C6572]">1-on-1 End-to-End Encrypted</span>
                </div>
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {currentDirectThread.map((msg) => {
                  const isCurrentUser =
                    msg.senderId === (currentUser?.user_id || 'usr-investor-01');

                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 ${
                        isCurrentUser ? 'flex-row-reverse' : ''
                      }`}
                    >
                      {renderAvatar(
                        isCurrentUser ? (currentUser?.full_name || 'You') : msg.senderName,
                        msg.isAiBot || msg.senderRole === 'bot',
                        'w-8 h-8 text-[11px]',
                        msg.senderRole
                      )}
                      <div className={`max-w-[80%] space-y-1 ${isCurrentUser ? 'items-end' : ''}`}>
                        <div
                          className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            isCurrentUser
                              ? 'bg-[#1B3B2B] text-white rounded-tr-xs shadow-xs'
                              : 'bg-[#F7F6F2] text-[#1B3B2B] border border-[#E5E3D8] rounded-tl-xs'
                          }`}
                        >
                          <p className="whitespace-pre-line">{msg.content}</p>
                        </div>
                        <div className={`text-[10px] text-[#5C6572] font-mono px-1 flex items-center gap-1 ${isCurrentUser ? 'justify-end' : ''}`}>
                          <span>{formatMessageTime(msg.timestamp)}</span>
                          {isCurrentUser && <CheckCheck className="w-3 h-3 text-emerald-600" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-[#5C6572] italic pl-2">
                    <span className="w-2 h-2 rounded-full bg-[#1B3B2B] animate-bounce" />
                    <span>{activeRecipient.name} is typing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Box */}
              <div className="p-3 sm:p-4 bg-[#F7F6F2] border-t border-[#E5E3D8]">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                    placeholder={`Message ${activeRecipient.name} directly...`}
                    className="flex-1 bg-white border border-[#E5E3D8] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                  />
                  <button
                    type="submit"
                    disabled={!inputContent.trim()}
                    className="px-5 py-2.5 rounded-xl bg-[#1B3B2B] hover:bg-[#11271D] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: AGRIBOT AI (DEDICATED INTERACTIVE CHATBOT) */}
        {activeChatTab === 'bot' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            
            {/* AgriBot Info Bar */}
            <div className="bg-[#FAF7F0] border-b border-[#E5E3D8] px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1B3B2B] text-[#C5A059] flex items-center justify-center shadow-xs">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1B3B2B] flex items-center gap-2">
                    <span>AgriBot AI Assistant</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                      Active
                    </span>
                  </h4>
                  <p className="text-xs text-[#5C6572]">
                    Dedicated intelligence engine for BirdGrow agricultural metrics, investment tiers, and wallet queries.
                  </p>
                </div>
              </div>
            </div>

            {/* AgriBot Direct Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {(directChatMessages['usr-agribot'] || []).map((msg) => {
                const isCurrentUser =
                  msg.senderId === (currentUser?.user_id || 'usr-investor-01');

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      isCurrentUser ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                      {renderAvatar(
                        isCurrentUser ? (currentUser?.full_name || 'You') : 'AgriBot AI',
                        !isCurrentUser,
                        'w-8 h-8 text-[11px]',
                        isCurrentUser ? 'user' : 'bot'
                      )}
                    </div>

                    <div className={`max-w-[80%] space-y-1 ${isCurrentUser ? 'items-end' : ''}`}>
                      <div
                        className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isCurrentUser
                            ? 'bg-[#1B3B2B] text-white rounded-tr-xs shadow-xs'
                            : 'bg-[#F9F7F1] text-[#1B3B2B] border border-[#E5E3D8] rounded-tl-xs shadow-2xs'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.content}</p>
                      </div>
                      <span className="text-[10px] text-[#5C6572] font-mono px-1">
                        {formatMessageTime(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-[#5C6572] italic pl-2">
                  <Bot className="w-4 h-4 text-[#C5A059] animate-spin" />
                  <span>AgriBot is calculating response...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="p-3 bg-[#FAF7F0] border-t border-[#E5E3D8] flex items-center gap-2 overflow-x-auto text-xs shrink-0 no-scrollbar">
              <span className="text-[#5C6572] text-[11px] font-bold shrink-0">Suggested:</span>
              <button
                onClick={() => setInputContent('What is the ROI and timeframe for each tier?')}
                className="px-3 py-1 bg-white border border-[#E5E3D8] rounded-lg text-[11px] font-medium text-[#1B3B2B] hover:border-[#1B3B2B] shrink-0 cursor-pointer"
              >
                📊 Compare All 3 Tiers
              </button>
              <button
                onClick={() => setInputContent('How does the admin confirm off-platform payments?')}
                className="px-3 py-1 bg-white border border-[#E5E3D8] rounded-lg text-[11px] font-medium text-[#1B3B2B] hover:border-[#1B3B2B] shrink-0 cursor-pointer"
              >
                💳 Admin Balance Tool
              </button>
              <button
                onClick={() => setInputContent('Explain the 24-hour group chat message retention')}
                className="px-3 py-1 bg-white border border-[#E5E3D8] rounded-lg text-[11px] font-medium text-[#1B3B2B] hover:border-[#1B3B2B] shrink-0 cursor-pointer"
              >
                ⏳ 24h Chat Policy
              </button>
              <button
                onClick={() => setInputContent('Tell me about the Alaska Sub-Zero Bio-Dome opening')}
                className="px-3 py-1 bg-white border border-[#E5E3D8] rounded-lg text-[11px] font-medium text-[#1B3B2B] hover:border-[#1B3B2B] shrink-0 cursor-pointer"
              >
                ❄️ Alaska Bio-Dome
              </button>
            </div>

            {/* Input Form */}
            <div className="p-3 sm:p-4 bg-[#F7F6F2] border-t border-[#E5E3D8]">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  placeholder="Ask AgriBot anything about BirdGrow..."
                  className="flex-1 bg-white border border-[#E5E3D8] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
                />
                <button
                  type="submit"
                  disabled={!inputContent.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#1B3B2B] hover:bg-[#11271D] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
                >
                  <span>Ask AI</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>
        )}

        {/* INVESTOR PROFILE POPOVER MODAL */}
        {selectedProfilePreview && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-[#E5E3D8] space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {renderAvatar(selectedProfilePreview.name, selectedProfilePreview.role === 'bot', 'w-14 h-14 text-base font-extrabold', selectedProfilePreview.role)}
                  <div>
                    <h4 className="text-base font-extrabold text-[#1B3B2B]">
                      {selectedProfilePreview.name}
                    </h4>
                    <span className="text-xs text-[#5C6572] flex items-center gap-1">
                      <span>{selectedProfilePreview.country}</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-semibold">{selectedProfilePreview.onlineStatus}</span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProfilePreview(null)}
                  className="p-1 text-[#5C6572] hover:text-[#1B3B2B]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 bg-[#F7F6F2] rounded-xl border border-[#E5E3D8] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#5C6572]">Status:</span>
                  <span className="font-bold text-[#1B3B2B]">{selectedProfilePreview.badge || 'Verified Investor'}</span>
                </div>
                {selectedProfilePreview.investedAmount && (
                  <div className="flex justify-between">
                    <span className="text-[#5C6572]">Capital Allocation:</span>
                    <span className="font-mono font-bold text-emerald-800">
                      {formatCurrentCurrency(selectedProfilePreview.investedAmount, false)}
                    </span>
                  </div>
                )}
                {selectedProfilePreview.activePlanTitle && (
                  <div className="flex justify-between">
                    <span className="text-[#5C6572]">Active Plan:</span>
                    <span className="font-semibold text-[#1B3B2B] truncate max-w-[170px]">
                      {selectedProfilePreview.activePlanTitle}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-xs text-[#5C6572] leading-relaxed">
                {selectedProfilePreview.bio}
              </p>

              <button
                type="button"
                onClick={() => handleStartDirectWithMember(selectedProfilePreview)}
                className="w-full py-2.5 rounded-xl bg-[#1B3B2B] hover:bg-[#11271D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message {selectedProfilePreview.name} Individually</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
