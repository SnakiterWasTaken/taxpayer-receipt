"""Fail-closed tests using synthetic, NOT official, Czech FIN-like observations."""
import sys
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from fin_2024_aggregation_gates import validate_research_rows, UnverifiedAccountingBasis

def row(**kwargs):
    x = dict(organisation="00000001", period="2024012", purpose="3111",
             item="5331", budget_type="3", actual="100.00")
    x.update(kwargs)
    return x

class FinAggregationGatesTests(unittest.TestCase):
    def check_reject(self, rows, message=None, **kwargs):
        with self.assertRaisesRegex(UnverifiedAccountingBasis, message or "."):
            validate_research_rows(rows, source="state",
                member="MIS-RIS_2024012.csv", **kwargs)

    def test_reject_cumulative_months(self):
        self.check_reject([row(), row(period="2024011", organisation="00000002")], "period")
    def test_reject_special_summary_period(self):
        self.check_reject([row(period="0000000")], "period")
    def test_reject_duplicate_identity(self):
        self.check_reject([row(), row(actual="200.00")], "Repeated")
    def test_reject_unknown_budget_type(self):
        self.check_reject([row(budget_type="0")], "budget type")
    def test_reject_missing_classification(self):
        self.check_reject([row(purpose="")], "classification")
    def test_reject_unknown_csv_section(self):
        with self.assertRaisesRegex(UnverifiedAccountingBasis, "source/member"):
            validate_research_rows([row()], source="state",
                member="ZU01_2024012.csv")
    def test_reject_without_2024_codebook(self):
        self.check_reject([row()], "codebook", transfer_reconciled=True)
    def test_reject_without_transfer_reconciliation(self):
        self.check_reject([row()], "transfers", approved_2024_codebook=True)
    def test_reject_prague_overlap(self):
        with self.assertRaisesRegex(UnverifiedAccountingBasis, "Prague"):
            validate_research_rows([row()], source="prague",
                member="FINMMC201_2024012.csv",
                approved_2024_codebook=True, transfer_reconciled=True)
    def test_nonmonetary_output_even_when_all_gates_explicit(self):
        result = validate_research_rows([row()], source="state",
            member="MIS-RIS_2024012.csv", approved_2024_codebook=True,
            transfer_reconciled=True)
        self.assertFalse(result["amountsCalculated"])
        self.assertFalse(result["budgetManagerVerified"])
        self.assertNotIn("total", result)
        self.assertNotIn("actual", result)

if __name__ == "__main__":
    unittest.main()
