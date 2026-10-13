import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Compass,
  UserPlus,
  LogIn,
  RotateCcw
} from 'lucide-react';
import { authService } from '../../services/authService.js';
import { UserProfile } from '../../types.js';
import { AtelierGlyph } from '../ui/AtelierGlyphs.js';

interface LoginPageProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: (user: UserProfile) => void;
  isModal?: boolean;
}

type AuthTab = 'login' | 'signup' | 'forgot';

const OLFACTORY_FAMILIES = [
  'Woody Aromatic',
  'Amber Floral',
  'Traditional Indian Attar',
  'Fresh Citrus / Aquatic',
  'Gourmand / Sweet Resin',
  'Smoky Leather & Oud'
];

const SUGGESTED_NOTES = [
  'Mysore Sandalwood',
  'Mitti Attar',
  'Ruh Gulab',
  'Bergamot',
  'Cardamom',
  'Assam Oud',
  'Vetiver (Khus)',
  'Vanilla Infusion'
];

export const LoginPage: React.FC<LoginPageProps> = ({
  isOpen = true,
  onClose,
  onSuccess,
  isModal = true
}) => {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');

  // --- LOG IN STATE ---
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // --- SIGN UP STATE ---
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupFamily, setSignupFamily] = useState(OLFACTORY_FAMILIES[0]);
  const [signupNotes, setSignupNotes] = useState<string[]>(['Mysore Sandalwood', 'Bergamot']);

  // --- FORGOT PASSWORD STATE ---
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);

  // Status & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [quickSwitchToSignup, setQuickSwitchToSignup] = useState(false);
  const [quickSwitchToLogin, setQuickSwitchToLogin] = useState(false);

  if (!isOpen) return null;

  // ================= 1. USER AUTHENTICATION (LOG IN) =================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);
    setQuickSwitchToSignup(false);

    const email = loginEmail.trim().toLowerCase();
    const password = loginPassword.trim();

    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    try {
      setIsSubmitting(true);
      const user = await authService.login({
        email,
        password
      });

      setSuccessNotice(`Authentication successful. Welcome back, ${user.name}!`);
      setTimeout(() => {
        onSuccess?.(user);
        onClose?.();
      }, 500);
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('No account found with this email')) {
        setErrorMessage('No account found with this email. Please create an account first.');
        setQuickSwitchToSignup(true);
      } else if (msg.includes('Incorrect password')) {
        setErrorMessage('Incorrect password. Please verify your credentials.');
      } else {
        setErrorMessage(msg || 'Authentication failed. Please verify credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= 2. USER REGISTRATION (SIGN UP) =================
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);
    setQuickSwitchToLogin(false);

    const email = signupEmail.trim().toLowerCase();
    const password = signupPassword.trim();
    const confirmPassword = signupConfirmPassword.trim();
    const name = signupName.trim() || email.split('@')[0];

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }
    if (confirmPassword && password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your password confirmation.');
      return;
    }

    // Direct registration with secure SQLite password hashing
    try {
      setIsSubmitting(true);
      const user = await authService.register({
        name,
        email,
        password,
        preferred_family: signupFamily,
        signature_notes: signupNotes,
        title: 'Apprentice Perfumer'
      });

      setSuccessNotice(`Account created successfully! Welcome to the Atelier, ${user.name}.`);
      setTimeout(() => {
        onSuccess?.(user);
        onClose?.();
      }, 600);
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('Account already exists')) {
        setErrorMessage('Account already exists. Please log in instead.');
        setQuickSwitchToLogin(true);
      } else {
        setErrorMessage(msg || 'Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= 3. FORGOT PASSWORD =================
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);
    setQuickSwitchToSignup(false);

    const email = forgotEmail.trim().toLowerCase();
    const newPassword = forgotNewPassword.trim();
    const confirmPassword = forgotConfirmPassword.trim();

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid registered email address');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please confirm your new password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await authService.resetPassword(email, newPassword);
      setSuccessNotice(res.message || 'Password reset successfully! You can now log in.');

      // Pre-fill login credentials for convenience
      setLoginEmail(email);
      setLoginPassword(newPassword);

      // Return to login tab after brief confirmation
      setTimeout(() => {
        setActiveTab('login');
      }, 1500);
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('No account found with this email')) {
        setErrorMessage('No account found with this email. Please create an account first.');
        setQuickSwitchToSignup(true);
      } else {
        setErrorMessage(msg || 'Failed to reset password. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Note toggle for Sign Up
  const toggleNote = (note: string) => {
    if (signupNotes.includes(note)) {
      setSignupNotes(signupNotes.filter((n) => n !== note));
    } else {
      if (signupNotes.length >= 4) return;
      setSignupNotes([...signupNotes, note]);
    }
  };

  // Continue as guest
  const handleContinueAsGuest = () => {
    const guest = authService.continueAsGuest();
    onSuccess?.(guest);
    onClose?.();
  };

  const content = (
    <div className="w-full max-w-xl mx-auto rounded-3xl bg-[#FAF7F2] dark:bg-[#14100D] border border-black/[0.08] dark:border-white/[0.12] shadow-2xl overflow-hidden text-left relative z-10 transition-colors">
      {/* Haute Parfumerie Header Banner */}
      <div className="relative px-6 pt-7 pb-5 border-b border-black/[0.06] dark:border-white/[0.08] bg-gradient-to-b from-amber-500/[0.07] to-transparent">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-[#7E7165] dark:text-[#9F9387] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition cursor-pointer"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center shadow-md shadow-amber-900/30">
            <AtelierGlyph type="still" className="w-5 h-5 text-amber-100" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-amber-800 dark:text-amber-400 font-semibold block">
              L'Atelier Olfactif Authentication
            </span>
            <h2 className="font-serif text-2xl font-medium tracking-tight text-[#1A1613] dark:text-[#F4EFEA]">
              {activeTab === 'login' && 'Enter Scent Atelier'}
              {activeTab === 'signup' && 'Create Scent Passport'}
              {activeTab === 'forgot' && 'Reset Vault Password'}
            </h2>
          </div>
        </div>

        <p className="mt-2 text-xs text-[#6B5F54] dark:text-[#A99D91] leading-relaxed">
          {activeTab === 'login' &&
            'Access your persistent perfume wardrobe, living olfactory DNA portrait, and custom fragrance formulas.'}
          {activeTab === 'signup' &&
            'Register your account in the SQLite database to preserve your fragrance collection, living DNA portrait, and custom alchemy formulations.'}
          {activeTab === 'forgot' &&
            'Verify your registered email address and define a new secure password for your olfactory vault.'}
        </p>

        {/* Tab Controls: Log In, Sign Up, and Forgot Password */}
        <div className="mt-5 grid grid-cols-3 p-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06] text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
            }}
            className={`py-2 rounded-lg text-center transition cursor-pointer select-none font-sans flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-white dark:bg-[#201A15] text-[#1A1613] dark:text-[#F4EFEA] shadow-sm font-semibold border border-black/[0.04] dark:border-white/[0.08]'
                : 'text-[#6D6257] dark:text-[#9E9285] hover:text-[#1A1613] dark:hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Log In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setErrorMessage(null);
            }}
            className={`py-2 rounded-lg text-center transition cursor-pointer select-none font-sans flex items-center justify-center gap-1.5 ${
              activeTab === 'signup'
                ? 'bg-white dark:bg-[#201A15] text-[#1A1613] dark:text-[#F4EFEA] shadow-sm font-semibold border border-black/[0.04] dark:border-white/[0.08]'
                : 'text-[#6D6257] dark:text-[#9E9285] hover:text-[#1A1613] dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Sign Up</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('forgot');
              if (!forgotEmail && loginEmail) {
                setForgotEmail(loginEmail);
              }
              setErrorMessage(null);
            }}
            className={`py-2 rounded-lg text-center transition cursor-pointer select-none font-sans flex items-center justify-center gap-1.5 ${
              activeTab === 'forgot'
                ? 'bg-white dark:bg-[#201A15] text-[#1A1613] dark:text-[#F4EFEA] shadow-sm font-semibold border border-black/[0.04] dark:border-white/[0.08]'
                : 'text-[#6D6257] dark:text-[#9E9285] hover:text-[#1A1613] dark:hover:text-white'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Forgot Password</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 sm:p-7">
        {/* Alerts & Feedback */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/25 flex flex-col gap-2 text-xs text-red-700 dark:text-red-400"
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span className="font-medium leading-relaxed">{errorMessage}</span>
              </div>

              {quickSwitchToSignup && (
                <div className="pl-6 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSignupEmail(loginEmail || forgotEmail);
                      setActiveTab('signup');
                      setErrorMessage(null);
                      setQuickSwitchToSignup(false);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 transition cursor-pointer flex items-center gap-1.5 w-fit"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create Account Now</span>
                  </button>
                </div>
              )}

              {quickSwitchToLogin && (
                <div className="pl-6 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail(signupEmail || forgotEmail);
                      setActiveTab('login');
                      setErrorMessage(null);
                      setQuickSwitchToLogin(false);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 transition cursor-pointer flex items-center gap-1.5 w-fit"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Log In to Existing Account</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {successNotice && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 font-medium"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successNotice}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= TAB 1: USER LOG IN ================= */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-[#54493F] dark:text-[#B5A99D] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7F72]" />
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname@domain.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1C1612] text-sm text-[#1A1613] dark:text-[#F4EFEA] focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono tracking-wider uppercase text-[#54493F] dark:text-[#B5A99D]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(loginEmail);
                    setActiveTab('forgot');
                    setErrorMessage(null);
                  }}
                  className="text-[11px] text-amber-700 dark:text-amber-400 hover:underline cursor-pointer font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7F72]" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1C1612] text-sm text-[#1A1613] dark:text-[#F4EFEA] focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7F72] hover:text-[#1A1613] dark:hover:text-white cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#6B5F54] dark:text-[#A89C8F]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span>Remember this Atelier station</span>
              </label>

              <span className="text-[11px] font-mono text-[#8C7F72]">
                SQLite Vault Storage
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-medium text-sm tracking-wide shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Checking Database...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Log In & Enter Scent Atelier</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-[#7A6E63] dark:text-[#9A8D80]">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setSignupEmail(loginEmail);
                    setActiveTab('signup');
                    setErrorMessage(null);
                  }}
                  className="text-amber-700 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
                >
                  Sign Up Here
                </button>
              </span>
            </div>
          </form>
        )}

        {/* ================= TAB 2: USER REGISTRATION (SIGN UP) ================= */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-[#54493F] dark:text-[#B5A99D] mb-1.5">
                  Full Name / Perfumer Alias
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7F72]" />
                  <input
                    type="text"
                    placeholder="e.g. Shamrat"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1C1612] text-sm text-[#1A1613] dark:text-[#F4EFEA] focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-[#54493F] dark:text-[#B5A99D] mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7F72]" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. shamratppp@gmail.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1C1612] text-sm text-[#1A1613] dark:text-[#F4EFEA] focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-[#54493F] dark:text-[#B5A99D] mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7F72]" />
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 6 characters"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1C1612] text-sm text-[#1A1613] dark:text-[#F4EFEA] focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7F72] hover:text-[#1A1613] dark:hover:text-white cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-[#54493F] dark:text-[#B5A99D] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7F72]" />
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1C1612] text-sm text-[#1A1613] dark:text-[#F4EFEA] focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-[#54493F] dark:text-[#B5A99D] mb-1.5">
                Primary Olfactory Affinity
              </label>
              <select
                value={signupFamily}
                onChange={(e) => setSignupFamily(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1C1612] text-xs text-[#1A1613] dark:text-[#F4EFEA] focus:outline-none focus:border-amber-600 transition cursor-pointer"
              >
                {OLFACTORY_FAMILIES.map((fam) => (
                  <option key={fam} value={fam}>{fam}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono tracking-wider uppercase text-[#54493F] dark:text-[#B5A99D]">
                  Signature Notes (Up to 4)
                </label>
                <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400">
                  {signupNotes.length}/4 selected
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_NOTES.map((note) => {
                  const isSelected = signupNotes.includes(note);
                  return (
                    <button
                      key={note}
                      type="button"
                      onClick={() => toggleNote(note)}
                      className={`px-2.5 py-1 rounded-lg text-xs transition cursor-pointer select-none ${
                        isSelected
                          ? 'bg-amber-600 text-white font-medium shadow-sm'
                          : 'bg-black/[0.03] dark:bg-white/[0.05] text-[#5A4E44] dark:text-[#C5B8AB] hover:bg-black/[0.06] border border-black/[0.05] dark:border-white/[0.08]'
                      }`}
                    >
                      {note}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-medium text-sm tracking-wide shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Writing to Database...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account & Save to Database (+150 XP)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-[#7A6E63] dark:text-[#9A8D80]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail(signupEmail);
                    setActiveTab('login');
                    setErrorMessage(null);
                  }}
                  className="text-amber-700 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
                >
                  Log In Here
                </button>
              </span>
            </div>
          </form>
        )}

        {/* ================= TAB 3: FORGOT PASSWORD ================= */}
        {activeTab === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-[#54493F] dark:text-[#B5A99D] mb-1.5">
                Registered Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7F72]" />
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname@domain.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1C1612] text-sm text-[#1A1613] dark:text-[#F4EFEA] focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                />
              </div>
              <p className="text-[11px] text-[#7E7266] dark:text-[#9A8D80] mt-1">
                The account associated with this email will be queried in the SQLite database.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-[#54493F] dark:text-[#B5A99D] mb-1.5">
                New Password * (Min 6 characters)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7F72]" />
                <input
                  type={showForgotNewPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your new password"
                  value={forgotNewPassword}
                  onChange={(e) => setForgotNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1C1612] text-sm text-[#1A1613] dark:text-[#F4EFEA] focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7F72] hover:text-[#1A1613] dark:hover:text-white cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showForgotNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-[#54493F] dark:text-[#B5A99D] mb-1.5">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7F72]" />
                <input
                  type={showForgotNewPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter your new password"
                  value={forgotConfirmPassword}
                  onChange={(e) => setForgotConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1C1612] text-sm text-[#1A1613] dark:text-[#F4EFEA] focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-medium text-sm tracking-wide shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Updating Password in SQLite...</span>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Update Password & Return to Log In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-[#7A6E63] dark:text-[#9A8D80]">
                Remembered your password?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail(forgotEmail);
                    setActiveTab('login');
                    setErrorMessage(null);
                  }}
                  className="text-amber-700 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
                >
                  Back to Log In
                </button>
              </span>
            </div>
          </form>
        )}

        {/* Guest & Security Footer */}
        <div className="mt-6 pt-5 border-t border-black/[0.05] dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={handleContinueAsGuest}
            className="text-[#6E6155] dark:text-[#A89C8F] hover:text-[#1A1613] dark:hover:text-white transition flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>Continue as Visiting Alchemist (Guest)</span>
          </button>

          <div className="flex items-center gap-1.5 text-[11px] text-[#8C7F72] dark:text-[#7A6E63]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted SQLite Hash Storage</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isModal) {
    return <div className="min-h-screen py-10 px-4 flex items-center justify-center">{content}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      {content}
    </div>
  );
};
