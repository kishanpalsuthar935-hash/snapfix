export type CurrencyCode = 'INR' | 'GBP' | 'EUR' | 'AED' | 'CAD' | 'AUD' | 'USD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  country: string;
  flag: string;
  monthlyPrice: number;
  annualPrice: number;
  monthlyFormatted: string;
  annualFormatted: string;
  baseUsdMonthly: number;
  baseUsdAnnual: number;
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    country: 'India',
    flag: '🇮🇳',
    monthlyPrice: 2500,
    annualPrice: 16800,
    monthlyFormatted: '₹2,500',
    annualFormatted: '₹16,800',
    baseUsdMonthly: 30,
    baseUsdAnnual: 200,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    country: 'United Kingdom',
    flag: '🇬🇧',
    monthlyPrice: 24,
    annualPrice: 160,
    monthlyFormatted: '£24',
    annualFormatted: '£160',
    baseUsdMonthly: 30,
    baseUsdAnnual: 200,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    country: 'Europe',
    flag: '🇪🇺',
    monthlyPrice: 28,
    annualPrice: 185,
    monthlyFormatted: '€28',
    annualFormatted: '€185',
    baseUsdMonthly: 30,
    baseUsdAnnual: 200,
  },
  AED: {
    code: 'AED',
    symbol: 'AED ',
    name: 'UAE Dirham',
    country: 'UAE',
    flag: '🇦🇪',
    monthlyPrice: 110,
    annualPrice: 735,
    monthlyFormatted: '110 AED',
    annualFormatted: '735 AED',
    baseUsdMonthly: 30,
    baseUsdAnnual: 200,
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$ ',
    name: 'Canadian Dollar',
    country: 'Canada',
    flag: '🇨🇦',
    monthlyPrice: 40,
    annualPrice: 270,
    monthlyFormatted: 'CA$ 40',
    annualFormatted: 'CA$ 270',
    baseUsdMonthly: 30,
    baseUsdAnnual: 200,
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$ ',
    name: 'Australian Dollar',
    country: 'Australia',
    flag: '🇦🇺',
    monthlyPrice: 45,
    annualPrice: 300,
    monthlyFormatted: 'A$ 45',
    annualFormatted: 'A$ 300',
    baseUsdMonthly: 30,
    baseUsdAnnual: 200,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    country: 'USA / Others',
    flag: '🇺🇸',
    monthlyPrice: 30,
    annualPrice: 200,
    monthlyFormatted: '$30',
    annualFormatted: '$200',
    baseUsdMonthly: 30,
    baseUsdAnnual: 200,
  },
};

const STORAGE_KEY = 'vunix_user_currency';
const USER_OVERRIDE_KEY = 'vunix_currency_manual_override';

export interface DetectionResult {
  currency: CurrencyCode;
  config: CurrencyConfig;
  detectedCountry: string;
  detectedZone: string;
  isAutoDetected: boolean;
}

/**
 * Automatically detects the user's country and native currency using browser timezone and locale.
 */
export function detectUserCurrency(): DetectionResult {
  let tz = '';
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  } catch {
    tz = '';
  }

  const nav = typeof navigator !== 'undefined' ? navigator : null;
  const locale = (
    (nav?.language || (nav?.languages && nav?.languages[0]) || '')
  ).toLowerCase();

  // 1. India (Asia/Kolkata, Calcutta, etc.)
  if (
    tz.includes('Kolkata') ||
    tz.includes('Calcutta') ||
    tz === 'IST' ||
    locale.endsWith('-in') ||
    locale.startsWith('hi') ||
    locale.startsWith('ta') ||
    locale.startsWith('te') ||
    locale.startsWith('bn') ||
    locale.startsWith('gu') ||
    locale.startsWith('mr') ||
    locale.startsWith('pa')
  ) {
    return {
      currency: 'INR',
      config: SUPPORTED_CURRENCIES.INR,
      detectedCountry: 'India',
      detectedZone: tz || 'Asia/Kolkata',
      isAutoDetected: true,
    };
  }

  // 2. UK (GBP)
  if (
    tz.includes('London') ||
    tz.includes('Belfast') ||
    tz.includes('Jersey') ||
    tz.includes('Guernsey') ||
    tz.includes('Isle_of_Man') ||
    locale === 'en-gb'
  ) {
    return {
      currency: 'GBP',
      config: SUPPORTED_CURRENCIES.GBP,
      detectedCountry: 'United Kingdom',
      detectedZone: tz || 'Europe/London',
      isAutoDetected: true,
    };
  }

  // 3. UAE (AED)
  if (
    tz.includes('Dubai') ||
    tz.includes('Abu_Dhabi') ||
    tz.includes('Muscat') ||
    locale.endsWith('-ae') ||
    locale.startsWith('ar-ae')
  ) {
    return {
      currency: 'AED',
      config: SUPPORTED_CURRENCIES.AED,
      detectedCountry: 'UAE',
      detectedZone: tz || 'Asia/Dubai',
      isAutoDetected: true,
    };
  }

  // 4. Canada (CAD)
  const canadaZones = [
    'Toronto',
    'Vancouver',
    'Montreal',
    'Edmonton',
    'Calgary',
    'Winnipeg',
    'Halifax',
    'St_Johns',
    'Regina',
    'Yellowknife',
  ];
  if (
    canadaZones.some((z) => tz.includes(z)) ||
    locale === 'en-ca' ||
    locale === 'fr-ca'
  ) {
    return {
      currency: 'CAD',
      config: SUPPORTED_CURRENCIES.CAD,
      detectedCountry: 'Canada',
      detectedZone: tz || 'America/Toronto',
      isAutoDetected: true,
    };
  }

  // 5. Australia (AUD)
  if (tz.startsWith('Australia/') || locale === 'en-au') {
    return {
      currency: 'AUD',
      config: SUPPORTED_CURRENCIES.AUD,
      detectedCountry: 'Australia',
      detectedZone: tz || 'Australia/Sydney',
      isAutoDetected: true,
    };
  }

  // 6. Europe (EUR)
  const euroLocales = ['-de', '-fr', '-it', '-es', '-nl', '-be', '-at', '-ie', '-fi', '-gr', '-pt'];
  if (
    (tz.startsWith('Europe/') && !tz.includes('London')) ||
    euroLocales.some((l) => locale.endsWith(l))
  ) {
    return {
      currency: 'EUR',
      config: SUPPORTED_CURRENCIES.EUR,
      detectedCountry: 'Europe',
      detectedZone: tz || 'Europe/Paris',
      isAutoDetected: true,
    };
  }

  // 7. USA & Default (USD)
  return {
    currency: 'USD',
    config: SUPPORTED_CURRENCIES.USD,
    detectedCountry: 'United States',
    detectedZone: tz || 'America/New_York',
    isAutoDetected: true,
  };
}

/**
 * Gets currently saved currency from localStorage, or runs auto-detection if none exists.
 */
export function getActiveCurrency(): CurrencyConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
    if (saved && SUPPORTED_CURRENCIES[saved]) {
      return SUPPORTED_CURRENCIES[saved];
    }
  } catch {
    // ignore
  }

  const detected = detectUserCurrency();
  try {
    localStorage.setItem(STORAGE_KEY, detected.currency);
  } catch {
    // ignore
  }
  return detected.config;
}

/**
 * Manually changes the currency and persists choice in localStorage.
 */
export function setManualCurrency(currencyCode: CurrencyCode): CurrencyConfig {
  const config = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.USD;
  try {
    localStorage.setItem(STORAGE_KEY, config.code);
    localStorage.setItem(USER_OVERRIDE_KEY, 'true');
  } catch {
    // ignore
  }
  return config;
}

/**
 * Re-detects on user sign-in unless user has explicitly chosen an override.
 */
export function syncCurrencyOnSignIn(): CurrencyConfig {
  try {
    const isOverridden = localStorage.getItem(USER_OVERRIDE_KEY) === 'true';
    if (isOverridden) {
      const saved = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
      if (saved && SUPPORTED_CURRENCIES[saved]) {
        return SUPPORTED_CURRENCIES[saved];
      }
    }
  } catch {
    // ignore
  }

  const detected = detectUserCurrency();
  try {
    localStorage.setItem(STORAGE_KEY, detected.currency);
  } catch {
    // ignore
  }
  return detected.config;
}
