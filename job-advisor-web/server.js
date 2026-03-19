#!/usr/bin/env node
/**
 * Local server for Job Advisor web app.
 * - Serves static files from ./
 * - POST /api/request → saves JSON to request.json
 * - GET /api/report → returns report.md content
 * Run: node server.js (or npm run job-advisor)
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT || '8765', 10);
const REQUEST_FILE = path.join(__dirname, 'request.json');
const REPORT_FILE = path.join(__dirname, 'report.md');

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.md': 'text/markdown',
  '.ico': 'image/x-icon',
};

function serveStatic(req, res, filePath) {
  const ext = path.extname(filePath);
  res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
  res.setHeader('Cache-Control', 'no-cache');
  fs.createReadStream(filePath).pipe(res);
}

function sendJson(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // POST /api/request - save request JSON
  if (req.method === 'POST' && pathname === '/api/request') {
    let body = '';
    for await (const chunk of req) body += chunk;
    try {
      const data = JSON.parse(body);
      fs.writeFileSync(REQUEST_FILE, JSON.stringify(data, null, 2));
      sendJson(res, { ok: true, message: 'Request saved to request.json' });
    } catch (e) {
      sendJson(res, { ok: false, error: e.message }, 400);
    }
    return;
  }

  // GET /api/report - return report.md
  if (req.method === 'GET' && pathname === '/api/report') {
    try {
      const content = fs.readFileSync(REPORT_FILE, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/markdown', 'Cache-Control': 'no-cache' });
      res.end(content);
    } catch (e) {
      if (e.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'No report yet' }));
      } else throw e;
    }
    return;
  }

  // GET /reference/servicenow - ServiceNow Job Fit Dashboard reference
  if (req.method === 'GET' && pathname === '/reference/servicenow') {
    const refPath = path.join(__dirname, '..', 'assets', 'docs', 'ServiceNow-Job-Fit-Dashboard.html');
    try {
      const content = fs.readFileSync(refPath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-cache' });
      res.end(content);
    } catch (e) {
      res.writeHead(404);
      res.end('Reference not found');
    }
    return;
  }

  // GET /api/request - return request.json (for debugging)
  if (req.method === 'GET' && pathname === '/api/request') {
    try {
      const content = fs.readFileSync(REQUEST_FILE, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
      res.end(content);
    } catch (e) {
      if (e.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'No request yet' }));
      } else throw e;
    }
    return;
  }

  // Static files
  const filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname.slice(1));
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end();
    return;
  }
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    serveStatic(req, res, filePath);
  });
});

server.listen(PORT, () => {
  console.log(`Job Advisor web: http://localhost:${PORT}`);
  console.log('  API: POST /api/request, GET /api/report');
});
