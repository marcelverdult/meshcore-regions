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

- Last sync: `2026-11-25T11:57:05Z`
- Roots: 252
- Total nodes: 2836
- Unsorted entries: 1371

| when (UTC) | kind | path | note |
|---|---|---|---|
| 2026-11-24T13:09:12Z | sync | bae8fdb | Merge pull request #166 from marcelverdult/sync/auto |
| 2026-11-24T13:09:03Z | sync | 3ca006f | sync: 6 added, 0 resolved, 1367 unsorted |
| 2026-11-23T11:36:14Z | sync | 2968147 | Merge pull request #165 from marcelverdult/sync/auto |
| 2026-11-23T11:36:08Z | sync | 4c13e71 | sync: 4 added, 0 resolved, 1360 unsorted |
| 2026-11-22T10:35:13Z | sync | a432f3b | Merge pull request #164 from marcelverdult/sync/auto |
| 2026-11-22T10:35:07Z | sync | 35269eb | sync: 6 added, 0 resolved, 1358 unsorted |
| 2026-11-21T10:30:38Z | sync | 2038d4b | Merge pull request #163 from marcelverdult/sync/auto |
| 2026-11-21T10:30:32Z | sync | 3583f5f | sync: 3 added, 0 resolved, 1354 unsorted |
| 2026-11-20T10:47:58Z | sync | 64d2434 | Merge pull request #162 from marcelverdult/sync/auto |
| 2026-11-20T10:47:48Z | sync | 4386f6b | sync: 10 added, 0 resolved, 1345 unsorted |
| 2026-11-19T10:59:03Z | sync | db6ff28 | Merge pull request #161 from marcelverdult/sync/auto |
| 2026-11-19T10:58:55Z | sync | a407316 | sync: 12 added, 0 resolved, 1341 unsorted |
| 2026-11-18T10:56:39Z | sync | 8e467a5 | Merge pull request #160 from marcelverdult/sync/auto |
| 2026-11-18T10:56:30Z | sync | b152a62 | sync: 10 added, 0 resolved, 1339 unsorted |
| 2026-11-17T11:23:49Z | sync | caed0da | Merge pull request #159 from marcelverdult/sync/auto |
| 2026-11-17T11:23:41Z | sync | bc08752 | sync: 1 added, 0 resolved, 1336 unsorted |
| 2026-11-16T10:29:59Z | sync | d1494c1 | Merge pull request #158 from marcelverdult/sync/auto |
| 2026-11-16T10:27:45Z | sync | 18ad8ed | sync: 5 added, 0 resolved, 1330 unsorted |
| 2026-11-15T10:16:27Z | sync | ade54c3 | Merge pull request #157 from marcelverdult/sync/auto |
| 2026-11-15T10:14:53Z | sync | 00fc429 | sync: 5 added, 0 resolved, 1292 unsorted |

<!-- regions:auto-status:end -->

## License

[CC0 1.0 Universal](LICENSE) — public-domain dedication. This catalog is
released with no rights reserved: copy, modify, redistribute, and embed it
(including in firmware) for any purpose, with no attribution required.
