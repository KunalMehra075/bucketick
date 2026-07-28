import { createApp } from './app';
import { connectDb } from './config/db';
import { env } from './config/env';

async function main() {
  await connectDb(env.mongoUri);
  // eslint-disable-next-line no-console
  console.log('Connected to MongoDB');

  const app = createApp();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Bucketick API listening on http://localhost:${env.port}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err);
  process.exit(1);
});
