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

- Last sync: `2026-06-24T04:25:42Z`
- Roots: 252
- Total nodes: 1387
- Unsorted entries: 418

| when (UTC) | kind | path | note |
|---|---|---|---|
| 2026-06-23T04:23:48Z | sync | 1be8ea1 | Merge pull request #34 from marcelverdult/sync/auto |
| 2026-06-23T04:23:43Z | sync | 167e8e9 | sync: 2 added, 41 resolved, 418 unsorted |
| 2026-06-22T04:32:24Z | sync | e31110a | Merge pull request #33 from marcelverdult/sync/auto |
| 2026-06-22T04:32:18Z | sync | f78efeb | sync: 13 added, 41 resolved, 417 unsorted |
| 2026-06-20T04:29:20Z | sync | 1195cdb | Merge pull request #32 from marcelverdult/sync/auto |
| 2026-06-20T04:29:15Z | sync | 8ca7df4 | sync: 15 added, 41 resolved, 413 unsorted |
| 2026-06-18T04:30:53Z | sync | 6fc9a02 | Merge pull request #31 from marcelverdult/sync/auto |
| 2026-06-18T04:30:48Z | sync | 1cced41 | sync: 2 added, 41 resolved, 411 unsorted |
| 2026-06-17T04:31:27Z | sync | 73d77d2 | Merge pull request #30 from marcelverdult/sync/auto |
| 2026-06-17T04:31:22Z | sync | f779723 | sync: 9 added, 30 resolved, 407 unsorted |
| 2026-06-15T04:32:19Z | sync | d39212d | Merge pull request #29 from marcelverdult/sync/auto |
| 2026-06-15T04:32:14Z | sync | 819fb4a | sync: 6 added, 30 resolved, 389 unsorted |
| 2026-06-14T04:31:26Z | sync | 036e421 | Merge pull request #28 from marcelverdult/sync/auto |
| 2026-06-14T04:31:21Z | sync | c0aad67 | sync: 5 added, 41 resolved, 388 unsorted |
| 2026-06-13T04:30:32Z | sync | 75b6480 | Merge pull request #27 from marcelverdult/sync/auto |
| 2026-06-13T04:30:27Z | sync | 15d1588 | sync: 2 added, 41 resolved, 397 unsorted |
| 2026-06-12T04:30:50Z | sync | aefcb0c | Merge pull request #26 from marcelverdult/sync/auto |
| 2026-06-12T04:30:44Z | sync | d275075 | sync: 21 added, 41 resolved, 395 unsorted |
| 2026-06-09T04:25:42Z | sync | 89fbce6 | Merge pull request #25 from marcelverdult/sync/auto |
| 2026-06-09T04:25:34Z | sync | e5792d3 | sync: 7 added, 41 resolved, 373 unsorted |

<!-- regions:auto-status:end -->

## License

[CC0 1.0 Universal](LICENSE) — public-domain dedication. This catalog is
released with no rights reserved: copy, modify, redistribute, and embed it
(including in firmware) for any purpose, with no attribution required.
