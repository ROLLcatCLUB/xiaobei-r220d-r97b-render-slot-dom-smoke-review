from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


STAGE = "1013R_R220D_R97B_RENDER_SLOT_DOM_SMOKE"
ROOT_OUTPUT = Path("outputs/PREP_ROOM_RENDER_CANVAS_DEEPEN_V1")
OUTPUT_DIR = ROOT_OUTPUT / STAGE
TARGET = (
    ROOT_OUTPUT
    / "1013R_R97B_TEACHER_SHELL_EXPERIENCE_POLISH_AND_STALE_CONTENT_CLEANUP"
    / "r97b_clean_shell_context_preview.html"
)
RESULT = OUTPUT_DIR / "validate_1013R_R220D_r97b_render_slot_dom_smoke_result.json"

REQUIRED_FILES = [
    "README_FOR_GPT_REVIEW.md",
    "PACKAGE_MANIFEST.json",
    "r220d_scope_note_right_rail_aux_surface.md",
    "r220d_dom_smoke_environment.md",
    "r220d_static_resolver_smoke.json",
    "r220d_dynamic_child_slot_smoke.json",
    "r220d_uploaded_payload_rebind_smoke.json",
    "r220d_teaching_process_dom_smoke.json",
    "r220d_right_rail_bottom_xiaojiao_boundary_smoke.json",
    "r220d_wrong_shell_guard_smoke.json",
    "r220d_wrong_shell_guard_report.md",
    "r220d_dom_smoke_summary.json",
    "r220d_dom_smoke_summary.md",
    "runner/run_1013R_R220D_r97b_render_slot_dom_smoke.js",
    "validator/validate_1013R_R220D_r97b_render_slot_dom_smoke.py",
]

FORBIDDEN_TRUE_BOUNDARY_KEYS = [
    "real_field_rendering",
    "new_html_shell",
    "R21_modified",
    "R36_modified",
    "R36_M1_R100_P1_promoted",
    "formal_apply",
    "database_written",
    "feishu_written",
    "memory_written",
    "pptx_pdf_docx_generated",
    "R95_executed",
    "provider_model_called",
    "xiaojiao_real_modification",
    "field_level_editing",
    "R201F_R201H_main_chain_replaced",
    "right_rail_content_model_defined",
    "big_screen_content_model_defined",
]


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8-sig"))


def all_false(mapping: dict[str, Any], keys: list[str]) -> dict[str, bool]:
    return {key: mapping.get(key) is False for key in keys}


def check(root: Path) -> dict[str, Any]:
    output_dir = root / OUTPUT_DIR
    target = root / TARGET
    required_files = {name: (output_dir / name).exists() for name in REQUIRED_FILES}

    json_names = [
        "PACKAGE_MANIFEST.json",
        "r220d_static_resolver_smoke.json",
        "r220d_dynamic_child_slot_smoke.json",
        "r220d_uploaded_payload_rebind_smoke.json",
        "r220d_teaching_process_dom_smoke.json",
        "r220d_right_rail_bottom_xiaojiao_boundary_smoke.json",
        "r220d_wrong_shell_guard_smoke.json",
        "r220d_dom_smoke_summary.json",
    ]
    parsed: dict[str, bool] = {}
    data: dict[str, Any] = {}
    for name in json_names:
        try:
            data[name] = read_json(output_dir / name)
            parsed[name] = True
        except Exception:
            parsed[name] = False

    manifest = data.get("PACKAGE_MANIFEST.json") or {}
    static = data.get("r220d_static_resolver_smoke.json") or {}
    dynamic = data.get("r220d_dynamic_child_slot_smoke.json") or {}
    rebind = data.get("r220d_uploaded_payload_rebind_smoke.json") or {}
    process = data.get("r220d_teaching_process_dom_smoke.json") or {}
    right = data.get("r220d_right_rail_bottom_xiaojiao_boundary_smoke.json") or {}
    wrong_shell = data.get("r220d_wrong_shell_guard_smoke.json") or {}
    summary = data.get("r220d_dom_smoke_summary.json") or {}

    parent_slots = static.get("parent_slots") or {}
    parent_slot_checks = {
        slot: bool((parent_slots.get(slot) or {}).get("exists"))
        for slot in ["lesson-body", "teaching-process", "right-rail", "bottom-xiaojiao"]
    }

    child_slots = dynamic.get("child_slots") or {}
    child_slot_checks = {
        slot: bool((child_slots.get(slot) or {}).get("exists") or (child_slots.get(slot) or {}).get("missing_recorded_as_gap"))
        for slot in [
            "basis",
            "analysis",
            "goals",
            "keypoints",
            "preparation",
            "assessment",
            "teaching-process",
            "teaching-process-episodes",
        ]
    }

    right_rail_isolation_checks = {
        "right_rail_slot_exists": right.get("right_rail_slot_exists") is True,
        "right_rail_content_semantics_out_of_scope": right.get("right_rail_content_semantics_out_of_scope") is True,
        "legacy_big_screen_content_not_promoted": right.get("legacy_big_screen_content_not_promoted") is True,
        "right_rail_not_teacher_main_source": right.get("right_rail_not_teacher_main_source") is True,
        "right_rail_does_not_write_main_body": right.get("right_rail_does_not_write_main_body") is True,
        "dirty_legacy_right_rail_hidden_or_ignored": right.get("dirty_legacy_right_rail_hidden_or_ignored") is True,
        "right_rail_slot_isolation_pass": right.get("right_rail_slot_isolation_pass") is True,
        "big_screen_content_model_out_of_scope": right.get("big_screen_content_model_out_of_scope") is True,
    }

    pass_conditions = {
        "required_files": all(required_files.values()),
        "json_parse": all(parsed.values()),
        "target_exists": target.exists(),
        "resolver_parent_slots_pass": static.get("resolver_parent_slots_pass") is True and all(parent_slot_checks.values()),
        "dynamic_child_slots_pass": dynamic.get("dynamic_child_slots_pass") is True and all(child_slot_checks.values()),
        "uploaded_payload_rebind_pass": rebind.get("uploaded_payload_rebind_pass") is True,
        "no_backend_network_call": rebind.get("no_backend_network_call") is True,
        "teaching_process_dom_pass": process.get("teaching_process_dom_pass") is True,
        "source_gap_as_teaching_body_zero": process.get("source_gap_as_teaching_body") == 0,
        "provisional_without_teacher_review_label_zero": process.get("provisional_without_teacher_review_label") == 0,
        "right_rail_slot_isolation_pass": all(right_rail_isolation_checks.values()),
        "bottom_xiaojiao_slot_isolation_pass": right.get("bottom_xiaojiao_slot_isolation_pass") is True,
        "wrong_shell_guard_pass": wrong_shell.get("wrong_shell_guard_pass") is True,
        "summary_pass": summary.get("status") == "PASS",
        "field_rendering_false": summary.get("field_rendering") is False,
        "formal_apply_false": summary.get("formal_apply") is False,
        "no_write_true": summary.get("no_write") is True,
        "no_R95_true": summary.get("no_R95") is True,
        "no_model_provider_call_true": summary.get("no_model_provider_call") is True,
        "manifest_boundary": (manifest.get("boundary") or {}).get("dom_smoke_only") is True
        and all(all_false(manifest.get("boundary") or {}, FORBIDDEN_TRUE_BOUNDARY_KEYS).values()),
    }

    passed = all(pass_conditions.values())
    return {
        "stage": STAGE,
        "status": "PASS" if passed else "FAIL",
        "target_file": str(TARGET).replace("\\", "/"),
        "checks": {
            "required_files": required_files,
            "json_parse": parsed,
            "parent_slot_checks": parent_slot_checks,
            "child_slot_checks": child_slot_checks,
            "right_rail_isolation_checks": right_rail_isolation_checks,
            "pass_conditions": pass_conditions,
        },
        "right_rail_scope": {
            "classification": "reserved auxiliary surface",
            "content_semantics_out_of_scope": True,
            "big_screen_content_model_out_of_scope": True,
            "future_line": "R230_BIG_SCREEN_AND_RIGHT_RAIL_AUX_SURFACE",
        },
        "boundary": {
            "dom_smoke_only": True,
            "real_field_rendering": False,
            "new_html_shell": False,
            "R21_modified": False,
            "R36_modified": False,
            "R36_M1_R100_P1_promoted": False,
            "formal_apply": False,
            "database_written": False,
            "feishu_written": False,
            "memory_written": False,
            "pptx_pdf_docx_generated": False,
            "R95_executed": False,
            "provider_model_called": False,
            "xiaojiao_real_modification": False,
            "field_level_editing": False,
            "R201F_R201H_main_chain_replaced": False,
            "right_rail_content_model_defined": False,
            "big_screen_content_model_defined": False,
        },
        "next_recommended_stages": [
            "R201I_SINGLE_LESSON_TEMPLATE_V1_FREEZE_CANDIDATE",
            "1013R_R220E_SINGLE_LESSON_TEMPLATE_CENTER_BODY_READONLY_BINDING",
            "R230A_RIGHT_RAIL_DIRTY_CONTENT_AUDIT_AND_QUARANTINE",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".", help="repository root")
    args = parser.parse_args()
    root = Path(args.root).resolve()
    result = check(root)
    output = root / RESULT
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
