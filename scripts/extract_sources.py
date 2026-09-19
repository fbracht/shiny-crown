"""Reproduce Session 1 text and embedded-image evidence; never edits source PDFs.

Requires pypdf, pdfplumber, Pillow, pdftotext, and optionally tesseract.
Run from the repository root. OCR is evidence, not approved application copy.
"""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import hashlib
import json
import subprocess
import re

import pdfplumber
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs/source-analysis"
INPUTS = {
    "combined-aid": "references/Solo_Player_Aid_Combi_V3.2.pdf",
    "rules": "references/Rules.pdf",
    "crown-handbook": "references/Crown Handbook.pdf",
}
manifest = []


def normalize_extracted_lines(lines: list[str]) -> str:
    """Preserve semantic line breaks while repairing hard-wrapped words."""
    repaired: list[str] = []
    index = 0
    while index < len(lines):
        line = lines[index].rstrip()
        while (
            line.endswith("-")
            and index + 1 < len(lines)
            and re.match(r"^[a-z]", lines[index + 1].lstrip())
        ):
            index += 1
            line = line[:-1] + lines[index].lstrip()
        repaired.append(re.sub(r"[ \t]{2,}", " ", line))
        index += 1
    return "\n".join(repaired)


for sid, relative in INPUTS.items():
    source = ROOT / relative
    reader = PdfReader(source)
    target = OUT / "extracted" / sid
    target.mkdir(parents=True, exist_ok=True)
    subprocess.run(["pdftotext", "-layout", str(source), str(target / "layout.txt")], check=True)
    pages = (target / "layout.txt").read_text().split("\f")[:len(reader.pages)]
    for number, text in enumerate(pages, 1):
        (target / f"page-{number:02}.txt").write_text(text)
    manifest.append({
        "id": sid, "file": relative,
        "sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "pages": len(reader.pages),
        "page_numbering": "PDF page index, one-based; printed numbering matches in supplied files",
        "metadata": {str(k): str(v) for k, v in (reader.metadata or {}).items()},
        "page_stats": [{"pdf_page": n, "chars": len(t.strip())} for n, t in enumerate(pages, 1)],
    })
(OUT / "source-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")

source = ROOT / INPUTS["combined-aid"]
reader = PdfReader(source)
asset_dir = OUT / "assets/combined-aid"
asset_dir.mkdir(parents=True, exist_ok=True)
assets, normalized = [], ["# Combined aid: text layer in reading order", "",
    "Source: Solo_Player_Aid_Combi_V3.2.pdf. PDF/printed pages agree.",
    "Semantic line breaks are retained; hard-wrapped words are repaired. Image-only content is separate in image-transcriptions.md; OCR is unverified evidence.", ""]
with pdfplumber.open(source) as pdf:
    for n, (page, pypage) in enumerate(zip(pdf.pages, reader.pages), 1):
        normalized += [f"## Page {n}", ""]
        if n == 1:
            boxes = [(0, 0, page.width, 120), (0, 120, 302, page.height), (302, 120, page.width, page.height)]
        elif n in (2, 3, 4):
            boxes = [(0, 0, 302, page.height), (302, 0, page.width, page.height)]
        else:
            boxes = [(0, 0, page.width, page.height)]
        for box in boxes:
            txt = page.within_bbox(box).extract_text(x_tolerance=2, y_tolerance=3) or "[No text layer]"
            lines = txt.splitlines()
            if lines and lines[-1].strip() == str(n):
                lines.pop()
            txt = normalize_extracted_lines(lines).replace("\uf045", "-").replace("\uf085", "LEFT").replace("\uf086", "RIGHT")
            normalized += [txt, ""]
        image_map = {Path(im.name).stem: im for im in pypage.images}
        for i, placement in enumerate(page.images, 1):
            name = placement["name"]
            asset = image_map[name]
            filename = f"p{n:02}-{name}.png"
            destination = asset_dir / filename
            if not destination.exists():
                asset.image.save(destination)
            assets.append({
                "id": f"aid.p{n:02}.{name}.placement{i:02}", "asset_id": f"aid.p{n:02}.{name}", "page": n,
                "path": str(destination.relative_to(ROOT)),
                "bbox_pt": [round(placement[k], 3) for k in ("x0", "top", "x1", "bottom")],
                "native_pixels": list(asset.image.size),
                "ocr": str((destination.with_suffix(".txt")).relative_to(ROOT)),
                "classification": "requires-visual-classification",
            })
(OUT / "normalized-reading-order.md").write_text("\n".join(normalized))
(OUT / "image-inventory.json").write_text(json.dumps(assets, indent=2) + "\n")

def ocr(item):
    image_path = ROOT / item["path"]
    output = image_path.with_suffix("")
    if not output.with_suffix(".txt").exists():
        subprocess.run(["tesseract", str(image_path), str(output), "--psm", "6"], check=True, capture_output=True)

with ThreadPoolExecutor(max_workers=3) as pool:
    list(pool.map(ocr, {a["path"]: a for a in assets}.values()))
print(f"Extracted {len(manifest)} PDFs, {len(assets)} image placements; original files unchanged.")
