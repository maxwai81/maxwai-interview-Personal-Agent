# Agents

## Cursor Cloud specific instructions

### Project overview

This is a **configuration/documentation project** for building n8n workflows via Cursor's MCP integration. The main application logic in `index.js` is a stub. The project's value is in its `.cursorrules`, `CLAUDE.md`, agent skills (`.agents/`), and MCP setup docs.

### Running the application

- `npm start` — runs `node index.js` (prints startup message and exits)
- `npm run dev` — runs `node --watch index.js` (watches for file changes)

### No lint, test, or build tooling

The project has **no linting, testing, or build configuration**. There are no ESLint, Prettier, TypeScript, or test framework configs. `package.json` has empty `dependencies` and `devDependencies`.

### MCP integration (n8n-mcp)

The primary functionality comes from the **n8n-mcp** MCP server, configured via `.mcp.json` (gitignored). It requires two secrets:
- `N8N_API_URL` — the n8n instance URL
- `N8N_API_KEY` — the n8n API key

See `QUICKSTART.md` and `MCP_SETUP.md` for setup details.

### Key files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Comprehensive workflow building guidelines and MCP tool reference |
| `.cursorrules` | Workspace-level rules for code style and n8n integration |
| `QUICKSTART.md` | 5-minute MCP setup guide |
| `MCP_SETUP.md` | Detailed MCP installation and troubleshooting |
| `.env.example` | Template for n8n API credentials |
| `.agents/skills/` | Agent skill definitions (browser automation, self-improving agent) |
