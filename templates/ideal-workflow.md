# 理想工作流（北极星 v0.3.0）

> 所有新会话参照此 baseline，self-evolve 用此对比实际。L0–L5 dispatcher 替代 v0.2.0 的"5 阶段"作为任务生命周期。

## L0–L5（任务生命周期的级别维度）

| L | 触发 | 流程 | 例子 |
|---|------|------|------|
| L0 | 疑问词，无祈使 | 零流程，≤ 1 段回答 | "What does dispatch do?" |
| L1 | 1 文件，无 spec | TDD（如是 code） | rename, typo |
| L2 | 1–3 文件，无 schema/dep | TDD，无 spec/plan | 加 util，单 bug 修复 |
| L3 | 3+ 文件 / 新 dep | spec（轻）→ plan → 实施 | 加 CRUD 模块 |
| L4 | 5+ 文件 / 新架构 | brainstorm → spec → plan → 实施 + review | 加 auth 子系统 |
| L5 | 模糊 / 范围不清 | brainstorm → spec w/ `[ASSUMED]` → re-dispatch | "make this better" |

## L2 vs L3 判别

- **L2 留 L2**：1–3 文件，无 schema 变化，无新 dep，无 cross-cutting 关注
- **升 L3**：4+ 文件 / 新 dep / schema 改 / 需测试基建变化
- 不确定？估 L2，让 mid-flight escalation 升

## 触发技能（per L）

| L | Skills（顺序） |
|---|----------------|
| L0 | （无，直接答） |
| L1/L2 | `tdd-guide` → `verification-before-completion` |
| L3 | `writing-plans` → `executing-plans` → `tdd-guide` → `verification-before-completion` |
| L4 | `brainstorming` → `writing-plans` → `executing-plans` → `tdd-guide` → `code-review` |
| L5 | `brainstorming` → spec draft → re-dispatch L3/L4 |

## 不做的事

- ❌ 估错 L 时静默完成（→ `harness/rules/escalation-protocol.md`）
- ❌ 凭记忆选 skill（→ `superpowers:using-superpowers`）
- ❌ 无验证标 done（→ `superpowers:verification-before-completion`）
- ❌ 重构时动 working logic
- ❌ 同 bug 1 session 修 2 次以上

## CodeGraph 落点（v0.3.0）

CodeGraph trigger 整合到 `harness/rules/task-workflow.md` 的 "CodeGraph trigger" 表 — spec/plan 模板不再强制 CodeGraph 段（标 `<!-- L0-L2: skip below. L3+: fill below. -->`，L3+ 仍可填，但不是必须）。

5 个 trigger：refactor → `impact`；新 feature → `files` + `search`；改签名 → `callers`；跨文件 bug → `callees`；质量审查 → `complexity minValue=15`。

## Slim Core（v0.3.0 落地）

- 5 rules（≤300 行 total）：`task-workflow` (80), `llm-coding-discipline` (67), `bug-fixing-discipline` (18), `routing-table` (53), `escalation-protocol` (35) = **253 行**
- 2 hooks：`codegraph-sync` (PostToolUse), `userpromptsubmit-route` (UserPromptSubmit)
- 3 skills：`init-project`, `dispatch`, `self-evolve`

v0.2.0 的 14 rules 删 11 个，KISS/DRY/YAGNI 合入 `llm-coding-discipline`，`codegraph-workflow` 触发点合入 `task-workflow`。
