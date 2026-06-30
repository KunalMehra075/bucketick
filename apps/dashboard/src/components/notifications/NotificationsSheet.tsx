import { Star, UserPlus, MessageSquare, Users2, Trophy, CheckCircle2, BellOff } from 'lucide-react';
import type { Notification } from '@bucketick/api-client';
import { Avatar, Sheet } from '@bucketick/ui';
import { useNotifications } from '@/hooks/queries';
import { useUIStore } from '@/stores/uiStore';
import { timeAgo } from '@/lib/format';

const typeMeta: Record<Notification['type'], { icon: typeof Star; tint: string }> = {
  star: { icon: Star, tint: 'bg-soft-yellow text-[#9a6b00]' },
  follow: { icon: UserPlus, tint: 'bg-soft-pink text-brand-pink' },
  comment: { icon: MessageSquare, tint: 'bg-soft-blue text-brand-blue' },
  collab_invite: { icon: Users2, tint: 'bg-soft-purple text-brand-purple' },
  achievement: { icon: Trophy, tint: 'bg-soft-yellow text-[#9a6b00]' },
  progress: { icon: CheckCircle2, tint: 'bg-soft-blue text-brand-blue' },
};

function NotificationRow({ n }: { n: Notification }) {
  const meta = typeMeta[n.type];
  const Icon = meta.icon;

  return (
    <div className={cnRow(n.read)}>
      <div className="relative shrink-0">
        {n.actor ? (
          <Avatar src={n.actor.avatarUrl ?? undefined} name={n.actor.name} size={42} />
        ) : (
          <span className="grid h-[42px] w-[42px] place-items-center rounded-full bg-gradient-dusk text-white">
            <Trophy className="h-5 w-5" />
          </span>
        )}
        <span
          className={`absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full ring-2 ring-surface ${meta.tint}`}
        >
          <Icon className="h-3 w-3" />
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug text-content">
          {n.actor && <span className="font-bold">{n.actor.name} </span>}
          <span className={n.actor ? 'text-content-muted' : 'font-semibold'}>{n.text}</span>
        </p>
        <p className="mt-0.5 text-xs text-content-muted">{timeAgo(n.createdAt)}</p>
      </div>

      {!n.read && <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-pink" />}
    </div>
  );
}

function cnRow(read: boolean) {
  return [
    'flex items-start gap-3 px-5 py-4 transition-colors hover:bg-surface2',
    read ? '' : 'bg-soft-pink/30',
  ].join(' ');
}

export function NotificationsSheet() {
  const open = useUIStore((s) => s.notificationsOpen);
  const setOpen = useUIStore((s) => s.setNotificationsOpen);
  const { data: notifications } = useNotifications();

  const unread = (notifications ?? []).filter((n) => !n.read).length;

  return (
    <Sheet
      open={open}
      onClose={() => setOpen(false)}
      title="Notifications"
      description={unread > 0 ? `${unread} new since you last looked` : 'You are all caught up'}
      headerAction={
        unread > 0 ? (
          <button className="self-center whitespace-nowrap rounded-pill px-3 py-1.5 text-xs font-bold text-brand-pink hover:bg-soft-pink">
            Mark all read
          </button>
        ) : undefined
      }
    >
      {notifications && notifications.length > 0 ? (
        <div className="divide-y divide-line">
          {notifications.map((n) => (
            <NotificationRow key={n.id} n={n} />
          ))}
        </div>
      ) : (
        <div className="grid h-full place-items-center px-6 py-20 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-surface2 text-content-muted">
            <BellOff className="h-7 w-7" />
          </span>
          <p className="mt-4 font-bold text-content">Nothing here yet</p>
          <p className="mt-1 max-w-xs text-sm text-content-muted">
            When people star, follow, or comment, it shows up right here. Go be interesting.
          </p>
        </div>
      )}
    </Sheet>
  );
}
