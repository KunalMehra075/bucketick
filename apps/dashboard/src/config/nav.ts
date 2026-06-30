import {
  LayoutDashboard,
  ListChecks,
  Compass,
  Bookmark,
  MessageCircle,
  Flame,
  Trophy,
  BarChart3,
  Settings,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

export interface NavSection {
  heading: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    heading: 'Overview',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/lists', label: 'My Bucket Lists', icon: ListChecks },
      { to: '/saved', label: 'Saved', icon: Bookmark },
    ],
  },
  {
    heading: 'Social',
    items: [
      { to: '/explore', label: 'Explore', icon: Compass },
      { to: '/messages', label: 'Messages', icon: MessageCircle, badge: 2 },
    ],
  },
  {
    heading: 'You',
    items: [
      { to: '/streaks', label: 'Streaks', icon: Flame },
      { to: '/achievements', label: 'Achievements', icon: Trophy },
      { to: '/analytics', label: 'Analytics', icon: BarChart3 },
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export const premiumItem: NavItem = { to: '/premium', label: 'Premium', icon: Sparkles };
