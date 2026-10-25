#!/usr/bin/env python3
"""Conservative, offline guards for Czech 2024 FIN source rows.

This module deliberately NEVER produces financial aggregates: official 2024 field
semantics, transfer consolidation and the COFOG bridge remain unresolved.
"""
from collections import Counter

class UnverifiedAccountingBasis(ValueError):
    """Input cannot safely support a financial aggregation."""

SOURCE_MEMBERS = {
    "municipal": "FINM201_2024012.csv",
    "prague": "FINMMC201_2024012.csv",
    "state": "MIS-RIS_2024012.csv",
    "fund": "FINSF01_2024012.csv",
}
PERIOD = "2024012"
REQUIRED_FIELDS = ("organisation", "period", "purpose", "item", "budget_type", "actual")

def validate_research_rows(rows, *, source, member, approved_2024_codebook=False,
                           verified_prague_overlap=False, transfer_reconciled=False):
    """Return non-monetary diagnostics only, refusing any unsourced interpretation.

    The flags document gates for future approved workflows; they never unlock
    monetary results from this function.
    """
    if source not in SOURCE_MEMBERS or member != SOURCE_MEMBERS[source]:
        raise UnverifiedAccountingBasis("Unrecognised original 2024 source/member")
    rows = list(rows)
    if not rows:
        raise UnverifiedAccountingBasis("No reporting rows")
    for index, row in enumerate(rows, 1):
        if not isinstance(row, dict) or any(f not in row for f in REQUIRED_FIELDS):
            raise UnverifiedAccountingBasis(f"Row {index}: required source field absent")
        if row["period"] != PERIOD:
            raise UnverifiedAccountingBasis(
                f"Row {index}: non-December or special period {row['period']!r}; "
                "never sum cumulative or unexplained period rows")
        if not str(row["organisation"]).strip():
            raise UnverifiedAccountingBasis(f"Row {index}: missing organisation")
        if not str(row["purpose"]).strip() or not str(row["item"]).strip():
            raise UnverifiedAccountingBasis(f"Row {index}: missing classification")
        if str(row["budget_type"]).strip() not in ("2", "3"):
            raise UnverifiedAccountingBasis(f"Row {index}: unvalidated budget type")
    keys = [(r["organisation"], r["period"], r["purpose"], r["item"],
             r["budget_type"]) for r in rows]
    if len(keys) != len(set(keys)):
        raise UnverifiedAccountingBasis(
            "Repeated simplified identity: extra dimensions or duplicated lines; cannot aggregate")
    if not approved_2024_codebook:
        raise UnverifiedAccountingBasis("2024-effective official codebook not verified")
    if source == "prague" and not verified_prague_overlap:
        raise UnverifiedAccountingBasis("Prague/municipality entity overlap unverified")
    if not transfer_reconciled:
        raise UnverifiedAccountingBasis("Internal transfers not reconciled")
    return {
        "status": "STRUCTURAL_GATES_ONLY_NOT_FINANCIAL_VALIDATION",
        "source": source,
        "recordCount": len(rows),
        "organisations": len({r["organisation"] for r in rows}),
        "period": PERIOD,
        "amountsCalculated": False,
        "cofogMapped": False,
        "budgetManagerVerified": False,
    }
