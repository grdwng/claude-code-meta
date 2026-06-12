# Changelog

## v0.3.2 (2026-06-12) — TaskCreate enforcement + .gitignore

**Added:**
- 5th Stop hook trigger: warn on multi-step sessions (≥ 3 edits OR ≥ 8 tool calls) that didn't invoke `TaskCreate`/`TaskUpdate` (L3+ task tree tracking is mandatory)
- `task-workflow.md` Enforcement table: new row referencing the existing "Task Tree" section

**Changed:**
- `harness/hooks/quality-discipline-stop.js` taskListInUse check uses TaskCreate OR TaskUpdate

## v0.3.1 (2026-06-12) — Quality-discipline enforcement

**Added:**
- `harness/hooks/quality-discipline-stop.{json,js}` — Stop hook that warns if a session completes without invoking the mandatory skills its trigger conditions required
- "Quality Gates (enforced)" subsection in `skills/dispatch/SKILL.md`
- "🔴 Enforcement (per-session)" section in `harness/rules/task-workflow.md`

**Changed:**
- Mandatory skills table now uses full registered names (`superpowers:test-driven-development` instead of shorthand `tdd-guide`) — `task-workflow.md:28-31`
- README + harness/CLAUDE.md updated from "2 hooks" → "3 hooks"
- Version bumped v0.3.0 → v0.3.1 (MINOR — new plugin-shipped hook per semver)

**Behavior change:**
- Stop hook fires on session-end, reads transcript, prints stderr warning if any of 4 trigger conditions fired without the corresponding mandatory skill being invoked
- Warn-only (exit 0 always) — does not block session exit
- Triggers: code edits ≥ 1 (TDD), code edits ≥ 1 (verify), bug keywords + edits (debug), <5 tool calls no using-superpowers

**Deferred to v0.4.x:**
- Wrapper-layer (SkillC) for in-session force-invocation of mandatory skills

**v0.3.1 patch (also included in v0.3.2):**
- `.gitignore` excludes `.codegraph/` (regenerable) and `.claude/memory/` (local session state)

## v0.3.0 (2026-06-11) — Slim dispatch architecture

Initial v0.3.x release. 5 slim rules / 253 lines, 3 skills, 4 templates, 2 hooks (codegraph-sync + userpromptsubmit-route).