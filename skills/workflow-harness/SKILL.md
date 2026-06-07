---
name: gordon-claude-code:workflow-harness
description: Workflow orchestrator — enforces 5-stage lifecycle (需求→计划→开发→测试→完成), 4 mandatory skills, CodeGraph trigger points, bug-fixing discipline. Called at the start of every development session.
---

# Workflow Harness

The orchestrator. Routes to the right sub-skill at the right time. Maintains discipline. The living skill in the lifecycle (init → **workflow-harness** → self-evolve).

## When to use

- **First response of every development session** (per the 🔴 rule in `task-workflow.md`)
- After any major project reset
- When user explicitly invokes

## What it does

This skill is an **orchestrator, not a doer**. It calls other skills at the right time.

### Routing table

| When | Calls | Why |
|------|-------|-----|
| Session start | `superpowers:using-superpowers` | Find the right sub-skill (🔴 mandatory) |
| Writing spec | `superpowers:brainstorming` + `codegraph_files` + `codegraph_search` | Module boundaries + name collision check |
| Writing plan | `superpowers:writing-plans` + `codegraph_impact` + `codegraph_callers` | Impact analysis before committing |
| Developing feature | `superpowers:test-driven-development` or `tdd-guide` agent | RED → GREEN → REFACTOR (🔴 mandatory) |
| Fixing bug | `superpowers:systematic-debugging` | Systematize debugging, no guessing (🔴 mandatory) |
| Marking done | `superpowers:verification-before-completion` | Real verification, not assumption (🔴 mandatory) |
| Debugging cross-file | `codegraph_callees` | Trace call chain |
| Refactoring | `codegraph_impact` | Check downstream effects |
| Finishing branch | `superpowers:finishing-a-development-branch` | Clean up before merge |

### Enforced disciplines

- **5-stage lifecycle**: 需求 → 计划 → 开发 → 测试 → 完成
- **5 checkpoints** (one per stage, must stop for user confirmation)
- **No skipping stages** (each checkpoint must be confirmed)
- **No silent completion** (must call verification-before-completion before marking done)
- **Subtask not done → parent not done** (TaskCreate hierarchy)

### Bug-fixing discipline (delegates to `bug-fixing-discipline.md`)

1. Reproduce → paste error → locate root cause → minimal fix → verify
2. No "fixed" without verification
3. One issue at a time
4. 2 failures → stop, re-analyze

## CodeGraph trigger points (delegates to `codegraph-workflow.md`)

| 场景 | 命令 |
|------|------|
| 🔧 重构 | `codegraph_impact` |
| 🆕 新功能 | `codegraph_files` + `codegraph_search` |
| ✏️ 改签名 | `codegraph_callers` |
| 🐛 跨文件 bug | `codegraph_callees` |
| 📊 复杂度审查 | `codegraph_complexity` |

## Outputs

- Correct workflow execution (correct skills called at correct times)
- 5 checkpoints delivered to user (one per lifecycle stage)
- Task tree maintained via TaskCreate/TaskUpdate
- Memory updated when task completes

## When NOT to use

- Trivial single-line edits (just do it)
- Pure questions (no workflow needed)
- Already in the middle of a task (continue, don't restart)

## References

- Rules file: `~/.claude/rules/common/task-workflow.md` (the canonical spec this skill enforces)
- Companion rules: `bug-fixing-discipline.md`, `codegraph-workflow.md`, `llm-coding-discipline.md`
- Origin: 2026-06-07 self-audit, see `memory/superpowers-skill-discipline.md`
