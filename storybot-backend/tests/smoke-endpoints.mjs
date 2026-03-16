import assert from 'node:assert/strict';
import http from 'node:http';

process.env.REDDIT_USER_AGENT = process.env.REDDIT_USER_AGENT || 'storybot-smoke-test';
process.env.REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID || 'dummy-client-id';
process.env.REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET || 'dummy-client-secret';
process.env.REDDIT_REFRESH_TOKEN = process.env.REDDIT_REFRESH_TOKEN || 'dummy-refresh-token';

const { default: app } = await import('../app.js');

const server = http.createServer(app);

const listen = () => new Promise((resolve) => {
  server.listen(0, '127.0.0.1', () => resolve(server.address().port));
});

const close = () => new Promise((resolve, reject) => {
  server.close((err) => (err ? reject(err) : resolve()));
});

const port = await listen();
const baseUrl = `http://127.0.0.1:${port}`;

const checks = [];

try {
  {
    const response = await fetch(`${baseUrl}/api/check-subreddit`);
    const body = await response.json();
    assert.equal(response.status, 400);
    assert.equal(body.error, 'Subreddit name required.');
    checks.push('check-subreddit validation');
  }

  {
    const response = await fetch(`${baseUrl}/api/text-to-speech`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: '' }),
    });
    const body = await response.json();
    assert.equal(response.status, 400);
    assert.equal(body.error, 'TTS failed');
    assert.equal(body.detail, 'Text input must be a non-empty string.');
    checks.push('text-to-speech validation');
  }

  {
    const response = await fetch(`${baseUrl}/api/compose-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoUrl: 'https://example.com/video' }),
    });
    const body = await response.json();
    assert.equal(response.status, 400);
    assert.equal(body.error, 'Missing required fields.');
    checks.push('compose-video validation');
  }

  {
    const response = await fetch(`${baseUrl}/api/suggest-subreddits`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.deepEqual(body, { subreddits: [] });
    checks.push('suggest-subreddits empty query');
  }

  {
    const response = await fetch(`${baseUrl}/api/fetch-youtube-video`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(typeof body.videoUrl, 'string');
    assert.match(body.videoUrl, /^https:\/\/www\.youtube\.com\/watch\?v=/);
    checks.push('fetch-youtube-video url');
  }

  console.log('Smoke checks passed:', checks.join(', '));
} finally {
  await close();
}
