import { Outlet } from 'react-router-dom';
import { cn } from '@bucketick/ui';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { NotificationsSheet } from '@/components/notifications/NotificationsSheet';
import { useUIStore } from '@/stores/uiStore';

export function AppShell() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const mobileOpen = useUIStore((s) => s.mobileSidebarOpen);
  const setMobile = useUIStore((s) => s.setMobileSidebar);

  return (
    <div className="min-h-screen bg-bg text-content">
      <Sidebar />

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-[var(--bt-overlay)] lg:hidden"
          onClick={() => setMobile(false)}
        />
      )}

      <div
        className={cn(
          'flex min-h-screen flex-col transition-[padding] duration-300 ease-out',
          collapsed ? 'lg:pl-[76px]' : 'lg:pl-[260px]',
        )}
      >
        <Topbar />
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>

      <NotificationsSheet />
    </div>
  );
}
