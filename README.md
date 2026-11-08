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

- Last sync: `2026-11-08T09:45:18Z`
- Roots: 252
- Total nodes: 2755
- Unsorted entries: 1270

| when (UTC) | kind | path | note |
|---|---|---|---|
| 2026-11-07T09:29:32Z | sync | 05aeac3 | Merge pull request #149 from marcelverdult/sync/auto |
| 2026-11-07T09:29:26Z | sync | d376421 | sync: 3 added, 0 resolved, 1268 unsorted |
| 2026-11-06T10:13:35Z | sync | d31a255 | Merge pull request #148 from marcelverdult/sync/auto |
| 2026-11-06T10:13:27Z | sync | 8bd92aa | sync: 9 added, 1 resolved, 1265 unsorted |
| 2026-11-05T10:11:33Z | sync | 0d88a7f | Merge pull request #147 from marcelverdult/sync/auto |
| 2026-11-05T10:08:56Z | sync | c1d8699 | sync: 6 added, 0 resolved, 1264 unsorted |
| 2026-11-03T10:24:18Z | sync | 3be1750 | Merge pull request #146 from marcelverdult/sync/auto |
| 2026-11-03T10:21:40Z | sync | eb1f8bf | sync: 1 added, 0 resolved, 1261 unsorted |
| 2026-11-02T10:23:57Z | sync | ad3fa62 | Merge pull request #145 from marcelverdult/sync/auto |
| 2026-11-02T10:23:49Z | sync | 0e45ede | sync: 4 added, 0 resolved, 1256 unsorted |
| 2026-11-01T09:56:30Z | sync | 106a3a5 | Merge pull request #144 from marcelverdult/sync/auto |
| 2026-11-01T09:56:24Z | sync | d1293f3 | sync: 3 added, 0 resolved, 1254 unsorted |
| 2026-10-31T09:09:06Z | sync | a3dc8aa | Merge pull request #143 from marcelverdult/sync/auto |
| 2026-10-31T09:09:00Z | sync | d5df6bc | sync: 3 added, 0 resolved, 1254 unsorted |
| 2026-10-30T09:22:50Z | sync | 175ccff | Merge pull request #142 from marcelverdult/sync/auto |
| 2026-10-30T09:22:44Z | sync | 0a50506 | sync: 15 added, 0 resolved, 1246 unsorted |
| 2026-10-29T09:12:05Z | sync | d574d01 | Merge pull request #141 from marcelverdult/sync/auto |
| 2026-10-29T09:11:00Z | sync | 96bb2de | sync: 4 added, 0 resolved, 1242 unsorted |
| 2026-10-28T09:11:52Z | sync | 8d018cd | Merge pull request #140 from marcelverdult/sync/auto |
| 2026-10-28T09:11:02Z | sync | 96aed56 | sync: 0 added, 0 resolved, 1240 unsorted |

<!-- regions:auto-status:end -->

## License

[CC0 1.0 Universal](LICENSE) — public-domain dedication. This catalog is
released with no rights reserved: copy, modify, redistribute, and embed it
(including in firmware) for any purpose, with no attribution required.
