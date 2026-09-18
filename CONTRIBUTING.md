# Contributing

This repository holds Scoop manifests, nothing else. A bug in one of the tools
belongs in that tool's own repository — the links are in the README.

## What belongs here

Packaging problems: a manifest that installs the wrong architecture, a shim that
does not land on `PATH`, a hash that no longer matches the published file, a
`checkver` or `autoupdate` block that stopped following upstream.

## Changing a manifest

```powershell
scoop install scoop-tlk/<app>.json   # install straight from the file
scoop uninstall <app>
```

`excavator` rewrites `version`, `url` and `hash` on its own every night, so do not
send a pull request that only bumps a version — if it is stale, the autoupdate
block is what is broken and that is the part worth fixing.

Every manifest is formatted with four-space indentation, the same as the ones
already in `bucket/`.

## What CI checks

Each manifest has to parse as JSON, and every non-autoupdate download URL has to
answer 200. Both run on every push and pull request.

## Adding a tool

Only Talkdedsec tools go in this bucket. If you package one of them for a
platform that is missing, open an issue first so the naming and the shim names
match the rest.
