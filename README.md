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
│  │ init-project   │→ │ dispatch       │→ │ self-evolve    │  │
│  │ (BIRTH)        │  │ (LIVING)       │  │ (GROWTH)       │  │
│  │                │  │                │  │                │  │
│  │ One-time       │  │ Every session  │  │ Periodic       │  │
│  │ bootstrap      │  │ L0–L5 router   │  │ audit          │  │
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
│   ├── plugin.json                    ← plugin metadata
│   └── marketplace.json               ← marketplace metadata
├── skills/                            ← 3 lifecycle skills
│   ├── init-project/SKILL.md         ← 8-step bootstrap (Step 8 installs slim core)
│   ├── dispatch/SKILL.md             ← L0–L5 router
│   └── self-evolve/SKILL.md          ← weekly audit + propose updates
├── templates/                         ← 4 templates copied to consumer projects
│   ├── ideal-workflow.md             ← baseline (stays in plugin)
│   ├── spec-template.md              ← copied to project on init
│   ├── plan-template.md              ← copied to project on init
│   └── audit-skills.sh               ← copied to project on init
└── harness/                           ← self-contained harness layer (new in v0.2.0)
    ├── CLAUDE.md                      ← plugin repo's own CLAUDE.md
    ├── rules/                         ← 5 slim rules / 253 lines total
    │   ├── task-workflow.md           ← L0–L5 routing (80)
    │   ├── routing-table.md           ← keyword → skill (53)
    │   ├── escalation-protocol.md     ← mid-flight L2→L3 (35)
    │   ├── llm-coding-discipline.md   (67)
    │   └── bug-fixing-discipline.md   (18)
    ├── hooks/                         ← 2 hooks (merged into settings.json on init)
    │   ├── codegraph-sync.json        ← PostToolUse
    │   └── userpromptsubmit-route.json ← UserPromptSubmit
    └── memory/MEMORY.md               ← plugin's own memory index
```

> **Self-contained:** cloning this repo + running `init-project` in any new project = full harness restored (5 rules / 253 lines + 2 hooks + 3 skills + 4 templates). No per-machine setup required beyond `git clone` and `gh auth login`.

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
  7. Verifies slim core (5 rules + 2 hooks)
  → "Project initialized. Ready for development."
```

### Living (every development session)

```text
User: "I want to add feature X"

Claude (claude-code-meta:dispatch, automatic at session start):
  → Calls superpowers:using-superpowers (find right sub-skill)
  → Routes by L-level (L0 bypass / L1–L2 TDD / L3 spec+plan / L4 brainstorm / L5 re-dispatch)
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

## 🧭 Skill triggering by L-level (v0.3.0)

Skills trigger by routing-level, not blanket enforcement. Cost asymmetry: L0 questions get a direct answer without invoking the superpowers cascade.

| L | Trigger | Skills (in order) |
|---|---------|-------------------|
| L0 | Question word, no imperative | (none — direct answer) |
| L1 | 1 file, no spec | `tdd-guide` → `verification-before-completion` |
| L2 | 1–3 files, no schema/dep | `tdd-guide` → `verification-before-completion` |
| L3 | 3+ files / new dep | `writing-plans` → `executing-plans` → `tdd-guide` → `verification-before-completion` |
| L4 | 5+ files / new arch | `brainstorming` → `writing-plans` → `executing-plans` → `tdd-guide` → `code-review` |
| L5 | Vague / unclear scope | `brainstorming` → spec draft with `[ASSUMED]` → re-dispatch |

Routing table: `harness/rules/routing-table.md`. Dispatcher: `skills/dispatch/SKILL.md`.

## 🧬 Lifecycle phases

| Phase | Skill | When | Output |
|-------|-------|------|--------|
| **Birth** | `init-project` | Once at project start | Project structure + templates + global state verified |
| **Living** | `dispatch` | Every dev session | L0–L5 routing, escalation on L2→L3, slim discipline |
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

## 🔄 Migration from v0.2.0

v0.3.0 is a slim-routing refactor. v0.2.0's `workflow-harness` orchestrator and 14-rule context are replaced by an L0–L5 router and 5 slim rules.

| Surface | v0.2.0 | v0.3.0 | Δ |
|---|---|---|---|
| Rules in `~/.claude/rules/common/` | 14 files / ~724 lines | 5 files / ≤300 lines | −9 files, −~424 lines |
| Hooks | 1 (`codegraph-sync`) | 2 (+ `userpromptsubmit-route`) | +1 |
| Per-session dispatcher | `workflow-harness` skill | `dispatch` skill | replaced |
| L0 early-bypass | none | question words + no imperative | new |
| Mid-flight escalation | none | L2 → L3 when ≥4 callers | new |
| Templates | spec/plan full | spec/plan with `L0-L2 skip` markers | lighter |
| `task-workflow.md` | 58 lines, no bypass | ≤120 lines, L0–L5 routing table | rewritten |
| `ideal-workflow.md` | long-form narrative | ≤80 lines, L0–L5 + dispatch reference | rewritten |
| Backward-compat | — | init-project detects & removes v0.2.0 rules | one-shot |

**3-step upgrade:**

1. **Pull the plugin** — in this repo: `git pull`. For external installs: re-fetch the marketplace version.
2. **Re-run `init-project` in each consumer project** — it overwrites `~/.claude/rules/common/` with the 5 slim rules and merges the new `userpromptsubmit-route` hook into `settings.json`. The old v0.2.0 rules (9 of them) are detected and removed.
3. **Restart Claude Code** — so the new `UserPromptSubmit` hook is loaded. Verify with: ask "What does dispatch do?" — should answer directly in ≤5s without invoking the superpowers cascade.

If a project's `~/.claude/rules/common/` still has the 14 old files after step 2, manually `rm` them and re-run `init-project`. The detection is by filename list, not a content heuristic.

## 📚 Related docs

- `skills/init-project/SKILL.md` — full bootstrap procedure
- `skills/dispatch/SKILL.md` — L0–L5 routing + escalation rules
- `skills/self-evolve/SKILL.md` — full audit procedure + suggested-mode rules
- `templates/ideal-workflow.md` — the baseline self-evolve compares against

External references (in 01_project's memory):
- `memory/plugin-skill-audit-2026-06-07.md` — original audit findings
- `memory/periodic-audit-cadence.md` — why weekly
- `memory/superpowers-skill-discipline.md` — why using-superpowers must be first

## 📋 Version

**0.3.0** (2026-06-11) — slim-routing refactor (L0–L5, dispatch replaces workflow-harness, 5 rules / ≤300 lines)
