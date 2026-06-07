# claude-code-meta

**A 3-skill lifecycle suite for Claude Code projects.** Distills 01_project's proven workflow (111 sessions of real usage) into a portable plugin covering the full project lifecycle: **init → harness → self-evolve**.

## 🎯 Why this exists

01_project built a working workflow over 111 sessions: CodeGraph integration, 4 mandatory skills, spec/plan templates, weekly self-audit. But all of that was locked inside one project. **This plugin packages those patterns so any new project inherits them from day 1.**

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  claude-code-meta plugin                                     │
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  │
│  │ init-project   │→ │ workflow-      │→ │ self-evolve    │  │
│  │ (BIRTH)        │  │ harness        │  │ (GROWTH)       │  │
│  │                │  │ (LIVING)       │  │                │  │
│  │ One-time       │  │ Every session  │  │ Periodic       │  │
│  │ bootstrap      │  │ orchestrator   │  │ audit          │  │
│  └────────────────┘  └────────────────┘  └────────────────┘  │
│         ↑                       │                │           │
│         │                       ↓                ↓           │
│         │              ┌─────────────────────────────┐       │
│         └──────────────│  templates/                 │       │
│                        │  · ideal-workflow.md         │       │
│                        │  · spec-template.md          │       │
│                        │  · plan-template.md          │       │
│                        │  · audit-skills.sh           │       │
│                        └─────────────────────────────┘       │
└──────────────────────────────────────────────────────────────┘
```

## 📁 File layout

```
claude-code-meta/
├── README.md                          ← you are here
├── .claude-plugin/
│   └── plugin.json                    ← plugin metadata
├── skills/
│   ├── init-project/SKILL.md         ← 7-step bootstrap
│   ├── workflow-harness/SKILL.md     ← per-session orchestrator
│   └── self-evolve/SKILL.md          ← weekly audit + propose updates
└── templates/
    ├── ideal-workflow.md             ← baseline (stays in plugin)
    ├── spec-template.md              ← copied to project on init
    ├── plan-template.md              ← copied to project on init
    └── audit-skills.sh               ← copied to project on init
```

## 🚀 Installation

> ⚠️ **There is no "local install" — copying the plugin to your project root does NOT make the skills discoverable.** Claude Code's harness reads `~/.claude/plugins/installed_plugins.json` at session start. You must complete all 4 steps below.

### Step 1: Make the plugin a real git repo

```bash
# Put the plugin somewhere OUTSIDE your project (e.g. ~/claude-code-meta-plugin/)
mkdir -p ~/claude-code-meta-plugin
cp -r /path/to/claude-code-meta/. ~/claude-code-meta-plugin/
cd ~/claude-code-meta-plugin
git init -q
git -c user.email="you@local" -c user.name="You" add -A
git -c user.email="you@local" -c user.name="You" commit -q -m "v0.1.0"
SHA=$(git rev-parse HEAD)
echo "Plugin SHA: $SHA"  # ← note this, you need it
```

### Step 2: Create a marketplace entry

The plugin source needs a `.claude-plugin/marketplace.json` (a separate file from `plugin.json`) listing itself:

```json
{
  "name": "claude-code-meta",
  "owner": {"name": "You"},
  "metadata": {"description": "..."},
  "plugins": [{
    "name": "claude-code-meta",
    "source": "./",
    "description": "...",
    "version": "0.1.0"
  }]
}
```

### Step 3: Verify the manifest format

- `plugin.json` has `"skills": ["./skills/"]` — **array of paths, not skill names**
- Each `SKILL.md` frontmatter has `name: <skill-name>` — **no plugin prefix**

### Step 4: Register globally

Edit `~/.claude/plugins/known_marketplaces.json`:

```json
"gordon-claude-code": {
  "source": {"source": "github", "repo": "grdwng/claude-code-meta"},
  "installLocation": "/Users/you/.claude/plugins/marketplaces/gordon-claude-code",
  "lastUpdated": "<ISO8601>"
}
```

Edit `~/.claude/plugins/installed_plugins.json`:

```json
"plugins": {
  "claude-code-meta@gordon-claude-code": [{
    "scope": "user",
    "installPath": "/Users/you/.claude/plugins/cache/gordon-claude-code/claude-code-meta/0.1.0",
    "version": "0.1.0",
    "installedAt": "<ISO8601>",
    "lastUpdated": "<ISO8601>",
    "gitCommitSha": "<real SHA from Step 1>"
  }]
}
```

Copy the plugin files to the cache:

```bash
mkdir -p ~/.claude/plugins/cache/gordon-claude-code/claude-code-meta/0.1.0
cp -r ~/claude-code-meta-plugin/{.claude-plugin,skills,templates,README.md} \
      ~/.claude/plugins/cache/gordon-claude-code/claude-code-meta/0.1.0/
```

### Step 5: Verify in a new session

```bash
cd /path/to/your-project
claude   # start a NEW session
# In the session: /plugin   ← should list claude-code-meta
# Or invoke: claude-code-meta:init-project
```

> **Why all this?** The harness only reads `installed_plugins.json` at session start. Anything not registered there is invisible. See `memory/plugin-local-install-doesnt-work.md` for the full debugging journey (2026-06-07 smoke test).

## 📖 Usage

### Birth (once per project)

```text
User: "Initialize this new project with the claude-code workflow"

Claude (invokes claude-code-meta:init-project):
  1. Runs codegraph init -i
  2. Creates CLAUDE.md from template
  3. Creates memory/MEMORY.md
  4. Copies spec/plan templates
  5. Copies audit-skills.sh
  6. Verifies global PostToolUse hook
  7. Verifies global rules (4 mandatory skills)
  → "Project initialized. Ready for development."
```

### Living (every development session)

```text
User: "I want to add feature X"

Claude (gordon-claude-code:workflow-harness, automatic at session start):
  → Calls superpowers:using-superpowers (find right sub-skill)
  → Routes to writing-plans / brainstorming / TDD as needed
  → Enforces 5-stage lifecycle (需求→计划→开发→测试→完成)
  → Stops for user confirmation at each checkpoint
```

### Growth (weekly + on-demand)

```text
Monday 10:07 AM (cron, set up by init-project):
  → Runs gordon-claude-code:self-evolve
  → bash scripts/audit-skills.sh
  → Compares to docs/superpowers/ideal-workflow.md
  → Proposes rule updates IF deviation persists 2+ cycles (suggested mode)
  → Reports to user
```

## 🔴 The 4 mandatory skills (enforced)

These 4 skills must be invoked at the specified times. Missing them = non-compliant.

| Skill | When | Why |
|-------|------|-----|
| `superpowers:using-superpowers` | Every new task start | Find the right sub-skill |
| `superpowers:test-driven-development` or `tdd-guide` agent | Development stage | RED → GREEN → REFACTOR |
| `superpowers:systematic-debugging` | Every bug fix | Systematize debugging |
| `superpowers:verification-before-completion` | Marking done | Real verification, not assumption |

## 🧬 Lifecycle phases

| Phase | Skill | When | Output |
|-------|-------|------|--------|
| **Birth** | `init-project` | Once at project start | Project structure + templates + global state verified |
| **Living** | `workflow-harness` | Every dev session | Correct skills called, 5 checkpoints, 4 mandatory triggers |
| **Growth** | `self-evolve` | Weekly + on-demand | Audit report + deviation analysis + suggested rule updates |

The phases are **cyclical**: growth feeds back into living (rules update) and informs future births (new projects get latest version).

## 📊 Origin (2026-06-07)

This plugin was extracted from a self-audit session in 01_project. The audit found:

| Skill | Calls/111 sessions | Verdict |
|-------|-------------------|---------|
| `superpowers:writing-plans` | 70 | 🟢 healthy |
| `superpowers:brainstorming` | 64 | 🟢 healthy |
| `superpowers:test-driven-development` | 20 | 🟠 underused (0.18/session) |
| `superpowers:systematic-debugging` | 18 | 🟠 underused (0.16/session) |
| **`superpowers:using-superpowers`** | **3** | **🔴 almost never (0.03/session)** |
| `superpowers:verification-before-completion` | 0 | 🔴 never |

The 4 mandatory skill rules, audit script, and templates were extracted and packaged here. The Monday 10:07 cron (`3adb96d9`) was set up to keep self-evolving.

## 📚 Related docs

- `skills/init-project/SKILL.md` — full bootstrap procedure
- `skills/workflow-harness/SKILL.md` — full routing table + enforced disciplines
- `skills/self-evolve/SKILL.md` — full audit procedure + suggested-mode rules
- `templates/ideal-workflow.md` — the baseline self-evolve compares against

External references (in 01_project's memory):
- `memory/plugin-skill-audit-2026-06-07.md` — original audit findings
- `memory/periodic-audit-cadence.md` — why weekly
- `memory/superpowers-skill-discipline.md` — why using-superpowers must be first

## 📋 Version

**0.1.0** (2026-06-07) — initial release
