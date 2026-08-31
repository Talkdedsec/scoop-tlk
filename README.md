# scoop-tlk

A [Scoop](https://scoop.sh) bucket for the Talkdedsec tools. Windows, no installer, no
admin rights, and `scoop update` keeps them current.

```powershell
scoop bucket add tlk https://github.com/Talkdedsec/scoop-tlk
```

## What is in it

| App | What it does | Licence |
| --- | --- | --- |
| [`wymcmd`](https://github.com/Talkdedsec/tlk-wymcmd) | Explains why a console window opened — which scheduled task, service, registry key or click started it, reconstructed from what Windows already recorded. | Source-available, free to use |
| [`tlk-visual`](https://github.com/Talkdedsec/tlk-visual) | Real-time screen colour engine — brightness, contrast, gamma, temperature and night vision written straight to the display gamma ramp. No driver, no injection. | GPL-3.0-or-later |

```powershell
scoop install tlk/wymcmd
scoop install tlk/tlk-visual
```

`wymcmd` ships x64 and arm64 builds and Scoop picks the right one. `tlk-visual` is x64 only.

## Verifying what you installed

Both projects attest their release builds, so the binary Scoop downloaded can be traced back
to the workflow run that produced it:

```powershell
gh attestation verify (scoop prefix wymcmd | Join-Path -ChildPath wymcmd.exe) --owner Talkdedsec
```

That is stronger than the checksum Scoop already verified — a checksum proves the file was
not altered in transit, an attestation proves which commit and workflow built it.

## Keeping it current

`excavator` runs daily, notices a new release upstream, updates the manifest and commits it.
Nothing here is updated by hand unless the shape of a release changes.

## Reporting a problem

A bug in a tool belongs in that tool's repository — the links are in the table above. Open
an issue here only when the packaging is what is wrong: a manifest that installs the wrong
architecture, a shim that does not appear on `PATH`, a hash that no longer matches.
