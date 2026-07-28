/**
 * Seeds the database with demo users, lists, items, and follows so the
 * leaderboard and social screens look alive from the first launch.
 *
 * WARNING: this wipes the users, lists, items, and follows collections first.
 * Run it against a fresh/dev database. Usage: npm run seed
 */
import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import { connectDb, disconnectDb } from './config/db';
import { env } from './config/env';
import { User } from './models/User';
import { List } from './models/List';
import { Item } from './models/Item';
import { Follow } from './models/Follow';
import { Post } from './models/Post';
import { Hype } from './models/Hype';
import { Comment } from './models/Comment';
import { Bookmark } from './models/Bookmark';
import { recomputeUserStats } from './utils/stats';
import { BrandColor, ItemStatus, Visibility } from './types';

const DEMO_PASSWORD = 'password';

/** Stable Unsplash CDN images for demo covers and posts. */
const IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=60',
];
const img = (i: number) => IMAGES[i % IMAGES.length];

/** Achievement posts. `author` indexes into DEMO_USERS. Captions are human, dry, no emojis. */
interface SeedPost {
  author: number;
  caption: string;
  images: string[];
  aspect: number;
  category: string;
}
const DEMO_POSTS: SeedPost[] = [
  { author: 0, caption: 'Stood at the edge of Patagonia and forgot how to speak for a second. Continent number five, done.', images: [img(0), img(2)], aspect: 1.25, category: 'Travel' },
  { author: 0, caption: 'Made pasta from scratch that did not fall apart. Small win, huge ego boost.', images: [img(6)], aspect: 0.8, category: 'Skills' },
  { author: 1, caption: 'Jumped out of a perfectly good plane. Ten out of ten, would panic again.', images: [img(4)], aspect: 1.4, category: 'Adventure' },
  { author: 1, caption: 'Berlin marathon in the books. My legs have filed a formal complaint.', images: [img(3)], aspect: 0.75, category: 'Fitness' },
  { author: 2, caption: 'My short story is actually published. Someone other than my mum will read it.', images: [img(7)], aspect: 1.0, category: 'Creative' },
  { author: 3, caption: 'Ate ramen in a six-seat Tokyo bar at midnight. The broth changed me.', images: [img(6), img(3)], aspect: 1.2, category: 'Food' },
  { author: 4, caption: 'Gave my first conference talk without fainting. The bar was low, I cleared it.', images: [img(8)], aspect: 0.85, category: 'Career' },
  { author: 5, caption: 'Watched the sun melt into Santorini. Photos do not do it justice, but here we are.', images: [img(5)], aspect: 1.3, category: 'Travel' },
  { author: 6, caption: 'Kept a plant alive for a whole year. This is my Everest, honestly.', images: [img(11)], aspect: 0.9, category: 'Everyday' },
  { author: 7, caption: 'Caught my first real wave in Portugal. Swallowed half the Atlantic doing it.', images: [img(10), img(3)], aspect: 1.15, category: 'Adventure' },
  { author: 2, caption: 'Learning film photography, one gloriously overexposed roll at a time.', images: [img(1)], aspect: 1.1, category: 'Creative' },
  { author: 0, caption: 'Cherry blossoms in Japan. Cried a little, blamed it on the pollen.', images: [img(2)], aspect: 0.8, category: 'Travel' },
  { author: 3, caption: 'Real Neapolitan pizza in Naples. I have peaked, it is all downhill from here.', images: [img(6)], aspect: 1.0, category: 'Food' },
  { author: 1, caption: 'Tokyo marathon done. Two continents of running down, a few knees to go.', images: [img(9)], aspect: 1.25, category: 'Fitness' },
  { author: 4, caption: 'Shipped a tiny side project and a stranger actually used it. Made my week.', images: [img(8)], aspect: 0.9, category: 'Career' },
  { author: 5, caption: 'Slow morning, strong coffee, a plan to see one more island this year.', images: [img(5)], aspect: 1.35, category: 'Travel' },
];

/** A few warm, positive comment lines. */
const COMMENT_BODIES = [
  'This is so inspiring, congrats.',
  'Okay now I want to do this too.',
  'Huge. You earned every bit of this.',
  'The photos are unreal.',
  'Adding this to my own list right now.',
  'Proud of you, genuinely.',
];

interface SeedItem {
  title: string;
  note?: string;
  location?: string;
  status: ItemStatus;
}
interface SeedList {
  title: string;
  description: string;
  category: string;
  accent: BrandColor;
  visibility: Visibility;
  items: SeedItem[];
}
interface SeedUser {
  name: string;
  username: string;
  email: string;
  avatarColor: BrandColor;
  bio: string;
  lists: SeedList[];
}

const DEMO_USERS: SeedUser[] = [
  {
    name: 'Maya Chen',
    username: 'mayawanders',
    email: 'maya@bucketick.com',
    avatarColor: 'pink',
    bio: 'Chasing sunrises and questionable street food.',
    lists: [
      {
        title: 'Every continent before 35',
        description: 'Five down, two to go. Antarctica is going to be cold and I am oddly excited.',
        category: 'Travel',
        accent: 'pink',
        visibility: 'public',
        items: [
          { title: 'Hike Patagonia', location: 'Chile', status: 'completed' },
          { title: 'See the cherry blossoms', location: 'Japan', status: 'completed' },
          { title: 'Safari in the Serengeti', location: 'Tanzania', status: 'in_progress' },
          { title: 'Set foot in Antarctica', status: 'dreaming' },
        ],
      },
      {
        title: 'Learn to actually cook',
        description: 'Beyond pasta. The bar is on the floor and I keep tripping over it.',
        category: 'Skills',
        accent: 'orange',
        visibility: 'public',
        items: [
          { title: 'Make fresh pasta from scratch', status: 'completed' },
          { title: 'Nail a proper risotto', status: 'in_progress' },
        ],
      },
    ],
  },
  {
    name: 'Leo Alvarez',
    username: 'leooffgrid',
    email: 'leo@bucketick.com',
    avatarColor: 'blue',
    bio: 'Weekends are for mountains.',
    lists: [
      {
        title: 'Slightly terrifying adventures',
        description: 'Heart says yes, knees file a formal complaint.',
        category: 'Adventure',
        accent: 'blue',
        visibility: 'public',
        items: [
          { title: 'Skydive', status: 'completed' },
          { title: 'Free dive to 20 meters', status: 'in_progress' },
          { title: 'Climb El Capitan', location: 'Yosemite', status: 'dreaming' },
        ],
      },
      {
        title: 'Run a marathon on every continent',
        description: 'My physio is going to buy a boat with what I pay them.',
        category: 'Fitness',
        accent: 'purple',
        visibility: 'public',
        items: [
          { title: 'Berlin marathon', location: 'Germany', status: 'completed' },
          { title: 'Tokyo marathon', location: 'Japan', status: 'completed' },
          { title: 'Boston marathon', location: 'USA', status: 'in_progress' },
        ],
      },
    ],
  },
  {
    name: 'Sana Kapoor',
    username: 'sanadoesthings',
    email: 'sana@bucketick.com',
    avatarColor: 'purple',
    bio: 'Maker of things, finisher of some of them.',
    lists: [
      {
        title: 'Creative dares',
        description: 'The stuff I keep saying I will start on Monday.',
        category: 'Creative',
        accent: 'purple',
        visibility: 'public',
        items: [
          { title: 'Publish a short story', status: 'completed' },
          { title: 'Learn film photography', status: 'in_progress' },
          { title: 'Paint a proper mural', status: 'dreaming' },
        ],
      },
    ],
  },
  {
    name: 'Theo Bright',
    username: 'theobright',
    email: 'theo@bucketick.com',
    avatarColor: 'orange',
    bio: 'Collecting small wins and big meals.',
    lists: [
      {
        title: 'Eat my way around the world',
        description: 'A love letter to carbs, honestly.',
        category: 'Food',
        accent: 'orange',
        visibility: 'public',
        items: [
          { title: 'Ramen in a tiny Tokyo alley', location: 'Japan', status: 'completed' },
          { title: 'Real Neapolitan pizza', location: 'Naples', status: 'completed' },
          { title: 'Street tacos in Mexico City', location: 'Mexico', status: 'in_progress' },
        ],
      },
    ],
  },
  {
    name: 'Ines Moreau',
    username: 'inescollects',
    email: 'ines@bucketick.com',
    avatarColor: 'yellow',
    bio: 'Quietly ambitious.',
    lists: [
      {
        title: 'Career things I keep postponing',
        description: 'Future me is very brave. Present me needs coffee.',
        category: 'Career',
        accent: 'yellow',
        visibility: 'public',
        items: [
          { title: 'Give a talk at a conference', status: 'completed' },
          { title: 'Mentor someone starting out', status: 'in_progress' },
          { title: 'Ship a side project people use', status: 'dreaming' },
        ],
      },
    ],
  },
  {
    name: 'Ken Watanabe',
    username: 'kenw',
    email: 'ken@bucketick.com',
    avatarColor: 'blue',
    bio: 'Slow travel, strong coffee.',
    lists: [
      {
        title: 'Islands worth the flight',
        description: 'Sand optional, good views not.',
        category: 'Travel',
        accent: 'blue',
        visibility: 'public',
        items: [
          { title: 'Watch a sunset in Santorini', location: 'Greece', status: 'completed' },
          { title: 'Dive the Great Barrier Reef', location: 'Australia', status: 'dreaming' },
        ],
      },
    ],
  },
  {
    name: 'Ada Okonkwo',
    username: 'adabuilds',
    email: 'ada@bucketick.com',
    avatarColor: 'pink',
    bio: 'Builder. Occasional gardener.',
    lists: [
      {
        title: 'Grow something real',
        description: 'The basil survived. We are calling that momentum.',
        category: 'Everyday',
        accent: 'pink',
        visibility: 'public',
        items: [
          { title: 'Keep a plant alive for a year', status: 'in_progress' },
          { title: 'Grow my own tomatoes', status: 'dreaming' },
        ],
      },
    ],
  },
  {
    name: 'Finn Doyle',
    username: 'finndoyle',
    email: 'finn@bucketick.com',
    avatarColor: 'orange',
    bio: 'Just here to do the things.',
    lists: [
      {
        title: 'Firsts I owe myself',
        description: 'Small brave things count too.',
        category: 'Adventure',
        accent: 'orange',
        visibility: 'public',
        items: [
          { title: 'Learn to surf', location: 'Portugal', status: 'in_progress' },
          { title: 'Sleep under the stars, no tent', status: 'dreaming' },
          { title: 'Swim in the ocean at sunrise', status: 'completed' },
        ],
      },
    ],
  },
];

/**
 * Wipes and re-seeds demo data. Assumes an active Mongoose connection.
 * Returns the counts inserted.
 */
export async function seedDatabase() {
  await Promise.all([
    User.deleteMany({}),
    List.deleteMany({}),
    Item.deleteMany({}),
    Follow.deleteMany({}),
    Post.deleteMany({}),
    Hype.deleteMany({}),
    Comment.deleteMany({}),
    Bookmark.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const createdIds: string[] = [];
  let coverIdx = 0;

  for (const spec of DEMO_USERS) {
    // eslint-disable-next-line no-await-in-loop
    const user = await User.create({
      name: spec.name,
      username: spec.username,
      email: spec.email,
      passwordHash,
      avatarColor: spec.avatarColor,
      avatarUrl: `https://i.pravatar.cc/300?u=${spec.username}`,
      bio: spec.bio,
      verified: true,
    });
    createdIds.push(String(user._id));

    for (const list of spec.lists) {
      // eslint-disable-next-line no-await-in-loop
      const listDoc = await List.create({
        owner: user._id,
        title: list.title,
        description: list.description,
        category: list.category,
        accent: list.accent,
        visibility: list.visibility,
        coverUrl: img(coverIdx++),
      });
      // eslint-disable-next-line no-await-in-loop
      await Item.insertMany(
        list.items.map((it) => ({
          list: listDoc._id,
          owner: user._id,
          title: it.title,
          note: it.note ?? null,
          location: it.location ?? null,
          status: it.status,
          completedAt: it.status === 'completed' ? new Date() : null,
        }))
      );
    }

    // eslint-disable-next-line no-await-in-loop
    await recomputeUserStats(String(user._id));
  }

  // Follow web: each user follows the next three (mod), so everyone has a network.
  const followEdges: { follower: string; following: string }[] = [];
  for (let i = 0; i < createdIds.length; i += 1) {
    for (let offset = 1; offset <= 3; offset += 1) {
      const target = createdIds[(i + offset) % createdIds.length];
      if (target !== createdIds[i]) {
        followEdges.push({ follower: createdIds[i], following: target });
      }
    }
  }
  await Follow.insertMany(followEdges);

  // Sync follower/following counters.
  for (const id of createdIds) {
    // eslint-disable-next-line no-await-in-loop
    const [followersCount, followingCount] = await Promise.all([
      Follow.countDocuments({ following: id }),
      Follow.countDocuments({ follower: id }),
    ]);
    // eslint-disable-next-line no-await-in-loop
    await User.updateOne({ _id: id }, { $set: { followersCount, followingCount } });
  }

  // Achievement posts.
  const postDocs = await Post.insertMany(
    DEMO_POSTS.map((p) => ({
      author: createdIds[p.author],
      caption: p.caption,
      images: p.images,
      coverAspect: p.aspect,
      category: p.category,
      visibility: 'public',
    }))
  );

  // Deterministic social edges (no randomness, no duplicate keys).
  const hypeEdges: { user: string; post: Types.ObjectId }[] = [];
  const commentEdges: { post: Types.ObjectId; author: string; body: string }[] = [];
  const bookmarkEdges: { user: string; post: Types.ObjectId }[] = [];
  const n = createdIds.length;

  postDocs.forEach((post, i) => {
    const a = DEMO_POSTS[i].author;
    const pid = post._id as Types.ObjectId;
    for (let k = 1; k <= 4; k += 1) hypeEdges.push({ user: createdIds[(a + k) % n], post: pid });
    const c1 = (a + 2) % n;
    const c2 = (a + 5) % n;
    if (c1 !== a) commentEdges.push({ post: pid, author: createdIds[c1], body: COMMENT_BODIES[i % COMMENT_BODIES.length] });
    if (c2 !== a && c2 !== c1) commentEdges.push({ post: pid, author: createdIds[c2], body: COMMENT_BODIES[(i + 3) % COMMENT_BODIES.length] });
    bookmarkEdges.push({ user: createdIds[(a + 3) % n], post: pid });
  });

  await Hype.insertMany(hypeEdges);
  await Comment.insertMany(commentEdges);
  await Bookmark.insertMany(bookmarkEdges);

  // Set post counters from what we inserted.
  for (const post of postDocs) {
    // eslint-disable-next-line no-await-in-loop
    const [hypesCount, commentsCount, bookmarksCount] = await Promise.all([
      Hype.countDocuments({ post: post._id }),
      Comment.countDocuments({ post: post._id }),
      Bookmark.countDocuments({ post: post._id }),
    ]);
    // eslint-disable-next-line no-await-in-loop
    await Post.updateOne({ _id: post._id }, { $set: { hypesCount, commentsCount, bookmarksCount } });
  }

  // Recompute user stats now that posts exist (fills postsCount).
  for (const id of createdIds) {
    // eslint-disable-next-line no-await-in-loop
    await recomputeUserStats(id);
  }

  const [users, lists, items, posts] = await Promise.all([
    User.countDocuments(),
    List.countDocuments(),
    Item.countDocuments(),
    Post.countDocuments(),
  ]);
  return {
    users,
    lists,
    items,
    posts,
    follows: followEdges.length,
    demoEmail: 'maya@bucketick.com',
    demoPassword: DEMO_PASSWORD,
  };
}

/** CLI entry: connect, seed, disconnect. Only runs when invoked directly. */
async function runCli() {
  await connectDb(env.mongoUri);
  // eslint-disable-next-line no-console
  console.log('Connected. Wiping and seeding demo data...');
  const c = await seedDatabase();
  // eslint-disable-next-line no-console
  console.log(
    `Seeded ${c.users} users, ${c.lists} lists, ${c.items} items, ${c.posts} posts, ${c.follows} follows.`
  );
  // eslint-disable-next-line no-console
  console.log(`Demo login: ${c.demoEmail} / ${c.demoPassword} (same password for all demo users).`);
  await disconnectDb();
}

if (require.main === module) {
  runCli().catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Seed failed:', err);
    process.exit(1);
  });
}
