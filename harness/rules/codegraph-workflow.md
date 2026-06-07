# CodeGraph Workflow Integration

> This file defines when CodeGraph data **must** be consulted during development. CodeGraph is auto-synced via PostToolUse hook on every JS/TS/Python edit, so the index is always fresh — there is no excuse to skip these checks.

## Why this rule exists

`codegraph_*` tools are installed, the index is up to date, but the data is **only useful if it's actually consulted** before changes. Without these triggers, CodeGraph becomes a write-only tool.

## Mandatory Triggers

### 🔧 Before any refactor (rename, signature change, extraction, deletion)

```bash
mcp__codegraph__codegraph_impact symbol="<func or class>" depth=2
```

**Why:** Catches unintended downstream effects. Renaming `parseFile` without checking callers leaves stale references; deleting a function without checking callees leaves dead imports.

### 🆕 Before any new feature

```bash
mcp__codegraph__codegraph_files pattern="<target module>/**"
mcp__codegraph__codegraph_search query="<feature keyword>"
```

**Why:** Avoids reinventing existing utilities. Reveals module boundaries. Catches name collisions before they hit `git commit`.

### ✏️ Before changing a function signature or params

```bash
mcp__codegraph__codegraph_callers symbol="<func>" limit=20
```

**Why:** Every caller is a potential breakage. Knowing the count and locations up front prevents "fix one, break three" cycles.

### 🐛 When debugging cross-file behavior

```bash
mcp__codegraph__codegraph_callees symbol="<entry point>" limit=20
```

**Why:** Traces the full call chain without `grep` and `Read` round-trips. Fastest way to find the actual source of unexpected behavior.

### 📊 When evaluating code quality (optional but recommended)

```bash
mcp__codegraph__codegraph_complexity metric="cyclomatic" minValue=15
```

**Why:** Surfaces high-complexity functions worth refactoring.

## Workflow integration points

| Phase | CodeGraph call | Output goes to |
|-------|---------------|----------------|
| Spec writing | `codegraph_files` + `codegraph_search` | `docs/superpowers/specs/*.md` → "CodeGraph 上下文" section |
| Plan writing | `codegraph_impact` + `codegraph_callers` | `docs/superpowers/plans/*.md` → "Impact 分析" section |
| Pre-refactor | `codegraph_impact` | Inline before deciding scope |
| Debugging | `codegraph_callees` | Inline when tracing behavior |

The spec/plan templates in `docs/superpowers/templates/` have placeholder sections for these outputs — **fill them in, do not skip**.

## When NOT to use CodeGraph

- Single-file, isolated changes (e.g., renaming a local variable)
- Trivial edits with no callers (`codegraph_callers` returns 0)
- Brand-new project where index doesn't exist yet (run `codegraph init -i` first)

## Trust but verify

`codegraph status` reports "up to date" but can lie about edge completeness. If a query returns 0 results when you expect more, run `codegraph index` for a full rebuild. See `memory/codegraph_stale_edges.md` for the full gotcha.
