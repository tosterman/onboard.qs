"""Validate a release ZIP against its exact source checkout."""
import hashlib
import json
from pathlib import Path
import sys
import zipfile

ROOT = Path(__file__).resolve().parent.parent
EXPECTED = {"README.md", "LICENSE", "onboard-qs.js", "onboard-qs.qext", "preview.png", "dist/onboard-qs.js"}


def verify(path, root=ROOT):
    package = json.loads((root / "package.json").read_text(encoding="utf-8"))
    metadata = json.loads((root / "src/meta.json").read_text(encoding="utf-8"))
    lock = json.loads((root / "package-lock.json").read_text(encoding="utf-8"))
    version = package["version"]
    assert metadata["version"] == lock["version"] == lock["packages"][""]["version"] == version, "Source versions differ"
    with zipfile.ZipFile(path) as archive:
        files = [entry.filename for entry in archive.infolist() if not entry.is_dir()]
        assert len(files) == len(set(files)), "Duplicate archive entries"
        assert set(files) == EXPECTED, f"Unexpected or missing files: {set(files) ^ EXPECTED}"
        assert archive.testzip() is None, "Corrupt ZIP"
        assert sum(entry.file_size for entry in archive.infolist()) < 2_000_000, "Unexpected package growth"
        for name in ("README.md", "LICENSE"):
            assert archive.read(name) == (root / name).read_bytes(), f"Stale {name}"
        manifest = json.loads(archive.read("onboard-qs.qext"))
        assert manifest["version"] == version, "Packaged version differs"
        assert manifest["name"] == "Onboard Tour", "Wrong display name"
        assert manifest["bundle"]["name"] == "Tyler's Custom Extensions", "Wrong group"
        for name in ("onboard-qs.js", "preview.png", "dist/onboard-qs.js"):
            assert archive.read(name) == (root / "onboard-qs-ext" / name).read_bytes(), f"Stale {name}"
        runtime = archive.read("dist/onboard-qs.js")
        for token in (b"__PACKAGE_VERSION__", b"__BUILD_TYPE__", b"__BUILD_DATE__"):
            assert token not in runtime, f"Unresolved token: {token}"
        assert version.encode() in runtime, "Runtime missing release version"
    return version


if __name__ == "__main__":
    path = ROOT / "onboard-qs.zip"
    try:
        version = verify(path)
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        (ROOT / "SHA256SUMS").write_text(f"{digest}  onboard-qs.zip\n", encoding="utf-8")
        print(f"Verified Onboard Tour {version}: {path.stat().st_size} bytes; SHA256 {digest}")
    except Exception as error:
        print(f"Package verification failed: {error}", file=sys.stderr)
        sys.exit(1)
