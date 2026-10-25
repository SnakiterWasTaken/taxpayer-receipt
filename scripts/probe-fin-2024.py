#!/usr/bin/env python3
"""Read-only provenance/schema probe of original MF MONITOR 2024 FIN ZIPs.

Never turns a probe into a published spending figure or budget-manager claim.
Output is JSON metadata only. Does NOT upload or redistribute original records.
"""
from __future__ import annotations
import argparse
import csv
import hashlib
import io
import json
import os
from pathlib import Path
import tempfile
import urllib.request
import zipfile

SOURCE = "https://data.gov.cz/datov%C3%A1-sada?iri=https://data.gov.cz/zdroj/datov%C3%A9-sady/00006947/"
DATASETS = [
    {"id": "FIN2-12M-USC-2024-12", "scope": "municipalities, regions and municipal associations",
     "catalogue": SOURCE+"a292cf11a404725b37bcef6fc39203f5",
     "url": "https://monitor.statnipokladna.gov.cz/data/extrakty/csv/FinM/2024_12_Data_CSUIS_FINM.zip"},
    {"id": "FIN2-12M-PRAGUE-2024-12", "scope": "Prague magistrate and district statements; possible overlap with other accounts",
     "catalogue": SOURCE+"f9e06d391325b61670602899e652e084",
     "url": "https://monitor.statnipokladna.gov.cz/data/extrakty/csv/FinMMC/2024_12_Data_CSUIS_FINMMC.zip"},
]
MAX_ZIP_BYTES = 250 * 1024 * 1024
MAX_MEMBER_BYTES = 1_000 * 1024 * 1024

def safe_zip_member(info: zipfile.ZipInfo) -> bool:
    name = info.filename.replace("\\", "/")
    parts = name.split("/")
    return (not info.is_dir() and
        not name.startswith("/") and not name.startswith("./") and
        not any(p in ("..", "") for p in parts) and
        not (len(name)>240 or info.file_size>MAX_MEMBER_BYTES) and
        (name.lower().endswith(".csv") or name.lower().endswith(".txt")))

def sniff_first_csv_rows(sample: bytes) -> dict:
    decoded = sample.decode("utf-8-sig", errors="replace")
    try:
        dialect = csv.Sniffer().sniff(decoded[:12000], delimiters=";,\t|")
        delimiter = dialect.delimiter
    except csv.Error:
        delimiter = ";" if decoded.count(";")>decoded.count(",") else ","
    rows = list(csv.reader(io.StringIO(decoded), delimiter=delimiter))
    return {"delimiter": delimiter, "header": rows[0][:60] if rows else [],
            "sampleColumnCounts": [len(row) for row in rows[:4]],
            "sampleLinesInspected": min(len(rows), 4)}

MAX_PROFILE_ROWS_PER_MEMBER = 2_000_000

def profile_csv_member(archive: zipfile.ZipFile, info: zipfile.ZipInfo, delimiter: str) -> dict:
    """Stream actual rows; publish counts and code distributions, never source rows."""
    with archive.open(info) as binary:
        with io.TextIOWrapper(binary, encoding="utf-8-sig", errors="replace", newline="") as stream:
            reader=csv.reader(stream,delimiter=delimiter)
            header=next(reader,[])
            def col(fragment):
                return next((i for i,name in enumerate(header) if fragment in name),None)
            ico_col=col("ZC_ICO")
            period_col=col("0FISCPER")
            type_col=col("0CI_TYPE")
            purpose_col=col("0FUNC_AREA")
            amount_col=col("ZU_ROZKZ")
            organisations=set(); periods=set(); types={}; purpose_codes=set()
            count=0; bad_columns=0; null_actuals=0; amount_shapes={}
            for row in reader:
                count+=1
                if len(row)!=len(header):
                    bad_columns+=1
                if ico_col is not None and len(row)>ico_col:
                    value=row[ico_col].strip()
                    if value:organisations.add(value)
                if period_col is not None and len(row)>period_col:
                    periods.add(row[period_col].strip())
                if type_col is not None and len(row)>type_col:
                    label=row[type_col].strip()
                    types[label]=types.get(label,0)+1
                if purpose_col is not None and len(row)>purpose_col:
                    val=row[purpose_col].strip()
                    if val:purpose_codes.add(val)
                if amount_col is not None and len(row)>amount_col:
                    val=row[amount_col].strip()
                    if not val:null_actuals+=1
                    else:
                        shape=("comma" if "," in val else "dot" if "." in val else "integer")
                        amount_shapes[shape]=amount_shapes.get(shape,0)+1
                if count>=MAX_PROFILE_ROWS_PER_MEMBER:break
            return {"countedRows":count,"rowCountComplete":count<MAX_PROFILE_ROWS_PER_MEMBER,
                "malformedColumnRows":bad_columns,"uniqueOrganisationIds":len(organisations),
                "periods":sorted(periods)[:24],
                "budgetTypeDistribution":types,
                "distinctPurposeCodes":len(purpose_codes),
                "missingActualFields":null_actuals,
                "actualAmountFormats":amount_shapes}

def inspect_zip(path: Path) -> list[dict]:
    with zipfile.ZipFile(path) as archive:
        infos = [x for x in archive.infolist() if safe_zip_member(x)]
        if not infos:
            raise ValueError("No safely inspectable CSV/TXT members found in ZIP")
        result = []
        for info in infos[:40]:
            with archive.open(info) as member:
                sample = member.read(32_768)
            item = {"file": info.filename, "uncompressedBytes": info.file_size,
                    "compressedBytes": info.compress_size, "crc32": format(info.CRC, "08x")}
            item.update(sniff_first_csv_rows(sample))
            item["profile"]=profile_csv_member(archive,info,item["delimiter"])
            result.append(item)
        return result

def download_probe(dataset: dict) -> dict:
    result = {"dataset": dataset["id"], "scope": dataset["scope"],
              "catalogue": dataset["catalogue"], "distribution": dataset["url"],
              "status": "BLOCKED", "archiveSha256Computed": False,
              "financialReconciliationVerified": False, "budgetManagerVerified": False}
    name = None
    try:
        req = urllib.request.Request(dataset["url"], headers={
            "User-Agent": "taxpayer-receipt/0.10 data research contact Github",
            "Accept": "application/zip"})
        hasher = hashlib.sha256()
        total = 0
        with urllib.request.urlopen(req, timeout=70) as response:
            result["httpStatus"] = response.status
            declared = response.headers.get("Content-Length")
            result["declaredContentLength"] = int(declared) if declared and declared.isdigit() else None
            if result["declaredContentLength"] and result["declaredContentLength"]>MAX_ZIP_BYTES:
                raise ValueError("Published ZIP exceeds maximum safe probe size")
            with tempfile.NamedTemporaryFile(prefix="mf-fin-",suffix=".zip",delete=False) as file:
                name=file.name
                while True:
                    chunk = response.read(1024*1024)
                    if not chunk: break
                    total += len(chunk)
                    if total>MAX_ZIP_BYTES: raise ValueError("ZIP exceeded capped probe size")
                    hasher.update(chunk); file.write(chunk)
        result["downloadedBytes"] = total
        result["sha256"] = hasher.hexdigest()
        result["members"] = inspect_zip(Path(name))
        result["status"] = "SOURCE_ZIP_INSPECTED"
        # SHA256 identifies downloaded archive; CSV rows are profiled without publishing them.
        result["archiveSha256Computed"] = True
    except Exception as exc:
        result["failureType"] = type(exc).__name__
        result["failureExplanation"] = str(exc)[:500]
    finally:
        if name and os.path.isfile(name): os.unlink(name)
    return result

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--out",default="test-results/fin-2024-source-probe.json")
    parser.add_argument("--only",choices=["all","municipal","prague"],default="all")
    args=parser.parse_args()
    subset = DATASETS if args.only=="all" else [DATASETS[0] if args.only=="municipal" else DATASETS[1]]
    out={"schema":1,"kind":"SOURCE_DISCOVERY_ONLY","period":"2024-12",
         "scopeWarning":"Source ZIP sampling does not validate accounting totals, internal transfers, COFOG classification or budget decision authority.",
         "datasets":[download_probe(ds) for ds in subset]}
    path=Path(args.out)
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(out,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    for ds in out["datasets"]:
        print(ds["dataset"]+": "+ds["status"]+", bytes="+str(ds.get("downloadedBytes","unknown")))
        if "failureExplanation" in ds: print("  Reason: "+ds["failureExplanation"])
        else:
            for item in ds["members"][:8]:
                print("  "+item["file"]+": "+str(item["profile"]["countedRows"])+
                      " rows; "+str(item["profile"]["uniqueOrganisationIds"])+" distinct organisation IDs; "+str(item["uncompressedBytes"])+
                      " decompressed bytes; delimiter="+repr(item["delimiter"])+"; columns="+str(item["header"][:12]))
    print("Saved metadata: "+str(path))
    # A failed official download is BLOCKED; do not report it as successful data ingestion.
    return 0 if all(x["status"]=="SOURCE_ZIP_INSPECTED" for x in out["datasets"]) else 2

if __name__=="__main__":
    raise SystemExit(main())
