#!/usr/bin/env python3
"""Optional real EUROMOD Czech simulator probe using official *training* data.

Requires 'pip install euromod pandas' plus installed EUROMOD executable and
an official model release containing XMLParam/ and Input/CZ_training_data.txt.
No tax law inference, no synthetic fake outputs, no silent fallback.
"""
import argparse
import hashlib
import json
from pathlib import Path
import sys

COLUMNS = ('idhh', 'idperson', 'yem', 'ils_taxin', 'ils_sicee', 'ils_sicer', 'ils_dispy', 'ils_ben')


def run(model_path, years, output_path):
    try:
        import pandas as pd
        from euromod import Model
    except ImportError as exc:
        raise RuntimeError('Install official connector and pandas: python -m pip install euromod pandas') from exc
    model_root=Path(model_path).expanduser().resolve()
    if not (model_root/'XMLParam').is_dir():
        raise ValueError('Model folder must include XMLParam; extract official model ZIP first.')
    training=model_root/'Input'/'CZ_training_data.txt'
    if not training.is_file():
        raise ValueError(f'Missing official training dataset: {training}')
    model=Model(str(model_root))
    data=pd.read_csv(training,sep='\t')
    if not {'idhh','idperson'}.issubset(data.columns):
        raise ValueError('Training input missing mandatory EUROMOD identifiers')
    report={'status':'executed','country':'CZ','years':{},'source':'local_official_model_and_training_data',
            'model_path':str(model_root),'training_sha256':hashlib.sha256(training.read_bytes()).hexdigest(),
            'unit':'EUR/CZK model-specific; raw output monthly (do not treat as annual)',
            'limitations':['Training dataset households are NOT our curated salary/household benchmark cases.',
                           'Tax components may have different coverage and rounding than our Czech employee estimator.',
                           'No parity claim is made. A reviewed scenario-to-input mapping is still required.']}
    for year in years:
        key=f'CZ_{year}'
        try: system=model.countries['CZ'].systems[key]
        except Exception as exc: raise ValueError(f'EUROMOD system {key} unavailable') from exc
        sim=system.run(data,'CZ_training_data',verbose=False)
        if sim.errors:
            raise RuntimeError(f'{key} reported errors: {sim.errors}')
        frame=sim.outputs[0]
        columns=[col for col in COLUMNS if col in frame.columns]
        missing=[col for col in COLUMNS if col not in frame.columns]
        report['years'][str(year)]={'system':key,'rows':len(frame),'available_columns':columns,
                                   'missing_columns':missing,'column_names_sha256':hashlib.sha256(
                                    '\n'.join(map(str,frame.columns)).encode()).hexdigest(),
                                   'result':'training_data_probe_only'}
        if not {'ils_taxin','ils_sicee'}.issubset(columns):
            raise RuntimeError(f'{key}: missing core tax or social contribution columns; inspect actual model output: {missing}')
    dest=Path(output_path); dest.parent.mkdir(parents=True,exist_ok=True)
    dest.write_text(json.dumps(report,indent=2)+'\n')
    return report


def main(argv=None):
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--model',required=True,help='Extracted official EUROMOD model root (containing XMLParam and Input)')
    p.add_argument('--years',type=int,nargs='+',default=[2024,2025,2026])
    p.add_argument('--output',default='euromod-training-probe.json')
    a=p.parse_args(argv)
    try:
        report=run(a.model,a.years,a.output)
        print(f'Official EUROMOD training probe completed: {list(report["years"])}; output: {a.output}')
        return 0
    except Exception as exc:
        print(f'EUROMOD model simulation NOT completed: {exc}',file=sys.stderr)
        return 2


if __name__=='__main__':raise SystemExit(main())
