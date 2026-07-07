# R220D GPT Review Readme

## Package

`1013R_R220D_R97B_RENDER_SLOT_DOM_SMOKE`

## Verdict Requested

Please review whether this package can be accepted as:

`R97B render slot DOM smoke after R220B/R220C`

This is still not real field rendering.

## Important Scope Update

Right rail and big-screen content are intentionally out of scope in R220D.

The right rail is treated only as:

`reserved auxiliary surface`

R220D verifies that the slot exists, the resolver can find it, and it is isolated from the teacher main body. R220D must not validate, define, generate, or approve the historical right-rail or big-screen content.

Big-screen and clean right-rail content should move to a later R230 line.

## Boundary

- No new HTML shell.
- No R21/R36 edit.
- No R36/M1/R100-P1 promotion.
- No formal apply.
- No database, Feishu, or memory write.
- No PPTX/PDF/DOCX export.
- No R95.
- No provider/model call.
- No Xiaojiao real modification.
- No field-level editing.
- No replacement of the R201F/R201H main chain.
- No real field rendering in R220D.
- No right-rail or big-screen content model definition.

## Files To Review

- `r220d_dom_smoke_environment.md`
- `r220d_static_resolver_smoke.json`
- `r220d_dynamic_child_slot_smoke.json`
- `r220d_uploaded_payload_rebind_smoke.json`
- `r220d_teaching_process_dom_smoke.json`
- `r220d_right_rail_bottom_xiaojiao_boundary_smoke.json`
- `r220d_wrong_shell_guard_report.md`
- `r220d_dom_smoke_summary.md`
- `validate_1013R_R220D_r97b_render_slot_dom_smoke_result.json`

## Expected Acceptance

Accept only if:

- R220B parent slots resolve in a real browser.
- R220C child section slots are present or recorded as gaps.
- Uploaded readonly payload rebind keeps parent slots resolvable.
- Teaching process episodes remain inside `#nb-section-teaching-process`.
- `source_gap_as_teaching_body = 0`.
- `provisional_without_teacher_review_label = 0`.
- Right rail is slot-isolated and not treated as teacher main source.
- Legacy big-screen/right-rail content is not promoted into the center lesson body.
- Wrong shell guard stays on R97B.
