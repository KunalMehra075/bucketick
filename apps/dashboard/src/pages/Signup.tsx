import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import apiClient, { STORAGE_KEYS } from '@bucketick/api-client';
import { Button, Input } from '@bucketick/ui';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { GoogleButton } from '@/components/auth/GoogleButton';

export function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const tokens = await apiClient.auth.signup(
        email || 'new@bucketick.app',
        password,
        name || 'New Dreamer',
      );
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
      artTitle="Every great life needs a slightly unrealistic list."
      artTagline="Start collecting dreams today. Future you is already grateful, and a little smug about it."
    >
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold tracking-tight text-content">Create your account</h1>
        <p className="mt-1 text-sm text-content-muted">
          Free forever, no credit card, no catch. Just somewhere to put the big ideas.
        </p>
      </div>

      <GoogleButton>Sign up with Google</GoogleButton>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs font-semibold uppercase tracking-wider text-content-muted">
          or
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-bold text-content">Full name</span>
          <div className="relative mt-1.5">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-muted" />
            <Input
              type="text"
              autoComplete="name"
              placeholder="Kunal Mehra"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-9"
            />
          </div>
        </label>

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
              autoComplete="new-password"
              placeholder="At least 8 characters"
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

        <label className="flex items-start gap-2 text-sm text-content-muted">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-line accent-brand-pink"
          />
          <span>
            I agree to the{' '}
            <Link to="/terms" className="font-bold text-brand-pink hover:underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="font-bold text-brand-pink hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        <Button type="submit" size="lg" className="w-full" disabled={loading || !agree}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-content-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-brand-pink hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
