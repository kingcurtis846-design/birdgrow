import React, { useState, useEffect } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { formatRawCurrency } from '../../lib/formatters';
import { CRYPTO_DEPOSIT_ACCOUNTS } from '../../lib/mockData';
import { CryptoCoin } from '../../types';
import {
  X,
  Copy,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  QrCode,
  AlertCircle,
  Coins,
  ChevronDown,
} from 'lucide-react';

const DEPOSIT_NETWORKS: Record<CryptoCoin, { label: string; value: string; feeTag: string }[]> = {
  USDT: [
    { label: 'TRC-20 (Tron) · Recommended', value: 'TRC-20 (Tron)', feeTag: 'Fast · Lowest Fee' },
    { label: 'ERC-20 (Ethereum Mainnet)', value: 'ERC-20 (Ethereum)', feeTag: 'Ethereum L1' },
  ],
  USDC: [
    { label: 'ERC-20 (Ethereum Mainnet)', value: 'ERC-20 (Ethereum)', feeTag: 'Standard Mainnet' },
    { label: 'TRC-20 (Tron Network)', value: 'TRC-20 (Tron)', feeTag: 'Fast Settlement' },
  ],
  BTC: [
    { label: 'Native SegWit (Bech32)', value: 'Native Bitcoin (SegWit)', feeTag: 'On-Chain' },
  ],
  ETH: [
    { label: 'ERC-20 (Ethereum Mainnet)', value: 'Ethereum (ERC-20)', feeTag: 'Mainnet' },
  ],
};

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: number;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, initialAmount }) => {
  const { deposit, settings, currency, formatCurrentCurrency, formatRawCurrency, currencySymbol, convertAmount, t } = usePlatform();

  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin>('USDT');
  const [selectedNetwork, setSelectedNetwork] = useState(DEPOSIT_NETWORKS.USDT[0].value);

  // Currency-aware presets
  const activePresets = currency === 'GBP'
    ? [425, 850, 4250, 21250]
    : currency === 'USD'
    ? [500, 1000, 5000, 25000]
    : currency === 'JPY'
    ? [80000, 160000, 800000, 4000000]
    : [500, 1000, 5000, 25000];

  const [amount, setAmount] = useState<number>(() => {
    if (initialAmount && initialAmount > 0) return initialAmount;
    return activePresets[1];
  });

  const [txHash, setTxHash] = useState('');
  const [showQr, setShowQr] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Synchronize when initialAmount is passed from insufficient balance click
  useEffect(() => {
    if (isOpen) {
      if (initialAmount && initialAmount > 0) {
        setAmount(initialAmount);
      } else {
        setAmount(activePresets[1]);
      }
      setFeedback(null);
    }
  }, [isOpen, initialAmount, currency]);

  if (!isOpen) return null;

  const activeCrypto = CRYPTO_DEPOSIT_ACCOUNTS[selectedCoin];

  const isUsdtErc20 = selectedCoin === 'USDT' && selectedNetwork.includes('ERC-20');
  const customAddress =
    selectedCoin === 'USDT'
      ? isUsdtErc20
        ? settings?.cryptoAddresses?.USDT_ERC20 || settings?.cryptoAddresses?.USDT
        : settings?.cryptoAddresses?.USDT
      : settings?.cryptoAddresses?.[selectedCoin];

  const depositAddress =
    customAddress ||
    (selectedCoin === 'USDT'
      ? isUsdtErc20
        ? (activeCrypto as any).secondaryAddress || activeCrypto.address
        : activeCrypto.address
      : activeCrypto.address);

  // Real, scannable QR Code image URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    depositAddress
  )}&bgcolor=FFFFFF&color=11271D&margin=2`;

  // Calculate crypto equivalent based on active currency
  const amountInEur = currency === 'EUR' ? amount : amount / (currency === 'GBP' ? 0.85 : currency === 'USD' ? 1.08 : 165.5);
  const cryptoAmount = (amountInEur / activeCrypto.rateEur).toFixed(
    selectedCoin === 'BTC' ? 6 : selectedCoin === 'ETH' ? 4 : 2
  );

  const isExceedingMillion = amount > 1000000;
  const adminEmail = settings?.adminEmail || 'compliance@birdgrow.eu';

  const handleCoinChange = (coin: CryptoCoin) => {
    setSelectedCoin(coin);
    setSelectedNetwork(DEPOSIT_NETWORKS[coin][0].value);
    setFeedback(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleConfirmDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setFeedback({ type: 'error', message: 'Please enter a valid deposit amount.' });
      return;
    }

    setIsProcessing(true);
    setFeedback(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const res = await deposit(
        amount,
        'crypto',
        {
          cryptoCoin: selectedCoin,
          network: selectedNetwork,
          cryptoAmount,
          depositAddress,
          txHash: txHash || `0x${Math.random().toString(16).substring(2, 18)}${Math.random().toString(16).substring(2, 18)}`,
        },
        true // isAmountInActiveCurrency = true
      );

      if (res.success) {
        setFeedback({
          type: 'success',
          message: `${formatRawCurrency(amount)} (~${cryptoAmount} ${selectedCoin}) registered! Wallet balance updates upon on-chain confirmation.`,
        });
        setTimeout(() => {
          onClose();
        }, 1800);
      } else {
        setFeedback({ type: 'error', message: res.message || 'Deposit confirmation failed' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Deposit processing error' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full border border-[#E5E3D8] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-4 py-3 bg-[#11271D] text-white flex items-center justify-between border-b border-[#244E39]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C5A059] text-[#11271D] flex items-center justify-center font-bold shrink-0">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white leading-tight">Deposit Capital</div>
              <div className="text-[10px] text-white/70">Instant Blockchain Transfer · Zero Platform Fee</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleConfirmDeposit} className="p-4 space-y-3">
          
          {feedback && (
            <div
              className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="leading-snug">{feedback.message}</span>
            </div>
          )}

          {/* Asset & Network Selectors */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-[#1B3B2B] mb-1">
                Cryptocurrency
              </label>
              <div className="relative">
                <select
                  value={selectedCoin}
                  onChange={(e) => handleCoinChange(e.target.value as CryptoCoin)}
                  className="w-full h-9 pl-2.5 pr-7 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs font-bold text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B] appearance-none cursor-pointer"
                >
                  <option value="USDT">USDT · Tether</option>
                  <option value="USDC">USDC · USD Coin</option>
                  <option value="BTC">BTC · Bitcoin</option>
                  <option value="ETH">ETH · Ethereum</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#5C6572] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#1B3B2B] mb-1">
                Network Chain
              </label>
              <div className="relative">
                <select
                  value={selectedNetwork}
                  onChange={(e) => setSelectedNetwork(e.target.value)}
                  className="w-full h-9 pl-2.5 pr-7 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs font-semibold text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B] appearance-none cursor-pointer truncate"
                >
                  {DEPOSIT_NETWORKS[selectedCoin].map((net) => (
                    <option key={net.value} value={net.value}>
                      {net.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#5C6572] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Deposit Address Box with Real QR Code Scanner */}
          <div className="p-3 bg-[#F7F6F2] rounded-xl border border-[#E5E3D8] space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#1B3B2B]">
                Official {selectedCoin} Deposit Address:
              </span>
              <button
                type="button"
                onClick={() => setShowQr(!showQr)}
                className="text-[10px] text-[#C5A059] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <QrCode className="w-3 h-3" />
                <span>{showQr ? 'Hide QR' : 'Show QR'}</span>
              </button>
            </div>

            {/* Address Display & Copy Button */}
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-[#DCDAD0]">
              <span className="font-mono text-xs text-[#1B3B2B] break-all flex-1 select-all font-semibold">
                {depositAddress}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="h-7 px-2.5 bg-[#1B3B2B] hover:bg-[#11271D] text-white rounded-md text-[11px] font-bold transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
              >
                {copiedAddress ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedAddress ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* LIVE WORKING QR CODE SCANNER */}
            {showQr && (
              <div className="p-3 bg-white rounded-xl border border-[#DCDAD0] flex flex-col items-center justify-center gap-2 animate-in fade-in zoom-in-95 duration-150">
                <img
                  src={qrCodeUrl}
                  alt={`Scan ${selectedCoin} Deposit Address`}
                  className="w-36 h-36 rounded-lg border border-[#E5E3D8] p-1 shadow-sm"
                />
                <span className="text-[10px] text-[#5C6572] font-mono text-center">
                  Scan from mobile wallet to transfer {selectedCoin} ({selectedNetwork})
                </span>
              </div>
            )}
          </div>

          {/* Allocation Amount - 100% IN SYNC WITH PRESETS */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-[#1B3B2B] text-xs">
                Allocation Amount ({currencySymbol})
              </label>
              <span className="text-[11px] font-mono font-semibold text-[#16A34A] bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                ≈ {cryptoAmount} {selectedCoin}
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#5C6572]">
                {currencySymbol}
              </span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={amount === 0 ? '' : amount}
                placeholder="Enter deposit amount"
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  const stripped = raw.replace(/^0+/, '');
                  if (stripped === '') {
                    setAmount(0);
                    return;
                  }
                  setAmount(parseInt(stripped, 10));
                }}
                className={`w-full h-10 pl-7 pr-3 bg-[#F7F6F2] border rounded-xl text-base font-bold font-mono text-[#1B3B2B] focus:outline-none tabular-nums transition-colors ${
                  isExceedingMillion ? 'border-amber-400 bg-amber-50/20' : 'border-[#DCDAD0] focus:border-[#1B3B2B]'
                }`}
              />
            </div>

            {/* Quick Presets Sync Directly with Input Box */}
            <div className="flex items-center gap-1.5 pt-0.5">
              {activePresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  className={`flex-1 py-1 rounded-md text-[11px] font-semibold border transition-colors cursor-pointer text-center ${
                    amount === preset
                      ? 'bg-[#1B3B2B] text-white border-[#1B3B2B]'
                      : 'bg-[#F0EFEA] hover:bg-[#E5E3D8] text-[#1B3B2B] border-transparent'
                  }`}
                >
                  +{currencySymbol}{preset.toLocaleString()}
                </button>
              ))}
            </div>

            {isExceedingMillion && (
              <div className="p-2 bg-amber-50 rounded-lg border border-amber-300 text-[11px] text-amber-900 flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <span>For allocations &gt; {currencySymbol}1,000,000, contact <strong className="underline">{adminEmail}</strong> for dedicated OTC escrow.</span>
              </div>
            )}
          </div>

          {/* Optional Tx Hash */}
          <div>
            <label className="text-[11px] font-bold text-[#1B3B2B] block mb-1">
              Transaction Hash / TxID <span className="font-normal text-gray-500">(Optional)</span>
            </label>
            <input
              type="text"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value.trim())}
              placeholder="e.g. 0x4a5e1e4baab89f3a32518a88c31bc87f6..."
              className="w-full h-8 px-2.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs font-mono text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing || amount <= 0}
            className="w-full h-11 bg-[#1B3B2B] hover:bg-[#11271D] disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-99"
          >
            {isProcessing ? (
              <span>Confirming Deposit...</span>
            ) : (
              <>
                <span>Confirm Deposit of {currencySymbol}{amount.toLocaleString()} (~{cryptoAmount} {selectedCoin})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          <div className="text-[10px] text-[#6E7B74] flex items-center justify-center gap-1 text-center pt-0.5">
            <ShieldCheck className="w-3 h-3 text-[#16A34A] shrink-0" />
            <span>Audited Multi-Signature Custody · Monitored by Executive Operations Desk</span>
          </div>

        </form>

      </div>
    </div>
  );
};