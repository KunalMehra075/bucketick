import { NavLink } from 'react-router-dom';
import { ChevronLeft, PanelLeft, Sparkles, X } from 'lucide-react';
import { cn } from '@bucketick/ui';
import { navSections, type NavItem } from '@/config/nav';
import { useUIStore } from '@/stores/uiStore';
import { useProfile } from '@/hooks/queries';

function BrandMark() {
  return <img src="/bucketick-logo.png" alt="" className="h-9 w-9 shrink-0 object-contain" />;
}

function NavRow({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const Icon = item.icon;
  const setMobile = useUIStore((s) => s.setMobileSidebar);

  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      onClick={() => setMobile(false)}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
          isActive
            ? 'bg-soft-pink text-brand-pink'
            : 'text-content-muted hover:bg-surface2 hover:text-content',
          collapsed && 'justify-center px-0',
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && !collapsed && (
            <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-pink" />
          )}
          <Icon className="h-5 w-5 shrink-0" />
          <span className={cn('flex-1 truncate', collapsed && 'hidden')}>{item.label}</span>
          {item.badge != null && !collapsed && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-pink px-1 text-[11px] font-bold text-white">
              {item.badge}
            </span>
          )}
          {/* Tooltip when collapsed */}
          {collapsed && (
            <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-lg bg-content px-2.5 py-1.5 text-xs font-semibold text-bg opacity-0 shadow-soft-md transition-opacity group-hover:opacity-100">
              {item.label}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export function Sidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggle = useUIStore((s) => s.toggleSidebar);
  const mobileOpen = useUIStore((s) => s.mobileSidebarOpen);
  const setMobile = useUIStore((s) => s.setMobileSidebar);
  const { data: profile } = useProfile();

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-line bg-sidebar transition-all duration-300 ease-out',
        collapsed ? 'w-[76px]' : 'w-[260px]',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      )}
    >
      {/* Brand + collapse */}
      <div className={cn('flex h-16 items-center gap-2 px-4', collapsed && 'justify-center px-0')}>
        <BrandMark />
        {!collapsed && (
          <img
            src="/bucketick-wordmark.png"
            alt="Bucketick"
            className="h-5 w-auto object-contain dark:brightness-0 dark:invert"
          />
        )}
        <button
          onClick={toggle}
          aria-label="Collapse sidebar"
          className={cn(
            'ml-auto hidden h-8 w-8 place-items-center rounded-lg text-content-muted hover:bg-surface2 hover:text-content lg:grid',
            collapsed && 'hidden',
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {/* Close on mobile */}
        <button
          onClick={() => setMobile(false)}
          aria-label="Close menu"
          className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-content-muted hover:bg-surface2 lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          onClick={toggle}
          aria-label="Expand sidebar"
          className="mx-auto mb-2 hidden h-8 w-8 place-items-center rounded-lg text-content-muted hover:bg-surface2 hover:text-content lg:grid"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
      )}

      {/* Nav */}
      <nav className="scroll-slim flex-1 space-y-5 overflow-y-auto px-3 py-2">
        {navSections.map((section) => (
          <div key={section.heading} className="space-y-1">
            {!collapsed && (
              <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-content-muted/70">
                {section.heading}
              </p>
            )}
            {section.items.map((item) => (
              <NavRow key={item.to} item={item} collapsed={collapsed} />
            ))}
          </div>
        ))}
      </nav>

      {/* Premium upsell + user */}
      <div className="space-y-3 p-3">
        {!collapsed ? (
          <div className="rounded-2xl bg-gradient-dusk p-4 text-white">
            <Sparkles className="h-5 w-5" />
            <p className="mt-2 text-sm font-bold leading-tight">Go Premium</p>
            <p className="mt-0.5 text-xs text-white/80">AI planning, custom themes, and more.</p>
            <NavLink
              to="/premium"
              className="mt-3 inline-flex rounded-button bg-white px-3 py-1.5 text-xs font-bold text-content"
            >
              Upgrade
            </NavLink>
          </div>
        ) : (
          <NavLink
            to="/premium"
            aria-label="Go Premium"
            className="grid h-10 w-full place-items-center rounded-xl bg-gradient-dusk text-white"
          >
            <Sparkles className="h-5 w-5" />
          </NavLink>
        )}

        <NavLink
          to="/settings"
          className={cn(
            'flex items-center gap-3 rounded-xl p-2 hover:bg-surface2',
            collapsed && 'justify-center p-0',
          )}
        >
          <img
            src={profile?.avatarUrl ?? 'https://randomuser.me/api/portraits/men/32.jpg'}
            alt=""
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
          {!collapsed && (
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-content">
                {profile?.name ?? 'Kunal Mehra'}
              </span>
              <span className="block truncate text-xs text-content-muted">
                @{profile?.username ?? 'kunal'}
              </span>
            </span>
          )}
        </NavLink>
      </div>
    </aside>
  );
}
