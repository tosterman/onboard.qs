# GitHub Workflows

- **Extension checks:** validates pull requests and main with lint, tests, a production ZIP build and package integrity tests.
- **Release extension:** manually dispatched from main; builds the exact commit and creates a draft release containing onboard-qs.zip, SHA256SUMS and a runtime dependency inventory. Existing versions cannot be republished by this workflow.
- **CodeQL / workflow security analysis:** separate security checks; inspect their run results rather than treating configuration as proof.
- Inherited Copilot and reviewer workflows are development helpers, not release gates.

See [Build and Release](BUILD-AND-DEPLOYMENT.md) for the supported release process. GitHub publication does not deploy to Qlik.
