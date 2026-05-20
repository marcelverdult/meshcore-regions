#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const REGIONS_DIR = join(ROOT, 'regions');
const INDEX_PATH = join(ROOT, 'index.json');

export function loadTree() {
  const files = readdirSync(REGIONS_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort();

  const tree = [];
  for (const file of files) {
    const stem = basename(file, '.json');
    const body = readFileSync(join(REGIONS_DIR, file), 'utf8');
    const node = JSON.parse(body);
    if (node.code !== stem) {
      throw new Error(`filename/code mismatch: ${file} has code "${node.code}"`);
    }
    tree.push(normalize(node));
  }
  return tree;
}

function normalize(node) {
  const out = { code: node.code, name: node.name };
  if (Array.isArray(node.regions) && node.regions.length > 0) {
    const sorted = [...node.regions].sort((a, b) => a.code.localeCompare(b.code));
    out.regions = sorted.map(normalize);
  } else if (Array.isArray(node.regions)) {
    out.regions = [];
  }
  return out;
}

function* walk(node, ancestors) {
  const path = [...ancestors, node.code].join('-');
  yield { path, name: node.name };
  if (Array.isArray(node.regions)) {
    for (const child of node.regions) {
      yield* walk(child, [...ancestors, node.code]);
    }
  }
}

export function buildFlat(tree) {
  const flat = [];
  for (const root of tree) {
    for (const entry of walk(root, [])) flat.push(entry);
  }
  flat.sort((a, b) => a.path.localeCompare(b.path));
  return flat;
}

export function buildIndex(generatedAt) {
  const tree = loadTree();
  const flat = buildFlat(tree);
  return { generated_at: generatedAt, tree, flat };
}

function main() {
  const generatedAt = process.env.SOURCE_DATE_EPOCH
    ? new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000).toISOString().replace(/\.\d{3}Z$/, 'Z')
    : new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  const index = buildIndex(generatedAt);
  writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2) + '\n');
  console.log(`wrote ${INDEX_PATH} (${index.flat.length} entries)`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
