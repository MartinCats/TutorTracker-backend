import serverless from 'serverless-http';
import { app, init } from '../src/app.js';

let inited = false;
export default async function handler(req, res) {
  if (!inited) {
    await init();        // ต่อ MongoDB หนึ่งครั้ง
    inited = true;
  }
  const handle = serverless(app);
  return handle(req, res);
}
