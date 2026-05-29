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

- Last sync: `2026-05-29T17:11:03Z`
- Roots: 252
- Total nodes: 1254
- Unsorted entries: 279

| when (UTC) | kind | path | note |
|---|---|---|---|
| 2026-05-29T19:07:01Z | manual | a66f46d | feat(be): complete Belgium provinces, add city sub-regions |
| 2026-05-29T19:06:44Z | manual | 1e7a7fd | fix(validate): only verify index.json freshness when it is committed |
| 2026-05-29T18:29:14Z | manual | 4afc1ac | Merge pull request #11 from marcelverdult/sync/auto |
| 2026-05-29T04:29:47Z | sync | ec80260 | sync: 36 added, 9 resolved, 277 unsorted |
| 2026-05-26T04:25:59Z | sync | 0bed871 | Merge pull request #10 from marcelverdult/sync/auto |
| 2026-05-26T04:25:54Z | sync | 1d233a0 | sync: 10 added, 9 resolved, 238 unsorted |
| 2026-05-25T04:30:49Z | sync | 6891caa | Merge pull request #8 from marcelverdult/sync/auto |
| 2026-05-25T04:30:45Z | sync | 7a5b081 | sync: 7 added, 9 resolved, 233 unsorted |
| 2026-05-25T00:27:30Z | manual | 8bc1eb4 | Merge pull request #7 from markino222/main |
| 2026-05-24T15:37:15Z | manual | c97de49 | Names in Italian regions |
| 2026-05-24T04:28:17Z | sync | 02cdea9 | Merge pull request #6 from marcelverdult/sync/auto |
| 2026-05-24T04:28:12Z | sync | b32e59d | sync: 8 added, 10 resolved, 225 unsorted |
| 2026-05-23T04:17:14Z | sync | b25f3ad | Merge pull request #5 from marcelverdult/sync/auto |
| 2026-05-23T04:17:09Z | sync | 7afde70 | sync: 15 added, 9 resolved, 219 unsorted |
| 2026-05-22T17:16:44Z | manual | 85434ed | ci: bump actions to Node 24 runtime, prune old sync runs |
| 2026-05-22T17:07:51Z | manual | 9a6862e | regions: add Rhineland community regions from meshrheinland.de |
| 2026-05-22T16:18:16Z | manual | 1489b54 | regions: humanize de-sh, de-ni-gs, de-harz labels from meshcorenetz.de |
| 2026-05-22T13:01:40Z | manual | 606ce7f | regions: name de-nw-owl as Ostwestfalen-Lippe |
| 2026-05-22T09:57:30Z | manual | c58038c | docs: release catalog under CC0 1.0 |
| 2026-05-22T04:30:43Z | sync | 6bb90c0 | Merge pull request #3 from marcelverdult/sync/auto |

<!-- regions:auto-status:end -->

## License

[CC0 1.0 Universal](LICENSE) — public-domain dedication. This catalog is
released with no rights reserved: copy, modify, redistribute, and embed it
(including in firmware) for any purpose, with no attribution required.
