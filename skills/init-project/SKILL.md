---
name: gordon-claude-code:init-project
description: One-time bootstrap for new Claude Code projects — copy templates from this plugin, init CodeGraph, set up project CLAUDE.md + memory + audit script. Applies the best practices from 01_project.
---

# Init Project

One-time setup. The birth skill in the lifecycle (**init-project** → harness → self-evolve).

## When to use

- User starts a new project and wants Claude Code development setup
- User says "set up this repo for Claude Code" / "apply 01_project workflow to X"
- User wants the standard workflow harness + self-evolve from day 1

## What it does (7 steps)

1. **`codegraph init -i`** — build `.codegraph/` index
2. **Create project `CLAUDE.md`** from the 76-line slim template (identity, how-to-run, project structure, key dates, pointers to memory/templates)
3. **Create `memory/MEMORY.md`** with initial index structure
4. **Create `docs/superpowers/templates/`** by copying `spec-template.md` + `plan-template.md` from this plugin
5. **Copy `scripts/audit-skills.sh`** from this plugin + make executable
6. **Verify** `~/.claude/settings.json` has the PostToolUse hook for `codegraph sync` (add it if missing)
7. **Verify** `~/.claude/rules/common/` has the 4 mandatory skills (using-superpowers, TDD, debugging, verification) — add any missing ones

## Don't touch

- Global rules in `~/.claude/rules/common/` (auto-loaded, shared across all projects)
- Other global state (env vars, permissions)

The init only creates **project-specific artifacts** + verifies global setup is in place.

## Outputs

- `.codegraph/` (CodeGraph index)
- `CLAUDE.md` (76 lines)
- `memory/MEMORY.md` (initial structure)
- `docs/superpowers/templates/{spec,plan}-template.md`
- `scripts/audit-skills.sh` (executable)
- Verification report: "global rules OK / hook present / 2 mandatory rule files present"
- Optional: `docs/superpowers/audits/` (empty dir, ready for self-evolve)

## Templates sourced from this plugin

- `templates/ideal-workflow.md` → stays in plugin (baseline for self-evolve)
- `templates/spec-template.md` → copied to project's `docs/superpowers/templates/`
- `templates/plan-template.md` → copied to project's `docs/superpowers/templates/`
- `templates/audit-skills.sh` → copied to project's `scripts/`

## What comes after init

After init completes, the project is ready for:
- Normal development sessions (workflow-harness skill kicks in)
- First self-evolve audit (run within 1-2 weeks to validate baseline)

## References

- Origin: 2026-06-07 self-audit, see `memory/periodic-audit-cadence.md`
- Companion skills: `self-evolve` (audit cadence), `workflow-harness` (ongoing enforcement)
