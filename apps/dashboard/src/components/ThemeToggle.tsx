import { Monitor, Moon, Sun } from 'lucide-react';
import { IconButton } from '@bucketick/ui';
import { useUIStore, type Theme } from '@/stores/uiStore';

const order: Theme[] = ['system', 'light', 'dark'];
const icon = { system: Monitor, light: Sun, dark: Moon } as const;
const label = { system: 'System theme', light: 'Light theme', dark: 'Dark theme' } as const;

/** Cycles system -> light -> dark. */
export function ThemeToggle() {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);
  const Icon = icon[theme];

  const next = () => setTheme(order[(order.indexOf(theme) + 1) % order.length]);

  return (
    <IconButton label={label[theme]} onClick={next}>
      <Icon className="h-5 w-5" />
    </IconButton>
  );
}
