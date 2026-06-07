# claude-code-meta

**Last updated:** 2026-06-07
**Version:** v0.2.0 (self-contained harness)

> Plugin repo for `claude-code-meta` — distributes the 3-skill lifecycle suite + the 14 global rules + the codegraph auto-sync hook that makes the workflow actually work.

## Contents
- [What this repo is](#what-this-repo-is)
- [How to develop this plugin](#how-to-develop-this-plugin)
- [Repository structure](#repository-structure)
- [Versioning + release](#versioning--release)
- [Memory](memory/MEMORY.md) ← check this first

## What this repo is

A **self-contained Claude Code harness**, not just a plugin. Contains:

| Layer | Content | Purpose |
|-------|---------|---------|
| **Plugin** | `.claude-plugin/`, `skills/`, `templates/` | The 3 skills + 4 templates consumers install via marketplace |
| **Global rules** | `harness/rules/*.md` (14 files) | Auto-loaded by every Claude session; mandates workflow + discipline |
| **Hooks** | `harness/hooks/*.json` | PostToolUse auto-sync (e.g., codegraph); installed to `~/.claude/settings.json` |
| **Plugin's own dev setup** | `harness/CLAUDE.md`, `harness/memory/` | Lets the plugin repo use its own workflow on itself |

**Why self-contained?** Without it, `init-project` would only bootstrap a project — users would still have to manually copy 14 rules + the hook from somewhere. With it, `init-project` is a true one-shot: `git clone` → run skill → everything works.

## How to develop this plugin

### Bootstrap this repo (if starting fresh)

```bash
cd ~/Documents/claude-code-meta
codegraph init -i   # optional: index this repo for code-aware development
# In a Claude session, invoke: claude-code-meta:init-project
# (Step 8 will install harness/rules/* + harness/hooks/* to your global config)
```

### Modify a rule

1. Edit `harness/rules/<file>.md`
2. Bump version in `harness/CLAUDE.md`
3. Commit + push
4. Consumers who reinstall get the new rule

### Modify a skill

1. Edit `skills/<skill-name>/SKILL.md`
2. Bump version
3. Commit + push
4. Consumers get the new skill on next install

### Add a new skill

1. `mkdir skills/<new-skill>/`
2. Write `SKILL.md` with frontmatter (name: `<new-skill>`, description: one-line)
3. Update workflow-harness SKILL.md routing table
4. Bump version, commit, push

### Add a new rule

1. Write `harness/rules/<new-rule>.md`
2. Update `init-project` Step 8 if it's mandatory
3. Bump version, commit, push

### Run self-evolve

```bash
# In a Claude session, run weekly
claude-code-meta:self-evolve
# → audits current practice vs templates/ideal-workflow.md
# → proposes rule updates IF deviation persists
```

## Repository structure

```
claude-code-meta/
├── .claude-plugin/
│   ├── plugin.json                    ← plugin metadata (name, skills, version)
│   └── marketplace.json               ← marketplace metadata (lists self)
├── skills/                            ← 3 skills (init-project, workflow-harness, self-evolve)
├── templates/                         ← 4 templates (spec, plan, ideal-workflow, audit-skills.sh)
├── harness/                           ← self-contained harness layer (new in v0.2.0)
│   ├── CLAUDE.md                      ← this file
│   ├── rules/                         ← 14 global rules (auto-loaded into every session)
│   │   ├── task-workflow.md
│   │   ├── bug-fixing-discipline.md
│   │   ├── llm-coding-discipline.md
│   │   ├── codegraph-workflow.md
│   │   └── ... (10 more)
│   ├── hooks/                         ← hook definitions (merged into settings.json by init-project)
│   │   └── codegraph-sync.json
│   └── memory/                        ← plugin's own memory
│       └── MEMORY.md
├── README.md
└── .git/                              ← remote: github.com/grdwng/claude-code-meta
```

## Versioning + release

- **Semver** with `vMAJOR.MINOR.PATCH`
- **MAJOR:** breaking skill/manifest changes (consumers need to reinstall)
- **MINOR:** new skills, new rules, new harness features
- **PATCH:** wording fixes, doc updates
- Tag in git: `git tag v0.x.y && git push --tags`
- Consumers who reinstall get the tagged version

## Related

- GitHub: https://github.com/grdwng/claude-code-meta
- Origin: 2026-06-07 self-audit in 01_project
