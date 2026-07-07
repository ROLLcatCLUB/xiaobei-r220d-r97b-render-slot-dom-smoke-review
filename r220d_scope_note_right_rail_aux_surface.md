# R220D Right Rail Scope Note

R220D intentionally does not define right-rail or big-screen content semantics.

Current right rail / big-screen area contains historical dirty content. It must not be treated as an accepted render result for `single_lesson_template`, and it must not become a source for the center teacher main body.

## R220D Allows

- Check that `right-rail` slot exists.
- Check that `resolveRenderSlot("right-rail")` works.
- Check that right rail is outside `lesson-body`.
- Check that right rail is not part of teacher main source selectors.
- Check that legacy dirty big-screen/right-rail text is not promoted into the center body.

## R220D Forbids

- Define big-screen content model.
- Bind classroom display.
- Generate courseware script.
- Generate material suggestions.
- Connect Xiaojiao suggestions as accepted right-rail content.
- Treat old P6 / legacy right-rail text as valid rendering.
- Let right-rail text enter teacher main body.

## Future Line

Right rail and big-screen content should be handled later by:

`R230_BIG_SCREEN_AND_RIGHT_RAIL_AUX_SURFACE`

Possible later split:

- `R230A_RIGHT_RAIL_DIRTY_CONTENT_AUDIT_AND_QUARANTINE`
- `R230B_BIG_SCREEN_CONTENT_MODEL_CONTRACT`
- `R230C_RIGHT_RAIL_CLEAN_RENDERER_PREVIEW`
- `R230D_CURRENT_EPISODE_TO_BIG_SCREEN_CONTEXT_BINDING`
