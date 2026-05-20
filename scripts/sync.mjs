#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { loadTree, buildFlat, buildIndex } from './build-index.mjs';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const REGIONS_DIR = join(ROOT, 'regions');
const TODO_PATH = join(ROOT, 'unsorted', 'todo.json');
const INDEX_PATH = join(ROOT, 'index.json');
const README_PATH = join(ROOT, 'README.md');
const NOW_ISO = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
const BUCKET_KEYS = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','_'];
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_PATH_LEN = 64;

function fatal(msg) {
  console.error(`FATAL: ${msg}`);
  process.exit(1);
}

async function fetchUpstream(url) {
  let res;
  try { res = await fetch(url); }
  catch (e) { fatal(`fetch failed (${e.constructor?.name || 'Error'})`); }
  if (!res.ok) fatal(`upstream HTTP ${res.status}`);
  let body;
  try { body = await res.json(); }
  catch (e) { fatal(`upstream returned non-JSON`); }
  if (!body || !Array.isArray(body.regions)) fatal('upstream response missing regions[]');
  return { status: res.status, names: body.regions.map((r) => r.name).filter((n) => typeof n === 'string') };
}

function indexTreeByCode(tree) {
  const map = new Map();
  for (const r of tree) map.set(r.code, r);
  return map;
}

function findOrPlace(rootMap, segments) {
  // Returns: { kind: 'noop' | 'add' | 'todo', addPath?, addParent?, reason? }
  const [root, ...rest] = segments;
  const rootNode = rootMap.get(root);
  if (!rootNode) return { kind: 'todo', reason: 'no_root' };

  if (rest.length === 0) return { kind: 'noop' };

  let node = rootNode;
  let traversedPath = root;
  for (let i = 0; i < rest.length - 1; i++) {
    const seg = rest[i];
    const childPath = `${traversedPath}-${seg}`;
    if (!Array.isArray(node.regions)) {
      return { kind: 'todo', reason: `missing_parent:${childPath}` };
    }
    const child = node.regions.find((c) => c.code === childPath);
    if (!child) {
      return { kind: 'todo', reason: `missing_parent:${childPath}` };
    }
    node = child;
    traversedPath = childPath;
  }

  const final = rest[rest.length - 1];
  const finalPath = `${traversedPath}-${final}`;
  if (!Array.isArray(node.regions)) node.regions = [];
  if (node.regions.find((c) => c.code === finalPath)) return { kind: 'noop' };

  if (finalPath.length > MAX_PATH_LEN) return { kind: 'todo', reason: `missing_parent:${traversedPath}` };

  node.regions.push({ code: finalPath, name: final, regions: [] });
  node.regions.sort((a, b) => a.code.localeCompare(b.code));
  return { kind: 'add', addPath: finalPath, addParent: traversedPath };
}

function pathsInTree(tree) {
  const set = new Set();
  function walk(node) {
    set.add(node.code);
    if (Array.isArray(node.regions)) for (const c of node.regions) walk(c);
  }
  for (const r of tree) walk(r);
  return set;
}

function writeRootFiles(tree) {
  for (const root of tree) {
    const body = JSON.stringify(stripEmpty(root), null, 2) + '\n';
    writeFileSync(join(REGIONS_DIR, root.code + '.json'), body);
  }
}

function stripEmpty(node) {
  const out = { code: node.code, name: node.name };
  if (Array.isArray(node.regions)) {
    out.regions = node.regions.map(stripEmpty);
    out.regions.sort((a, b) => a.code.localeCompare(b.code));
  }
  return out;
}

function loadTodo() {
  if (!existsSync(TODO_PATH)) {
    const empty = { generated_at: NOW_ISO, buckets: {} };
    for (const k of BUCKET_KEYS) empty.buckets[k] = [];
    return empty;
  }
  return JSON.parse(readFileSync(TODO_PATH, 'utf8'));
}

function bucketFor(raw) {
  const c = raw[0] || '';
  return /[a-z]/.test(c) ? c : '_';
}

function rewriteReadmeBlock(stats) {
  if (!existsSync(README_PATH)) return;
  const src = readFileSync(README_PATH, 'utf8');
  const begin = '<!-- regions:auto-status:begin -->';
  const end = '<!-- regions:auto-status:end -->';
  const iB = src.indexOf(begin);
  const iE = src.indexOf(end);
  if (iB === -1 || iE === -1 || iE < iB) return;

  const recent = recentActivityRows();
  const lines = [];
  lines.push(begin);
  lines.push('');
  lines.push(`- Last sync: \`${NOW_ISO}\``);
  lines.push(`- Roots: ${stats.roots}`);
  lines.push(`- Total nodes: ${stats.totalNodes}`);
  lines.push(`- Unsorted entries: ${stats.unsortedTotal}`);
  lines.push('');
  if (recent.length > 0) {
    lines.push('| when (UTC) | kind | path | note |');
    lines.push('|---|---|---|---|');
    for (const row of recent) {
      lines.push(`| ${row.when} | ${row.kind} | ${row.path || ''} | ${row.note || ''} |`);
    }
  } else {
    lines.push('_No activity recorded yet._');
  }
  lines.push('');
  lines.push(end);

  const out = src.slice(0, iB) + lines.join('\n') + src.slice(iE + end.length);
  writeFileSync(README_PATH, out);
}

function recentActivityRows() {
  // Best-effort: parse last 20 commits on HEAD. Commits authored by the sync
  // bot count as "sync"; everything else is "manual".
  let out;
  try { out = execSync('git log -n 50 --pretty=format:%H%x09%cI%x09%aN%x09%s', { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); }
  catch { return []; }
  const rows = [];
  for (const line of out.split('\n')) {
    const parts = line.split('\t');
    if (parts.length < 4) continue;
    const [sha, when, author, ...subjectParts] = parts;
    const subject = subjectParts.join('\t');
    const kind = author === 'github-actions[bot]' ? 'sync' : 'manual';
    rows.push({ when: when.replace(/\.\d{3}Z?$/, 'Z').replace(/[+-]\d{2}:\d{2}$/, 'Z'), kind, path: sha.slice(0, 7), note: subject });
    if (rows.length >= 20) break;
  }
  return rows;
}

function countNodes(tree) {
  let n = 0;
  function walk(node) { n++; if (Array.isArray(node.regions)) for (const c of node.regions) walk(c); }
  for (const r of tree) walk(r);
  return n;
}

async function main() {
  const url = process.env.KIEKR_MAP_API_URL;
  if (!url) fatal('KIEKR_MAP_API_URL is not set');

  const { status, names } = await fetchUpstream(url);
  console.log(`run ${NOW_ISO} status=${status} upstream_count=${names.length}`);

  const tree = loadTree();
  const rootMap = indexTreeByCode(tree);

  let added = 0;
  const newTodoEntries = [];
  const seenInRun = new Set();

  for (const raw of names) {
    if (seenInRun.has(raw)) continue;
    seenInRun.add(raw);

    if (!NAME_RE.test(raw)) {
      console.log(`todo ${raw}  reason=invalid_chars  bucket=${bucketFor(raw)}`);
      newTodoEntries.push({ raw, reason: 'invalid_chars' });
      continue;
    }
    const result = findOrPlace(rootMap, raw.split('-'));
    if (result.kind === 'noop') {
      console.log(`noop ${raw}`);
    } else if (result.kind === 'add') {
      console.log(`add  ${raw}  -> ${result.addParent}`);
      added++;
    } else {
      console.log(`todo ${raw}  reason=${result.reason}  bucket=${bucketFor(raw)}`);
      newTodoEntries.push({ raw, reason: result.reason });
    }
  }

  // Persist tree
  writeRootFiles(tree);

  // Reconcile todo
  const todo = loadTodo();
  for (const k of BUCKET_KEYS) if (!Array.isArray(todo.buckets[k])) todo.buckets[k] = [];

  const headPaths = pathsInTree(tree);
  const keptByRaw = new Map();
  let resolved = 0;
  for (const k of BUCKET_KEYS) {
    for (const entry of todo.buckets[k]) {
      if (headPaths.has(entry.raw)) {
        console.log(`resolved ${entry.raw}  (was bucket=${k}, reason=${entry.reason})`);
        resolved++;
        continue;
      }
      // Re-evaluate against updated tree to keep reason fresh
      let reEval = null;
      if (!NAME_RE.test(entry.raw)) reEval = { kind: 'todo', reason: 'invalid_chars' };
      else reEval = findOrPlace(rootMap, entry.raw.split('-'));
      if (reEval.kind === 'noop') {
        console.log(`resolved ${entry.raw}  (was bucket=${k}, reason=${entry.reason})`);
        resolved++;
        continue;
      }
      const reason = reEval.kind === 'todo' ? reEval.reason : entry.reason;
      keptByRaw.set(entry.raw, { raw: entry.raw, reason, first_seen: entry.first_seen });
    }
  }

  for (const ne of newTodoEntries) {
    if (keptByRaw.has(ne.raw)) {
      const k = keptByRaw.get(ne.raw);
      k.reason = ne.reason;
    } else {
      keptByRaw.set(ne.raw, { raw: ne.raw, reason: ne.reason, first_seen: NOW_ISO });
    }
  }

  const newBuckets = {};
  for (const k of BUCKET_KEYS) newBuckets[k] = [];
  for (const entry of keptByRaw.values()) {
    newBuckets[bucketFor(entry.raw)].push(entry);
  }
  let unsortedTotal = 0;
  const reasonCounts = { no_root: 0, missing_parent: 0, invalid_chars: 0 };
  for (const k of BUCKET_KEYS) {
    newBuckets[k].sort((a, b) => a.raw.localeCompare(b.raw));
    unsortedTotal += newBuckets[k].length;
    for (const e of newBuckets[k]) {
      if (e.reason === 'no_root') reasonCounts.no_root++;
      else if (e.reason === 'invalid_chars') reasonCounts.invalid_chars++;
      else if (e.reason.startsWith('missing_parent:')) reasonCounts.missing_parent++;
    }
    console.log(`bucket ${k}: ${newBuckets[k].length} entries`);
  }

  writeFileSync(TODO_PATH, JSON.stringify({ generated_at: NOW_ISO, buckets: newBuckets }, null, 2) + '\n');

  // Regenerate index
  const index = buildIndex(NOW_ISO);
  writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2) + '\n');

  // README block
  rewriteReadmeBlock({
    roots: tree.length,
    totalNodes: countNodes(tree),
    unsortedTotal,
  });

  const summary = {
    added,
    resolved,
    unsorted_total: unsortedTotal,
    no_root: reasonCounts.no_root,
    missing_parent: reasonCounts.missing_parent,
    invalid_chars: reasonCounts.invalid_chars,
    upstream_count: names.length,
    committed: null,
  };
  console.log(`SUMMARY ${JSON.stringify(summary)}`);
}

main().catch((e) => fatal(e.message || String(e)));
