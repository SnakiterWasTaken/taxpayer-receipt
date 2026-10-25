import json
from pathlib import Path
import sys
import tempfile
import unittest
from zipfile import ZipFile

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'scripts'/'euromod'))
from model_diff import country_xml, xml_snapshot, compare
from release_watch import parse_release_page, changes


def model_xml(rate='0.15', tax='TIN', include_extra=False):
    extra = '<Policy><Name>NewTax</Name><Rate>0.02</Rate></Policy>' if include_extra else ''
    return f'''<?xml version="1.0"?><CountryConfig xmlns="http://euromod.com/CountryConfig.xsd"><Country><ShortName>CZ</ShortName><System><Name>CZ_2024</Name><Policy><Name>{tax}</Name><Rate>{rate}</Rate></Policy>{extra}</System></Country></CountryConfig>'''.encode()


class EUROMODIntegrationTests(unittest.TestCase):
    def test_no_change(self):
        self.assertEqual(compare(model_xml(),model_xml())['change_count'],0)
    def test_rate_change_detected(self):
        r=compare(model_xml(),model_xml(rate='0.16'))
        self.assertTrue(r['review_required'])
        self.assertTrue(any(c['before']=='0.15' and c['after']=='0.16' for c in r['changes']))
    def test_mechanism_added(self):
        r=compare(model_xml(),model_xml(include_extra=True))
        self.assertTrue(any(c['kind']=='added' for c in r['changes']))
    def test_zip_and_directory(self):
        with tempfile.TemporaryDirectory() as d:
            base=Path(d); root=base/'release'/'XMLParam';root.mkdir(parents=True)
            (root/'CZ.xml').write_bytes(model_xml())
            (root/'CZ_DataConfig.xml').write_bytes(b'<data/>')
            self.assertEqual(country_xml(base/'release'),model_xml())
            with ZipFile(base/'model.zip','w') as z:
                z.writestr('model/XMLParam/CZ.xml',model_xml())
                z.writestr('model/XMLParam/CZ_DataConfig.xml',b'<data/>')
            self.assertEqual(country_xml(base/'model.zip'),model_xml())
    def test_duplicate_country_fail_closed(self):
        with tempfile.TemporaryDirectory() as d:
            zpath=Path(d)/'model.zip'
            with ZipFile(zpath,'w') as z:
                z.writestr('A/XMLParam/CZ.xml',model_xml())
                z.writestr('B/XMLParam/CZ.xml',model_xml())
            with self.assertRaisesRegex(ValueError,'found 2'):country_xml(zpath)
    def test_release_page_parse(self):
        page='<h2>Model</h2><a>EUROMOD model J2.54+</a> Beta release (September 2026) <a>EUROMOD model J2.0+</a> Latest stable release (February 2026)<h3>Model archive - all versions</h3>'
        self.assertEqual(parse_release_page(page),{'beta':'J2.54+','stable':'J2.0+'})
    def test_release_changes(self):
        self.assertEqual(changes({'beta':'J2.54+','stable':'J2.0+'},{'beta':'J2.54+','stable':'J2.0+'}),{})
        self.assertEqual(changes({'beta':'J2.54+','stable':'J2.0+'},{'beta':'J3.0+','stable':'J2.0+'}),{'beta':{'baseline':'J2.54+','observed':'J3.0+'}})
    def test_release_ambiguous_fails(self):
        with self.assertRaisesRegex(ValueError,'uniquely'):parse_release_page('<div>Unknown new site layout</div>')

if __name__=='__main__':unittest.main()
