import importlib.util
from pathlib import Path
import io
import os
import tempfile
import unittest
import zipfile

SOURCE=Path(__file__).resolve().parents[1]/"scripts"/"probe-fin-2024.py"
spec=importlib.util.spec_from_file_location("fin_probe",SOURCE)
probe=importlib.util.module_from_spec(spec)
spec.loader.exec_module(probe)

class FinProbeTests(unittest.TestCase):
    def test_source_registry_is_official_and_year_scoped(self):
        self.assertEqual(len(probe.DATASETS),2)
        for item in probe.DATASETS:
            self.assertIn("2024-12",item["id"])
            self.assertEqual(item["url"].split("/")[2],"monitor.statnipokladna.gov.cz")
            self.assertTrue(item["url"].endswith(".zip"))
            self.assertIn("data.gov.cz/",item["catalogue"])

    def test_sample_header_detection_and_no_trust_in_amounts(self):
        d=probe.sniff_first_csv_rows("ICO;PARAGRAF;POL;SKUTECNOST\n00000001;3113;5331;30000\n".encode())
        self.assertEqual(d["delimiter"],";")
        self.assertEqual(d["header"],["ICO","PARAGRAF","POL","SKUTECNOST"])
        self.assertEqual(d["sampleColumnCounts"][:2],[4,4])

    def test_rejects_path_traversal_and_decompression_bombs(self):
        def info(name,size=100):
            z=zipfile.ZipInfo(name);z.file_size=size;return z
        self.assertFalse(probe.safe_zip_member(info("../evil.csv")))
        self.assertFalse(probe.safe_zip_member(info("/etc/passwd.csv")))
        self.assertFalse(probe.safe_zip_member(info("a.csv",probe.MAX_MEMBER_BYTES+1)))
        self.assertTrue(probe.safe_zip_member(info("FinM/sample.csv")))

    def test_inspects_local_zip_without_exposing_raw_rows(self):
        with tempfile.TemporaryDirectory() as td:
            path=Path(td)/"dummy.zip"
            with zipfile.ZipFile(path,"w") as z:
                z.writestr("sample.csv","ZC_ICO:ZC_ICO;0FISCPER:0FISCPER;FUNC_AREA:0FUNC_AREA;ZU_ROZKZ:ZU_ROZKZ\n00000001;2024012;3113;30000\n")
            parts=probe.inspect_zip(path)
            self.assertEqual(len(parts),1)
            self.assertEqual(parts[0]["header"][0],"ZC_ICO:ZC_ICO")
            self.assertEqual(parts[0]["profile"]["countedRows"],1)
            self.assertTrue(parts[0]["profile"]["rowCountComplete"])
            self.assertEqual(parts[0]["profile"]["uniqueOrganisationIds"],1)
            self.assertEqual(parts[0]["profile"]["periods"],["2024012"])
            self.assertNotIn("00000001",str(parts))

if __name__=="__main__":
    unittest.main()
