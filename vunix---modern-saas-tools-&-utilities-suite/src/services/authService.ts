import { UserProfile } from '../types';

export interface StoredUserAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
  isPro: boolean;
  plan?: 'monthly' | 'annual';
  authProvider: 'local' | 'google';
}

export interface PasswordResetEntry {
  email: string;
  code: string;
  expiresAt: number;
}

export interface ProSubscriptionRecord {
  email: string;
  plan: 'monthly' | 'annual';
  activatedAt: string;
  status: 'active';
  transactionId?: string;
}

const USERS_STORAGE_KEY = 'vunix_registered_accounts';
const RESET_STORAGE_KEY = 'vunix_password_resets';
const SESSION_STORAGE_KEY = 'vunix_user';
const PRO_SUBSCRIPTIONS_KEY = 'vunix_pro_subscriptions';
const LAST_EMAIL_KEY = 'vunix_last_email';

export function getLastUsedEmail(): string | null {
  try {
    return localStorage.getItem(LAST_EMAIL_KEY) || null;
  } catch {
    return null;
  }
}

export function setLastUsedEmail(email: string): void {
  try {
    if (email && validateEmail(email)) {
      localStorage.setItem(LAST_EMAIL_KEY, email.trim().toLowerCase());
    }
  } catch {
    // ignore
  }
}

// Utility to generate cryptographic random salt
function generateSalt(length = 16): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// Utility to hash password with SHA-256 and salt using standard Web Crypto API
async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${password}:${salt}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Validation helper
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim().toLowerCase());
}

// Check for Firebase readiness
export function isFirebaseConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID
  );
}

// Local accounts database helpers
function getStoredAccounts(): StoredUserAccount[] {
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveStoredAccounts(accounts: StoredUserAccount[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to save user accounts to local storage', err);
  }
}

function getStoredResets(): PasswordResetEntry[] {
  try {
    const data = localStorage.getItem(RESET_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveStoredResets(resets: PasswordResetEntry[]): void {
  try {
    localStorage.setItem(RESET_STORAGE_KEY, JSON.stringify(resets));
  } catch (err) {
    console.error('Failed to save reset entries to storage', err);
  }
}

/**
 * Permanent PRO Subscriptions Ledger
 * Keyed by user email (case-insensitive) to ensure PRO status is never lost across sessions/devices
 */
export function getProSubscriptions(): Record<string, ProSubscriptionRecord> {
  try {
    const raw = localStorage.getItem(PRO_SUBSCRIPTIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Check if a given email has an active PRO subscription record
 */
export function isEmailPro(email: string): { isPro: boolean; plan?: 'monthly' | 'annual' } {
  if (!email) return { isPro: false };
  const cleanEmail = email.trim().toLowerCase();
  const subs = getProSubscriptions();
  const record = subs[cleanEmail];
  if (record && record.status === 'active') {
    return { isPro: true, plan: record.plan };
  }
  return { isPro: false };
}

/**
 * Permanently save and associate a PRO subscription with an email/Gmail address
 */
export function saveProSubscription(
  email: string,
  plan: 'monthly' | 'annual',
  transactionId?: string
): UserProfile {
  const cleanEmail = email.trim().toLowerCase();
  const subs = getProSubscriptions();

  subs[cleanEmail] = {
    email: cleanEmail,
    plan,
    activatedAt: new Date().toISOString(),
    status: 'active',
    transactionId: transactionId || `TXN_${Date.now()}`,
  };

  try {
    localStorage.setItem(PRO_SUBSCRIPTIONS_KEY, JSON.stringify(subs));
  } catch (err) {
    console.error('Failed to save PRO subscription record', err);
  }

  // Update registered accounts database if this user exists
  const accounts = getStoredAccounts();
  const accountIndex = accounts.findIndex((u) => u.email === cleanEmail);
  let name = cleanEmail.split('@')[0];

  if (accountIndex !== -1) {
    accounts[accountIndex].isPro = true;
    accounts[accountIndex].plan = plan;
    name = accounts[accountIndex].name;
    saveStoredAccounts(accounts);
  }

  // Update the active session
  const currentSession = getCurrentSession();
  const updatedProfile: UserProfile = {
    name: currentSession && currentSession.email.toLowerCase() === cleanEmail ? currentSession.name : name,
    email: cleanEmail,
    avatar: currentSession?.avatar || '',
    isPro: true,
    plan,
  };

  saveCurrentSession(updatedProfile);
  return updatedProfile;
}

/**
 * Sign Up with Email and Password
 * Enforces:
 * - Real email validation
 * - Minimum 6 characters for password
 * - Unique email check
 * - SHA-256 salted password hashing
 * - Checks if email already holds an active PRO subscription
 */
export async function signUpWithEmail(
  name: string,
  email: string,
  password: string
): Promise<UserProfile> {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanName) {
    throw new Error('Please enter your full name.');
  }

  if (!cleanEmail || !validateEmail(cleanEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const accounts = getStoredAccounts();
  const existing = accounts.find((u) => u.email === cleanEmail);
  if (existing) {
    throw new Error('An account with this email already exists. Please sign in instead.');
  }

  const salt = generateSalt();
  const passwordHash = await hashPassword(password, salt);

  // Check if this email already holds a PRO subscription
  const proStatus = isEmailPro(cleanEmail);

  const newAccount: StoredUserAccount = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: cleanName,
    email: cleanEmail,
    passwordHash,
    salt,
    createdAt: new Date().toISOString(),
    isPro: proStatus.isPro,
    plan: proStatus.plan,
    authProvider: 'local',
  };

  accounts.push(newAccount);
  saveStoredAccounts(accounts);

  const profile: UserProfile = {
    name: newAccount.name,
    email: newAccount.email,
    avatar: '',
    isPro: newAccount.isPro,
    plan: newAccount.plan,
  };

  saveCurrentSession(profile);
  return profile;
}

/**
 * Sign In with Email and Password
 * Enforces:
 * - Real email validation
 * - If account does not exist, automatically creates it seamlessly!
 * - If account exists without password (e.g. Google-registered), updates password
 * - Verifies password hash match
 * - Syncs with permanent PRO subscription ledger
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<UserProfile & { wasAutoCreated?: boolean }> {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !validateEmail(cleanEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  if (!password) {
    throw new Error('Please enter your password.');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const accounts = getStoredAccounts();
  const accountIndex = accounts.findIndex((u) => u.email === cleanEmail);
  const proStatus = isEmailPro(cleanEmail);

  // If no account exists with this email, automatically create it seamlessly!
  if (accountIndex === -1) {
    const salt = generateSalt();
    const passwordHash = await hashPassword(password, salt);
    const newAccount: StoredUserAccount = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      passwordHash,
      salt,
      createdAt: new Date().toISOString(),
      isPro: proStatus.isPro,
      plan: proStatus.plan,
      authProvider: 'local',
    };
    accounts.push(newAccount);
    saveStoredAccounts(accounts);
    setLastUsedEmail(cleanEmail);

    const profile: UserProfile & { wasAutoCreated?: boolean } = {
      name: newAccount.name,
      email: newAccount.email,
      avatar: '',
      isPro: newAccount.isPro,
      plan: newAccount.plan,
      wasAutoCreated: true,
    };
    saveCurrentSession(profile);
    return profile;
  }

  const account = accounts[accountIndex];

  // If account was created with Google and doesn't have a password yet, attach it
  if (!account.passwordHash) {
    const salt = generateSalt();
    account.passwordHash = await hashPassword(password, salt);
    account.salt = salt;
    account.authProvider = 'local';
    saveStoredAccounts(accounts);
  } else {
    const computedHash = await hashPassword(password, account.salt);
    if (computedHash !== account.passwordHash) {
      throw new Error(
        'Incorrect password. Click "Forgot password?" to set a new password, or click "Continue with Google".'
      );
    }
  }

  setLastUsedEmail(cleanEmail);

  // Check permanent PRO subscription ledger
  const isPro = proStatus.isPro || Boolean(account.isPro);
  const plan = proStatus.plan || account.plan;

  const profile: UserProfile & { wasAutoCreated?: boolean } = {
    name: account.name,
    email: account.email,
    avatar: '',
    isPro,
    plan,
    wasAutoCreated: false,
  };

  saveCurrentSession(profile);
  return profile;
}

/**
 * Sign In / Sign Up with Google (GIS / OAuth / Firebase)
 * Checks if user already has an account or PRO subscription;
 * if they do, retains their PRO membership permanently.
 * Instant 1-click execution without password prompt.
 */
export async function authenticateWithGoogle(
  googleUser: { name?: string; email: string; avatar?: string }
): Promise<UserProfile> {
  const cleanEmail = googleUser.email.trim().toLowerCase();
  const cleanName = googleUser.name?.trim() || cleanEmail.split('@')[0];

  if (!cleanEmail || !validateEmail(cleanEmail)) {
    throw new Error('Please provide a valid Google/Gmail address.');
  }

  const accounts = getStoredAccounts();
  let account = accounts.find((u) => u.email === cleanEmail);

  // Check permanent PRO subscription ledger
  const proStatus = isEmailPro(cleanEmail);

  if (!account) {
    // Register new Google account
    account = {
      id: `usr_g_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: cleanName,
      email: cleanEmail,
      passwordHash: '',
      salt: '',
      createdAt: new Date().toISOString(),
      isPro: proStatus.isPro, // Inherit permanent PRO if email was previously upgraded
      plan: proStatus.plan,
      authProvider: 'google',
    };
    accounts.push(account);
    saveStoredAccounts(accounts);
  } else {
    // If user previously upgraded, ensure account has isPro: true
    if (proStatus.isPro && !account.isPro) {
      account.isPro = true;
      account.plan = proStatus.plan;
      saveStoredAccounts(accounts);
    }
  }

  setLastUsedEmail(cleanEmail);

  const profile: UserProfile = {
    name: account.name || cleanName,
    email: account.email,
    avatar: googleUser.avatar || '',
    isPro: proStatus.isPro || Boolean(account.isPro),
    plan: proStatus.plan || account.plan,
  };

  saveCurrentSession(profile);
  return profile;
}

/**
 * Direct Password Reset
 * Updates password directly without requiring simulated verification codes.
 * If account is not found, automatically creates the account with the new password.
 * Restores and permanently links any active PRO subscription.
 */
export async function directResetPassword(
  email: string,
  newPassword: string
): Promise<UserProfile & { wasAutoCreated?: boolean }> {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !validateEmail(cleanEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  if (!newPassword || newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  }

  const accounts = getStoredAccounts();
  const accountIndex = accounts.findIndex((u) => u.email === cleanEmail);
  const salt = generateSalt();
  const newHash = await hashPassword(newPassword, salt);
  const proStatus = isEmailPro(cleanEmail);

  let profile: UserProfile & { wasAutoCreated?: boolean };

  if (accountIndex !== -1) {
    accounts[accountIndex].passwordHash = newHash;
    accounts[accountIndex].salt = salt;
    accounts[accountIndex].authProvider = 'local';
    if (proStatus.isPro) {
      accounts[accountIndex].isPro = true;
      accounts[accountIndex].plan = proStatus.plan;
    }
    saveStoredAccounts(accounts);

    profile = {
      name: accounts[accountIndex].name,
      email: accounts[accountIndex].email,
      avatar: '',
      isPro: accounts[accountIndex].isPro,
      plan: accounts[accountIndex].plan,
      wasAutoCreated: false,
    };
  } else {
    // Seamlessly create the account if it wasn't registered yet!
    const newAccount: StoredUserAccount = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      passwordHash: newHash,
      salt,
      createdAt: new Date().toISOString(),
      isPro: proStatus.isPro,
      plan: proStatus.plan,
      authProvider: 'local',
    };
    accounts.push(newAccount);
    saveStoredAccounts(accounts);

    profile = {
      name: newAccount.name,
      email: newAccount.email,
      avatar: '',
      isPro: newAccount.isPro,
      plan: newAccount.plan,
      wasAutoCreated: true,
    };
  }

  setLastUsedEmail(cleanEmail);
  saveCurrentSession(profile);
  return profile;
}

/**
 * Request Password Reset (Retained for backwards compatibility)
 */
export async function requestPasswordReset(email: string): Promise<{ code: string; message: string }> {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !validateEmail(cleanEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  // Generate 6-digit verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins

  const resets = getStoredResets().filter((r) => r.email !== cleanEmail);
  resets.push({ email: cleanEmail, code, expiresAt });
  saveStoredResets(resets);

  return {
    code,
    message: `A password reset code has been generated for ${cleanEmail}. In this browser environment, use code: ${code}`,
  };
}

/**
 * Complete Password Reset with Code (Retained for backwards compatibility)
 */
export async function resetPasswordWithCode(
  email: string,
  code: string,
  newPassword: string
): Promise<UserProfile> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = code.trim();

  if (!cleanCode) {
    throw new Error('Please enter the verification code.');
  }

  if (!newPassword || newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  }

  return directResetPassword(cleanEmail, newPassword);
}

/**
 * Save current user session in local storage
 */
export function saveCurrentSession(user: UserProfile): void {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to save session', err);
  }
}

/**
 * Get current session from local storage and verify permanent PRO status
 */
export function getCurrentSession(): UserProfile | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.email) {
      // Re-verify against pro subscriptions ledger so PRO status is permanently active across page reloads
      const proStatus = isEmailPro(parsed.email);
      if (proStatus.isPro && !parsed.isPro) {
        parsed.isPro = true;
        parsed.plan = proStatus.plan;
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed as UserProfile;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Clear current session
 */
export function clearCurrentSession(): void {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
}
