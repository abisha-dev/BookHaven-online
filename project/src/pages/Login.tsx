import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Eye, EyeOff, Mail, Lock, Apple, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    setLoading(true);
    try {
      await login(form.email, form.password);
      showToast('Welcome back!', 'success');
      navigate('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      showToast(msg.includes('Invalid') ? 'Invalid email or password.' : msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    showToast('Password reset is available in your Supabase project settings.', 'info');
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-visual">
          <div className="auth-visual-badge">
            <BookOpen size={28} />
          </div>
          <div className="auth-visual-content">
            <h1>Your next great story starts here.</h1>
            <p>
              Discover inspiring stories, meaningful ideas, and books worth remembering.
            </p>
          </div>

          <div className="book-stack" aria-hidden="true">
            <div className="book book-one" />
            <div className="book book-two" />
            <div className="book book-three" />
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-inner">
            <div className="brand-badge">
              <BookOpen size={22} />
            </div>

            <div className="auth-header">
              <h2>Welcome Back</h2>
              <p>Sign in to continue your BookHaven journey.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="field-group">
                <label htmlFor="login-email">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="field-group">
                <label htmlFor="login-password">Password</label>
                <div className="input-with-icon password-wrap">
                  <Lock size={18} />
                  <input
                    id="login-password"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPw((p) => !p)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="meta-row">
                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>

                <button type="button" className="text-link" onClick={handleForgotPassword}>
                  Forgot Password?
                </button>
              </div>

              <button type="submit" className="gold-btn" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="divider"><span>OR CONTINUE WITH</span></div>

            <div className="social-row">
              <button type="button" className="social-btn google-btn" aria-label="Continue with Google">
                <span className="social-logo">G</span>
                Google
              </button>
              <button type="button" className="social-btn apple-btn" aria-label="Continue with Apple">
                <Apple size={18} />
                Apple
              </button>
            </div>

            <p className="switch-copy">
              Don&apos;t have an account?{' '}
              <Link to="/register">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
