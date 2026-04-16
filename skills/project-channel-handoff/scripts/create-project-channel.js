#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DISCORD_API = 'https://discord.com/api/v10';

function arg(name, fallback = null) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return fallback;
  return process.argv[idx + 1] ?? fallback;
}
function required(name) {
  const value = arg(name);
  if (!value) throw new Error(`Missing --${name}`);
  return value;
}
function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 90);
}
async function discordFetch(token, route, options = {}) {
  const res = await fetch(`${DISCORD_API}${route}`, {
    ...options,
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
  if (!res.ok) throw new Error(`Discord API ${route} failed (${res.status}): ${JSON.stringify(json)}`);
  return json;
}
function splitMessage(text, max = 1800) {
  const parts = [];
  let remaining = text.trim();
  while (remaining.length > max) {
    let cut = remaining.lastIndexOf('\n', max);
    if (cut < max * 0.5) cut = remaining.lastIndexOf(' ', max);
    if (cut < max * 0.5) cut = max;
    parts.push(remaining.slice(0, cut).trim());
    remaining = remaining.slice(cut).trim();
  }
  if (remaining) parts.push(remaining);
  return parts;
}
async function sendChunks(token, channelId, title, text) {
  const chunks = splitMessage(text);
  for (let i = 0; i < chunks.length; i++) {
    const content = i === 0 ? `**${title}**\n\n${chunks[i]}` : chunks[i];
    await discordFetch(token, `/channels/${channelId}/messages`, { method: 'POST', body: JSON.stringify({ content }) });
  }
}
async function main() {
  const token = process.env.DISCORD_BOT_TOKEN || process.env.DISCORD_TOKEN;
  if (!token) throw new Error('Missing DISCORD_BOT_TOKEN or DISCORD_TOKEN.');
  const guildId = required('guild-id');
  const name = slugify(required('name'));
  const contextPath = required('context');
  const topic = arg('topic', 'Project handoff channel');
  const parentId = arg('parent-id');
  const type = Number(arg('type', '0'));
  const handoff = JSON.parse(fs.readFileSync(path.resolve(contextPath), 'utf8'));
  const created = await discordFetch(token, `/guilds/${guildId}/channels`, {
    method: 'POST',
    body: JSON.stringify({ name, type, topic, parent_id: parentId || undefined }),
  });
  await discordFetch(token, `/channels/${created.id}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content: handoff.intro || `Project handoff for ${handoff.projectName || name}` }),
  });
  for (const section of handoff.sections || []) {
    await sendChunks(token, created.id, section.title, section.body);
  }
  console.log(JSON.stringify({ ok: true, channelId: created.id, channelName: created.name }, null, 2));
}
main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
