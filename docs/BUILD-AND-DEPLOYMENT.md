# Build and Release

All shipped changes must be merged into main through a pull request. The release tag, source metadata, installation ZIP, README and license must describe the same version.

## Local verification

Use Node.js 24.15 or newer and Python 3:

1. Run npm ci --ignore-scripts.
2. Run npm run lint and npm test.
3. Run npm run pack:prod.
4. Run python scripts/test-package.py.

The production command creates onboard-qs.zip and SHA256SUMS. It validates the archive against the source checkout, including its README, license, runtime files, extension name, group and version. The package contains no source repository, demo media, or nested ZIP.

## Release procedure

1. Update the version in package.json, package-lock.json and src/meta.json together. Update CHANGELOG.md and release-config/notes.md.
2. Open a pull request. Resolve conflicts, pass Extension checks, and review the change before merging.
3. From main, run the Release extension workflow in GitHub Actions.
4. The workflow tests and packages the exact main commit and creates a draft release with the installation ZIP, checksum and runtime dependency inventory.
5. Download the draft asset, verify its checksum, and validate the extension in the authorized test tenant. Publish the draft when the recorded checks support the release.
6. Install that same ZIP in the destination tenant through its approved deployment process.

Never replace an existing release asset to ship a correction. Make a new version instead. A historical basics.5 asset received a README-only correction before this process was established; its source archive retains the historical README.

## Installation

Download the release asset named onboard-qs.zip and upload it intact. GitHub Code / Download ZIP and Source code archives contain development source and are not installable extensions.

## Tenant deployment

Publishing to GitHub does not update Qlik. This repository does not store a Qlik credential or perform automatic tenant deployment. Use the authorized tenant administration upload flow, or a separately approved enterprise deployment identity and pipeline.

Client deployment approval and runtime acceptance are separate from a successful package build. Record installed version, artifact checksum, tenant, date and checks performed. Do not claim checks that were not run.
