import React, { useState, useEffect, useRef } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  X,
  Send,
  Headphones,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';

interface HumanSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HumanSupportModal: React.FC<HumanSupportModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    humanChatMessages,
    sendHumanSupportChatMessage,
    isHumanTyping,
    settings,
    t,
  } = usePlatform();

  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, humanChatMessages, isHumanTyping]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isSending) return;

    setInputMessage('');
    setIsSending(true);
    try {
      await sendHumanSupportChatMessage(text);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    '💳 Verify My Deposit',
    '🌾 60-Day Enterprise Plan (320% ROI)',
    '💼 Large Allocation > £1,000,000',
    '🏦 How do withdrawals work?',
    '📍 European facility bio-security',
  ];

  const adminEmail = settings?.adminEmail || 'foodcriticdan@gmail.com';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full h-[620px] max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#E5E3D8] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Chat Header */}
        <div className="p-3.5 sm:p-5 bg-[#11271D] text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1B3B2B] border-2 border-[#C5A059] flex items-center justify-center text-[#C5A059] font-bold text-sm shadow-xs">
                <span>EV</span>
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#11271D] animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-white">Elena Vance</h3>
                <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                  {t.navOperationsDesk || 'Operations Desk'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-white/75 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Active Now · Executive Team Desk</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label={t.closeModal || 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Admin Dispatch Info Ribbon */}
        <div className="px-3 sm:px-4 py-2 bg-[#FAF9F5] border-b border-[#E5E3D8] text-[10px] sm:text-[11px] text-[#5C6572] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
            <span className="truncate">
              Dispatched directly to lead desk: <strong className="text-[#1B3B2B]">admin@birdgrow.net</strong>
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase shrink-0 ml-1">
            Encrypted
          </span>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 p-3.5 sm:p-5 overflow-y-auto space-y-3 bg-[#F7F6F2]">
          {humanChatMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-[#1B3B2B] border border-[#C5A059] flex items-center justify-center text-[#C5A059] font-bold text-[10px] shrink-0">
                    <span>EV</span>
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 sm:p-3.5 text-xs shadow-xs transition-all ${
                    isUser
                      ? 'bg-[#1B3B2B] text-white rounded-br-xs'
                      : 'bg-white text-[#1B3B2B] border border-[#E5E3D8] rounded-bl-xs'
                  }`}
                >
                  {!isUser && (
                    <div className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider mb-1 flex items-center gap-1">
                      <span>Elena Vance · Operations Desk</span>
                      <Sparkles className="w-2.5 h-2.5" />
                    </div>
                  )}

                  <p className="leading-relaxed whitespace-pre-wrap text-xs sm:text-[13px]">{msg.text}</p>

                  <div
                    className={`text-[9px] mt-1.5 flex items-center justify-end gap-1 ${
                      isUser ? 'text-white/60' : 'text-[#7C887E]'
                    }`}
                  >
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isUser && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isHumanTyping && (
            <div className="flex items-end gap-2 justify-start animate-in fade-in duration-150">
              <div className="w-7 h-7 rounded-full bg-[#1B3B2B] border border-[#C5A059] flex items-center justify-center text-[#C5A059] font-bold text-[10px] shrink-0">
                <span>EV</span>
              </div>
              <div className="bg-white border border-[#E5E3D8] rounded-2xl rounded-bl-xs px-4 py-2.5 text-xs text-[#5C6572] flex items-center gap-2 shadow-xs">
                <span className="text-[11px] font-medium text-[#1B3B2B]">Elena is typing</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1B3B2B] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1B3B2B] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1B3B2B] animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 sm:px-4 bg-[#FAF9F5] border-t border-[#E5E3D8] overflow-x-auto flex items-center gap-1.5 no-scrollbar shrink-0">
          <span className="text-[10px] font-bold text-[#5C6572] uppercase shrink-0 mr-1">Quick:</span>
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSend(prompt)}
              className="min-h-[32px] text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-[#F0EFEA] text-[#1B3B2B] border border-[#DCDAD0] font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-2xs hover:border-[#1B3B2B]"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-2.5 sm:p-4 bg-white border-t border-[#E5E3D8] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message to Elena (Operations Desk)..."
                className="w-full min-h-[44px] pl-3.5 pr-10 py-2.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs sm:text-sm text-[#1B3B2B] placeholder:text-[#7C887E] focus:outline-none focus:border-[#1B3B2B]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#7C887E] hidden sm:inline">
                ↵ Enter
              </span>
            </div>

            <button
              type="submit"
              disabled={!inputMessage.trim() || isSending}
              className="min-w-[44px] min-h-[44px] p-2.5 bg-[#1B3B2B] hover:bg-[#11271D] disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer shadow-xs shrink-0 flex items-center justify-center"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4 text-[#C5A059]" />
            </button>
          </form>

          <div className="text-[10px] text-[#7C887E] text-center pt-2 flex items-center justify-center gap-2">
            <span>🔒 Bank-grade encrypted channel</span>
            <span>·</span>
            <span>Real human operations staff</span>
          </div>
        </div>

      </div>
    </div>
  );
};
