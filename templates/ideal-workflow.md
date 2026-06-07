# 理想工作流(北极星)

> 2026-06-07 自查自检确立的标准化工作流。**所有新会话必须以此为参照,审计时以此为目标对比差异。**

## 🎯 核心原则(LLM Coding Discipline)

1. **Think Before Coding** — 不确定就问,假设说清楚
2. **Simplicity First** — 没要的功能不加
3. **Surgical Changes** — 只动必要的
4. **Goal-Driven Execution** — 达成就停

## 🔴 4 个强制 Skill(必须调用,不调 = 不合规)

| Skill | 触发时机 | 历史(0.03~0.18/会话) | 期望(目标/会话) |
|-------|---------|------|------|
| `superpowers:using-superpowers` | 每个新任务开始 | 0.03 | **≥ 1.0** |
| `superpowers:test-driven-development` / `tdd-guide` agent | 开发阶段 | 0.18 | **≥ 0.5** |
| `superpowers:systematic-debugging` | 每个 bug 修复前 | 0.16 | **≥ 0.5** |
| `superpowers:verification-before-completion` | 标 done 前 | 0.00 | **≥ 1.0** |

## 🟢 重度使用 Skill(应当保持 ≥ 0.5/会话)

| Skill | 历史 |
|-------|------|
| `superpowers:writing-plans` | 0.63 |
| `superpowers:brainstorming` | 0.58 |
| `superpowers:subagent-driven-development` | 0.37 |
| `superpowers:executing-plans` | 0.29 |

## 🏗️ 3 层架构

```
全局规则(~/.claude/rules/common/  · 14 文件,自动加载)
        ↓
项目特定(项目/CLAUDE.md  · 76 行,引用 + 身份 + 怎么跑)
        ↓
工具 + 模板 + hook
  · CodeGraph(自动同步,1,645 历史调用)
  · docs/superpowers/templates/(spec + plan 模板)
  · PostToolUse hook(自动 sync)
```

## 🔄 5 阶段任务生命周期

```
需求 → 计划 → 开发 → 测试 → 完成
 ↓      ↓      ↓      ↓      ↓
checkpoint × 5(每阶段必停等确认)
```

## 🐛 Bug Fixing 4 铁律

1. 复现 → 报错 → 根因 → 最小修复 → 验证
2. 禁止"无验证的已修复"
3. 一次只改一个问题
4. 2 次失败 → 停止,重新分析

## 📊 工具使用预期值(对比 111 会话历史)

| 工具 | 历史平均/会话 | 期望 |
|------|--------------|------|
| Bash | 61 | 60±20 |
| Read | 18 | 15±5 |
| mcp__codegraph__* | 15 | ≥ 10(健康) |
| Edit | 9 | 8±3 |
| TaskCreate + TaskUpdate | 5 | ≥ 3(工作流活跃) |
| Agent | 1.4 | ≥ 1 |
| Skill | 1.0 | ≥ 2(强制后应上升) |

## 🧠 CodeGraph 5 个强制触发点

| 场景 | 命令 |
|------|------|
| 🔧 重构 | `codegraph_impact` |
| 🆕 新功能 | `codegraph_files` + `codegraph_search` |
| ✏️ 改签名 | `codegraph_callers` |
| 🐛 跨文件 bug | `codegraph_callees` |
| 📊 复杂度 | `codegraph_complexity` |

## 📋 Spec / Plan 模板(强制填充 CodeGraph 段)

- `docs/superpowers/templates/spec-template.md` → "CodeGraph 上下文"段
- `docs/superpowers/templates/plan-template.md` → "Impact 分析"段

## 🚫 不做的事

- ❌ 追溯修复历史不合规代码(默认不碰)
- ❌ 凭记忆选 skill(每次用 `using-superpowers`)
- ❌ 无验证标 done
- ❌ 重构时 refactor working logic
- ❌ 1 次会话里同一 bug 修 2 次以上
