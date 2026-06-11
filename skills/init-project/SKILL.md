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

## What it does (8 steps)

1. **`codegraph init -i`** — build `.codegraph/` index
2. **Create project `CLAUDE.md`** from the 76-line slim template (identity, how-to-run, project structure, key dates, pointers to memory/templates)
3. **Create `memory/MEMORY.md`** with initial index structure
4. **Create `docs/superpowers/templates/`** by copying `spec-template.md` + `plan-template.md` from this plugin
5. **Copy `scripts/audit-skills.sh`** from this plugin + make executable
6. **Verify** `~/.claude/settings.json` has the PostToolUse hook for `codegraph sync` (add it if missing)
7. **Verify** `~/.claude/rules/common/` has the 2 mandatory rule files (`task-workflow.md` and `bug-fixing-discipline.md`) — these are the workflow + debugging rules the harness auto-loads
8. **Install slim core harness** (v0.3.0, replaces v0.2.0's 14-rule full copy):
   - Copy `harness/rules/task-workflow.md` to `~/.claude/rules/common/`
   - Copy `harness/rules/llm-coding-discipline.md` to `~/.claude/rules/common/`
   - Copy `harness/rules/bug-fixing-discipline.md` to `~/.claude/rules/common/`
   - Copy `harness/rules/routing-table.md` to `~/.claude/rules/common/`
   - Copy `harness/rules/escalation-protocol.md` to `~/.claude/rules/common/`
   - Merge `harness/hooks/codegraph-sync.json` into `~/.claude/settings.json` (PostToolUse)
   - Merge `harness/hooks/userpromptsubmit-route.json` into `~/.claude/settings.json` (UserPromptSubmit)
   - **Migration from v0.2.0**: detect any of the 11 v0.2.0 rules in `~/.claude/rules/common/` and remove them — `development-workflow.md`, `codegraph-workflow.md`, `coding-style.md`, `git-workflow.md`, `hooks.md`, `testing.md`, `performance.md`, `patterns.md`, `security.md`, `code-review.md`, `agents.md`
   - Skip any Copy/Merge if a file with the same name is already up-to-date (idempotent)

## Don't touch

- Other projects' per-project state
- Files outside `~/.claude/` (no `~/.bashrc`, no `~/.zshrc`, etc.)

The init only creates **project-specific artifacts** + verifies/installs global setup under `~/.claude/`.

## Outputs

- `.codegraph/` (CodeGraph index)
- `CLAUDE.md` (76 lines)
- `memory/MEMORY.md` (initial structure)
- `docs/superpowers/templates/{spec,plan}-template.md`
- `scripts/audit-skills.sh` (executable)
- `~/.claude/rules/common/` populated with 5 slim rules (Step 8)
- `~/.claude/settings.json` updated with 2 harness hooks (Step 8)
- Verification report: "slim core installed (5/5 rules) / 2 hooks merged / v0.2.0 stale rules purged (if any)"
- Optional: `docs/superpowers/audits/` (empty dir, ready for self-evolve)

## Harness sources (v0.3.0 slim core)

- `harness/rules/{task-workflow,llm-coding-discipline,bug-fixing-discipline,routing-table,escalation-protocol}.md` → copied to `~/.claude/rules/common/`
- `harness/hooks/{codegraph-sync,userpromptsubmit-route}.json` → merged into `~/.claude/settings.json` (idempotent by hook name)
- `harness/CLAUDE.md` → used by the plugin repo itself (not copied to consumer projects)

## Templates sourced from this plugin

- `templates/ideal-workflow.md` → stays in plugin (baseline for self-evolve)
- `templates/spec-template.md` → copied to project's `docs/superpowers/templates/`
- `templates/plan-template.md` → copied to project's `docs/superpowers/templates/`
- `templates/audit-skills.sh` → copied to project's `scripts/`

## What comes after init

After init completes, the project is ready for:
- Normal development sessions (dispatch skill kicks in)
- First self-evolve audit (run within 1-2 weeks to validate baseline)
- New machine: `git clone` + `claude` + `init-project` = full harness restored

## References

- Origin: 2026-06-07 self-audit, see `memory/periodic-audit-cadence.md`
- Companion skills: `self-evolve` (audit cadence), `dispatch` (L0–L5 routing)
