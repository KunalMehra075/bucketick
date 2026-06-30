import { useMemo, useState } from 'react';
import { Play, Star, Eye, Bookmark, Compass } from 'lucide-react';
import type { ExploreMedia } from '@bucketick/api-client';
import { Avatar, Skeleton } from '@bucketick/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { useExploreMedia } from '@/hooks/queries';
import { compact } from '@/lib/format';

function duration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function ExploreTile({ media }: { media: ExploreMedia }) {
  return (
    <figure className="group relative mb-4 block break-inside-avoid overflow-hidden rounded-2xl bg-surface2">
      <div className="relative w-full" style={{ aspectRatio: `1 / ${media.aspect}` }}>
        <img
          src={media.thumbnailUrl}
          alt={media.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Video affordances */}
        {media.type === 'video' && (
          <>
            <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm">
              <Play className="h-4 w-4 fill-current" />
            </span>
            {media.durationSeconds != null && (
              <span className="absolute bottom-2 right-2 rounded-md bg-black/55 px-1.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
                {duration(media.durationSeconds)}
              </span>
            )}
          </>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/75 via-black/0 to-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex justify-end p-2.5">
            <button
              aria-label="Save"
              className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-content transition-transform hover:scale-110"
            >
              <Bookmark className="h-4 w-4" />
            </button>
          </div>

          <figcaption className="p-3 text-white">
            <p className="line-clamp-2 text-sm font-bold leading-snug">{media.title}</p>
            <div className="mt-2 flex items-center gap-2">
              <Avatar
                src={media.author.avatarUrl ?? undefined}
                name={media.author.name}
                size={22}
              />
              <span className="truncate text-xs font-semibold">@{media.author.username}</span>
            </div>
            <div className="mt-2 flex items-center gap-3 text-xs font-semibold text-white/90">
              <span className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5" /> {compact(media.starsCount)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" /> {compact(media.viewsCount)}
              </span>
            </div>
          </figcaption>
        </div>
      </div>
    </figure>
  );
}

export function Explore() {
  const { data, isLoading } = useExploreMedia();
  const [active, setActive] = useState('All');

  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    (data?.items ?? []).forEach((m) => set.add(m.category));
    return Array.from(set);
  }, [data]);

  const items = (data?.items ?? []).filter((m) => active === 'All' || m.category === active);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Explore"
        subtitle="A bottomless scroll of other people's adventures. Steal an idea, save a few, pretend you'll do them all."
      />

      {/* Category chips */}
      <div className="scroll-slim -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={
              'shrink-0 rounded-pill px-4 py-2 text-sm font-bold transition-colors ' +
              (active === cat
                ? 'bg-content text-bg'
                : 'bg-surface2 text-content-muted hover:text-content')
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 xl:columns-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton
              key={i}
              className="mb-4 w-full rounded-2xl"
              style={{ height: 160 + (i % 4) * 60 }}
            />
          ))}
        </div>
      ) : items.length ? (
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 xl:columns-5">
          {items.map((m) => (
            <ExploreTile key={m.id} media={m} />
          ))}
        </div>
      ) : (
        <div className="grid place-items-center rounded-card border border-dashed border-line py-20 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-soft-blue text-brand-blue">
            <Compass className="h-7 w-7" />
          </span>
          <p className="mt-4 font-bold text-content">Nothing in {active} yet</p>
          <p className="mt-1 text-sm text-content-muted">
            Try another category, the good stuff is hiding.
          </p>
        </div>
      )}
    </div>
  );
}
