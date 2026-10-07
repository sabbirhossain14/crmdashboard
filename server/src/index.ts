// Local / traditional server entry. On Vercel the app is served via api/index.ts.
import app from './app.js';
import { connectDB } from './config/db.js';

const port = Number(process.env.PORT || 4000);
connectDB()
  .then(() => app.listen(port, () => console.info(`ClientFlow API listening on ${port}`)))
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  });
