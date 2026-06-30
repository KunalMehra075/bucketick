import { Link } from 'react-router-dom';
import { Bell, Menu, MessageCircle, Plus, Search } from 'lucide-react';
import { Button, IconButton } from '@bucketick/ui';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useUIStore } from '@/stores/uiStore';
import { useNotifications, useProfile } from '@/hooks/queries';

export function Topbar() {
  const setMobile = useUIStore((s) => s.setMobileSidebar);
  const setNotificationsOpen = useUIStore((s) => s.setNotificationsOpen);
  const { data: profile } = useProfile();
  const { data: notifications } = useNotifications();
  const unread = (notifications ?? []).filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-bg/80 px-4 backdrop-blur-md md:px-8">
      <IconButton label="Open menu" className="lg:hidden" onClick={() => setMobile(true)}>
        <Menu className="h-5 w-5" />
      </IconButton>

      {/* Search */}
      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-muted" />
        <input
          type="search"
          placeholder="Search dreams, people, lists..."
          className="h-10 w-full rounded-pill border border-line bg-surface pl-9 pr-4 text-sm text-content placeholder:text-content-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/40"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <Button size="sm" className="hidden md:inline-flex">
          <Plus className="h-4 w-4" />
          New list
        </Button>

        <ThemeToggle />

        <Link to="/messages" aria-label="Messages">
          <IconButton label="Messages" className="relative">
            <MessageCircle className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-pink ring-2 ring-bg" />
          </IconButton>
        </Link>

        <IconButton
          label="Notifications"
          className="relative"
          onClick={() => setNotificationsOpen(true)}
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-pink px-1 text-[10px] font-bold leading-none text-white ring-2 ring-bg">
              {unread}
            </span>
          )}
        </IconButton>

        <Link to="/settings" aria-label="Your profile">
          <img
            src={profile?.avatarUrl ?? 'https://randomuser.me/api/portraits/men/32.jpg'}
            alt="Your profile"
            className="ml-1 h-9 w-9 rounded-full object-cover ring-2 ring-line"
          />
        </Link>
      </div>
    </header>
  );
}
