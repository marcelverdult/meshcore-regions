# meshcore-regions

Canonical, community-editable catalog of MeshCore regions used worldwide.

## What this is

A simple JSON catalog of region identifiers used across the MeshCore ecosystem. Each region has a `code` (the fully qualified hyphenated path, e.g. `de-hh-attraktor`), a human-readable `name` (the leaf label, e.g. `Attraktor`), and optional nested children.

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

`code` is the full hyphenated path from the root. A child's `code` always starts with its parent's `code` followed by `-`. The `flat` array in `index.json` lists every node as `{ "path": "de-hh-attraktor", "name": "Attraktor" }` for quick lookups.

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
- Codes are lowercase ASCII letters, digits, and hyphens. A child's `code` must start with its parent's `code` followed by `-`. Total length capped at 64 characters.
- Children of any node are sorted by `code`.

## How sync works

The catalog refreshes every night from the public MeshCore map at http://map.kiekr.app. Two ways to add a new region:

- Pin your repeater on the map with the KiekR App for Android or iOS (https://kiekr.app); your region appears here on the next sync.
- Open a pull request against this repository.

## Last updates

<!-- regions:auto-status:begin -->

- Last sync: `2026-05-20T16:46:20Z`
- Roots: 251
- Total nodes: 565
- Unsorted entries: 195

| when (UTC) | kind | path | note |
|---|---|---|---|
| 2026-05-20T18:21:52Z | sync | f2f6de3 | sync: switch to PR-mode with auto-merge |
| 2026-05-20T18:14:21Z | manual | e9133ec | initial: regions catalog, sync, validation |

<!-- regions:auto-status:end -->

## License

To be determined.
