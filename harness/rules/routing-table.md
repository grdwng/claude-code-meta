# Routing Table (Advisory)

> Keyword / extension / directory → skill hints. **Advisory only** — Claude makes the final call.

## L0 Bypass (hard constraint)

All keywords default `min-level: L1+`. L0 prompts (interrogatives, no imperative) never match — so a "What does dispatch do?" query routes nothing and runs zero workflow.

## Keyword → Skill

| Keyword | Skill | min-level |
|---------|-------|-----------|
| `plan`, `spec`, `prd`, `roadmap` | `superpowers:writing-plans` / `planner` | L3 |
| `brainstorm`, `idea`, `what if` | `superpowers:brainstorming` | L3 |
| `tdd`, `test first`, `red green` | `superpowers:test-driven-development` | L2 |
| `review`, `feedback`, `nit` | `code-review` / `superpowers:requesting-code-review` | L2 |
| `refactor`, `rename`, `extract` | `superpowers:verification-before-completion` + codegraph `impact` | L3 |
| `bug`, `failing`, `broken`, `error` | `superpowers:systematic-debugging` | L2 |
| `verify`, `done`, `complete` | `superpowers:verification-before-completion` | L2 |
| `commit`, `pr`, `merge`, `push` | `commit-commands:commit-push-pr` | L2 |
| `skill`, `rule`, `hook` | `claude-code-meta:self-evolve` | L3 |
| `init`, `bootstrap`, `scaffold` | `claude-code-meta:init-project` | L4 |
| `dispatch`, `route`, `level` | `claude-code-meta:dispatch` | L2 |

## Extension → Skill

| Extension | Skill | min-level |
|-----------|-------|-----------|
| `*.test.{ts,js,py}` | `superpowers:test-driven-development` | L2 |
| `*.spec.{ts,js}` | `superpowers:test-driven-development` | L2 |
| `*_test.py`, `test_*.py` | `superpowers:test-driven-development` | L2 |
| `Dockerfile`, `docker-compose*` | `deployment-patterns` | L3 |
| `*.sql`, `*.migration` | `database-reviewer` | L3 |
| `package.json`, `pyproject.toml`, `Cargo.toml` | dispatch review (dependency change) | L3 |

## Directory → Skill

| Directory | Skill | min-level |
|-----------|-------|-----------|
| `harness/rules/`, `harness/hooks/` | `claude-code-meta:self-evolve` | L4 |
| `skills/`, `templates/` | `claude-code-meta:self-evolve` | L4 |
| `.claude-plugin/` | dispatch review (manifest change) | L4 |
| `docs/superpowers/specs/` | `superpowers:writing-plans` | L3 |
| `docs/superpowers/plans/` | `superpowers:executing-plans` | L3 |
| `migrations/`, `db/schema/` | `database-reviewer` | L3 |
| `e2e/`, `tests/e2e/` | `e2e-runner` | L3 |
| `auth/`, `payment/`, `crypto/` | `security-reviewer` | L4 |

## Three Mitigations (anti-routing-rot)

1. **Advisory only** — Claude may ignore any match. Routing hints inform, not mandate.
2. **`self-evolve` audits 0-hit keywords** — Weekly audit (see `claude-code-meta:self-evolve` Step 4) flags keywords that never matched in last 30 days for removal.
3. **No duplicate auto-loaded skill** — Don't route to a skill already auto-loaded by `harness/rules/*` or `~/.claude/CLAUDE.md` (would create noise, no signal).
