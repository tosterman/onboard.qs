# Qlik basics checklist — 2026-09-28

Fork prerelease: `1.8.3-basics.1`, based on upstream `a7b8873f41a1f6d8a4f18c96a93aac7a9b710ee5`.

## Scope

The existing Tour Editor now offers **Include Qlik basics** with seven checkboxes. Filtering and export request a sheet object. Adding appends ordinary editable steps to the selected tour; it does not modify existing steps or publish until the author saves. All original appearance controls remain available. Generated practice steps allow native selection controls and menus outside the highlighted target; ordinary tours retain their existing interaction behavior. Native dialogs temporarily hide the practice popover and shade.

## Checks completed

- Node 24 production build and deployable ZIP generation passed.
- ESLint passed. Seven automated tests passed: template selection/validation, independent objects, JSON roundtrip, cancel/escape, duplicate-dialog prevention, safe object text, existing editor save/reopen and practice-only rendering behavior.
- Production dependency audit reports zero vulnerabilities after updating DOMPurify within the existing dependency range. Inherited development-only audit findings remain tracked in TODO.
- Installed the ZIP in an authorized Qlik Cloud test tenant; extension listing reports `1.8.3-basics.1`.
- In the native editor, checked all seven lessons, selected a filter/chart, added steps, saved and reopened all seven.
- Ran the generated tour against a synthetic dataset: selected and confirmed a year; removed that field's selection; cleared all selections; used Step back to restore the year; created a private bookmark; applied it; opened Download → Data and downloaded an XLSX. Native dialogs yielded and returned to the same practice step. Done closed the tour.
- GitNexus impact and change detection completed. Shared rendering helper is high-impact, so the new interaction class is conditional on generated basics and covered by a regression test.

Installed ZIP SHA-256: `1198e604242749a0afa64f71de575db2fbcfe3511ea99e34d201b5aa3772441c`.

## Boundaries

These are guided practice templates with manual Next/Done, not automatic completion verification. Qlik Cloud toolbar selectors were checked in the test tenant; client-managed Sense, mobile and full keyboard/assistive-technology acceptance are not certified. Existing upstream show-once, save-error handling, theme transfer, auto-start and 1×1 editor-access limitations remain tracked in TODO. This feature does not claim to resolve those separate review findings.

The deployment ZIP was generated before this verification report and README feature note; its executable code is the tested candidate. The report is shipped as a separate release asset.

HQ routing has no trusted registration for this fork; no governed HQ writeback is claimed.
