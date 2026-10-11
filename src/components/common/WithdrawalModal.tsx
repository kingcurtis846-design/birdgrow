import React, { useState, useEffect } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { convertGbpAmount, formatRawCurrency } from '../../lib/formatters';
import { CryptoCoin } from '../../types';
import {
  X,
  CheckCircle2,
  ArrowRight,
  Lock,
  Bitcoin,
  AlertCircle,
  ChevronDown,
  Bookmark,
  Plus,
  Trash2,
  Check,
  ShieldCheck,
} from 'lucide-react';

export interface SavedCryptoAddress {
  id: string;
  label: string;
  coin: CryptoCoin;
  network: string;
  address: string;
  isDefault?: boolean;
}

const DEFAULT_SAVED_ADDRESSES: SavedCryptoAddress[] = [
];

const COIN_CONFIG: Record<CryptoCoin, { name: string; symbol: string; networks: { label: string; value: string; fee: string }[] }> = {
  USDT: {
    name: 'Tether USD',
    symbol: 'USDT',
    networks: [
      { label: 'TRC-20 (Tron) · Recommended', value: 'TRC-20 (Tron)', fee: 'Lowest Gas Fee · Fast' },
      { label: 'ERC-20 (Ethereum Mainnet)', value: 'ERC-20 (Ethereum)', fee: 'Ethereum Network' },
    ],
  },
  USDC: {
    name: 'USD Coin',
    symbol: 'USDC',
    networks: [
      { label: 'ERC-20 (Ethereum Mainnet)', value: 'ERC-20 (Ethereum)', fee: 'Ethereum Network' },
      { label: 'TRC-20 (Tron Network)', value: 'TRC-20 (Tron)', fee: 'Fast Settlement' },
    ],
  },
  BTC: {
    name: 'Bitcoin',
    symbol: 'BTC',
    networks: [
      { label: 'Native SegWit (Bech32) · Recommended', value: 'Native Bitcoin (SegWit)', fee: 'Standard On-Chain' },
      { label: 'Legacy Bitcoin (P2PKH)', value: 'Bitcoin (Legacy P2PKH)', fee: 'Legacy Format' },
    ],
  },
  ETH: {
    name: 'Ethereum',
    symbol: 'ETH',
    networks: [
      { label: 'ERC-20 (Ethereum Mainnet)', value: 'Ethereum (ERC-20)', fee: 'Ethereum L1' },
      { label: 'Arbitrum One (L2 Low Gas)', value: 'Arbitrum One (L2)', fee: 'L2 Rollup' },
    ],
  },
};

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenKyc: () => void;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ isOpen, onClose, onOpenKyc }) => {
  const {
    currentWallet,
    currentUser,
    requestWithdrawal,
    settings,
    currency,
    currencySymbol,
    formatCurrentCurrency,
  } = usePlatform();

  // Storage key for per-user saved addresses
  const storageKey = `birdgrow_address_book_${currentUser?.user_id || 'usr-investor-01'}`;

  // Saved Addresses state
  const [savedAddresses, setSavedAddresses] = useState<SavedCryptoAddress[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : DEFAULT_SAVED_ADDRESSES;
    } catch {
      return DEFAULT_SAVED_ADDRESSES;
    }
  });

  // Sync saved addresses to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(savedAddresses));
    } catch (e) {
      console.warn('Could not persist address book:', e);
    }
  }, [savedAddresses, storageKey]);

  // Minimum withdrawal threshold in base EUR and active currency
  const minWithdrawalBase = settings.minimumWithdrawal || 100;
  const minWithdrawalInActive = Math.round(convertGbpAmount(minWithdrawalBase, currency));

  const [amount, setAmount] = useState<number>(Math.max(minWithdrawalInActive, 500));
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin>('USDT');
  const [cryptoNetwork, setCryptoNetwork] = useState(COIN_CONFIG.USDT.networks[0].value);
  const [walletAddress, setWalletAddress] = useState('TN9qR7vK4b8wY5xM3zL1jP6sD2fH8nB4vX');

  // Address saving state
  const [saveCurrentAddress, setSaveCurrentAddress] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState('');
  const [addressSavedSuccess, setAddressSavedSuccess] = useState(false);
  const [showAddressManager, setShowAddressManager] = useState(false);

  // New address form inside address manager
  const [managerCoin, setManagerCoin] = useState<CryptoCoin>('USDT');
  const [managerNetwork, setManagerNetwork] = useState(COIN_CONFIG.USDT.networks[0].value);
  const [managerAddress, setManagerAddress] = useState('');
  const [managerLabel, setManagerLabel] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const isKycVerified = currentUser?.kyc_status === 'verified';
  const availableBalance = currentWallet?.main_balance || 0;
  const availableBalanceInActive = convertGbpAmount(availableBalance, currency);

  // Validation states
  const isBelowMinimum = amount > 0 && amount < minWithdrawalInActive;
  const isExceedingBalance = amount > availableBalanceInActive;
  const feePercent = settings.platformFeePercentage || 1.5;
  const feeAmount = Math.round(amount * (feePercent / 100) * 100) / 100;
  const netEstimated = Math.max(0, Math.round((amount - feeAmount) * 100) / 100);

  // Check if current wallet address matches an already saved address
  const matchingSavedAddress = savedAddresses.find(
    (sa) => sa.address.trim().toLowerCase() === walletAddress.trim().toLowerCase()
  );

  // Saved addresses for the currently selected cryptocurrency
  const relevantSavedAddresses = savedAddresses.filter((sa) => sa.coin === selectedCoin);

  const handleCoinChange = (coin: CryptoCoin) => {
    setSelectedCoin(coin);
    const defaultNet = COIN_CONFIG[coin].networks[0].value;
    setCryptoNetwork(defaultNet);

    // If there is a saved address for this coin, optionally pre-fill
    const matching = savedAddresses.find((sa) => sa.coin === coin);
    if (matching) {
      setWalletAddress(matching.address);
      if (matching.network) {
        setCryptoNetwork(matching.network);
      }
    }
  };

  const handleSelectSavedAddress = (addressId: string) => {
    if (addressId === 'custom') {
      setWalletAddress('');
      setSaveCurrentAddress(false);
      return;
    }
    const target = savedAddresses.find((sa) => sa.id === addressId);
    if (target) {
      setSelectedCoin(target.coin);
      setCryptoNetwork(target.network);
      setWalletAddress(target.address);
      setSaveCurrentAddress(false);
    }
  };

  const handleSaveCurrentAddressNow = () => {
    if (!walletAddress || walletAddress.trim().length < 8) return;
    const label = newAddressLabel.trim() || `${selectedCoin} (${cryptoNetwork.split(' ')[0]}) Wallet`;
    const newEntry: SavedCryptoAddress = {
      id: `addr-${Date.now()}`,
      label,
      coin: selectedCoin,
      network: cryptoNetwork,
      address: walletAddress.trim(),
    };
    setSavedAddresses((prev) => [newEntry, ...prev]);
    setSaveCurrentAddress(false);
    setNewAddressLabel('');
    setAddressSavedSuccess(true);
    setTimeout(() => setAddressSavedSuccess(false), 2500);
  };

  const handleAddAddressFromManager = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managerAddress.trim() || managerAddress.trim().length < 8) return;
    const label = managerLabel.trim() || `${managerCoin} Payout Wallet`;
    const newEntry: SavedCryptoAddress = {
      id: `addr-${Date.now()}`,
      label,
      coin: managerCoin,
      network: managerNetwork,
      address: managerAddress.trim(),
    };
    setSavedAddresses((prev) => [newEntry, ...prev]);
    setManagerAddress('');
    setManagerLabel('');
  };

  const handleDeleteSavedAddress = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!isKycVerified) {
      setFeedback({
        type: 'error',
        message: 'Identity verification (KYC) is required under European AML Directives before withdrawing.',
      });
      return;
    }

    if (amount < minWithdrawalInActive) {
      setFeedback({
        type: 'error',
        message: `Minimum withdrawal threshold is ${formatRawCurrency(minWithdrawalInActive, currency, true)} (approx. €${minWithdrawalBase.toFixed(2)}).`,
      });
      return;
    }

    if (amount > availableBalanceInActive) {
      setFeedback({
        type: 'error',
        message: `Requested amount (${formatRawCurrency(amount, currency, true)}) exceeds available balance (${formatRawCurrency(availableBalanceInActive, currency, true)}).`,
      });
      return;
    }

    if (!walletAddress || walletAddress.trim().length < 10) {
      setFeedback({
        type: 'error',
        message: `Please provide a valid destination wallet address.`,
      });
      return;
    }

    // Auto-save address if user checked the box
    if (saveCurrentAddress && !matchingSavedAddress) {
      const label = newAddressLabel.trim() || `${selectedCoin} (${cryptoNetwork.split(' ')[0]}) Wallet`;
      const newEntry: SavedCryptoAddress = {
        id: `addr-${Date.now()}`,
        label,
        coin: selectedCoin,
        network: cryptoNetwork,
        address: walletAddress.trim(),
      };
      setSavedAddresses((prev) => [newEntry, ...prev]);
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const destination = {
        type: 'crypto' as const,
        cryptoCoin: selectedCoin,
        network: cryptoNetwork,
        walletAddress: walletAddress.trim(),
      };

      const res = await requestWithdrawal(amount, destination, true);

      if (res.success) {
        setFeedback({
          type: 'success',
          message: `${res.message} Admin console has been notified for processing.`,
        });
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setFeedback({ type: 'error', message: res.message || 'Withdrawal failed' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error executing withdrawal' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      {/* Compact card constrained to fit comfortably without vertical scrolling */}
      <div className="bg-white rounded-2xl max-w-md w-full border border-[#E5E3D8] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Streamlined Header with Balance Pill */}
        <div className="px-4 py-3 bg-[#11271D] text-white flex items-center justify-between border-b border-[#244E39]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 text-[#C5A059] flex items-center justify-center border border-white/20 shrink-0">
              <Bitcoin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white leading-tight">Withdraw Funds</div>
              <div className="text-[10px] text-white/70">Fast Crypto Settlement · 1.5% Fee</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-[9px] uppercase tracking-wider text-white/60 font-semibold">Available</span>
              <span className="text-xs font-mono font-bold text-[#16A34A] bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                {formatCurrentCurrency(availableBalance, true)}
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* KYC Notice if unverified */}
        {!isKycVerified && (
          <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 flex items-center justify-between text-xs text-amber-900 gap-2">
            <div className="flex items-center gap-1.5 truncate">
              <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="truncate text-[11px] font-medium">KYC verification required before payout</span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenKyc();
              }}
              className="px-2.5 py-1 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-[11px] rounded-md transition-colors shrink-0 cursor-pointer"
            >
              Verify KYC
            </button>
          </div>
        )}

        {/* View Mode: Address Manager Modal Drawer */}
        {showAddressManager ? (
          <div className="p-4 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E3D8]">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#C5A059]" />
                <span className="text-xs font-extrabold text-[#1B3B2B]">Address Book ({savedAddresses.length})</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAddressManager(false)}
                className="text-[11px] font-bold text-[#1B3B2B] hover:underline cursor-pointer"
              >
                Back to Withdrawal
              </button>
            </div>

            {/* List of Saved Addresses */}
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {savedAddresses.length === 0 ? (
                <div className="text-center py-4 text-xs text-[#5C6572]">
                  No saved addresses yet. Add one below!
                </div>
              ) : (
                savedAddresses.map((sa) => (
                  <div
                    key={sa.id}
                    onClick={() => {
                      handleSelectSavedAddress(sa.id);
                      setShowAddressManager(false);
                    }}
                    className={`p-2 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      walletAddress.toLowerCase() === sa.address.toLowerCase()
                        ? 'border-[#1B3B2B] bg-[#F7F6F2]'
                        : 'border-[#E5E3D8] hover:bg-[#FAF9F5]'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#1B3B2B] truncate">{sa.label}</span>
                        <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-bold">
                          {sa.coin}
                        </span>
                        <span className="text-[9px] text-[#5C6572] truncate">{sa.network.split(' ')[0]}</span>
                      </div>
                      <div className="text-[10px] font-mono text-[#5C6572] truncate mt-0.5">
                        {sa.address}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {walletAddress.toLowerCase() === sa.address.toLowerCase() && (
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                      )}
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSavedAddress(sa.id, e)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                        title="Delete address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add New Address Form inside Manager */}
            <form onSubmit={handleAddAddressFromManager} className="pt-2 border-t border-[#E5E3D8] space-y-2">
              <span className="text-[11px] font-bold text-[#1B3B2B] block">Add New Address:</span>
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="text"
                  required
                  placeholder="Label (e.g. My Ledger)"
                  value={managerLabel}
                  onChange={(e) => setManagerLabel(e.target.value)}
                  className="h-8 px-2.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs"
                />
                <select
                  value={managerCoin}
                  onChange={(e) => {
                    const c = e.target.value as CryptoCoin;
                    setManagerCoin(c);
                    setManagerNetwork(COIN_CONFIG[c].networks[0].value);
                  }}
                  className="h-8 px-2 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs font-bold text-[#1B3B2B]"
                >
                  <option value="USDT">USDT</option>
                  <option value="USDC">USDC</option>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                </select>
              </div>
              <input
                type="text"
                required
                placeholder="Wallet Address"
                value={managerAddress}
                onChange={(e) => setManagerAddress(e.target.value.trim())}
                className="w-full h-8 px-2.5 bg-[#F7F6F2] border border-[#DCDAD0] rounded-lg text-xs font-mono"
              />
              <button
                type="submit"
                className="w-full h-8 bg-[#1B3B2B] hover:bg-[#11271D] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save to Address Book</span>
              </button>
            </form>
          </div>
        ) : (
          /* Normal Simplified Form (No up/down scrolling needed) */
          <form onSubmit={handleWithdrawalSubmit} className="p-4 space-y-3">
            
            {feedback && (
              <div
                className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="leading-snug">{feedback.message}</span>
              </div>
            )}

            {/* Amount Section with Live Minimum Threshold Warning */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-[#1B3B2B] text-xs">Withdrawal Amount</label>
                <span className="text-[11px] font-medium text-[#5C6572]">
                  Min: <strong className="text-[#1B3B2B] font-mono">{formatRawCurrency(minWithdrawalInActive, currency, true)}</strong>
                </span>
              </div>

              {/* Input with embedded Max button */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#5C6572]">
                  {currencySymbol}
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={amount === 0 ? '' : amount}
                  placeholder={`Min ${formatRawCurrency(minWithdrawalInActive, currency, true)}`}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '');
                    const stripped = raw.replace(/^0+/, '');
                    if (stripped === '') {
                      setAmount(0);
                      return;
                    }
                    setAmount(parseInt(stripped, 10));
                  }}
                  className={`w-full h-10 pl-7 pr-16 bg-[#F7F6F2] border rounded-xl text-base font-bold font-mono text-[#1B3B2B] focus:outline-none tabular-nums transition-colors ${
                    isBelowMinimum || isExceedingBalance
                      ? 'border-red-400 focus:border-red-600 bg-red-50/20'
                      : 'border-[#DCDAD0] focus:border-[#1B3B2B]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setAmount(Math.floor(availableBalanceInActive))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] font-extrabold uppercase bg-white hover:bg-[#EAE8E0] text-[#1B3B2B] rounded-md border border-[#DCDAD0] transition-colors cursor-pointer"
                >
                  Max
                </button>
              </div>

              {/* Live Minimum Threshold Display & Quick Actions */}
              {isBelowMinimum ? (
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start justify-between gap-1.5 animate-in fade-in duration-150">
                  <div className="flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <div className="leading-tight text-[11px]">
                      <strong>Below minimum withdrawal threshold!</strong>
                      <div>Minimum required: <span className="font-mono font-bold text-amber-950">{formatRawCurrency(minWithdrawalInActive, currency, true)}</span> ({formatCurrentCurrency(minWithdrawalBase, false)})</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAmount(minWithdrawalInActive)}
                    className="px-2 py-0.5 bg-amber-800 hover:bg-amber-900 text-white rounded text-[10px] font-bold shrink-0 cursor-pointer"
                  >
                    Set to Min
                  </button>
                </div>
              ) : isExceedingBalance ? (
                <div className="p-2 rounded-lg bg-red-50 border border-red-300 text-[11px] text-red-800 flex items-center gap-1.5 animate-in fade-in duration-150">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>Exceeds balance ({formatRawCurrency(availableBalanceInActive, currency, true)})</span>
                </div>
              ) : (
                /* Quick preset chips */
                <div className="flex items-center gap-1.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setAmount(minWithdrawalInActive)}
                    className="px-2 py-0.5 rounded-md bg-[#F0EFEA] hover:bg-[#E5E3D8] text-[11px] font-semibold text-[#1B3B2B] transition-colors cursor-pointer"
                  >
                    Min ({formatRawCurrency(minWithdrawalInActive, currency, true)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAmount(Math.max(minWithdrawalInActive, Math.floor(availableBalanceInActive * 0.25)))}
                    className="px-2 py-0.5 rounded-md bg-[#F0EFEA] hover:bg-[#E5E3D8] text-[11px] font-semibold text-[#1B3B2B] transition-colors cursor-pointer"
                  >
                    25%
                  </button>
                  <button
                    type="button"
                    onClick={() => setAmount(Math.max(minWithdrawalInActive, Math.floor(availableBalanceInActive * 0.5)))}
                    className="px-2 py-0.5 rounded-md bg-[#F0EFEA] hover:bg-[#E5E3D8] text-[11px] font-semibold text-[#1B3B2B] transition-colors cursor-pointer"
                  >
                    50%
                  </button>
                  <button
                    type="button"
                    onClick={() => setAmount(Math.floor(availableBalanceInActive))}
                    className="px-2 py-0.5 rounded-md bg-[#F0EFEA] hover:bg-[#E5E3D8] text-[11px] font-semibold text-[#1B3B2B] transition-colors cursor-pointer ml-auto"
                  >
                    100%
                  </button>
                </div>
              )}
            </div>

            {/* Simplified Side-by-Side Dropdowns for Asset & Network */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-[#1B3B2B] mb-1">
                  Asset
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
                    value={cryptoNetwork}
                    onChange={(e) => setCryptoNetwork(e.target.value)}
                    className="w-full h-9 pl-2.5 pr-7 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs font-semibold text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B] appearance-none cursor-pointer truncate"
                  >
                    {COIN_CONFIG[selectedCoin].networks.map((net) => (
                      <option key={net.value} value={net.value}>
                        {net.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#5C6572] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Destination Wallet Address Section with Saved Address Dropdown & Save Option */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <label className="font-bold text-[#1B3B2B]">
                  Destination {selectedCoin} Address
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddressManager(true)}
                  className="text-[10px] text-[#C5A059] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Bookmark className="w-3 h-3" />
                  <span>Address Book ({savedAddresses.length})</span>
                </button>
              </div>

              {/* Saved Address Quick Selector Dropdown */}
              <div className="relative">
                <select
                  value={matchingSavedAddress ? matchingSavedAddress.id : 'custom'}
                  onChange={(e) => handleSelectSavedAddress(e.target.value)}
                  className="w-full h-7 pl-2 pr-7 bg-white border border-[#DCDAD0] rounded-lg text-[11px] font-medium text-[#1B3B2B] appearance-none cursor-pointer mb-1 truncate"
                >
                  {relevantSavedAddresses.map((sa) => (
                    <option key={sa.id} value={sa.id}>
                      Saved: {sa.label} ({sa.address.slice(0, 6)}...{sa.address.slice(-4)})
                    </option>
                  ))}
                  {savedAddresses
                    .filter((sa) => sa.coin !== selectedCoin)
                    .map((sa) => (
                      <option key={sa.id} value={sa.id}>
                        Saved ({sa.coin}): {sa.label} ({sa.address.slice(0, 6)}...{sa.address.slice(-4)})
                      </option>
                    ))}
                  <option value="custom">✏️ Enter custom / new address</option>
                </select>
                <ChevronDown className="w-3 h-3 text-[#5C6572] absolute right-2 top-2 pointer-events-none" />
              </div>

              {/* Address Input Field */}
              <input
                type="text"
                required
                value={walletAddress}
                onChange={(e) => {
                  setWalletAddress(e.target.value.trim());
                  setSaveCurrentAddress(false);
                }}
                placeholder={`Enter or paste destination ${selectedCoin} address`}
                className="w-full h-9 px-3 bg-[#F7F6F2] border border-[#DCDAD0] rounded-xl text-xs font-mono text-[#1B3B2B] focus:outline-none focus:border-[#1B3B2B]"
              />

              {/* Status / Save New Address Option */}
              {matchingSavedAddress ? (
                <div className="flex items-center justify-between text-[10px] text-emerald-800 font-semibold pt-0.5">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Saved Address: "{matchingSavedAddress.label}"</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddressManager(true)}
                    className="text-gray-500 hover:underline cursor-pointer"
                  >
                    Manage
                  </button>
                </div>
              ) : (
                <div className="pt-0.5 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <label className="flex items-center gap-1.5 cursor-pointer text-[#1B3B2B]">
                      <input
                        type="checkbox"
                        checked={saveCurrentAddress}
                        onChange={(e) => setSaveCurrentAddress(e.target.checked)}
                        className="rounded text-[#1B3B2B] focus:ring-0 cursor-pointer"
                      />
                      <span className="font-semibold text-[10px]">Save this address for future withdrawals</span>
                    </label>

                    {addressSavedSuccess && (
                      <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Address Saved!
                      </span>
                    )}
                  </div>

                  {saveCurrentAddress && (
                    <div className="flex items-center gap-1.5 animate-in fade-in duration-100">
                      <input
                        type="text"
                        placeholder="Address Label (e.g. My Ledger USDT)"
                        value={newAddressLabel}
                        onChange={(e) => setNewAddressLabel(e.target.value)}
                        className="flex-1 h-7 px-2 bg-white border border-[#DCDAD0] rounded-lg text-[10px]"
                      />
                      <button
                        type="button"
                        onClick={handleSaveCurrentAddressNow}
                        disabled={!walletAddress || walletAddress.length < 8}
                        className="h-7 px-2.5 bg-[#1B3B2B] hover:bg-[#11271D] disabled:opacity-50 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                      >
                        Save Now
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Ultra-compact Single-line Summary Bar */}
            <div className="px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E5E3D8] flex items-center justify-between text-xs text-[#5C6572]">
              <div>
                <span>Gross: </span>
                <strong className="text-[#1B3B2B] font-mono">{formatRawCurrency(amount, currency, true)}</strong>
              </div>
              <div>
                <span>Fee ({feePercent}%): </span>
                <strong className="text-amber-800 font-mono">-{formatRawCurrency(feeAmount, currency, true)}</strong>
              </div>
              <div className="text-right">
                <span>Net: </span>
                <strong className="text-[#16A34A] font-mono text-sm">{formatRawCurrency(netEstimated, currency, true)}</strong>
              </div>
            </div>

            {/* Smart Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !isKycVerified || amount <= 0 || isBelowMinimum || isExceedingBalance}
              className="w-full h-11 bg-[#1B3B2B] hover:bg-[#11271D] disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-99"
            >
              {isSubmitting ? (
                <span>Transmitting Request...</span>
              ) : !isKycVerified ? (
                <span>KYC Verification Required</span>
              ) : amount <= 0 ? (
                <span>Enter Amount</span>
              ) : isBelowMinimum ? (
                <span>⚠️ Below Minimum Threshold ({formatRawCurrency(minWithdrawalInActive, currency, true)})</span>
              ) : isExceedingBalance ? (
                <span>Insufficient Available Balance</span>
              ) : (
                <>
                  <span>Confirm Withdrawal · Net {formatRawCurrency(netEstimated, currency, true)}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
