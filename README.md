# Max n8n Agent

A custom n8n agent implementation for workflow automation using n8n-mcp and AI-powered workflow building.

## Overview

This project enables Claude AI to build high-quality n8n workflows using:
- **n8n-mcp** - MCP server for n8n (1,084+ nodes, 2,709+ templates)
- **n8n-skills** - Expert skills for building production-ready workflows
- **Self-hosted n8n** - Connected to your own n8n server

## 🚀 Quick Setup

### 1. Configure n8n-MCP

See **[QUICKSTART.md](./QUICKSTART.md)** for the 5-minute setup guide.

**In short:**
1. Get your n8n API key (Settings → API in your n8n instance)
2. Update `.mcp.json` with your n8n server URL and API key
3. Restart Cursor

### 2. Start Building Workflows

Ask Claude in Cursor:
```
"Create a webhook workflow that sends data to Slack"
```

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute setup guide
- **[MCP_SETUP.md](./MCP_SETUP.md)** - Detailed installation and troubleshooting
- **[CLAUDE.md](./CLAUDE.md)** - Complete workflow building guidelines
- **[.cursorrules](./.cursorrules)** - Project-specific rules

## Features

### Available MCP Tools (17+ tools)
- 🔍 Search 1,084+ n8n nodes (core + community)
- 📖 Get node details and configurations
- ✅ Validate workflows before deployment
- 🎯 Access 2,709 workflow templates
- 🤖 AI-powered workflow validation

### Workflow Management (13 tools)
- ✨ Create new workflows
- 🔄 Update existing workflows
- 🗑️ Delete workflows
- 📋 List all workflows
- 🚀 Deploy templates directly
- 🔧 Auto-fix common errors

### Execution Management (3 tools)
- ▶️ Test/trigger workflows
- 📊 List execution history
- 🔍 Get execution details

## Getting Started

### Installation

```bash
npm install
```

### Usage

```bash
npm start
```

## Development

```bash
npm run dev
```

## 🔗 Resources

- **n8n-mcp**: https://github.com/czlonkowski/n8n-mcp
- **n8n-skills**: https://github.com/czlonkowski/n8n-skills
- **n8n Documentation**: https://docs.n8n.io

## License

MIT
