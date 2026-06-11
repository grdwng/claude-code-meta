# claude-code-meta

**Last updated:** 2026-06-11
**Version:** v0.3.0 (slim dispatch architecture)

> Plugin repo for `claude-code-meta` — distributes a 3-skill dispatch suite + 5 slim global rules + 2 hooks that route prompts to the right level of work.

## Contents
- [What this repo is](#what-this-repo-is)
- [How to develop this plugin](#how-to-develop-this-plugin)
- [Repository structure](#repository-structure)
- [Versioning + release](#versioning--release)
- [Migration from v0.2.0](../README.md#-migration-from-v020)

## What this repo is

A **slim dispatch Claude Code harness** (v0.3.0; down from 14 rules / 724 lines in v0.2.0).

| Layer | Content | Purpose |
|-------|---------|---------|
| **Plugin** | `.claude-plugin/`, `skills/`, `templates/` | 3 skills + templates consumers install |
| **Slim rules** | `harness/rules/*.md` (5 files, 253 lines) | L0-L5 routing + discipline; auto-loaded |
| **Hooks** | `harness/hooks/*.json` (2 files) | `codegraph-sync` (PostToolUse) + `userpromptsubmit-route` (UserPromptSubmit) |
| **Plugin's own dev** | `harness/CLAUDE.md`, `harness/memory/` | Lets this repo use its own workflow |

**Why slim?** Routing table → dispatcher → right skill (L0 bypass / L1-L2 TDD / L3 spec+plan / L4 brainstorm / L5 re-dispatch). Cost asymmetry: cheap L0 questions don't trigger the full superpowers cascade.

## How to develop this plugin

### Bootstrap this repo

```bash
cd ~/Documents/claude-code-meta
codegraph init -i   # optional
# In a Claude session: claude-code-meta:init-project
# (Step 8 installs harness/{rules,hooks} to ~/.claude/)
```

### Modify a rule / skill

- Rule: edit `harness/rules/<file>.md` → bump version → commit
- Skill: edit `skills/<skill>/SKILL.md` → bump version → commit

### Add a new skill

1. `mkdir skills/<new>/` + write `SKILL.md` (frontmatter: `name:`, one-line `description:`)
2. Add keyword to `harness/rules/routing-table.md`
3. Bump version, commit

### Add a new rule

1. Write `harness/rules/<new>.md` (≤100 lines recommended)
2. Update trigger table in `harness/rules/task-workflow.md` if mandatory
3. Bump version, commit

### Run self-evolve

```bash
claude-code-meta:self-evolve
# → audits current practice vs templates/ideal-workflow.md
# → audits routing-table.md keyword hit rate (last 30 days)
# → proposes rule updates if deviation persists
```

## Repository structure

```
claude-code-meta/
├── .claude-plugin/                ← plugin + marketplace manifests
├── skills/                        ← 3 skills (init-project, dispatch, self-evolve)
├── templates/                     ← 4 templates (spec, plan, ideal-workflow, audit-skills.sh)
├── harness/                       ← self-contained harness layer
│   ├── CLAUDE.md                  ← this file
│   ├── rules/                     ← 5 slim rules (253 lines total)
│   │   ├── task-workflow.md       ← L0-L5 routing (80)
│   │   ├── routing-table.md       ← keyword → skill map (53)
│   │   ├── escalation-protocol.md ← mid-flight L2→L3 (35)
│   │   ├── llm-coding-discipline.md (67)
│   │   └── bug-fixing-discipline.md (18)
│   ├── hooks/                     ← 2 hook definitions
│   │   ├── codegraph-sync.json
│   │   └── userpromptsubmit-route.json
│   └── memory/                    ← plugin's own memory
├── README.md                      ← user-facing + Migration section
└── CHANGELOG.md                   ← v0.3.0 entry
```

## Versioning + release

- **Semver** with `vMAJOR.MINOR.PATCH`
- **MAJOR:** breaking skill/manifest changes (reinstall required)
- **MINOR:** new skills/rules/harness features
- **PATCH:** wording fixes, doc updates
- Tag: `git tag v0.x.y && git push --tags`

## Related

- GitHub: https://github.com/grdwng/claude-code-meta
- v0.3.0 spec + plan: `docs/superpowers/{specs,plans}/2026-06-11-workflow-routing-*.md`
