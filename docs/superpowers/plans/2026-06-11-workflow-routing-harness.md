# Workflow Routing Harness — Implementation Plan

**Spec:** `docs/superpowers/specs/2026-06-11-workflow-routing-design.md`
**Goal:** v0.2.0 (14 rules / 724 行) → v0.3.0 (5 rules / ≤300 行) + dispatch skill + advisory routing。
**Order:** add foundation → rewrite dependents → delete obsolete → bump version → verify。

---

## File Map

**Create (4):** `harness/rules/routing-table.md`, `harness/rules/escalation-protocol.md`, `harness/hooks/userpromptsubmit-route.json`, `skills/dispatch/SKILL.md`

**Modify (10):** `harness/rules/task-workflow.md`, `skills/init-project/SKILL.md`, `skills/self-evolve/SKILL.md`, `templates/spec-template.md`, `templates/plan-template.md`, `templates/ideal-workflow.md`, `harness/CLAUDE.md`, `README.md`, `CHANGELOG.md`, `.claude-plugin/{plugin,marketplace}.json`

**Delete (2):** `harness/rules/development-workflow.md`, `skills/workflow-harness/SKILL.md`

**Keep:** `llm-coding-discipline.md`, `bug-fixing-discipline.md`, `codegraph-sync.json`, `audit-skills.sh`, `MEMORY.md`

---

## Task 1 — `harness/rules/routing-table.md`

- [ ] Write file: 表格三段（keyword / extension / directory → skill）+ 三条 mitigation 段落。≤60 行。
- [ ] Verify: `test -f` && `wc -l ≤ 60`
- [ ] Commit: `feat: add advisory routing table`

---

## Task 2 — `harness/rules/escalation-protocol.md`

- [ ] Write file: triggers / phrasing / when NOT / after escalation。≤35 行。
- [ ] Verify: `wc -l ≤ 35`
- [ ] Commit: `feat: add mid-flight escalation protocol`

---

## Task 3 — `harness/hooks/userpromptsubmit-route.json`

- [ ] Write JSON：node 脚本读 `routing-table.md`，提取 keyword，匹配则 `console.log('[routing] matched: ...')`。L0 早退（疑问词 + 无祈使）。
- [ ] Verify: `jq . harness/hooks/userpromptsubmit-route.json`
- [ ] Commit: `feat: add UserPromptSubmit routing hook`

---

## Task 4 — `skills/dispatch/SKILL.md`

- [ ] Write SKILL.md：frontmatter + when to invoke + 估级表 + 路由分支 + L5 分支 + 中途升级 + 覆盖命令。
- [ ] Verify: 第一行 `---` 且含 `name: dispatch`
- [ ] Commit: `feat: add dispatch skill (replaces workflow-harness)`

---

## Task 5 — Rewrite `harness/rules/task-workflow.md` (≤120 行)

- [ ] Replace 全文：L0-L5 表 + L2/L3 判别 + 触发技能表 + dispatch + escalation + 任务树规则 + 验证。
- [ ] Verify: `wc -l ≤ 120`（超则把 L0-L5 表迁到 `routing-table.md`）
- [ ] Commit: `refactor: rewrite task-workflow as L0-L5 routing`

---

## Task 6 — `skills/init-project/SKILL.md` Step 8

- [ ] Replace Step 8：列 5 Copy + 2 Merge + 检测 v0.2.0 旧 rules 移除。
- [ ] Verify: `grep -cE '^- Copy|^- Merge' Step 8 区域` = 7
- [ ] Commit: `refactor: init-project installs slim core`

---

## Task 7 — `skills/self-evolve/SKILL.md`

- [ ] Add step 4 after "Compute deltas"：读 routing-table，取 keyword，按 audit-skills.sh 最近 30 天命中率报告 0-hit / 过激（>50% 会话命中）。
- [ ] Verify: `grep -q "routing-table health" skills/self-evolve/SKILL.md`
- [ ] Commit: `feat: self-evolve audits routing-table keywords`

---

## Task 8 — `templates/spec-template.md`

- [ ] 在 `## Design` 前插入 `<!-- L0-L2: skip below. L3+: fill below. -->`
- [ ] 删除 `## CodeGraph 上下文` 整段
- [ ] Verify: `grep -q 'L0-L2: skip' && ! grep -q '^## CodeGraph 上下文'`
- [ ] Commit: `refactor: spec-template uses L0-L2/L3+ markers`

---

## Task 9 — `templates/plan-template.md`

- [ ] 在 `## File Map` 前插入 marker；删除 `## Impact 分析` 整段。
- [ ] Verify: 同 Task 8 思路
- [ ] Commit: `refactor: plan-template uses L0-L2/L3+ markers`

---

## Task 10 — Rewrite `templates/ideal-workflow.md` (≤80 行)

- [ ] Replace 全文：L0-L5 表 + L2/L3 判别 + 触发技能表 + 不做的事 + CodeGraph v0.3.0 落点。
- [ ] Verify: `wc -l ≤ 80`
- [ ] Commit: `refactor: ideal-workflow rewrites north star around L0-L5`

---

## Task 11 — `harness/CLAUDE.md` (≤100 行)

- [ ] Replace 头部 + Contents + What this repo is + How to develop 四段为 v0.3.0 slim 描述。
- [ ] Verify: `wc -l ≤ 100`
- [ ] Commit: `refactor: CLAUDE.md reflects slim dispatch architecture`

---

## Task 12 — `README.md` v0.3.0 sync (Migration + 5 stale spots)

- [ ] 在 "Related docs" 前插入 `## 🔄 Migration from v0.2.0` 段：对比表 + 3 步升级。
- [ ] 同时修 5 处过时内容（v0.2.0 残留）：
  - 架构图：`workflow-harness` → `dispatch`
  - 文件树：`14 global rules` → `5 slim rules`
  - Self-contained 行：`14 rules + hooks + 3 skills` → `5 rules + 2 hooks + 3 skills`
  - `## 🔴 The 4 mandatory skills (enforced)` 段：改为"按 L 级别触发，不强制每会话"
  - Lifecycle 表：`workflow-harness` 列 → `dispatch`
  - Related docs：删除 `skills/workflow-harness/SKILL.md` 行
  - Version 行：`**0.1.0** (2026-06-07)` → `**0.3.0** (2026-06-11)`
- [ ] Verify: `grep -q '^## 🔄 Migration from v0.2.0'` && `! grep -q 'workflow-harness' README.md` && `! grep -q '14 global rules' README.md`
- [ ] Commit: `docs: README v0.3.0 sync + migration section`

---

## Task 13 — Delete obsolete

- [ ] 全仓 grep 残留：`grep -r "workflow-harness\|development-workflow" --include="*.md" --include="*.json" . | grep -v "docs/superpowers/\|.git/"` 必须空。
- [ ] `git rm harness/rules/development-workflow.md skills/workflow-harness/SKILL.md`
- [ ] Commit: `chore: delete obsolete workflow-harness + development-workflow`

---

## Task 14 — Version bump + CHANGELOG

- [ ] `plugin.json` + `marketplace.json` 0.2.0 → 0.3.0
- [ ] 创建/前置 `CHANGELOG.md` v0.3.0 entry（Added / Changed / Removed / Notes）
- [ ] Verify: `diff <(jq -r .version .claude-plugin/plugin.json) <(jq -r '.plugins[0].version' .claude-plugin/marketplace.json)`
- [ ] Commit: `chore: bump to v0.3.0 + CHANGELOG`

---

## Task 15 — Final verification (acceptance)

- [ ] **PRE-REQUISITE (在 Task 1 开始前必做)**：当前还在 v0.2.0，用秒表测 L0 查询 "What does dispatch do?" 的 wall-clock，记到 `docs/superpowers/audits/v0.3.0-acceptance-2026-06-11.md` 的 `baseline_v0.2.0_seconds:` 字段。**升级后此基线不可再得**。
- [ ] `wc -l harness/rules/*.md | tail -1` ≤ 300
- [ ] `wc -l harness/rules/task-workflow.md` ≤ 120
- [ ] `jq .` 两个 hook 文件
- [ ] 4 场景手测（开新会话）：
  1. **L0**: "What does dispatch do?" → 零流程 + **≤5s 且比 v0.2.0 快 ≥50%**（用上面 PRE-REQUISITE 记录的基线对照）
  2. **L2**: "Add `format_date` to utils/" → 无 spec/plan，测试跑
  3. **L3**: "Add `users` CRUD module" → spec → plan → 实施
  4. **L2→L3**: "Rename X" 发现 4 文件 → 主动报 L3
- [ ] 记结果到 `docs/superpowers/audits/v0.3.0-acceptance-2026-06-11.md`
- [ ] 全过 → `git tag v0.3.0 && git push --tags`

---

## Spec 覆盖检查

| Spec 需求 | 任务 |
|----------|------|
| L0–L5 + L2/L3 判别 + cost asymmetry | 4, 5 |
| Dispatcher + 覆盖命令 + L5 分支 | 4 |
| 中途升级 | 2, 4 |
| Routing table + 3 mitigations + L0 bypass | 1, 3 |
| Slim core 5 文件 ≤ 300 行 | 1, 2, 5, 15 |
| init-project 检测 v0.2.0 | 6 |
| 模板 L0-L2/L3+ marker | 8, 9 |
| 4 acceptance 场景 + L0 wall-clock | 15 |
| 版本 + CHANGELOG + Migration | 12, 14 |
| 删除 obsolete | 13 |
