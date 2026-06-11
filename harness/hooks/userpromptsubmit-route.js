#!/usr/bin/env node
// Read routing-table.md and print matched keywords for the user's prompt.
// L0 (interrogative / no imperative) bypasses the table entirely.

const fs = require('fs');
const path = require('path');

const prompt = (process.env.USER_PROMPT || '').trim();

// L0 bypass: starts with interrogative, or has no imperative verb
const l0Pattern = /^(what|why|how|when|where|who|which|can you|could you|is it|are there|do you|does it)\b/i;
const imperativePattern = /\b(add|fix|create|implement|build|write|run|test|refactor|rename|update|delete|remove|commit|merge|push|review|deploy|debug|investigate|find|check|search|look|show|explain|describe)\b/i;
if (l0Pattern.test(prompt) || !imperativePattern.test(prompt)) {
  process.exit(0);
}

// Read routing-table.md (relative to project root = harness/hooks/../..)
const tablePath = path.join(__dirname, '..', '..', 'harness', 'rules', 'routing-table.md');
if (!fs.existsSync(tablePath)) process.exit(0);

const table = fs.readFileSync(tablePath, 'utf8');

// Extract keywords from the "## Keyword → Skill" section
const keywords = [];
let inSection = false;
for (const line of table.split('\n')) {
  if (line.startsWith('## Keyword')) inSection = true;
  else if (line.startsWith('## ')) inSection = false;
  else if (inSection && line.startsWith('|') && !line.startsWith('|---') && !line.startsWith('| Keyword')) {
    const cells = line.split('|').map(c => c.trim());
    if (cells[1]) {
      cells[1].split(',').forEach(k => keywords.push(k.replace(/`/g, '').trim()));
    }
  }
}

const matched = keywords.filter(k => prompt.toLowerCase().includes(k.toLowerCase()));
if (matched.length > 0) {
  console.log('[routing] matched: ' + matched.join(', '));
}
