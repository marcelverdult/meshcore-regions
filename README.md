# meshcore-regions

Canonical, community-editable catalog of MeshCore regions used worldwide.

## What this is

A simple JSON catalog of region identifiers used across the MeshCore ecosystem. Each region has a stable `code` (e.g. `de-hh-attraktor` or `hansemesh`), a human-readable `name` (the leaf label, e.g. `Attraktor`), and optional nested children. A region's `code` never changes once published, even if it gets re-nested under a different parent.

## How to consume

Two stable raw URLs:

- Full catalog (tree + flat lookup):
  `https://raw.githubusercontent.com/marcelverdult/meshcore-regions/main/index.json`
- One country at a time:
  `https://raw.githubusercontent.com/marcelverdult/meshcore-regions/main/regions/<code>.json`

Each region node has this shape:

```json
{
  "code": "de-hh-attraktor",
  "name": "Attraktor",
  "regions": [ /* same shape, optional */ ]
}
```

`code` is stable and unique across the catalog. It usually mirrors the path from the root (e.g. `de-hh-attraktor`), but named networks that span multiple parents may keep a standalone code (e.g. `hansemesh` nested under `de`). The `flat` array in `index.json` lists every node as `{ "path": "<code>", "name": "<name>" }` for quick lookups; `path` equals the node's `code`.

## How to contribute

Pull requests may only modify files matching:

- `regions/*.json`
- `unsorted/todo.json`

Anything else (scripts, workflows, schemas, `index.json`, `README.md`) is maintained by repository maintainers via direct commits.

Rules enforced automatically by CI:

- **No new country root files.** PRs may not add files to `regions/`. The 249 ISO country codes plus `sco` and `ioi` are already seeded; if you need another root, open an issue.
- **No deletions** in `regions/`. Once a region is in the tree, it stays.
- **Moves require approval.** If your PR moves a node from one parent to another, a maintainer adds the `approved-move` label before merge.
- **Subdivision additions and name edits are free.** Add subdivisions under existing parents, fix a display name — no label needed.
- Codes are lowercase ASCII letters, digits, and hyphens. Each hyphen-separated segment is capped at 29 characters to match the MeshCore firmware region-name buffer (`char name[31]` in `RegionMap.h`, minus one byte reserved for the implicit `#` prefix the firmware prepends when deriving auto-hashtag transport keys; see meshcore-dev/MeshCore#2434). A region's `code` is immutable — once published, it does not change, even if the node is re-nested under a different parent.
- Children of any node are sorted by `code`.

## How sync works

The catalog refreshes every night from the public MeshCore map at http://map.kiekr.app. Two ways to add a new region:

- Pin your repeater on the map with the KiekR App for Android or iOS (https://kiekr.app); your region appears here on the next sync.
- Open a pull request against this repository.

## Last updates

<!-- regions:auto-status:begin -->

- Last sync: `2026-05-22T04:30:37Z`
- Roots: 252
- Total nodes: 593
- Unsorted entries: 202

| when (UTC) | kind | path | note |
|---|---|---|---|
| 2026-05-21T04:30:20Z | sync | e9d5d2c | Merge pull request #2 from marcelverdult/sync/auto |
| 2026-05-21T04:30:15Z | sync | b670f71 | sync: 3 added, 2 resolved, 195 unsorted |
| 2026-05-20T23:51:50Z | manual | 5540ef7 | schema: cap code segments at 29 chars, drop arbitrary 64 total |
| 2026-05-20T23:17:31Z | manual | 51071d3 | regions: preserve hansemesh code under de; drop parent-prefix rule |
| 2026-05-20T20:08:37Z | manual | fc2d3bd | regions: add nl-li, eu root, de-hansemesh; humanize labels |
| 2026-05-20T18:53:49Z | manual | f2ce031 | ci: opt into Node 24 for JS actions |
| 2026-05-20T18:52:41Z | manual | 0cb9e4c | readme: reflect full-path code shape; sync: kind by author |
| 2026-05-20T18:50:55Z | manual | a1552b4 | fix: store full hyphenated code on every node |
| 2026-05-20T16:46:28Z | sync | d17c6a2 | Merge pull request #1 from marcelverdult/sync/auto |
| 2026-05-20T16:46:21Z | sync | 9f4512d | sync: 0 added, 0 resolved, 195 unsorted |
| 2026-05-20T18:21:52Z | manual | f2f6de3 | sync: switch to PR-mode with auto-merge |
| 2026-05-20T18:14:21Z | manual | e9133ec | initial: regions catalog, sync, validation |

<!-- regions:auto-status:end -->

## License

[CC0 1.0 Universal](LICENSE) — public-domain dedication. This catalog is
released with no rights reserved: copy, modify, redistribute, and embed it
(including in firmware) for any purpose, with no attribution required.
