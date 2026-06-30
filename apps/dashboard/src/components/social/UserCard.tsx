import { useState } from 'react';
import { BadgeCheck, UserPlus, UserCheck } from 'lucide-react';
import type { User } from '@bucketick/api-client';
import { Avatar, Card, cn } from '@bucketick/ui';
import { compact } from '@/lib/format';

/** A person card for the Followers / Following lists. `initialFollowing` toggles the button state. */
export function UserCard({ user, initialFollowing }: { user: User; initialFollowing: boolean }) {
  const [following, setFollowing] = useState(initialFollowing);
  const isMe = user.username === 'kunal';

  return (
    <Card className="flex flex-col items-center p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-soft-md">
      <Avatar src={user.avatarUrl ?? undefined} name={user.name} size={64} />
      <div className="mt-3 flex items-center gap-1">
        <p className="font-bold text-content">{user.name}</p>
        {user.verified && <BadgeCheck className="h-4 w-4 text-brand-blue" />}
      </div>
      <p className="text-sm text-content-muted">@{user.username}</p>
      <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-xs text-content-muted">{user.bio}</p>

      <div className="mt-3 flex w-full justify-center gap-4 text-xs font-semibold text-content-muted">
        <span>
          <span className="font-extrabold text-content">{compact(user.followersCount)}</span>{' '}
          followers
        </span>
        <span>
          <span className="font-extrabold text-content">{user.completedCount}</span> done
        </span>
      </div>

      {!isMe && (
        <button
          onClick={() => setFollowing((v) => !v)}
          className={cn(
            'mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-button px-4 py-2 text-sm font-bold transition-colors',
            following
              ? 'bg-surface2 text-content hover:bg-line'
              : 'bg-brand-pink text-white hover:brightness-110',
          )}
        >
          {following ? (
            <>
              <UserCheck className="h-4 w-4" /> Following
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" /> Follow
            </>
          )}
        </button>
      )}
    </Card>
  );
}
