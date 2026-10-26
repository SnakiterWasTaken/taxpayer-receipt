"""Synthetic regression for December-only original state chapter inventory."""
import importlib.util
import tempfile
import unittest
import zipfile
from pathlib import Path
spec=importlib.util.spec_from_file_location("finprobe",Path(__file__).resolve().parents[1]/"scripts"/"probe-fin-2024.py")
m=importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
class ChapterCoverageTests(unittest.TestCase):
    def test_state_chapters_only_december_and_no_amounts(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/"synthetic.zip"
            with zipfile.ZipFile(p,"w") as z:
                z.writestr("MIS-RIS_2024012.csv","0FISCPER;0FM_AREA;ZC_ICO;0FUNC_AREA;ZU_ROZKZ\n2024011;313;01;3111;99\n2024012;313;01;3111;101\n2024012;333;02;3111;200\n0000000;398;00;;0\n")
            with zipfile.ZipFile(p) as z:
                out=m.profile_csv_member(z,z.infolist()[0],";")
            self.assertEqual(out["decemberChapterRowCounts"],{"313":1,"333":1})
            self.assertNotIn("actualTotal",out)
if __name__=="__main__": unittest.main()
