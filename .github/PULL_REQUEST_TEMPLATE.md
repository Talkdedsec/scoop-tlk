## What this changes

<!-- Which manifest, and what was wrong with it. -->

## Checks

- [ ] The manifest parses as JSON and keeps four-space indentation
- [ ] `scoop install scoop-tlk/<app>.json` installs and the shim runs
- [ ] Every `url` outside the `autoupdate` block answers 200
- [ ] `checkver` and `autoupdate` still follow the upstream release naming

<!-- A version bump on its own does not need a pull request; excavator does that
     nightly. If it is stale, say which part of autoupdate broke. -->
