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

- Last sync: `2026-06-14T04:31:20Z`
- Roots: 252
- Total nodes: 1339
- Unsorted entries: 388

| when (UTC) | kind | path | note |
|---|---|---|---|
| 2026-06-13T04:30:32Z | sync | 75b6480 | Merge pull request #27 from marcelverdult/sync/auto |
| 2026-06-13T04:30:27Z | sync | 15d1588 | sync: 2 added, 41 resolved, 397 unsorted |
| 2026-06-12T04:30:50Z | sync | aefcb0c | Merge pull request #26 from marcelverdult/sync/auto |
| 2026-06-12T04:30:44Z | sync | d275075 | sync: 21 added, 41 resolved, 395 unsorted |
| 2026-06-09T04:25:42Z | sync | 89fbce6 | Merge pull request #25 from marcelverdult/sync/auto |
| 2026-06-09T04:25:34Z | sync | e5792d3 | sync: 7 added, 41 resolved, 373 unsorted |
| 2026-06-08T04:31:37Z | sync | 866803c | Merge pull request #24 from marcelverdult/sync/auto |
| 2026-06-08T04:31:32Z | sync | 6797ebe | sync: 1 added, 41 resolved, 368 unsorted |
| 2026-06-07T04:30:51Z | sync | 84ec8a9 | Merge pull request #23 from marcelverdult/sync/auto |
| 2026-06-07T04:30:47Z | sync | b34e73e | sync: 7 added, 41 resolved, 359 unsorted |
| 2026-06-06T09:27:18Z | sync | c16508d | Merge pull request #22 from marcelverdult/sync/auto |
| 2026-06-06T09:27:13Z | sync | 7e7a20f | sync: 4 added, 41 resolved, 356 unsorted |
| 2026-06-06T01:10:24Z | manual | b028a0d | Merge pull request #20 from dreirund/patch-1 |
| 2026-06-05T04:30:15Z | sync | c47f632 | Merge pull request #21 from marcelverdult/sync/auto |
| 2026-06-05T04:30:09Z | sync | 0296e05 | sync: 6 added, 41 resolved, 354 unsorted |
| 2026-06-04T17:49:30Z | manual | 2b6c1ab | `de.json`: Made the naming for the regions around Dresden more specific. |
| 2026-06-04T04:31:13Z | sync | 26cca67 | Merge pull request #19 from marcelverdult/sync/auto |
| 2026-06-04T04:31:07Z | sync | 23cf3df | sync: 7 added, 21 resolved, 349 unsorted |
| 2026-06-02T15:11:31Z | manual | 1f61875 | Merge pull request #18 from markino222/main |
| 2026-06-02T12:58:22Z | manual | 7999cc5 | Added "europe" in eu.json |

<!-- regions:auto-status:end -->

## License

[CC0 1.0 Universal](LICENSE) — public-domain dedication. This catalog is
released with no rights reserved: copy, modify, redistribute, and embed it
(including in firmware) for any purpose, with no attribution required.
