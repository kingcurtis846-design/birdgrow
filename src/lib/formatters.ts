/**
 * European Agricultural Fintech Formatters with Multi-currency & Multi-language Localization
 */
import { Language, Currency } from '../types';

export const MOCK_EXCHANGE_RATES: Record<Currency, number> = {
  EUR: 1.0,    // Native base platform currency (€ Euro)
  USD: 1.09,   // $1.09 per €1.00
  GBP: 0.85,   // £0.85 per €1.00
  JPY: 160.0,  // ¥160 per €1.00
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  JPY: '¥',
};

export const CURRENCY_NAMES: Record<Currency, string> = {
  EUR: 'Euro (EUR €) · Native',
  USD: 'US Dollar (USD $)',
  GBP: 'British Pound (GBP £)',
  JPY: 'Japanese Yen (JPY ¥)',
};

let currentActiveCurrency: Currency = 'EUR';

export const setActiveCurrency = (curr: Currency) => {
  currentActiveCurrency = curr;
};

export const getActiveCurrency = (): Currency => {
  return currentActiveCurrency;
};

export const getCurrencySymbol = (currency?: Currency): string => {
  return CURRENCY_SYMBOLS[currency || currentActiveCurrency] || '€';
};

export const convertBaseAmount = (amountInBase: number, currency: Currency = currentActiveCurrency): number => {
  const rate = MOCK_EXCHANGE_RATES[currency] || 1.0;
  return Math.round(amountInBase * rate * 100) / 100;
};
export const convertGbpAmount = convertBaseAmount; // backwards compatibility

export const convertToBase = (amountInCurrency: number, fromCurrency: Currency = currentActiveCurrency): number => {
  const rate = MOCK_EXCHANGE_RATES[fromCurrency] || 1.0;
  return Math.round((amountInCurrency / rate) * 100) / 100;
};
export const convertToGbp = convertToBase; // backwards compatibility

/**
 * Formats a value that is ALREADY in the target currency (no rate multiplication).
 * Use this when displaying user input or calculations based on active currency.
 */
export const formatRawCurrency = (
  amountInCurrency: number,
  currency: Currency = currentActiveCurrency,
  showCents: boolean = true,
  lang: Language = 'en'
): string => {
  const locales: Record<Currency, string> = {
  EUR: lang === 'de' ? 'de-DE' : lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-IE',
  USD: 'en-US',
  GBP: 'en-GB',
  JPY: 'ja-JP',
};

  return new Intl.NumberFormat(locales[currency] || 'en-IE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(amountInCurrency);
};

export const formatCurrencyCompact = (
  amountInBase: number,
  currency: Currency = currentActiveCurrency,
  lang: Language = 'en'
): string => {
  const converted = convertBaseAmount(amountInBase, currency);
  const sym = CURRENCY_SYMBOLS[currency] || '€';
  if (converted >= 1_000_000) {
    const val = (converted / 1_000_000).toFixed(converted % 1_000_000 === 0 ? 0 : 2).replace(/\.00$/, '').replace(/(\.[1-9])0$/, '$1');
    return `${sym}${val}M`;
  }
  if (converted >= 1_000) {
    const val = (converted / 1_000).toFixed(converted % 1_000 === 0 ? 0 : 0);
    return `${sym}${val}K`;
  }
  return formatCurrency(amountInBase, currency, false, lang);
};

export const formatCurrency = (
  amountInBase: number,
  currency: Currency = currentActiveCurrency,
  showCents: boolean = true,
  lang: Language = 'en'
): string => {
  const converted = convertBaseAmount(amountInBase, currency);
  return formatRawCurrency(converted, currency, showCents, lang);
};

export const formatEuro = (
  amount: number,
  showCents: boolean = true,
  lang: Language = 'en',
  currency?: Currency
): string => {
  if (currency === 'EUR') {
    return formatRawCurrency(amount, 'EUR', showCents, lang);
  }
  return formatCurrency(amount, currency || currentActiveCurrency, showCents, lang);
};

export const formatDate = (dateStr: string | Date, lang: Language = 'en'): string => {
  if (!dateStr) return '—';
  const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  const locales: Record<Language, string> = {
    en: 'en-GB',
    de: 'de-DE',
    fr: 'fr-FR',
    es: 'es-ES',
  };
  return new Intl.DateTimeFormat(locales[lang] || 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
};

export const formatShortDate = (dateStr: string | Date, lang: Language = 'en'): string => {
  if (!dateStr) return '—';
  const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  const locales: Record<Language, string> = {
    en: 'en-GB',
    de: 'de-DE',
    fr: 'fr-FR',
    es: 'es-ES',
  };
  return new Intl.DateTimeFormat(locales[lang] || 'en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(d);
};

export const formatIBAN = (iban: string): string => {
  const cleaned = iban.replace(/\s+/g, '').toUpperCase();
  return cleaned.replace(/(.{4})/g, '$1 ').trim();
};

export const maskIBAN = (iban: string): string => {
  const cleaned = iban.replace(/\s+/g, '').toUpperCase();
  if (cleaned.length < 8) return cleaned;
  const start = cleaned.slice(0, 4);
  const end = cleaned.slice(-4);
  return `${start} •••• •••• ${end}`;
};

export const maskCryptoAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}••••${address.slice(-4)}`;
};

export const calculateDaysRemaining = (maturityDateStr: string): number => {
  const now = new Date().getTime();
  const target = new Date(maturityDateStr).getTime();
  const diffMs = target - now;
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
};

export const calculateCycleProgress = (startDateStr: string, maturityDateStr: string): number => {
  const start = new Date(startDateStr).getTime();
  const target = new Date(maturityDateStr).getTime();
  const now = new Date().getTime();
  if (now <= start) return 0;
  if (now >= target) return 100;
  const total = target - start;
  const elapsed = now - start;
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
};
