#!/usr/bin/env node
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { loadTree, buildFlat, buildIndex } from './build-index.mjs';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const REGIONS_DIR = join(ROOT, 'regions');
const TODO_PATH = join(ROOT, 'unsorted', 'todo.json');
const INDEX_PATH = join(ROOT, 'index.json');
const BUCKET_KEYS = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','_'];
const CODE_RE = /^[a-z0-9]+$/;
const PATH_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_PATH_LEN = 64;

const errors = [];
function err(msg) { errors.push(msg); }

function checkNode(node, ancestors, file) {
  if (!node || typeof node !== 'object') {
    err(`${file}: node at ${ancestors.join('-') || '<root>'} is not an object`);
    return;
  }
  if (typeof node.code !== 'string' || !CODE_RE.test(node.code)) {
    err(`${file}: invalid code "${node.code}" at ${ancestors.join('-') || '<root>'}`);
    return;
  }
  if (typeof node.name !== 'string' || node.name.length === 0) {
    err(`${file}: missing/empty name at ${[...ancestors, node.code].join('-')}`);
  }
  const joined = [...ancestors, node.code].join('-');
  if (joined.length > MAX_PATH_LEN) {
    err(`${file}: joined path "${joined}" exceeds ${MAX_PATH_LEN} chars`);
  }
  const allowed = new Set(['code', 'name', 'regions']);
  for (const k of Object.keys(node)) {
    if (!allowed.has(k)) err(`${file}: unexpected key "${k}" at ${joined}`);
  }
  if ('regions' in node) {
    if (!Array.isArray(node.regions)) {
      err(`${file}: regions must be array at ${joined}`);
      return;
    }
    const codes = node.regions.map((c) => c?.code);
    const dupSet = new Set();
    const dups = new Set();
    for (const c of codes) {
      if (dupSet.has(c)) dups.add(c);
      dupSet.add(c);
    }
    for (const d of dups) err(`${file}: duplicate child code "${d}" under ${joined}`);
    const sorted = [...codes].sort((a, b) => a.localeCompare(b));
    for (let i = 0; i < codes.length; i++) {
      if (codes[i] !== sorted[i]) {
        err(`${file}: children under ${joined} not sorted (expected ${sorted.join(',')}, got ${codes.join(',')})`);
        break;
      }
    }
    for (const child of node.regions) {
      checkNode(child, [...ancestors, node.code], file);
    }
  }
}

function checkRegions() {
  if (!existsSync(REGIONS_DIR)) {
    err('regions/ directory missing');
    return;
  }
  const files = readdirSync(REGIONS_DIR).filter((f) => f.endsWith('.json'));
  for (const file of files) {
    const stem = basename(file, '.json');
    if (!CODE_RE.test(stem)) {
      err(`regions/${file}: filename stem "${stem}" not [a-z0-9]+`);
      continue;
    }
    let node;
    try {
      node = JSON.parse(readFileSync(join(REGIONS_DIR, file), 'utf8'));
    } catch (e) {
      err(`regions/${file}: JSON parse error: ${e.message}`);
      continue;
    }
    if (node.code !== stem) {
      err(`regions/${file}: code "${node.code}" does not match filename stem "${stem}"`);
    }
    checkNode(node, [], `regions/${file}`);
  }
}

function checkTodo() {
  if (!existsSync(TODO_PATH)) { err('unsorted/todo.json missing'); return; }
  let todo;
  try { todo = JSON.parse(readFileSync(TODO_PATH, 'utf8')); }
  catch (e) { err(`unsorted/todo.json: JSON parse error: ${e.message}`); return; }
  if (typeof todo.generated_at !== 'string') err('unsorted/todo.json: generated_at missing');
  if (!todo.buckets || typeof todo.buckets !== 'object') { err('unsorted/todo.json: buckets missing'); return; }
  const keys = Object.keys(todo.buckets).sort();
  const expected = [...BUCKET_KEYS].sort();
  if (keys.length !== expected.length || keys.some((k, i) => k !== expected[i])) {
    err(`unsorted/todo.json: buckets must have exactly keys ${expected.join(',')}, got ${keys.join(',')}`);
  }
  for (const k of BUCKET_KEYS) {
    const entries = todo.buckets[k];
    if (!Array.isArray(entries)) { err(`unsorted/todo.json: bucket "${k}" is not array`); continue; }
    const raws = entries.map((e) => e?.raw);
    const sorted = [...raws].sort((a, b) => a.localeCompare(b));
    for (let i = 0; i < raws.length; i++) {
      if (raws[i] !== sorted[i]) {
        err(`unsorted/todo.json: bucket "${k}" not sorted by raw`);
        break;
      }
    }
    for (const e of entries) {
      if (typeof e.raw !== 'string' || e.raw.length === 0) err(`unsorted/todo.json: empty raw in bucket "${k}"`);
      const first = e.raw[0] || '';
      const wantBucket = /[a-z]/.test(first) ? first : '_';
      if (wantBucket !== k) err(`unsorted/todo.json: entry "${e.raw}" in bucket "${k}", expected "${wantBucket}"`);
      if (typeof e.reason !== 'string') err(`unsorted/todo.json: missing reason for "${e.raw}"`);
      else if (!/^(no_root|invalid_chars|missing_parent:[a-z0-9]+(-[a-z0-9]+)*)$/.test(e.reason)) {
        err(`unsorted/todo.json: invalid reason "${e.reason}" for "${e.raw}"`);
      }
      if (typeof e.first_seen !== 'string') err(`unsorted/todo.json: missing first_seen for "${e.raw}"`);
    }
  }
}

function checkIndexFreshness() {
  if (!existsSync(INDEX_PATH)) { err('index.json missing'); return; }
  let onDisk;
  try { onDisk = JSON.parse(readFileSync(INDEX_PATH, 'utf8')); }
  catch (e) { err(`index.json: JSON parse error: ${e.message}`); return; }
  let computed;
  try { computed = buildIndex(onDisk.generated_at || '1970-01-01T00:00:00Z'); }
  catch (e) { err(`index.json: rebuild failed: ${e.message}`); return; }
  const a = JSON.stringify({ tree: onDisk.tree, flat: onDisk.flat });
  const b = JSON.stringify({ tree: computed.tree, flat: computed.flat });
  if (a !== b) err('index.json is stale; run scripts/build-index.mjs');
}

function checkPrScope() {
  const list = process.env.GH_CHANGED_FILES;
  if (!list) return;
  const files = list.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  const allow = /^(regions\/[a-z0-9]+\.json|unsorted\/todo\.json)$/;
  const baseRef = process.env.GH_BASE_REF;
  for (const f of files) {
    if (!allow.test(f)) {
      err(`PR scope: path "${f}" not allowed; only regions/*.json and unsorted/todo.json may change`);
      continue;
    }
    if (f.startsWith('regions/') && baseRef) {
      try {
        execSync(`git cat-file -e ${baseRef}:${f}`, { stdio: 'ignore' });
      } catch {
        err(`PR scope: new root file "${f}" is not allowed; new country roots are added by maintainers only`);
      }
    }
  }
}

function pathsFromTree(tree) {
  const out = new Map();
  function walk(node, ancestors) {
    const p = [...ancestors, node.code].join('-');
    out.set(p, node.name);
    if (Array.isArray(node.regions)) for (const c of node.regions) walk(c, [...ancestors, node.code]);
  }
  for (const r of tree) walk(r, []);
  return out;
}

function loadTreeAtRef(ref) {
  const lsTree = execSync(`git ls-tree --name-only ${ref} regions/`, { encoding: 'utf8' });
  const files = lsTree.split('\n').map((s) => s.trim()).filter((s) => s.endsWith('.json'));
  const tree = [];
  for (const file of files) {
    const body = execSync(`git show ${ref}:${file}`, { encoding: 'utf8' });
    tree.push(JSON.parse(body));
  }
  return tree;
}

function checkDiffGuard() {
  const baseRef = process.env.GH_BASE_REF;
  if (!baseRef) return;
  const labels = (process.env.GH_LABELS || '').split(',').map((s) => s.trim()).filter(Boolean);
  let baseTree;
  try { baseTree = loadTreeAtRef(baseRef); }
  catch (e) { err(`diff guard: cannot load base ref ${baseRef}: ${e.message}`); return; }
  const headTree = loadTree();
  const basePaths = pathsFromTree(baseTree);
  const headPaths = pathsFromTree(headTree);

  const removed = [];
  for (const p of basePaths.keys()) if (!headPaths.has(p)) removed.push(p);
  const added = [];
  for (const p of headPaths.keys()) if (!basePaths.has(p)) added.push(p);

  const removedLeaves = removed.map((p) => p.split('-').pop());
  const addedByLeaf = new Map();
  for (const p of added) {
    const leaf = p.split('-').pop();
    if (!addedByLeaf.has(leaf)) addedByLeaf.set(leaf, []);
    addedByLeaf.get(leaf).push(p);
  }

  const moves = [];
  const deletes = [];
  for (let i = 0; i < removed.length; i++) {
    const leaf = removedLeaves[i];
    const candidates = addedByLeaf.get(leaf) || [];
    if (candidates.length > 0) {
      moves.push({ from: removed[i], to: candidates[0] });
      candidates.shift();
    } else {
      deletes.push(removed[i]);
    }
  }
  for (const d of deletes) err(`diff guard: deletion of "${d}" in regions/ is not allowed`);
  if (moves.length > 0 && !labels.includes('approved-move')) {
    for (const m of moves) err(`diff guard: move from "${m.from}" to "${m.to}" requires label "approved-move"`);
  } else if (moves.length > 0) {
    for (const m of moves) console.log(`move: ${m.from} -> ${m.to} (label approved-move present)`);
  }
}

function main() {
  checkRegions();
  checkTodo();
  checkIndexFreshness();
  checkPrScope();
  checkDiffGuard();
  if (errors.length > 0) {
    for (const e of errors) console.error(`ERROR: ${e}`);
    console.error(`\n${errors.length} validation error(s).`);
    process.exit(1);
  }
  console.log('validation OK');
}

main();
