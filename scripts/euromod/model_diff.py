#!/usr/bin/env python3
"""Compare a country's *actual* EUROMOD XML policy files across local releases.

This is a structural diff, NOT a legal interpretation of policy or an automatic
translation into taxpayer-receipt rules. Only reads explicit --old / --new files;
never downloads or executes model code. Accepts downloaded model ZIPs or directories.
"""
import argparse
import hashlib
import json
from pathlib import Path
import re
import sys
import xml.etree.ElementTree as ET
import zipfile

MAX_XML_BYTES = 30_000_000


def country_xml(source, country='CZ'):
    country = country.upper()
    if not re.fullmatch(r'[A-Z]{2}', country):
        raise ValueError('Country must be a two-letter code')
    src = Path(source)
    def matches(name):
        path = Path(name)
        return (path.name.lower() == country.lower() + '.xml' and
                ('xmlparam' in [part.lower() for part in path.parts]))
    if src.is_dir():
        paths = [p for p in src.rglob('*.xml') if matches(str(p))]
        if len(paths) != 1:
            raise ValueError(f'Expected one XMLParam/{country}.xml in {src}, found {len(paths)}')
        if paths[0].stat().st_size > MAX_XML_BYTES:
            raise ValueError('Country XML exceeds size limit')
        return paths[0].read_bytes()
    if src.is_file() and zipfile.is_zipfile(src):
        with zipfile.ZipFile(src) as z:
            files = [f for f in z.infolist() if not f.is_dir() and matches(f.filename)]
            if len(files) != 1:
                raise ValueError(f'Expected one XMLParam/{country}.xml in archive, found {len(files)}')
            if files[0].file_size > MAX_XML_BYTES:
                raise ValueError('Country XML exceeds size limit')
            return z.read(files[0])
    raise FileNotFoundError(f'Expected EUROMOD model archive (.zip) or folder: {src}')


def name(tag):
    return tag.rsplit('}', 1)[-1]  # Strip XML namespace from JRC files.


def child_text(el, child_name):
    for x in el:
        if name(x.tag) == child_name and x.text and x.text.strip():
            return x.text.strip()
    return None


def xml_snapshot(raw, country='CZ'):
    """Key paths with human-readable names/IDs, preserving structural changes.

    Produces a stable best-effort XML diff, NOT a semantic parameter extractor.
    Duplicate semantic keys are distinguished by their index, so moves can be noisy.
    """
    root = ET.fromstring(raw)
    entries = {}
    def walk(node, path):
        tag = name(node.tag)
        identifier = (child_text(node, 'Name') or node.attrib.get('name')
                      or child_text(node, 'ShortName') or child_text(node, 'ID'))
        # Identify siblings by name when possible, otherwise position.
        siblings = []
        for ch in node:
            label = name(ch.tag)
            key = child_text(ch, 'Name') or ch.attrib.get('name') or child_text(ch, 'ShortName')
            siblings.append((ch, label, key))
        seen = {}
        content = (node.text or '').strip()
        if content:
            entries[path + '/#text'] = content
        for k, v in sorted(node.attrib.items()):
            entries[path + '/@' + name(k)] = v
        for ch, label, key in siblings:
            token = f'{label}[{key}]' if key else label
            seen[token] = seen.get(token, 0) + 1
            count = sum(1 for _, l, n in siblings if l == label and (n or '') == (key or ''))
            if count > 1: token += f'#{seen[token]}'
            walk(ch, path + '/' + token)
    walk(root, '/' + name(root.tag))
    return entries


def compare(old_bytes, new_bytes, country='CZ', max_changes=250):
    old = xml_snapshot(old_bytes, country)
    new = xml_snapshot(new_bytes, country)
    changes = []
    for key in sorted(old.keys() | new.keys()):
        if old.get(key) != new.get(key):
            kind = 'added' if key not in old else 'removed' if key not in new else 'changed'
            changes.append({'kind': kind, 'path': key,
                            'before': old.get(key), 'after': new.get(key)})
    return {
        'country': country.upper(), 'method': 'structural_xml_diff_not_tax_rule_update',
        'old_sha256': hashlib.sha256(old_bytes).hexdigest(),
        'new_sha256': hashlib.sha256(new_bytes).hexdigest(),
        'old_entries': len(old), 'new_entries': len(new),
        'change_count': len(changes), 'changes': changes[:max_changes],
        'truncated': len(changes) > max_changes,
        'review_required': bool(changes),
    }


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--old', required=True, help='Unpacked EUROMOD model or official model ZIP')
    p.add_argument('--new', required=True, help='Unpacked EUROMOD model or official model ZIP')
    p.add_argument('--country', default='CZ')
    p.add_argument('--output', help='Write report JSON here, otherwise stdout')
    a = p.parse_args(argv)
    try:
        report = compare(country_xml(a.old, a.country), country_xml(a.new, a.country), a.country)
        report['old_source'] = str(a.old)
        report['new_source'] = str(a.new)
        rendered = json.dumps(report, indent=2, ensure_ascii=False) + '\n'
        if a.output:
            dest = Path(a.output); dest.parent.mkdir(parents=True, exist_ok=True); dest.write_text(rendered)
        else: print(rendered, end='')
        return 0
    except (OSError, ValueError, ET.ParseError, zipfile.BadZipFile) as exc:
        print(f'EUROMOD model diff unavailable: {exc}', file=sys.stderr)
        return 2


if __name__ == '__main__':
    raise SystemExit(main())
