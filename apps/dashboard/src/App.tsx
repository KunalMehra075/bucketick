import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { queryClient } from '@/lib/queryClient';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AppShell } from '@/components/layout/AppShell';
import { Dashboard } from '@/pages/Dashboard';
import { Lists } from '@/pages/Lists';
import { Explore } from '@/pages/Explore';
import { Saved } from '@/pages/Saved';
import { Followers } from '@/pages/Followers';
import { Following } from '@/pages/Following';
import { Messages } from '@/pages/Messages';
import { Streaks } from '@/pages/Streaks';
import { Achievements } from '@/pages/Achievements';
import { Analytics } from '@/pages/Analytics';
import { Settings } from '@/pages/Settings';
import { Premium } from '@/pages/Premium';
import { Login } from '@/pages/Login';
import { Signup } from '@/pages/Signup';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth — full screen, outside the app shell */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth" element={<Navigate to="/login" replace />} />

            <Route element={<AppShell />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/lists" element={<Lists />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/followers" element={<Followers />} />
              <Route path="/following" element={<Following />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/streaks" element={<Streaks />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
