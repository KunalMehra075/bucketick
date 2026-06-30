import { useEffect, useState } from 'react';
import { Search, Send, BadgeCheck, ArrowLeft, MessageCircle, Smile, Plus } from 'lucide-react';
import type { Conversation } from '@bucketick/api-client';
import { Avatar, cn } from '@bucketick/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { useConversations, useMessageThread } from '@/hooks/queries';
import { timeAgo } from '@/lib/format';

function ConversationRow({
  c,
  active,
  onClick,
}: {
  c: Conversation;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 px-3 py-3 text-left transition-colors',
        active ? 'bg-soft-pink/50' : 'hover:bg-surface2',
      )}
    >
      <div className="relative shrink-0">
        <Avatar src={c.participant.avatarUrl ?? undefined} name={c.participant.name} size={48} />
        {c.online && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-surface" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <p className="truncate text-sm font-bold text-content">{c.participant.name}</p>
          {c.participant.verified && (
            <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-brand-blue" />
          )}
          <span className="ml-auto shrink-0 text-[11px] font-semibold text-content-muted">
            {timeAgo(c.lastAt)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <p
            className={cn(
              'truncate text-xs',
              c.unread ? 'font-bold text-content' : 'text-content-muted',
            )}
          >
            {c.lastMessage}
          </p>
          {c.unread > 0 && (
            <span className="grid h-4 min-w-4 shrink-0 place-items-center rounded-full bg-brand-pink px-1 text-[10px] font-bold text-white">
              {c.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function Thread({ conversation }: { conversation: Conversation }) {
  const { data: messages } = useMessageThread(conversation.id);
  const [draft, setDraft] = useState('');

  return (
    <div className="flex h-full flex-col">
      {/* Thread header */}
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <Avatar
          src={conversation.participant.avatarUrl ?? undefined}
          name={conversation.participant.name}
          size={40}
        />
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <p className="truncate font-bold text-content">{conversation.participant.name}</p>
            {conversation.participant.verified && (
              <BadgeCheck className="h-4 w-4 text-brand-blue" />
            )}
          </div>
          <p className="text-xs font-semibold text-content-muted">
            {conversation.online ? 'Active now' : `@${conversation.participant.username}`}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="scroll-slim flex flex-1 flex-col gap-2 overflow-y-auto p-4">
        {(messages ?? []).map((m) => (
          <div key={m.id} className={cn('flex', m.fromMe ? 'justify-end' : 'justify-start')}>
            <div
              className={cn(
                'max-w-[78%] rounded-2xl px-3.5 py-2 text-sm',
                m.fromMe
                  ? 'rounded-br-md bg-brand-pink text-white'
                  : 'rounded-bl-md bg-surface2 text-content',
              )}
            >
              {m.body}
            </div>
          </div>
        ))}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setDraft('');
        }}
        className="flex items-center gap-2 border-t border-line p-3"
      >
        <button
          type="button"
          aria-label="Add"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-content-muted hover:bg-surface2"
        >
          <Plus className="h-5 w-5" />
        </button>
        <div className="relative flex-1">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write something nice..."
            className="h-11 w-full rounded-pill border border-line bg-surface pl-4 pr-10 text-sm text-content placeholder:text-content-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/40"
          />
          <Smile className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-content-muted" />
        </div>
        <button
          type="submit"
          aria-label="Send"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-pink text-white transition-transform hover:scale-105 disabled:opacity-50"
          disabled={!draft.trim()}
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}

export function Messages() {
  const { data: conversations } = useConversations();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [q, setQ] = useState('');

  // Default to the first conversation on desktop.
  useEffect(() => {
    if (!selectedId && conversations?.length) setSelectedId(conversations[0].id);
  }, [conversations, selectedId]);

  const filtered = (conversations ?? []).filter((c) =>
    c.participant.name.toLowerCase().includes(q.toLowerCase()),
  );
  const selected = (conversations ?? []).find((c) => c.id === selectedId) ?? null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        subtitle="Where the group chat plans the trip nobody books. Until now, maybe."
      />

      <div className="grid h-[calc(100vh-15rem)] grid-cols-1 overflow-hidden rounded-card border border-line bg-surface md:grid-cols-[320px_1fr]">
        {/* Conversation list */}
        <div
          className={cn(
            'flex min-h-0 flex-col border-line md:border-r',
            selected ? 'hidden md:flex' : 'flex',
          )}
        >
          <div className="border-b border-line p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search messages..."
                className="h-10 w-full rounded-pill border border-line bg-bg pl-9 pr-4 text-sm text-content placeholder:text-content-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/40"
              />
            </div>
          </div>
          <div className="scroll-slim min-h-0 flex-1 divide-y divide-line overflow-y-auto">
            {filtered.map((c) => (
              <ConversationRow
                key={c.id}
                c={c}
                active={c.id === selectedId}
                onClick={() => setSelectedId(c.id)}
              />
            ))}
          </div>
        </div>

        {/* Thread */}
        <div className={cn('min-h-0', selected ? 'flex flex-col' : 'hidden md:flex md:flex-col')}>
          {selected ? (
            <>
              {/* Mobile back button */}
              <button
                onClick={() => setSelectedId(null)}
                className="flex items-center gap-1 border-b border-line px-4 py-2 text-sm font-bold text-content md:hidden"
              >
                <ArrowLeft className="h-4 w-4" /> All chats
              </button>
              <div className="min-h-0 flex-1">
                <Thread conversation={selected} />
              </div>
            </>
          ) : (
            <div className="hidden h-full place-items-center p-8 text-center md:grid">
              <div>
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-soft-pink text-brand-pink">
                  <MessageCircle className="h-7 w-7" />
                </span>
                <p className="mt-4 font-bold text-content">Pick a conversation</p>
                <p className="mt-1 text-sm text-content-muted">Your messages will show up here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
