# Task Workflow (必须遵守)

> L0–L5 routing + per-level workflow. Slim core rule (≤120 行). For full dispatcher see `claude-code-meta:dispatch`.

## L0–L5 (estimate then route)

| Level | Trigger | Workflow |
|-------|---------|----------|
| L0 | Question, no imperative | Answer in ≤ 1 paragraph, zero flow |
| L1 | Trivial, 1 file, no spec | TDD if code, else just do it |
| L2 | 1–3 files, no schema/dep | TDD, no spec/plan |
| L3 | 3+ files OR new dep | spec (light) → plan → implement |
| L4 | 5+ files OR new arch | brainstorm → spec → plan → implement + review |
| L5 | Vague / ambiguous | brainstorm → spec with `[ASSUMED]` → re-dispatch |

## L2 vs L3 discriminator

- **L2** stays L2 if: 1-3 files, no schema change, no new dep, no cross-cutting concern
- **Escalate to L3** if any of: touches 4+ files, needs new dep, schema change, requires test infra changes

If unsure, estimate L2 and let mid-flight escalation upgrade.

## Trigger Skills (per L)

| L | Skills (in order) |
|---|-------------------|
| L0 | (none — just answer) |
| L1/L2 | `tdd-guide` → `verification-before-completion` |
| L3 | `writing-plans` → `executing-plans` → `tdd-guide` → `verification-before-completion` |
| L4 | `brainstorming` → `writing-plans` → `executing-plans` → `tdd-guide` → `code-review` |
| L5 | `brainstorming` → spec draft → re-dispatch as L3/L4 |

For dispatcher logic (estimation rules, override commands, mid-flight) see `claude-code-meta:dispatch`.
For escalation phrasing and after-escalation actions see `harness/rules/escalation-protocol.md`.

## Dispatch Flow

1. **Estimate L** from prompt + context (default = L2)
2. **Override check**: explicit `/L0`..`/L5`, `/no-flow`, `/force-flow` wins
3. **Route** to the trigger-skill sequence for that L
4. **Mid-flight**: if reality exceeds L, escalate per `escalation-protocol.md`

## Task Tree (TodoWrite / TaskCreate)

- 父任务 = 顶层目标
- 子任务 = 可执行的最小单位
- `blockedBy` = 显式依赖
- 每个 L3+ 子任务标 in_progress → completed,中间不跳
- 完成后更新 `memory/MEMORY.md`

## 🔴 Mandatory Skills (per phase, NOT per session)

| Phase | Required skill | Why |
|-------|---------------|-----|
| Start | `using-superpowers` | Pick the right skill, not by memory |
| Build | `tdd-guide` (L1+) | RED→GREEN→REFACTOR |
| Pre-done | `verification-before-completion` | No unverified "fixed" |
| Bug fix | `systematic-debugging` (L2+) | Reproduce→root cause→fix→verify |

Historical discipline gap: TDD only 0.18×/session, verification 0×/session. These are still the top failure modes — invoke them.

## CodeGraph trigger (consult before)

| Action | CodeGraph call |
|--------|----------------|
| Refactor / rename / extract | `codegraph_impact` |
| New feature | `codegraph_files` + `codegraph_search` |
| Signature change | `codegraph_callers` |
| Debugging cross-file | `codegraph_callees` |
| Quality review | `codegraph_complexity minValue=15` |

`.codegraph/` index is auto-synced via PostToolUse hook on every edit — fresh data, no excuse to skip.

## Verification (before any "done")

- [ ] Tests pass (80%+ coverage on new code)
- [ ] Lint / typecheck clean
- [ ] No hardcoded secrets
- [ ] Spec/plan tasks all `completed`
- [ ] Memory updated if workflow itself changed
