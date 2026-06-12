#!/usr/bin/env node
// quality-discipline-stop.js — Stop hook (warn-only)
// Reads transcript_path from stdin JSON payload
// Greps for mandatory skill invocations + code-edit/bug-keyword signals
// Warns to stderr if any mandatory skill was skipped
// Exit 0 always (warn-only, not blocking)
// Plan: /Users/gordonwangmbp/.claude/plans/tidy-wibbling-harbor.md

const fs = require('fs');

const RULE_REF = 'harness/rules/task-workflow.md "🔴 Enforcement"';
const CODE_EXT = /\.(ts|tsx|js|jsx|mjs|cjs|py|go|rs|rb|java|kt|swift|c|cpp|h|hpp|cs|php|sh|sql)$/i;
const BUG_KW = /\b(bug|broken|failing|crash)\b/i;

const TIMEOUT_MS = 5000;
const MIN_TRANSCRIPT_SIZE = 1024;
const MIN_TOOL_CALLS = 5;

// Bail after timeout (prevents hook hangs on huge transcripts)
const timeout = setTimeout(() => process.exit(0), TIMEOUT_MS);
timeout.unref();

// Read stdin synchronously
let stdin = '';
process.stdin.on('data', chunk => stdin += chunk);
process.stdin.on('end', () => {
  try {
    main(JSON.parse(stdin));
  } catch (e) {
    process.exit(0);
  }
});

function main(payload) {
  const transcriptPath = payload && payload.transcript_path;
  if (!transcriptPath || !fs.existsSync(transcriptPath)) {
    process.exit(0);
  }

  let content;
  try {
    content = fs.readFileSync(transcriptPath, 'utf8');
  } catch (e) {
    process.exit(0);
  }

  if (content.length < MIN_TRANSCRIPT_SIZE) {
    process.exit(0);
  }

  // Per-line analysis — JSONL transcripts have one JSON object per line
  const transcriptLines = content.split('\n');
  let totalEdits = 0;
  let codeFileEdits = 0;
  let totalToolCalls = 0;

  for (const line of transcriptLines) {
    if (/"name":"(Skill|Agent|TaskCreate|TaskUpdate|Read|Bash|Edit|Write|MultiEdit|Glob|Grep)"/.test(line)) {
      totalToolCalls++;
    }
    if (/"name":"(Edit|Write|MultiEdit)"/.test(line)) {
      totalEdits++;
      const m = line.match(/"file_path":"([^"]+)"/);
      if (m && CODE_EXT.test(m[1])) {
        codeFileEdits++;
      }
    }
  }

  // Trivial session — don't warn
  if (totalToolCalls < MIN_TOOL_CALLS && totalEdits === 0) {
    process.exit(0);
  }

  // Skill invocation counts — mirror audit-skills.sh:42 grep pattern (strict equality)
  const invokedTdd = (content.match(/"skill":"superpowers:test-driven-development"/g) || []).length;
  const invokedVerify = (content.match(/"skill":"superpowers:verification-before-completion"/g) || []).length;
  const invokedDebug = (content.match(/"skill":"superpowers:systematic-debugging"/g) || []).length;
  const invokedUsing = (content.match(/"skill":"superpowers:using-superpowers"/g) || []).length;

  // Bug keywords — first 5KB only (avoid false positives from error messages / stack traces)
  const bugKeywords = BUG_KW.test(content.slice(0, 5000));

  // Build warning list
  const warnings = [];

  if (invokedUsing === 0 && totalToolCalls >= MIN_TOOL_CALLS) {
    warnings.push({
      skill: 'superpowers:using-superpowers',
      why: 'session had ' + totalToolCalls + ' tool calls but never invoked using-superpowers at start'
    });
  }

  if (codeFileEdits >= 1 && invokedTdd === 0) {
    warnings.push({
      skill: 'superpowers:test-driven-development',
      why: codeFileEdits + ' code-file edit(s) but no TDD invocation (RED→GREEN→REFACTOR)'
    });
  }

  if (totalEdits >= 1 && invokedVerify === 0) {
    warnings.push({
      skill: 'superpowers:verification-before-completion',
      why: totalEdits + ' edit(s) but no verification invocation (no unverified "done")'
    });
  }

  if (bugKeywords && totalEdits >= 1 && invokedDebug === 0) {
    warnings.push({
      skill: 'superpowers:systematic-debugging',
      why: 'bug-related keywords + edits detected but no systematic-debugging invocation'
    });
  }

  if (warnings.length === 0) {
    process.exit(0);
  }

  const warnLines = warnings.map(function (w) {
    return '  - ' + w.skill + ' — ' + w.why + '\n    (rule: ' + RULE_REF + ')';
  });
  process.stderr.write('🔴 Quality discipline reminders (this session):\n' + warnLines.join('\n') + '\n');
  process.exit(0);
}