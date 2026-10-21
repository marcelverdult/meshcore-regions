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

- Last sync: `2026-10-21T08:10:14Z`
- Roots: 252
- Total nodes: 2676
- Unsorted entries: 1215

| when (UTC) | kind | path | note |
|---|---|---|---|
| 2026-10-20T08:05:37Z | sync | b2c099c | Merge pull request #132 from marcelverdult/sync/auto |
| 2026-10-20T08:04:44Z | sync | 3f2ee9c | sync: 5 added, 0 resolved, 1213 unsorted |
| 2026-10-19T18:45:15Z | sync | b85fad5 | Merge pull request #131 from marcelverdult/sync/auto |
| 2026-10-19T18:43:04Z | sync | 48172d2 | sync: 0 added, 0 resolved, 1206 unsorted |
| 2026-10-19T18:42:43Z | sync | 0fceaf7 | Merge pull request #130 from marcelverdult/sync/auto |
| 2026-10-19T18:42:35Z | sync | a522774 | sync: 14 added, 0 resolved, 1206 unsorted |
| 2026-10-19T20:42:03Z | manual | 58d064a | Merge pull request #129 from marcelverdult/fix/sync-user-agent |
| 2026-10-19T17:01:18Z | manual | 8d52acb | fix(sync): send an identifying User-Agent to kiekr.app |
| 2026-10-15T07:53:33Z | sync | ed6bafb | Merge pull request #128 from marcelverdult/sync/auto |
| 2026-10-15T07:53:25Z | sync | 78e8497 | sync: 10 added, 0 resolved, 1193 unsorted |
| 2026-10-14T08:20:27Z | sync | fc2dab7 | Merge pull request #127 from marcelverdult/sync/auto |
| 2026-10-14T08:16:18Z | sync | 3252e9c | sync: 6 added, 0 resolved, 1185 unsorted |
| 2026-10-13T09:56:12Z | sync | 6c39d74 | Merge pull request #126 from marcelverdult/sync/auto |
| 2026-10-13T09:56:03Z | sync | 18f34a4 | sync: 1 added, 0 resolved, 1181 unsorted |
| 2026-10-12T10:04:18Z | sync | db336df | Merge pull request #125 from marcelverdult/sync/auto |
| 2026-10-12T10:03:30Z | sync | 7aa8b30 | sync: 4 added, 0 resolved, 1178 unsorted |
| 2026-10-11T09:33:23Z | sync | 2c2964a | Merge pull request #124 from marcelverdult/sync/auto |
| 2026-10-11T09:33:01Z | sync | 7eb8b7c | sync: 1 added, 0 resolved, 1158 unsorted |
| 2026-10-10T09:16:36Z | sync | c2cb0de | Merge pull request #123 from marcelverdult/sync/auto |
| 2026-10-10T09:16:00Z | sync | ceeba3c | sync: 3 added, 0 resolved, 1152 unsorted |

<!-- regions:auto-status:end -->

## License

[CC0 1.0 Universal](LICENSE) — public-domain dedication. This catalog is
released with no rights reserved: copy, modify, redistribute, and embed it
(including in firmware) for any purpose, with no attribution required.
