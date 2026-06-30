import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import apiClient, { STORAGE_KEYS } from '@bucketick/api-client';
import { Button, Input } from '@bucketick/ui';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { GoogleButton } from '@/components/auth/GoogleButton';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const tokens = await apiClient.auth.login(email || 'kunal@bucketick.app', password);
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, JSON.stringify(tokens.accessToken));
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, JSON.stringify(tokens.refreshToken));
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(tokens.user));
      navigate('/');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      artTitle="Welcome back to your someday list."
      artTagline="The dreams did not plan themselves while you were gone. Let's pick up where you left off."
    >
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold tracking-tight text-content">Log in</h1>
        <p className="mt-1 text-sm text-content-muted">
          Good to see you again. Your adventures are exactly where you left them.
        </p>
      </div>

      <GoogleButton />

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs font-semibold uppercase tracking-wider text-content-muted">
          or
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-bold text-content">Email</span>
          <div className="relative mt-1.5">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-muted" />
            <Input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9"
            />
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-bold text-content">Password</span>
          <div className="relative mt-1.5">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-muted" />
            <Input
              type={showPw ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-9"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
              className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-content-muted hover:bg-surface2 hover:text-content"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>

        <div className="flex items-center justify-between">
          <label className="inline-flex items-center gap-2 text-sm text-content-muted">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-line text-brand-pink accent-brand-pink"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm font-bold text-brand-pink hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Log in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-content-muted">
        New here?{' '}
        <Link to="/signup" className="font-bold text-brand-pink hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
