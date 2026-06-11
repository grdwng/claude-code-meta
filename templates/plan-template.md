# [Feature/Module Name] Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** [1 sentence — what the implementation delivers]

**Architecture:** [1-3 sentences — major design choices, key files, data flow]

**Tech Stack:** [Languages, frameworks, libraries involved]

---

<!-- L0-L2: skip below. L3+: fill below. -->

## File Map

| File | Action | 关联 callers（从 codegraph） | 备注 |
|------|--------|------|------|
| `path/to/X.js:42` | Modify | `funcA(X.js:10)`, `funcB(Y.js:55)` | 改完通知所有 caller |
| `path/to/new.js` | Create | (none) | 新文件 |

---

## Task 1: [Title]

**Files:**
- Create / Modify: `path/to/file:line`
- 关联 callers（必查）：`codegraph_callers <symbol>` 已确认范围

- [ ] **Step 1: ...**

[详细步骤、代码片段、验证方法]

- [ ] **Step 2: ...**

---

## Task 2: [Title]

**Files:**
- Create / Modify: `path/to/file:line`
- 关联 callers（必查）：`codegraph_callers <symbol>` 已确认范围

- [ ] **Step 1: ...**

---

## Verification

[整体怎么验、回归测什么、E2E 跑哪个 spec]

- [ ] `npm test` 通过
- [ ] E2E `tests/e2e/<flow>.spec.js` 通过
- [ ] 手动跑一遍 happy path
