import { useState } from 'react';
import {
  User as UserIcon,
  Shield,
  Bell,
  Palette,
  Sun,
  Moon,
  Monitor,
  Camera,
  Check,
} from 'lucide-react';
import { Avatar, Button, Card, cn } from '@bucketick/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { useProfile } from '@/hooks/queries';
import { useUIStore, type Theme } from '@/stores/uiStore';

const TABS = [
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'account', label: 'Account', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
] as const;
type TabId = (typeof TABS)[number]['id'];

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-content">{label}</span>
      {hint && <span className="ml-2 text-xs text-content-muted">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputClass =
  'h-11 w-full rounded-input border border-line bg-bg px-3.5 text-sm text-content placeholder:text-content-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/40';

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors',
        on ? 'bg-brand-pink' : 'bg-surface2',
      )}
      aria-pressed={on}
    >
      <span
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-soft-sm transition-transform',
          on ? 'translate-x-[22px]' : 'translate-x-0.5',
        )}
      />
    </button>
  );
}

function ProfileTab() {
  const { data: profile } = useProfile();
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar src={profile?.avatarUrl ?? undefined} name={profile?.name} size={72} />
          <button className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-brand-pink text-white ring-2 ring-surface">
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>
        <div>
          <p className="font-bold text-content">{profile?.name}</p>
          <p className="text-sm text-content-muted">
            Profile photo. JPG or PNG, keep it under 5MB.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Display name">
          <input className={inputClass} defaultValue={profile?.name} />
        </Field>
        <Field label="Username">
          <input className={inputClass} defaultValue={profile?.username} />
        </Field>
      </div>

      <Field label="Bio" hint="A line or two. Make it count.">
        <textarea
          className={cn(inputClass, 'h-24 resize-none py-2.5')}
          defaultValue={profile?.bio ?? ''}
        />
      </Field>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost">Cancel</Button>
        <Button>Save changes</Button>
      </div>
    </div>
  );
}

function AccountTab() {
  return (
    <div className="space-y-5">
      <Field label="Email">
        <input className={inputClass} type="email" defaultValue="kunal@bucketick.app" />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="New password">
          <input className={inputClass} type="password" placeholder="••••••••" />
        </Field>
        <Field label="Confirm password">
          <input className={inputClass} type="password" placeholder="••••••••" />
        </Field>
      </div>

      <Card className="border-red-300/60 bg-red-500/5 p-4">
        <p className="font-bold text-red-500">Danger zone</p>
        <p className="mt-0.5 text-sm text-content-muted">
          Deleting your account erases every list, streak, and badge. There is no undo, and we will
          not pretend otherwise.
        </p>
        <button className="mt-3 rounded-button border-2 border-red-400 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-500 hover:text-white">
          Delete account
        </button>
      </Card>

      <div className="flex justify-end gap-2 pt-2">
        <Button>Update account</Button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    follows: true,
    stars: true,
    comments: true,
    collab: true,
    weekly: false,
    product: false,
  });
  const rows: { key: keyof typeof prefs; title: string; desc: string }[] = [
    { key: 'follows', title: 'New followers', desc: 'When someone starts following you.' },
    { key: 'stars', title: 'Stars', desc: 'When people star your bucket lists.' },
    { key: 'comments', title: 'Comments', desc: 'Replies and comments on your lists.' },
    {
      key: 'collab',
      title: 'Collaboration invites',
      desc: 'When someone adds you to a shared list.',
    },
    { key: 'weekly', title: 'Weekly digest', desc: 'A Sunday recap of your progress.' },
    { key: 'product', title: 'Product news', desc: 'The occasional "we built a thing" email.' },
  ];
  return (
    <div className="divide-y divide-line">
      {rows.map((r) => (
        <div key={r.key} className="flex items-center justify-between gap-4 py-4 first:pt-0">
          <div className="min-w-0">
            <p className="font-bold text-content">{r.title}</p>
            <p className="text-sm text-content-muted">{r.desc}</p>
          </div>
          <Toggle
            on={prefs[r.key]}
            onChange={() => setPrefs((p) => ({ ...p, [r.key]: !p[r.key] }))}
          />
        </div>
      ))}
    </div>
  );
}

function AppearanceTab() {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);
  const options: { id: Theme; label: string; icon: typeof Sun }[] = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ];
  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-content">Theme</p>
      <div className="grid grid-cols-3 gap-3">
        {options.map((o) => {
          const Icon = o.icon;
          const active = theme === o.id;
          return (
            <button
              key={o.id}
              onClick={() => setTheme(o.id)}
              className={cn(
                'relative flex flex-col items-center gap-2 rounded-2xl border-2 p-5 transition-colors',
                active ? 'border-brand-pink bg-soft-pink/40' : 'border-line hover:bg-surface2',
              )}
            >
              {active && (
                <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-brand-pink text-white">
                  <Check className="h-3 w-3" />
                </span>
              )}
              <Icon className={cn('h-6 w-6', active ? 'text-brand-pink' : 'text-content-muted')} />
              <span className="text-sm font-bold text-content">{o.label}</span>
            </button>
          );
        })}
      </div>
      <p className="text-sm text-content-muted">
        System follows your device. Dark mode is easier on the eyes during those 1am planning
        sessions.
      </p>
    </div>
  );
}

export function Settings() {
  const [tab, setTab] = useState<TabId>('profile');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="The knobs and dials. Tweak until it feels like yours."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        {/* Tab rail */}
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'inline-flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors lg:w-full',
                  active
                    ? 'bg-soft-pink text-brand-pink'
                    : 'text-content-muted hover:bg-surface2 hover:text-content',
                )}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </nav>

        <Card className="p-6">
          {tab === 'profile' && <ProfileTab />}
          {tab === 'account' && <AccountTab />}
          {tab === 'notifications' && <NotificationsTab />}
          {tab === 'appearance' && <AppearanceTab />}
        </Card>
      </div>
    </div>
  );
}
