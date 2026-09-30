"""Negative tests for the actual built release artifact."""
import importlib.util
from pathlib import Path
import tempfile
import unittest
import zipfile

spec = importlib.util.spec_from_file_location("verify_package", Path(__file__).with_name("verify-package.py"))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class PackageTests(unittest.TestCase):
    def altered(self, replacements=None, extra=None):
        folder = tempfile.TemporaryDirectory()
        self.addCleanup(folder.cleanup)
        path = Path(folder.name) / "test.zip"
        with zipfile.ZipFile(module.ROOT / "onboard-qs.zip") as source, zipfile.ZipFile(path, "w") as target:
            for item in source.infolist():
                target.writestr(item, (replacements or {}).get(item.filename, source.read(item.filename)))
            if extra:
                target.writestr(*extra)
        return path

    def test_current_package(self):
        module.verify(module.ROOT / "onboard-qs.zip")

    def test_rejects_stale_readme(self):
        with self.assertRaisesRegex(AssertionError, "Stale README"):
            module.verify(self.altered({"README.md": b"old documentation"}))

    def test_rejects_wrong_version(self):
        import json
        with zipfile.ZipFile(module.ROOT / "onboard-qs.zip") as source:
            manifest = json.loads(source.read("onboard-qs.qext"))
        manifest["version"] = "0.0.0"
        with self.assertRaisesRegex(AssertionError, "Packaged version"):
            module.verify(self.altered({"onboard-qs.qext": json.dumps(manifest).encode()}))

    def test_rejects_extra_files(self):
        with self.assertRaisesRegex(AssertionError, "Unexpected or missing"):
            module.verify(self.altered(extra=("demo.mp4", b"not runtime")))

    def test_rejects_missing_license(self):
        with self.assertRaisesRegex(AssertionError, "Stale LICENSE"):
            module.verify(self.altered({"LICENSE": b""}))


if __name__ == "__main__":
    unittest.main()
