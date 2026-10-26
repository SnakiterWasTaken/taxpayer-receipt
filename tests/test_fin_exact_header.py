"""Synthetic exact-header inventory tests; source semantics remain unverified."""
import importlib.util
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location("probe_fin", Path(__file__).resolve().parents[1] / "scripts" / "probe-fin-2024.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class FinExactHeaderTests(unittest.TestCase):
    def test_exact_suffix_and_position(self):
        h = ['"Fiscal period"0FISCPER:0FISCPER', 'ZC_ICO:ZC_ICO',
             'ZU_ROZKZ:ZU_ROZKZ', 'OTHER']
        r = module.machine_field_inventory(h)
        self.assertEqual(r["0FISCPER"], {"positions": [0], "status": "UNIQUE"})
        self.assertEqual(r["ZU_ROZKZ"], {"positions": [2], "status": "UNIQUE"})
        self.assertEqual(r["0FUNC_AREA"]["status"], "MISSING")

    def test_ambiguous_exact_suffix_rejected_as_unverified(self):
        r = module.machine_field_inventory(["0FISCPER:0FISCPER", "period:0FISCPER"])
        self.assertEqual(r["0FISCPER"]["status"], "AMBIGUOUS")
        self.assertEqual(r["0FISCPER"]["positions"], [0, 1])

    def test_substring_does_not_count_as_machine_field(self):
        r = module.machine_field_inventory(["NOT_0FISCPER", "0FISCPER_EXTRA", "X:NOT_ZU_ROZKZ"])
        self.assertEqual(r["0FISCPER"]["status"], "MISSING")
        self.assertEqual(r["ZU_ROZKZ"]["status"], "MISSING")

if __name__ == "__main__":
    unittest.main()
