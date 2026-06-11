# Workflow Routing Harness — Design Spec

**Date**: 2026-06-11 · **Status**: Draft · **Supersedes**: v0.2.0 (14 rules + 3 skills)

## Problem

v0.2.0 auto-injects 14 rules (724 lines) + 5-stage 强制 on every session, regardless of task. L0 查询付 L4 的代价。

## Goal

**纪律按风险分配，不按"是否新任务"分配。**

## Design

### L0–L5 taxonomy

| Level | Examples | Discipline |
|-------|----------|------------|
| **L0** 查询 | "什么是 X" / "为什么失败" | 直答，零流程 |
| **L1** 单点 | typo / rename / 删 import | 改，无任务树 |
| **L2** 局部 | 加方法 / 加测试 / 改单文件 | 改，无 spec/plan |
| **L3** 多文件 | 加模块 / 改 public API | spec + plan + 实施 |
| **L4** 复杂 | 5+ 文件 / 架构 / 新依赖 | L3 + 5-stage checkpoint |
| **L5** 模糊 | "给我做个 X 系统" | brainstorm → 落到 L3/L4 |

### L2 ↔ L3 机械判别（load-bearing）

L2 = 同时满足四条：≤1 文件、不改 public API、不引入被依赖的新文件、不改跨文件 caller。违反任一 → L3。

**LOC 不作判别**（LLM helper 常 >50 行）。信号冲突默认 L3。

### Cost asymmetry

| 错分方向 | 代价 |
|---------|------|
| False-L2（真 L3 算 L2） | 沉默的功能回归，hours-days 调试 |
| False-L3（真 L0/L2 算 L3） | 多写一份 spec，5 分钟 review |

约 **100:1**。默认偏 L3 一档。

### Dispatcher

- **默认**：Claude 读 prompt + context 自动估级
- **覆盖**：`/L0`...`/L5` / `/no-flow` / `/force-flow`
- **中途升级**：发现实际超估时**主动说出**，停下等确认，不沉默完成

### L5 分支

L5 是真实用户最常见入口。必走：列出歧义 → 出 spec draft (含 `[ASSUMED: ...]`) 或 `request_user_input` 2-4 选项 → 重新派为 L3/L4。**递归深度 ≤ 1**（防 L5↔L3 死循环）。

### Routing table（advisory）

关键词/扩展名/目录 → skill。三条防御：
1. Advisory only，Claude 最终决定
2. `self-evolve` 审计 0-hit 关键词
3. 不重复列入 auto-loaded skill

**L0 bypass 硬约束**：所有 keyword 默认 `min-level: L1+`，L0 prompt（疑问词、无祈使）自然不匹配。

## Changes from v0.2.0

### Delete (12 files)

`development-workflow.md` (44), `codegraph-workflow.md` (71 → 合入 task-workflow), `coding-style.md` (90 → 合入 llm-coding-discipline), `git-workflow.md` (24), `hooks.md` (30), `testing.md` (57), `performance.md` (55), `patterns.md` (31), `security.md` (29), `code-review.md` (124), `agents.md` (51), `skills/workflow-harness/`.

**合入前验证**：`grep -q "CodeGraph trigger" task-workflow.md && grep -q "KISS" llm-coding-discipline.md`。

### Modify (8 files)

`task-workflow.md`（全重写 L0–L5，≤120 行）、`init-project` Step 8（装 slim core）、`self-evolve`（加 routing-table 审计）、`spec-template.md` + `plan-template.md`（加 L0-L2/L3+ marker，删 mandatory CodeGraph/Impact）、`ideal-workflow.md`（重写）、`CLAUDE.md` + `README.md`。

### Keep (5 files)

`llm-coding-discipline.md` (42), `bug-fixing-discipline.md` (18), `codegraph-sync.json` hook, `audit-skills.sh`, `MEMORY.md`。

### Add (4 artifacts)

| 文件 | 作用 |
|------|------|
| `harness/rules/routing-table.md` | Keyword → skill，advisory |
| `harness/rules/escalation-protocol.md` | 中途升级触发条件 + 措辞 |
| `harness/hooks/userpromptsubmit-route.json` | UserPromptSubmit 注入 skill 提醒 |
| `skills/dispatch/SKILL.md` | L0–L5 dispatcher，替代 `workflow-harness` |

## Acceptance Criteria

- [ ] `harness/rules/` ≤ **300 行**（当前 724）— 60% 减
- [ ] Auto-loaded rule 文件 ≤ **5 个**（line count 是 binding 约束，file count 次之）
- [ ] **L0 wall-clock ≤ 5s** 且比 v0.2.0 同查询 **快 ≥ 50%**
- [ ] `task-workflow.md` ≤ 120 行，否则拆 `routing-table.md`
- [ ] 4 场景过：
  1. L0 查询 → 零流程
  2. L2 加 helper → 无 spec/plan
  3. L3 加模块 → spec + plan + 实施
  4. L2→L3 中途升级 → 主动说出
- [ ] `init-project` 检测 v0.2.0 并替换为 slim core（幂等）
- [ ] README + CLAUDE.md 无矛盾

## Slim core 文件清单（5 个，line 是 binding 约束）

1. `llm-coding-discipline.md` (42)
2. `bug-fixing-discipline.md` (18)
3. `task-workflow.md` (≤120)
4. `routing-table.md` (≤60)
5. `escalation-protocol.md` (≤35)

合计 ≤ 275 行。

## 为什么 L4 保留 5-stage

不是"5-stage 坏"，是"5-stage 当默认坏"。L4（跨 5+ 文件/架构/新依赖）的漏检代价 > 5-stage 成本；L0/L1/L2/L3 反之。

## Risks

| Risk | Mitigation |
|------|------------|
| 估错 level | 中途升级 + `/Lx` 覆盖 |
| Routing table 烂 | Advisory + `self-evolve` 审计 |
| 装旧版的人卡住 | `init-project` Step 8 检测并替换 |
| 模板 marker 漂回 always-filled | L0-L2 / L3+ 显式 marker |

## Migration

v0.2.0 → v0.3.0 = **breaking change**。`init-project` Step 8 检测旧 rules 并替换；CHANGELOG + README "Migration" section。

## Open Questions（defer）

1. Routing table 是否项目可覆盖？→ v0.3.0.1
2. `/L0`..`/L5` 是 slash command 还是自然语言？→ v0.3.0.1
3. 中途升级措辞是否可配置？→ 暂不
