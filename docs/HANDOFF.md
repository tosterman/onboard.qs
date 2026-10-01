# HANDOFF: onboard-qs

Verified at code commit `a678a541996953e2b66f3c3588ea507cc52eea33` on 2026-10-01.

## Product
Onboard Tour 1.9.1 is installed in Adaptive. An in-sheet control or compact help icon opens modal or target-attached coach marks with progress and navigation. Authors edit tours inside Qlik and can customize styling, targets, and the seven-step Qlik basics checklist.

## Verified operation
Mouse and keyboard launch/editor access, compact geometry, save/reopen/restore, Escape, filtering, clear/undo, bookmarks, completion, and browser-local show-once behavior passed in Adaptive. Current checks pass: 11 behavior tests, lint, a Node 24 production build, exact package verification, and 5 negative package tests. GitHub Actions built the published 67792-byte asset from this commit; SHA256 is `ac0a982fac86aec4aab834c5e2b077df5f7d951b006ab6a6cfee68cf241af86a`.

## Boundaries
Practice guides users but does not automatically prove completion. The export dialog opened, but final download completion was not proven. Full accessibility, mobile, client-managed Qlik Sense, nested objects, missing targets, and competing auto-starts remain unverified.

## Next
Investigate export completion; validate missing targets, competing auto-starts, and accessibility before organization-wide rollout.
