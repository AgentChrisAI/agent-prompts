#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

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
function replaceAllDeep(value, replacements) {
  if (typeof value === 'string') {
    let out = value;
    for (const [key, replacement] of Object.entries(replacements)) {
      out = out.split(key).join(replacement);
    }
    return out;
  }
  if (Array.isArray(value)) return value.map((item) => replaceAllDeep(item, replacements));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, replaceAllDeep(v, replacements)]));
  }
  return value;
}
function main() {
  const templatePath = required('template');
  const outPath = required('out');
  const projectName = required('project-name');
  const raw = fs.readFileSync(path.resolve(templatePath), 'utf8');
  const template = JSON.parse(raw);
  const result = replaceAllDeep(template, { PROJECT_NAME: projectName });
  fs.mkdirSync(path.dirname(path.resolve(outPath)), { recursive: true });
  fs.writeFileSync(path.resolve(outPath), JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ ok: true, out: path.resolve(outPath) }, null, 2));
}
main();
