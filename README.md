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

- Last sync: `2026-08-31T09:09:53Z`
- Roots: 252
- Total nodes: 1749
- Unsorted entries: 1042

| when (UTC) | kind | path | note |
|---|---|---|---|
| 2026-08-29T09:37:22Z | sync | 9b0bad9 | Merge pull request #83 from marcelverdult/sync/auto |
| 2026-08-29T09:37:09Z | sync | 81cf11d | sync: 1 added, 50 resolved, 1024 unsorted |
| 2026-08-28T14:46:23Z | sync | f98025b | Merge pull request #82 from marcelverdult/sync/auto |
| 2026-08-28T14:46:16Z | sync | 66f091c | sync: 12 added, 56 resolved, 1020 unsorted |
| 2026-08-26T03:47:37Z | sync | e47ef5f | Merge pull request #81 from marcelverdult/sync/auto |
| 2026-08-26T03:47:05Z | sync | 5a3f1b3 | sync: 2 added, 57 resolved, 1018 unsorted |
| 2026-08-25T03:41:31Z | sync | 7536898 | Merge pull request #80 from marcelverdult/sync/auto |
| 2026-08-25T03:41:19Z | sync | aafc111 | sync: 2 added, 67 resolved, 1017 unsorted |
| 2026-08-24T03:47:39Z | sync | abf8c9d | Merge pull request #79 from marcelverdult/sync/auto |
| 2026-08-24T03:47:33Z | sync | 537b6fc | sync: 11 added, 73 resolved, 1025 unsorted |
| 2026-08-23T03:43:32Z | sync | f4f9f94 | Merge pull request #78 from marcelverdult/sync/auto |
| 2026-08-23T03:43:28Z | sync | 7e3184c | sync: 14 added, 68 resolved, 1025 unsorted |
| 2026-08-21T03:43:57Z | sync | 05316c9 | Merge pull request #77 from marcelverdult/sync/auto |
| 2026-08-21T03:43:50Z | sync | 7428030 | sync: 9 added, 69 resolved, 1016 unsorted |
| 2026-08-20T03:39:44Z | sync | f52331a | Merge pull request #76 from marcelverdult/sync/auto |
| 2026-08-20T03:39:37Z | sync | 00d9285 | sync: 10 added, 68 resolved, 1004 unsorted |
| 2026-08-18T03:37:44Z | sync | 43dbffe | Merge pull request #75 from marcelverdult/sync/auto |
| 2026-08-18T03:37:38Z | sync | a30fd6d | sync: 15 added, 49 resolved, 1000 unsorted |
| 2026-08-16T03:41:28Z | sync | 43de9f7 | Merge pull request #74 from marcelverdult/sync/auto |
| 2026-08-16T03:41:21Z | sync | 1ac66cb | sync: 1 added, 59 resolved, 972 unsorted |

<!-- regions:auto-status:end -->

## License

[CC0 1.0 Universal](LICENSE) — public-domain dedication. This catalog is
released with no rights reserved: copy, modify, redistribute, and embed it
(including in firmware) for any purpose, with no attribution required.
