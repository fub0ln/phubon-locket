#!/usr/bin/env python3
"""Generate a module pointing only to the chosen owner's repository. No login needed."""
import argparse
import re
from pathlib import Path


def render(owner: str, repo: str = "phubon-locket", ref: str = "main", include_qr: bool = True, include_full: bool = True, include_private: bool = True) -> str:
    if not re.fullmatch(r"[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?", owner):
        raise ValueError("Ten tai khoan GitHub khong hop le")
    if not re.fullmatch(r"[A-Za-z0-9_.-]+", repo) or repo in {".", ".."}:
        raise ValueError("Ten repository khong hop le")
    if not re.fullmatch(r"[A-Za-z0-9_.-]+", ref) or ref in {".", ".."}:
        raise ValueError("Chi dung ten nhanh don gian hoac ma commit")
    base = f"https://raw.githubusercontent.com/{owner}/{repo}/{ref}"
    pattern = r"^https:\/\/api\.revenuecat\.com\/v1\/(?:receipts|subscribers\/[^/?]+)\/?(?:\?.*)?$"
    if include_qr and include_full:
        firebase = r"^https:\/\/firebaseremoteconfig\.googleapis\.com\/v1\/projects\/locket-4252a\/.+"
        title = "Phú Bôn - Locket 1.4 Full riêng tư" if include_private else "Phú Bôn - Locket 1.3 Full"
        description = "1.4.1: ngay Gold 01/11/2005 (GMT+7). Giu cac chuc nang Full va lua chon Chi minh toi cua ban 1.4." if include_private else "1.3.0: caption, filter, video 30s, am thanh va giao dien. Giu cau hinh upload va nguoi xem cua may chu."
        full_script = "phubon-full-1.4.js?v=1.4.0" if include_private else "phubon-full.js?v=1.3.0"
        return f"""#!name={title}
#!desc={description}

[Script]
phubon_gold = type=http-response, pattern={pattern}, script-path={base}/phubon-gold.js?v=1.4.1, requires-body=true, max-size=-1, timeout=10
phubon_request = type=http-request, pattern={pattern}, script-path={base}/phubon-request.js?v=1.1.0, timeout=10
phubon_full = type=http-response, pattern={firebase}, script-path={base}/{full_script}, requires-body=true, max-size=-1, timeout=10

[MITM]
hostname = %APPEND%, api.revenuecat.com, firebaseremoteconfig.googleapis.com
"""
    if include_qr:
        firebase = r"^https:\/\/firebaseremoteconfig\.googleapis\.com\/v1\/projects\/locket-4252a\/.+"
        return f"""#!name=Phú Bôn - Locket 1.2 QR kiểm thử
#!desc=1.2.0: giu Gold cua 1.1; chi them cau hinh QR. Khong ep upload, camera hay luot xem.

[Script]
phubon_gold = type=http-response, pattern={pattern}, script-path={base}/phubon-gold.js?v=1.1.0, requires-body=true, max-size=-1, timeout=10
phubon_request = type=http-request, pattern={pattern}, script-path={base}/phubon-request.js?v=1.1.0, timeout=10
phubon_qr = type=http-response, pattern={firebase}, script-path={base}/phubon-qr.js?v=1.2.0, requires-body=true, max-size=-1, timeout=10

[MITM]
hostname = %APPEND%, api.revenuecat.com, firebaseremoteconfig.googleapis.com
"""
    return f"""#!name=Phú Bôn - Locket 1.1 kiểm thử
#!desc=1.1.0: chi xu ly Gold. Khong ep Firebase, upload, QR hay luot xem. Ngay chinh trong phubon-gold.js.

[Script]
phubon_gold = type=http-response, pattern={pattern}, script-path={base}/phubon-gold.js?v=1.1.0, requires-body=true, max-size=-1, timeout=10
phubon_request = type=http-request, pattern={pattern}, script-path={base}/phubon-request.js?v=1.1.0, timeout=10

[MITM]
hostname = %APPEND%, api.revenuecat.com
"""


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--owner", required=True, help="Ten tai khoan GitHub cua ban")
    parser.add_argument("--repo", default="phubon-locket")
    parser.add_argument("--ref", default="main")
    modes = parser.add_mutually_exclusive_group()
    modes.add_argument("--baseline", action="store_true", help="Tao lai ban 1.1 khong them QR")
    modes.add_argument("--qr-only", action="store_true", help="Tao lai ban 1.2 chi them QR")
    modes.add_argument("--full-1-3", action="store_true", help="Tao lai ban Full 1.3 chua them rieng tu")
    parser.add_argument("--output", default="PhuBon.module")
    args = parser.parse_args()
    Path(args.output).write_text(render(args.owner, args.repo, args.ref, include_qr=not args.baseline, include_full=not args.qr_only, include_private=not args.full_1_3), encoding="utf-8")
    print(f"Da tao {args.output}")
