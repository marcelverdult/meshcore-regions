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

- Last sync: `2026-09-10T07:43:27Z`
- Roots: 252
- Total nodes: 1799
- Unsorted entries: 1066

| when (UTC) | kind | path | note |
|---|---|---|---|
| 2026-09-09T07:44:36Z | sync | 3afa22b | Merge pull request #93 from marcelverdult/sync/auto |
| 2026-09-09T07:44:04Z | sync | 7b2261d | sync: 2 added, 56 resolved, 1064 unsorted |
| 2026-09-08T07:39:46Z | sync | d4aa6a4 | Merge pull request #92 from marcelverdult/sync/auto |
| 2026-09-08T07:39:16Z | sync | 771e5e8 | sync: 3 added, 56 resolved, 1059 unsorted |
| 2026-09-07T07:45:27Z | sync | f3dcfb0 | Merge pull request #91 from marcelverdult/sync/auto |
| 2026-09-07T07:45:12Z | sync | 3873dfd | sync: 6 added, 53 resolved, 1055 unsorted |
| 2026-09-06T07:29:06Z | sync | caa6d8b | Merge pull request #90 from marcelverdult/sync/auto |
| 2026-09-06T07:28:41Z | sync | b114344 | sync: 2 added, 53 resolved, 1048 unsorted |
| 2026-09-05T07:16:24Z | sync | a17177b | Merge pull request #89 from marcelverdult/sync/auto |
| 2026-09-05T07:16:16Z | sync | db8815b | sync: 7 added, 54 resolved, 1047 unsorted |
| 2026-09-04T07:35:42Z | sync | cada827 | Merge pull request #88 from marcelverdult/sync/auto |
| 2026-09-04T07:35:10Z | sync | 9db61b0 | sync: 12 added, 53 resolved, 1045 unsorted |
| 2026-09-03T07:36:13Z | sync | 84df3d7 | Merge pull request #87 from marcelverdult/sync/auto |
| 2026-09-03T07:35:12Z | sync | 5f4dfa0 | sync: 0 added, 56 resolved, 1043 unsorted |
| 2026-09-02T07:30:02Z | sync | 40ff675 | Merge pull request #86 from marcelverdult/sync/auto |
| 2026-09-02T07:29:28Z | sync | c6d87a5 | sync: 5 added, 57 resolved, 1044 unsorted |
| 2026-08-31T09:10:33Z | sync | a606b29 | Merge pull request #84 from marcelverdult/sync/auto |
| 2026-08-31T09:09:54Z | sync | 82cb689 | sync: 11 added, 50 resolved, 1042 unsorted |
| 2026-08-29T09:37:22Z | sync | 9b0bad9 | Merge pull request #83 from marcelverdult/sync/auto |
| 2026-08-29T09:37:09Z | sync | 81cf11d | sync: 1 added, 50 resolved, 1024 unsorted |

<!-- regions:auto-status:end -->

## License

[CC0 1.0 Universal](LICENSE) — public-domain dedication. This catalog is
released with no rights reserved: copy, modify, redistribute, and embed it
(including in firmware) for any purpose, with no attribution required.
