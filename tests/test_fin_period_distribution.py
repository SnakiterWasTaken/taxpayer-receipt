"""Synthetic test for reporting-period distribution in the official ZIP profiler."""
import csv
import importlib.util
import tempfile
import unittest
import zipfile
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "probe-fin-2024.py"
spec = importlib.util.spec_from_file_location("probe_fin_2024", SCRIPT)
probe = importlib.util.module_from_spec(spec)
spec.loader.exec_module(probe)

class PeriodDistributionTests(unittest.TestCase):
    def test_counts_each_period_without_adding_amounts(self):
        with tempfile.TemporaryDirectory() as folder:
            file = Path(folder) / "synthetic.zip"
            with zipfile.ZipFile(file, "w") as archive:
                archive.writestr("MIS-RIS_2024012.csv",
                    "ZC_ICO;0FISCPER;0CI_TYPE;0FUNC_AREA;ZU_ROZKZ\n"
                    "123;2024001;3;3111;10.00\n"
                    "123;2024012;3;3111;120.00\n"
                    "123;2024012;3;3111;120.00\n"
                    "123;0000000;0;;\n")
            with zipfile.ZipFile(file) as archive:
                info = archive.infolist()[0]
                outcome = probe.profile_csv_member(archive, info, ";")
            self.assertEqual(outcome["periodRowCounts"],
                             {"0000000": 1, "2024001": 1, "2024012": 2})
            self.assertEqual(sum(outcome["periodRowCounts"].values()), 4)
            self.assertNotIn("monetaryTotal", outcome)
            self.assertNotIn("amountSum", outcome)

if __name__ == "__main__":
    unittest.main()
