# Task Workflow (必须遵守)

## 🔴 第一步强制(每次新任务都要做)

**调 Skill 工具运行 `superpowers:using-superpowers`** —— 让 harness 主动告诉你哪个 skill 适用于本次任务。

- **不调 = 没走工作流**,即使后面所有步骤都做了也不算合规
- 不要凭记忆选 skill —— superpowers 套件有 ~40 个 skill,人脑记不全
- 此举是为了避免 2026-06-07 自查发现的"工具用得勤、skill 用得少"问题

## 🔴 实施阶段强制(开发 + 测试阶段)

**调 Skill 工具运行 `superpowers:test-driven-development`** 或派遣 `tdd-guide` agent —— RED → GREEN → REFACTOR。

- 历史数据(2026-06-07 审计):`test-driven-development` 仅 20 次/111 会话(0.18/会话),TDD 严重不足
- 直接后果:项目累积 15+ pre-existing 测试失败(mocks.test.js 13 + dictation_bugs.test.js 2)
- 计划类 skill 用了 134 次(3:1 失衡),导致技术债在实施层堆积

## 🔴 完成阶段强制(标 done 前必做)

**调 Skill 工具运行 `superpowers:verification-before-completion`** —— 真的跑过测试,不是凭感觉。

- 跟 `bug-fixing-discipline.md` 第 2 条 "禁止无验证的已修复" 互锁
- 历史数据:该 skill 在 111 会话中**使用次数为 0** —— 必须扭转

---

## 每次开始新任务前必须

1. **检查 memory 中的项目进度**
   - 读 `memory/MEMORY.md` 和相关进度文件
   - 展示:当前任务 + 已完成 + 下一步
2. **用 TaskCreate 创建任务树**
   - 父任务 = 顶层目标
   - 子任务 = 可执行的最小单位
   - `blockedBy` = 标记依赖关系
3. **按依赖顺序执行,在检查点停下来等确认**

## 任务生命周期(每个阶段必须确认才能继续)

```
需求 → 计划 → 开发 → 测试 → 完成
```

| 阶段 | 检查点 | 必用 skill |
|------|--------|----------|
| 需求 | "这个理解对吗?同意后我写规格文档" | `superpowers:brainstorming`(可选,复杂需求时) |
| 计划 | "计划这样实现,同意吗?" | `superpowers:writing-plans` 或 `planner` agent |
| **开发** | "代码写好了,跑一下看看?" | **`superpowers:test-driven-development` 或 `tdd-guide` agent** 🔴 |
| **测试** | "功能验证通过了吗?" | **`superpowers:verification-before-completion`** 🔴 |
| 完成 | (更新 memory 自动) | —— |

## 规则

- 子任务不完成,父任务不能标记完成
- 每个检查点停下来等确认,不自动进入下一阶段
- 完成后更新 memory,记录当前进度
- 你可以随时问我:「我们进行到哪一步了?」
