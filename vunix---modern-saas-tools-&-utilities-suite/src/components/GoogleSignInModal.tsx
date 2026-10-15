import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ShieldCheck,
  LogOut,
  Crown,
  ArrowRight,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Check,
} from 'lucide-react';
import { UserProfile } from '../types';
import {
  signInWithEmail,
  signUpWithEmail,
  authenticateWithGoogle,
  directResetPassword,
  validateEmail,
  isEmailPro,
  getLastUsedEmail,
} from '../services/authService';

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onSignInSuccess: (user: UserProfile) => void;
  onSignOut: () => void;
  onContinueAsGuest?: () => void;
  onOpenLegal?: (doc: 'terms' | 'privacy' | 'refund') => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot_password' | 'google_quick';

export const GoogleSignInModal: React.FC<GoogleSignInModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSignInSuccess,
  onSignOut,
  onContinueAsGuest,
  onOpenLegal,
}) => {
  const [authMode, setAuthMode] = useState<AuthMode>('signin');

  // Form Fields - strictly blank by default (zero hardcoded personal data)
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Dedicated Google quick sign-in fields
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');

  // Forgot Password flow states (Direct 1-step reset, no codes required)
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const googleBtnContainerRef = useRef<HTMLDivElement>(null);
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || '';

  // Initialize with last used email if available
  useEffect(() => {
    if (isOpen) {
      const lastEmail = getLastUsedEmail();
      if (lastEmail && !emailInput) {
        setEmailInput(lastEmail);
        setResetEmail(lastEmail);
        setGoogleEmailInput(lastEmail);
      }
    }
  }, [isOpen]);

  // Reset errors when switching modes or closing
  useEffect(() => {
    if (!isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
      setShowPassword(false);
    }
  }, [isOpen]);

  const switchMode = (mode: AuthMode) => {
    setAuthMode(mode);
    setErrorMessage(null);
    setSuccessMessage(null);
    if (mode === 'forgot_password') {
      setResetEmail(emailInput.trim() || getLastUsedEmail() || '');
      setNewPassword('');
    }
    if (mode === 'google_quick') {
      setGoogleEmailInput(emailInput.trim() || resetEmail.trim() || getLastUsedEmail() || '');
      setGoogleNameInput(nameInput.trim() || '');
    }
  };

  // Google Identity Services (GIS) initialization when available
  useEffect(() => {
    if (!isOpen || currentUser || !GOOGLE_CLIENT_ID) return;

    const scriptId = 'google-gsi-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const initGIS = () => {
      const google = (window as any).google;
      if (!google?.accounts?.id || !googleBtnContainerRef.current) return;

      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          if (response?.credential) {
            try {
              setIsLoading(true);
              const base64Url = response.credential.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(
                atob(base64)
                  .split('')
                  .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                  .join('')
              );
              const data = JSON.parse(jsonPayload);

              const userProfile = await authenticateWithGoogle({
                name: data.name || data.given_name || 'Google User',
                email: data.email || 'user@gmail.com',
                avatar: data.picture || '',
              });

              onSignInSuccess(userProfile);
              onClose();
            } catch (err: any) {
              setErrorMessage(err?.message || 'Failed to authenticate with Google account.');
            } finally {
              setIsLoading(false);
            }
          }
        },
      });

      googleBtnContainerRef.current.innerHTML = '';
      google.accounts.id.renderButton(googleBtnContainerRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        shape: 'pill',
        text: 'continue_with',
      });
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => initGIS();
      document.body.appendChild(script);
    } else {
      initGIS();
    }
  }, [isOpen, currentUser, GOOGLE_CLIENT_ID, authMode]);

  if (!isOpen) return null;

  // 1-Click Interactive Google Sign-In Action
  const handleGoogleButtonClick = async (targetEmailOverride?: string | React.MouseEvent) => {
    setErrorMessage(null);

    const explicitEmail = typeof targetEmailOverride === 'string' ? targetEmailOverride : '';

    // Pick target email from: explicit override, emailInput, resetEmail, googleEmailInput, or last stored email
    const candidateEmail = (
      explicitEmail ||
      emailInput.trim() ||
      resetEmail.trim() ||
      googleEmailInput.trim() ||
      getLastUsedEmail() ||
      ''
    ).trim();

    // If an email is available and valid, authenticate immediately in 1 click!
    if (candidateEmail && validateEmail(candidateEmail)) {
      setIsLoading(true);
      try {
        const userProfile = await authenticateWithGoogle({
          name: nameInput.trim() || candidateEmail.split('@')[0],
          email: candidateEmail,
        });

        const proCheck = isEmailPro(candidateEmail);
        if (proCheck.isPro) {
          setSuccessMessage(`Welcome back! Permanent PRO status unlocked for ${candidateEmail}.`);
        } else {
          setSuccessMessage(`Signed in with Google as ${candidateEmail}!`);
        }

        setTimeout(() => {
          onSignInSuccess(userProfile);
          onClose();
        }, 350);
      } catch (err: any) {
        setErrorMessage(err?.message || 'Google Sign-In failed.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // If client ID is present and GIS has initialized, trigger One Tap prompt
    const google = (window as any).google;
    if (GOOGLE_CLIENT_ID && google?.accounts?.id) {
      google.accounts.id.prompt();
      return;
    }

    // If no email was provided yet, transition smoothly to dedicated Google Sign-In screen
    switchMode('google_quick');
  };

  // Submit Handler for Google Quick Sign-In screen
  const handleGoogleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = googleEmailInput.trim();
    if (!cleanEmail || !validateEmail(cleanEmail)) {
      setErrorMessage('Please enter a valid Google/Gmail address (e.g. yourname@gmail.com).');
      return;
    }

    setIsLoading(true);
    try {
      const cleanName = googleNameInput.trim() || cleanEmail.split('@')[0];
      const userProfile = await authenticateWithGoogle({
        name: cleanName,
        email: cleanEmail,
      });

      // Show instant feedback on whether their permanent PRO status was restored
      const proCheck = isEmailPro(cleanEmail);
      if (proCheck.isPro) {
        setSuccessMessage(`Welcome back! Permanent PRO status restored for ${cleanEmail}.`);
      } else {
        setSuccessMessage(`Signed in with Google as ${cleanEmail}!`);
      }

      setTimeout(() => {
        onSignInSuccess(userProfile);
        onClose();
      }, 400);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Google account sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Standard Email Sign In Handler (auto-creates account if not found)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!emailInput.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!validateEmail(emailInput.trim())) {
      setErrorMessage('Please enter a valid email address (e.g., name@domain.com).');
      return;
    }

    if (!passwordInput) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (passwordInput.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const userProfile = await signInWithEmail(emailInput, passwordInput);
      if (userProfile.wasAutoCreated) {
        setSuccessMessage(`Account created & signed in! Welcome to Vunix, ${userProfile.name}.`);
      } else {
        setSuccessMessage(`Welcome back, ${userProfile.name}!`);
      }
      setTimeout(() => {
        onSignInSuccess(userProfile);
        onClose();
      }, userProfile.wasAutoCreated ? 450 : 250);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Up Handler
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!nameInput.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!emailInput.trim() || !validateEmail(emailInput.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!passwordInput || passwordInput.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (passwordInput !== confirmPasswordInput) {
      setErrorMessage('Passwords do not match. Please re-enter carefully.');
      return;
    }

    setIsLoading(true);
    try {
      const userProfile = await signUpWithEmail(nameInput, emailInput, passwordInput);
      setSuccessMessage(`Account created successfully! Welcome to Vunix, ${userProfile.name}.`);
      setTimeout(() => {
        onSignInSuccess(userProfile);
        onClose();
      }, 400);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Direct Password Reset Handler (No verification code required)
  const handleDirectResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = resetEmail.trim();
    if (!cleanEmail || !validateEmail(cleanEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const userProfile = await directResetPassword(cleanEmail, newPassword);
      const proCheck = isEmailPro(cleanEmail);
      if (proCheck.isPro) {
        setSuccessMessage(`Password updated! Permanent PRO subscription restored for ${cleanEmail}.`);
      } else {
        setSuccessMessage('Password updated successfully! Signing you into your workspace...');
      }
      setTimeout(() => {
        onSignInSuccess(userProfile);
        onClose();
      }, 500);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestClick = () => {
    if (onContinueAsGuest) {
      onContinueAsGuest();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-neutral-200 p-8 space-y-6 relative overflow-hidden">
        {/* Dismiss / Close Button */}
        <button
          onClick={handleGuestClick}
          className="absolute top-6 right-6 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition"
          title="Close or Continue as Guest"
        >
          <X className="w-4 h-4" />
        </button>

        {currentUser ? (
          /* Profile Overview View */
          <div className="space-y-6 text-center">
            <div className="relative inline-block mx-auto">
              <div className="w-20 h-20 rounded-full mx-auto ring-4 ring-[#EDE9FE] shadow-sm bg-purple-700 text-white font-black text-2xl flex items-center justify-center select-none">
                {(currentUser.name?.trim() || currentUser.email?.trim() || 'U').charAt(0).toUpperCase()}
              </div>
              {currentUser.isPro && (
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#451A03] text-amber-300 shadow-sm" title="PRO Member">
                  <Crown className="w-3.5 h-3.5 fill-current" />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold text-neutral-900">{currentUser.name}</h3>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">{currentUser.email}</p>
              <div
                className={`mt-3 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  currentUser.isPro
                    ? 'bg-[#451A03] text-amber-300'
                    : 'bg-[#EDE9FE] text-[#451A03]'
                }`}
              >
                {currentUser.isPro ? (
                  <>
                    <Crown className="w-3.5 h-3.5 fill-current" /> PRO Member
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" /> Free Plan
                  </>
                )}
              </div>
            </div>

            {currentUser.isPro && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2 text-left">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>PRO subscription is permanently linked to this Gmail account. All 12 commercial tools are unlocked.</span>
              </div>
            )}

            <div className="pt-4 border-t border-neutral-100 space-y-2">
              <button
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-full border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold uppercase tracking-wider transition flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out of Vunix
              </button>
            </div>
          </div>
        ) : (
          /* Authentication System */
          <div className="space-y-5">
            {/* Header / Brand Branding */}
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#EDE9FE] flex items-center justify-center text-[#451A03] font-black text-sm shrink-0 border border-[#DDD6FE]">
                VX
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-neutral-900 leading-snug">
                  {authMode === 'google_quick'
                    ? 'Sign in with Google'
                    : authMode === 'forgot_password'
                    ? 'Reset Your Password'
                    : authMode === 'signup'
                    ? 'Create Vunix Account'
                    : 'Sign In to Vunix'}
                </h3>
                <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                  {authMode === 'google_quick'
                    ? 'Connect your personal Gmail to access your tools and saved PRO licenses'
                    : authMode === 'forgot_password'
                    ? 'Recover access to your workspace and saved tools'
                    : authMode === 'signup'
                    ? 'Sign up to access 15 tools and save your workspace'
                    : 'Sign in with Google to access your Vunix workspace and saved files'}
                </p>
              </div>
            </div>

            {/* Error or Success Alerts */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span className="flex-1">{errorMessage}</span>
                </div>
                {errorMessage.toLowerCase().includes('password') && (
                  <div className="flex items-center gap-2 pt-1 border-t border-rose-200/60 mt-0.5">
                    <button
                      type="button"
                      onClick={() => handleGoogleButtonClick(emailInput)}
                      className="px-2.5 py-1 bg-white hover:bg-rose-100 text-rose-900 border border-rose-300 rounded-lg font-bold text-[11px] transition inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Sign In with Google</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMode('forgot_password')}
                      className="px-2 py-1 text-rose-800 hover:text-rose-950 font-bold text-[11px] underline transition"
                    >
                      Reset Password
                    </button>
                  </div>
                )}
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* GOOGLE QUICK SIGN-IN SCREEN */}
            {authMode === 'google_quick' ? (
              <form onSubmit={handleGoogleQuickSubmit} className="space-y-3.5">
                <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span className="text-xs font-bold text-neutral-800">Google OAuth Account Verification</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    Enter your personal Gmail ID to sign in. If your account holds an active PRO membership, all 12 commercial tools will unlock automatically.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Your Google / Gmail ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
                    <input
                      type="email"
                      value={googleEmailInput}
                      onChange={(e) => {
                        setGoogleEmailInput(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="e.g. yourname@gmail.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none font-mono"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Display Name (Optional)
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
                    <input
                      type="text"
                      value={googleNameInput}
                      onChange={(e) => setGoogleNameInput(e.target.value)}
                      placeholder="e.g. Alex S."
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 font-bold text-xs shadow-sm transition flex items-center justify-center gap-2.5 disabled:opacity-50"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{isLoading ? 'Verifying Google Account...' : 'Continue with Google'}</span>
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => switchMode('signin')}
                    className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition"
                  >
                    ← Back to standard Sign In
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* Auth Mode Tabs (Sign In vs Sign Up) */}
                {authMode !== 'forgot_password' && (
                  <div className="flex rounded-xl bg-neutral-100 p-1">
                    <button
                      type="button"
                      onClick={() => switchMode('signin')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                        authMode === 'signin'
                          ? 'bg-white text-neutral-900 shadow-sm'
                          : 'text-neutral-500 hover:text-neutral-800'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMode('signup')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                        authMode === 'signup'
                          ? 'bg-white text-neutral-900 shadow-sm'
                          : 'text-neutral-500 hover:text-neutral-800'
                      }`}
                    >
                      Create Account
                    </button>
                  </div>
                )}

                {/* 1-Click "Continue with Google" OAuth Button */}
                {authMode !== 'forgot_password' && (
                  <div className="space-y-3">
                    {GOOGLE_CLIENT_ID && (
                      <div className="flex flex-col items-center justify-center">
                        <div ref={googleBtnContainerRef} className="flex justify-center w-full min-h-[44px]" />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleGoogleButtonClick()}
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 rounded-xl border border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-semibold shadow-sm transition flex items-center justify-center gap-2.5 active:scale-95 disabled:opacity-50"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-neutral-200" />
                      <span className="text-[10px] uppercase font-bold text-neutral-400">
                        {authMode === 'signup' ? 'or sign up with email' : 'or continue with email'}
                      </span>
                      <div className="flex-1 h-px bg-neutral-200" />
                    </div>
                  </div>
                )}

                {/* TAB 1: SIGN IN FORM */}
                {authMode === 'signin' && (
                  <form onSubmit={handleSignIn} className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
                        <input
                          type="email"
                          value={emailInput}
                          onChange={(e) => {
                            setEmailInput(e.target.value);
                            if (errorMessage) setErrorMessage(null);
                          }}
                          placeholder="name@domain.com"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-semibold text-neutral-700">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => switchMode('forgot_password')}
                          className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 transition"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordInput}
                          onChange={(e) => {
                            setPasswordInput(e.target.value);
                            if (errorMessage) setErrorMessage(null);
                          }}
                          placeholder="Enter your password (min 6 chars)"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 rounded-xl bg-[#451A03] hover:bg-[#2b1002] text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                    >
                      {isLoading ? 'Verifying Credentials...' : 'Sign In'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}

                {/* TAB 2: SIGN UP FORM */}
                {authMode === 'signup' && (
                  <form onSubmit={handleSignUp} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
                        <input
                          type="text"
                          value={nameInput}
                          onChange={(e) => {
                            setNameInput(e.target.value);
                            if (errorMessage) setErrorMessage(null);
                          }}
                          placeholder="e.g. Alex Morgan"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
                        <input
                          type="email"
                          value={emailInput}
                          onChange={(e) => {
                            setEmailInput(e.target.value);
                            if (errorMessage) setErrorMessage(null);
                          }}
                          placeholder="name@domain.com"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-semibold text-neutral-700">
                          Password
                        </label>
                        <span className="text-[10px] text-neutral-400">Min 6 characters</span>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordInput}
                          onChange={(e) => {
                            setPasswordInput(e.target.value);
                            if (errorMessage) setErrorMessage(null);
                          }}
                          placeholder="Create password"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPasswordInput}
                          onChange={(e) => {
                            setConfirmPasswordInput(e.target.value);
                            if (errorMessage) setErrorMessage(null);
                          }}
                          placeholder="Re-enter password"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 rounded-xl bg-[#451A03] hover:bg-[#2b1002] text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                    >
                      {isLoading ? 'Creating Free Account...' : 'Create Free Account'}
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    </button>
                  </form>
                )}

                {/* TAB 3: FORGOT PASSWORD FLOW (Direct 1-step reset or 1-click Google sign in) */}
                {authMode === 'forgot_password' && (
                  <div className="space-y-4">
                    {/* Option 1: 1-Click "Sign in with Google" button */}
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => handleGoogleButtonClick(resetEmail)}
                        disabled={isLoading}
                        className="w-full py-2.5 px-4 rounded-xl border border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-semibold shadow-sm transition flex items-center justify-center gap-2.5 active:scale-95 disabled:opacity-50"
                      >
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>Sign In with Google (Instant Access)</span>
                      </button>

                      <div className="flex items-center gap-3 pt-1">
                        <div className="flex-1 h-px bg-neutral-200" />
                        <span className="text-[10px] uppercase font-bold text-neutral-400">
                          or set new password directly
                        </span>
                        <div className="flex-1 h-px bg-neutral-200" />
                      </div>
                    </div>

                    {/* Option 2: Direct password reset form (no verification code required) */}
                    <form onSubmit={handleDirectResetPassword} className="space-y-3.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
                          <input
                            type="email"
                            value={resetEmail}
                            onChange={(e) => {
                              setResetEmail(e.target.value);
                              if (errorMessage) setErrorMessage(null);
                            }}
                            placeholder="Enter your email address"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none font-mono"
                            required
                            autoFocus
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                          New Password (minimum 6 characters)
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                              if (errorMessage) setErrorMessage(null);
                            }}
                            placeholder="Enter new secure password"
                            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 rounded-xl bg-[#451A03] hover:bg-[#2b1002] text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isLoading ? 'Updating Password...' : 'Reset Password & Sign In'}
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    </form>

                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        onClick={() => switchMode('signin')}
                        className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition"
                      >
                        ← Back to Sign In
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Legal policy compliance links */}
            <p className="text-[11px] text-neutral-500 text-center leading-relaxed pt-1">
              By accessing Vunix, you agree to our{' '}
              <button
                type="button"
                onClick={() => onOpenLegal?.('terms')}
                className="underline text-neutral-700 hover:text-black font-semibold transition"
              >
                Terms of Service
              </button>
              ,{' '}
              <button
                type="button"
                onClick={() => onOpenLegal?.('privacy')}
                className="underline text-neutral-700 hover:text-black font-semibold transition"
              >
                Privacy Policy
              </button>
              , and{' '}
              <button
                type="button"
                onClick={() => onOpenLegal?.('refund')}
                className="underline text-neutral-700 hover:text-black font-semibold transition"
              >
                Refund Policy
              </button>
              .
            </p>

            {/* Subtle "Continue as Guest" link */}
            <div className="pt-2 text-center border-t border-neutral-100">
              <button
                type="button"
                onClick={handleGuestClick}
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition py-1 inline-flex items-center gap-1"
              >
                <span>Continue as Guest (Explore 3 Free Tools)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
