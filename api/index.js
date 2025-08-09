import serverless from 'serverless-http';
import { app, init } from '../src/app.js';

let initPromise = null;
let lastInitError = null;

export default async function handler(req, res) {
  // HEALTH: ไม่แตะ DB
  if (req.url === '/api/health') {
    return res.status(200).json({ ok: true, inited: Boolean(initPromise) && !lastInitError });
  }

  // DEBUG: ลอง init แล้วส่งผลลัพธ์/เออเรอร์จริงกลับไป
  if (req.url === '/api/debug/init') {
    try {
      if (!initPromise) initPromise = init();
      await initPromise;
      lastInitError = null;
      return res.status(200).json({ ok: true, message: 'DB connected' });
    } catch (e) {
      lastInitError = e;
      return res.status(500).json({ ok: false, error: String(e?.message || e) });
    }
  }

  // เส้นทางอื่น: ต้องผ่าน init ก่อน
  try {
    if (!initPromise) initPromise = init();
    await initPromise;
    lastInitError = null;
  } catch (e) {
    lastInitError = e;
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }

  return serverless(app)(req, res);
}
