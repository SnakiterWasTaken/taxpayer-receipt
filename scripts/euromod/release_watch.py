#!/usr/bin/env python3
"""Fail-closed EUROMOD public release watcher. Detects version, not tax-rule changes."""
import argparse
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
from urllib.request import Request, urlopen

SOURCE_URL = 'https://euromod-web.jrc.ec.europa.eu/download-euromod/'
VERSION = r'([A-Z][0-9]+\.[0-9]+\+)'


class StripTags(HTMLParser):
    def __init__(self): super().__init__(); self.chunks=[]
    def handle_data(self, data): self.chunks.append(data)


def parse_release_page(page):
    text = StripTags(); text.feed(page)
    body = re.sub(r'\s+', ' ', ' '.join(text.chunks))
    # The page shows the current beta and stable versions before its archive list.
    model_section = body.split('Model archive - all versions')[0].split('## Model')[-1]
    results = {}
    for label, state in [('beta', 'Beta release'), ('stable', 'Latest stable release')]:
        matches = re.findall(r'EUROMOD model\s+' + VERSION + r'\s+' + state,
                             model_section, flags=re.IGNORECASE)
        if len(matches) != 1:
            raise ValueError(f'Cannot uniquely identify {label} model version (found {len(matches)}). Official page format may have changed.')
        results[label] = matches[0].upper()
    return results


def changes(baseline, current):
    if not all(re.fullmatch(VERSION, str(current.get(k,''))) for k in ('beta','stable')):
        raise ValueError('Invalid current version')
    if not all(re.fullmatch(VERSION, str(baseline.get(k,''))) for k in ('beta','stable')):
        raise ValueError('Invalid baseline version')
    return {k: {'baseline': baseline[k], 'observed': current[k]}
            for k in ('stable','beta') if baseline[k] != current[k]}


def main(argv=None):
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--baseline', default='data/euromod/release-baseline.json')
    p.add_argument('--page-file', help='Offline fixture. By default fetches the official site.')
    p.add_argument('--output', default='release-watch-result.json')
    a=p.parse_args(argv)
    try:
        baseline=json.loads(Path(a.baseline).read_text(encoding='utf-8'))['versions']
        if a.page_file:
            page=Path(a.page_file).read_text(encoding='utf-8')
        else:
            request=Request(SOURCE_URL,headers={'User-Agent':'TaxpayerReceipt-EUROMOD-release-watch/0.1 (+https://github.com/SnakiterWasTaken/taxpayer-receipt)'})
            with urlopen(request,timeout=30) as response:
                if response.status != 200: raise ValueError(f'HTTP {response.status}')
                page=response.read(1_000_001).decode('utf-8')
                if len(page)>1_000_000: raise ValueError('Official page unexpectedly large')
        observed=parse_release_page(page)
        report={'source_url':SOURCE_URL,'baseline':baseline,'observed':observed,
                'changes':changes(baseline,observed),
                'requires_review':baseline!=observed,
                'does_not_auto_update_tax_rules':True}
        dest=Path(a.output);dest.parent.mkdir(parents=True,exist_ok=True)
        dest.write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
        print(f'Observed EUROMOD stable {observed["stable"]}; beta {observed["beta"]}; changes: {len(report["changes"])}')
    except Exception as exc:
        print(f'EUROMOD release monitoring failed safely: {exc}',file=sys.stderr)
        return 2
    return 0


if __name__=='__main__': raise SystemExit(main())
