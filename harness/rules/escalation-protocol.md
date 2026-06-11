# Escalation Protocol (Mid-Flight)

> When a task turns out bigger than estimated, **stop and announce** — don't silently complete.

## Triggers (escalate when ANY)

- Touches ≥ 4 files (originally estimated as 1-2)
- Needs new external dependency (npm/pkg/cargo add)
- Schema or API contract change required
- Discovers ambiguity that changes the spec
- Test failure cascade (> 2 tests fail from same change)
- L2 user request reveals L3+ scope mid-implementation

## Phrasing

> "I estimated this as **L2**, but the work is actually **L3** (4 files + new dep). Stopping here — (a) continue at L3, (b) split, or (c) cancel?"

State the new level, why, then ask. Keep it short.

## When NOT to Escalate

- Minor extra cleanup within same file (do it, mention in commit)
- L1 → L2 growth (1 → 2 files, no new dep) — proceed, note in commit

## After Escalation (parent's call)

| Choice | Action |
|--------|--------|
| (a) Continue at new level | Stop → spec/plan → resume |
| (b) Split | Save partial, list sub-tasks |
| (c) Cancel | Revert in-progress, log to MEMORY.md |

## L5 Recursion Guard

L5 → L3 is fine. **L3 → L5 → L3 → ... is not.** Max one re-estimation; if still ambiguous, surface to parent with `request_user_input`.
