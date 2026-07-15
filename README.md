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

- Last sync: `2026-07-15T05:23:57Z`
- Roots: 252
- Total nodes: 1465
- Unsorted entries: 530

| when (UTC) | kind | path | note |
|---|---|---|---|
| 2026-07-13T06:07:39Z | sync | 23db6ab | Merge pull request #45 from marcelverdult/sync/auto |
| 2026-07-13T06:07:31Z | sync | c2ec534 | sync: 2 added, 30 resolved, 522 unsorted |
| 2026-07-12T05:49:46Z | sync | fc3ed84 | Merge pull request #44 from marcelverdult/sync/auto |
| 2026-07-12T05:49:41Z | sync | 5f8c717 | sync: 14 added, 30 resolved, 518 unsorted |
| 2026-07-10T06:37:03Z | sync | e4f845e | Merge pull request #43 from marcelverdult/sync/auto |
| 2026-07-10T06:36:57Z | sync | a47d0f5 | sync: 9 added, 21 resolved, 511 unsorted |
| 2026-07-06T09:10:11Z | manual | 9cc0869 | Merge pull request #42 from marcelverdult/sync/auto |
| 2026-07-06T07:05:05Z | sync | 6092e88 | sync: 11 added, 30 resolved, 473 unsorted |
| 2026-07-05T06:33:54Z | sync | 0f3feb8 | Merge pull request #41 from marcelverdult/sync/auto |
| 2026-07-05T06:33:49Z | sync | e634322 | sync: 0 added, 30 resolved, 469 unsorted |
| 2026-07-04T06:13:48Z | sync | 1135047 | Merge pull request #40 from marcelverdult/sync/auto |
| 2026-07-04T06:13:31Z | sync | 63bf240 | sync: 19 added, 41 resolved, 465 unsorted |
| 2026-06-29T04:31:25Z | sync | ff83e62 | Merge pull request #39 from marcelverdult/sync/auto |
| 2026-06-29T04:31:19Z | sync | 76ff59c | sync: 6 added, 41 resolved, 437 unsorted |
| 2026-06-28T04:30:31Z | sync | ed27fa9 | Merge pull request #38 from marcelverdult/sync/auto |
| 2026-06-28T04:30:26Z | sync | df6b229 | sync: 2 added, 41 resolved, 434 unsorted |
| 2026-06-27T04:21:40Z | sync | 8df71b2 | Merge pull request #37 from marcelverdult/sync/auto |
| 2026-06-27T04:21:34Z | sync | c99b1fa | sync: 3 added, 42 resolved, 427 unsorted |
| 2026-06-26T04:28:44Z | sync | 9e3b8d1 | Merge pull request #36 from marcelverdult/sync/auto |
| 2026-06-26T04:28:38Z | sync | e3b95d6 | sync: 9 added, 41 resolved, 423 unsorted |

<!-- regions:auto-status:end -->

## License

[CC0 1.0 Universal](LICENSE) — public-domain dedication. This catalog is
released with no rights reserved: copy, modify, redistribute, and embed it
(including in firmware) for any purpose, with no attribution required.
