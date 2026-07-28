/**
 * Zero-config demo server. Spins up an in-memory MongoDB, seeds it, and starts
 * the API. No connection string or external database needed.
 *
 * Data lives only in memory and resets on restart. Use `npm run dev` (with a real
 * MONGODB_URI in .env) once you want data to persist.
 *
 * Usage: npm run dev:demo
 */
import { MongoMemoryServer } from 'mongodb-memory-server';

async function main() {
  // eslint-disable-next-line no-console
  console.log('Starting in-memory MongoDB (first run downloads a small binary)...');
  const mem = await MongoMemoryServer.create();

  // Set env BEFORE importing anything that reads config/env.
  process.env.MONGODB_URI = mem.getUri('bucketick_demo');
  process.env.PORT = process.env.PORT || '8090';
  process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'demo_access_secret';
  process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'demo_refresh_secret';

  const { connectDb, disconnectDb } = await import('./config/db');
  const { createApp } = await import('./app');
  const { seedDatabase } = await import('./seed');

  await connectDb(process.env.MONGODB_URI);
  const counts = await seedDatabase();

  const port = Number(process.env.PORT);
  const app = createApp();
  const server = app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log('\n============================================================');
    // eslint-disable-next-line no-console
    console.log(`  Bucketick API (demo)  ->  http://localhost:${port}`);
    // eslint-disable-next-line no-console
    console.log(
      `  Seeded ${counts.users} users, ${counts.lists} lists, ${counts.items} items, ${counts.posts} posts.`
    );
    // eslint-disable-next-line no-console
    console.log(`  Demo login: ${counts.demoEmail} / ${counts.demoPassword}`);
    // eslint-disable-next-line no-console
    console.log('  In-memory database. Data resets when you stop this process.');
    // eslint-disable-next-line no-console
    console.log('============================================================\n');
  });

  const shutdown = async () => {
    // eslint-disable-next-line no-console
    console.log('\nShutting down demo server...');
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await disconnectDb();
    await mem.stop();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Demo server failed to start:', err);
  process.exit(1);
});
