---
name: self-evolve
description: Periodic self-audit for Claude Code projects — runs audit-skills.sh, compares to ideal-workflow baseline, identifies deviations, proposes rule updates (suggested mode, human reviews before any change)
---

# Self-Evolve

Periodic self-audit. The growth skill in the lifecycle (init → harness → **self-evolve**).

## When to use

- **Weekly cron** (every Monday 10:07 — set up by init-project)
- User says "跑自检" / "audit the project" / "self-evolve"
- After any major workflow change to compare new baseline against usage
- After installing new plugins (verify they get used)

## What it does (6 steps)

1. **Run** `bash scripts/audit-skills.sh` → generates `docs/superpowers/audits/audit-YYYY-MM-DD.md`
2. **Read** `docs/superpowers/ideal-workflow.md` (baseline) + previous audit report (trend)
3. **Compute deltas** for the 4 mandatory skills:
   - `using-superpowers` (target ≥ 1.0/session)
   - `test-driven-development` (target ≥ 0.5/session)
   - `systematic-debugging` (target ≥ 0.5/session)
   - `verification-before-completion` (target ≥ 1.0/session)
4. **routing-table health check** (v0.3.0+): read `harness/rules/routing-table.md`, extract all keywords, cross-reference against `audit-skills.sh` last-30-day hit counts. Report:
   - **0-hit keywords** (never matched in 30d) — candidates for removal
   - **over-active keywords** (matched in > 50% of sessions) — too broad, narrow scope
   - Output as a table: `| keyword | hit-rate | verdict |`
5. **Propose** rule updates IF deviation persists 2+ cycles (suggested mode — human reviews before any change)
6. **Write** findings to `memory/` if new pattern observed + report to user

## Mode: SUGGESTED (not autonomous)

This skill **proposes**, never **enforces** changes. Each suggestion shows:
- The diff (what would change)
- The reasoning (data + 2+ cycles of evidence)
- The expected impact

User reviews and confirms before any rule file is modified.

## Outputs

- New audit report: `docs/superpowers/audits/audit-YYYY-MM-DD.md`
- Optional memory file if a new pattern is identified
- User-facing summary: 3-5 bullets, focused on deltas

## Trust but verify

`codegraph status` can lie. If audit data looks suspicious (sudden drop in tool usage, etc.), re-run with full rebuild: `codegraph index`. See memory file `codegraph-stale-edges` for the full gotcha.

## References

- Templates: this plugin's `templates/ideal-workflow.md` (master copy)
- Audit script: project's `scripts/audit-skills.sh` (was `templates/audit-skills.sh` from this plugin)
- Origin: 2026-06-07 self-audit in 01_project, see `memory/plugin-skill-audit-2026-06-07.md`
