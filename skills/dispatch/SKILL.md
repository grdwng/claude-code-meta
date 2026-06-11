---
name: gordon-claude-code:dispatch
description: L0–L5 workflow dispatcher — reads the user's prompt + context, estimates the level, and routes to the right workflow (zero-flow → spec+plan → full brainstorming). Routes by estimated complexity (L0–L5).
---

# Dispatch

The runtime decision-maker for how much workflow a task deserves. Provides a L0–L5 estimator and explicit override commands.

## When to invoke

- Every user prompt (implicitly — Claude auto-runs this)
- User says `/L0`..`/L5` / `/no-flow` / `/force-flow` (explicit override)
- Mid-flight escalation triggered (see `harness/rules/escalation-protocol.md`)

## L0–L5 Estimation Table

| Level | Triggers | Workflow | Examples |
|-------|----------|----------|----------|
| **L0** | Interrogative, no imperative, lookup question | Zero flow — answer directly | "What does dispatch do?", "How do I run tests?" |
| **L1** | Single trivial change, 1 file, no spec | TDD if code, else just do it | Rename a variable, fix typo, add log line |
| **L2** | 1–3 files, no schema/dep change, local impact | TDD, no spec/plan | Add `format_date` util, fix single bug with clear repro |
| **L3** | 3+ files OR new dep OR cross-cutting | spec (light) → plan → implement | Add `users` CRUD module, refactor 4-file interface |
| **L4** | 5+ files OR new arch / new dep OR schema change | Full spec + plan + brainstorm if needed | Add auth subsystem, switch ORM, new service tier |
| **L5** | Vague / ambiguous / no clear scope | Brainstorm → spec draft (with `[ASSUMED: ...]`) → re-dispatch as L3/L4 | "Make this app better", "improve performance" |

## Routing Branches (after estimating L)

| Level | Action |
|-------|--------|
| L0 | Skip dispatch — answer in ≤ 1 paragraph, no tools, no plan |
| L1/L2 | `tdd-guide` (if code) → implement → `verification-before-completion` |
| L3 | `writing-plans` (skip brainstorming) → `executing-plans` → `tdd-guide` → verify |
| L4 | `brainstorming` (if arch/ambiguous) → `writing-plans` → `executing-plans` → `tdd-guide` → verify + `code-review` |
| L5 | See "L5 Branch" below |

## L5 Branch

L5 is the most common user entry point. Must:
1. List ambiguities
2. Either (a) draft a spec with `[ASSUMED: ...]` markers, or (b) call `request_user_input` with 2-4 options
3. Re-dispatch as L3 or L4

**Recursion guard:** L5 → L3 is fine. L3 → L5 → L3 → ... is not. Max one re-estimation. If still ambiguous, surface to parent.

## Mid-Flight Escalation

When the actual work exceeds the estimated L (see `harness/rules/escalation-protocol.md`):
- **Stop** and announce (don't silently complete)
- State: new L, why, options (continue / split / cancel)
- Wait for parent's choice

## Override Commands

| Command | Effect |
|---------|--------|
| `/L0` ... `/L5` | Force that level (skip estimation) |
| `/no-flow` | Skip all workflow (L0 behavior, but for imperative prompts) |
| `/force-flow` | Force L3 minimum (spec + plan) regardless of estimation |

Override is recorded in the commit message for traceability.
