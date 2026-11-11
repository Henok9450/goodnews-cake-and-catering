import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup' | 'forgot'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup, loginWithGoogle, resetPassword } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
      setSuccess('');
      setPassword('');
      setConfirmPassword('');
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await login(email.trim(), password);
      onClose();
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('No account found or invalid credentials. If you are new, click "Create Account" below.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again or click "Forgot password?".');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please wait a few minutes before trying again.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password provider is disabled in Firebase Console. Please sign in with Google or enable Email/Password under Firebase Console > Authentication.');
      } else {
        setError(err.message || 'Failed to sign in. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await signup(email.trim(), password, fullName.trim());
      setSuccess('Account created successfully! Welcome to GoodNews Cake.');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Signup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please switch to "Sign In".');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password sign-up is disabled in Firebase Console. Please sign in with Google.');
      } else {
        setError(err.message || 'Failed to create account.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address to receive a password reset link.');
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await resetPassword(email.trim());
      setSuccess('Password reset link sent! Please check your email inbox.');
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      await loginWithGoogle(true);
    } catch (err) {
      console.error('Google Auth error:', err);
      setError('Google authentication failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-2">
            <img src="/images/logo/logo3.png" alt="GoodNews Cake" className="h-8 w-auto object-contain" />
          </div>
          <button
            onClick={onClose}
            aria-label="Close authentication dialog"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 pt-2">
          
          {/* Mode Switcher Tabs (Only for login / signup) */}
          {mode !== 'forgot' && (
            <div className="flex p-1 mb-6 bg-gray-100 rounded-2xl">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  mode === 'login' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  mode === 'signup' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Title & Subtitle */}
          <div className="text-center mb-6">
            <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-bold text-gray-900 font-display">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'signup' && 'Join GoodNews Cake'}
              {mode === 'forgot' && 'Reset Your Password'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {mode === 'login' && 'Sign in to access your orders, inquiries, and saved favorites.'}
              {mode === 'signup' && 'Create your customer account to track orders and request custom cakes.'}
              {mode === 'forgot' && 'Enter your email address and we will send you a secure reset link.'}
            </p>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* FORMS */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5" htmlFor="auth-login-email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="auth-login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider" htmlFor="auth-login-password">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }}
                    className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="auth-login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Sign In with Email'
                )}
              </button>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5" htmlFor="auth-signup-name">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="auth-signup-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your Name"
                    autoComplete="name"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5" htmlFor="auth-signup-email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="auth-signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5" htmlFor="auth-signup-password">
                  Create Password (min. 6 chars)
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="auth-signup-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5" htmlFor="auth-signup-confirm">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="auth-signup-confirm"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Create My Account'
                )}
              </button>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5" htmlFor="auth-forgot-email">
                  Your Account Email
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="auth-forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Send Password Reset Link'
                )}
              </button>

              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                className="w-full py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
            </form>
          )}

          {/* Social Divider */}
          {mode !== 'forgot' && (
            <>
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <span className="relative px-4 text-xs uppercase tracking-wider font-semibold text-gray-400 bg-white">
                  or
                </span>
              </div>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full py-3 px-4 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl text-xs sm:text-sm font-bold text-gray-700 transition-all flex items-center justify-center gap-3 shadow-xs active:scale-98 disabled:opacity-60"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3h3.86c2.26-2.09 3.68-5.17 3.68-9.1z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09C3.25 21.3 7.31 24 12 24z" />
                  <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.61H1.28C.46 8.23 0 10.06 0 12s.46 3.77 1.28 5.39l3.99-3.1z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.61l3.99 3.1c.95-2.85 3.6-4.96 6.73-4.96z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default AuthModal;
