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

- Last sync: `2026-10-08T09:47:14Z`
- Roots: 252
- Total nodes: 2618
- Unsorted entries: 1141

| when (UTC) | kind | path | note |
|---|---|---|---|
| 2026-10-07T09:37:16Z | sync | a0214b3 | Merge pull request #120 from marcelverdult/sync/auto |
| 2026-10-07T09:37:08Z | sync | c902964 | sync: 4 added, 0 resolved, 1139 unsorted |
| 2026-10-06T09:40:10Z | sync | 0703b2a | Merge pull request #119 from marcelverdult/sync/auto |
| 2026-10-06T09:39:46Z | sync | 45ce885 | sync: 4 added, 0 resolved, 1134 unsorted |
| 2026-10-05T09:52:48Z | sync | a03500d | Merge pull request #118 from marcelverdult/sync/auto |
| 2026-10-05T09:52:38Z | sync | 2fd5ce0 | sync: 13 added, 0 resolved, 1128 unsorted |
| 2026-10-04T09:11:58Z | sync | a330390 | Merge pull request #117 from marcelverdult/sync/auto |
| 2026-10-04T09:11:51Z | sync | baa4fa0 | sync: 9 added, 0 resolved, 1122 unsorted |
| 2026-10-03T08:46:04Z | sync | 3ae188e | Merge pull request #116 from marcelverdult/sync/auto |
| 2026-10-03T08:45:43Z | sync | 8d3dc32 | sync: 5 added, 0 resolved, 1118 unsorted |
| 2026-10-02T09:13:33Z | sync | d790d20 | Merge pull request #115 from marcelverdult/sync/auto |
| 2026-10-02T09:13:25Z | sync | 45115e8 | sync: 5 added, 0 resolved, 1113 unsorted |
| 2026-10-01T09:39:57Z | sync | b0f9661 | Merge pull request #114 from marcelverdult/sync/auto |
| 2026-10-01T09:39:14Z | sync | 5257824 | sync: 4 added, 0 resolved, 1109 unsorted |
| 2026-09-30T09:11:47Z | sync | 2ad3636 | Merge pull request #113 from marcelverdult/sync/auto |
| 2026-09-30T09:11:38Z | sync | 0ff9301 | sync: 2 added, 0 resolved, 1100 unsorted |
| 2026-09-29T09:24:08Z | sync | 0260e66 | Merge pull request #112 from marcelverdult/sync/auto |
| 2026-09-29T09:21:06Z | sync | a18d984 | sync: 5 added, 0 resolved, 1092 unsorted |
| 2026-09-28T10:14:35Z | sync | adac5ea | Merge pull request #111 from marcelverdult/sync/auto |
| 2026-09-28T10:11:46Z | sync | fc0c135 | sync: 0 added, 0 resolved, 1090 unsorted |

<!-- regions:auto-status:end -->

## License

[CC0 1.0 Universal](LICENSE) — public-domain dedication. This catalog is
released with no rights reserved: copy, modify, redistribute, and embed it
(including in firmware) for any purpose, with no attribution required.
