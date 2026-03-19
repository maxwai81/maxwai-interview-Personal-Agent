# Agent Memory Guide

How agents (e.g., web-navigator) use patterns and memory—**without extra tokens or complexity**.

## How It Works

| What | Where | When Used |
|------|-------|-----------|
| **Runtime instructions** | `.cursor/agents/<agent>.md` | Every time the agent runs |
| **Learning database** | `memory/semantic-patterns.json` | When updating agent files (manual or via hooks) |
| **Experiences** | `memory/episodic/` | For pattern extraction and learning |

**Key:** Patterns are written *into* the agent file. The agent file is what Cursor loads when you delegate. No runtime loading of JSON = no extra tokens.

---

## Verification (Run Once)

Confirm your agents have the latest patterns:

```bash
# From project root
cd "/Users/max.seto/max-interview Personal Agent"

# 1. Check web-navigator has Form Automation section
grep -A 2 "Form Automation" .cursor/agents/web-navigator.md

# 2. Check semantic patterns exist for web-navigator
grep -B 1 '"web-navigator"' .agents/skills/self-improving-agent/memory/semantic-patterns.json
```

**Expected:** You should see the "Form Automation & Date Fields" section and `"target_skills": ["web-navigator"]` in the output.

---

## How to Invoke web-navigator (So It Uses the Patterns)

When you delegate to web-navigator, Cursor loads `.cursor/agents/web-navigator.md` as the agent's instructions. The patterns are already in that file.

**Ways to delegate:**
- In chat: `@web-navigator` or "use web-navigator to..."
- Via Task tool: `mcp_task(subagent_type="web-navigator", prompt="...")`

No extra commands or context injection needed.

---

## When You Learn Something New

1. **Add to episodic memory** (optional): `memory/episodic/2025/YYYY-MM-DD-<task>.json`
2. **Add to semantic patterns** (optional): `memory/semantic-patterns.json` with `target_skills: ["web-navigator"]`
3. **Update the agent file** (required): Add the guidance to `.cursor/agents/web-navigator.md`

The agent file is the source of truth for runtime. The memory files are for learning and traceability.

---

## Optional: Validation Script

Add to `package.json` scripts:

```json
"scripts": {
  "verify:agents": "node -e \"
    const fs = require('fs');
    const path = '.cursor/agents/web-navigator.md';
    const content = fs.readFileSync(path, 'utf8');
    const hasFormAutomation = content.includes('Form Automation');
    const hasDateFields = content.includes('calendar picker');
    console.log(hasFormAutomation && hasDateFields ? '✅ web-navigator has patterns' : '❌ web-navigator missing patterns');
    process.exit(hasFormAutomation && hasDateFields ? 0 : 1);
  \"
}
```

Run: `npm run verify:agents`

---

## Summary

| Question | Answer |
|----------|--------|
| Do I need to load semantic-patterns.json at runtime? | **No.** Patterns live in the agent file. |
| Do I need extra commands before delegating? | **No.** Delegate normally; Cursor loads the agent file. |
| How do new patterns get to the agent? | Update `.cursor/agents/web-navigator.md` when you learn something. |
| Is the memory/pattern system necessary? | For traceability and learning—yes. For runtime—the agent file is sufficient. |
