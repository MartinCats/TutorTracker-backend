import { app, init } from './src/app.js';
const PORT = process.env.PORT || 4000;
init().then(() => {
  app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
}).catch((err) => {
  console.error('Startup error:', err);
  process.exit(1);
});
