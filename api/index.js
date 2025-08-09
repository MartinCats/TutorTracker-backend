// api/index.js
import serverless from 'serverless-http';
import { app, init } from '../src/app.js';

let initPromise; // ป้องกัน init ซ้ำ
export default async function handler(req, res) {
  // health ไม่รอ DB
  if (req.url === '/api/health') {
    return res.status(200).json({ ok: true, inited: Boolean(initPromise) });
  }

  // init ครั้งเดียว พร้อม timeout กันค้าง
  if (!initPromise) {
    initPromise = Promise.race([
      init(),                                  // เชื่อม MongoDB
      new Promise((_, r) => setTimeout(() => r(new Error('init-timeout')), 7000))
    ]);
  }
  try { await initPromise; }
  catch (e) {
    return res.status(500).json({ ok: false, error: String(e.message || e) });
  }

  const handle = serverless(app);
  return handle(req, res);
}
