# 🚀 n8n-MCP Quick Start

## ✅ Step-by-Step Setup (5 minutes)

### 1. Get Your n8n API Credentials

Open your self-hosted n8n server and:

1. Navigate to **Settings → API**
2. Click **"Create API Key"**
3. Copy the generated API key (starts with `n8n_api_`)
4. Note your n8n server URL

### 2. Update `.mcp.json`

Open the `.mcp.json` file in this project and replace:

- `YOUR_N8N_SERVER_URL` → Your actual n8n URL
- `YOUR_N8N_API_KEY` → Your actual API key

**Examples:**

```json
// Local development
"N8N_API_URL": "http://localhost:5678",

// Production server
"N8N_API_URL": "https://n8n.yourdomain.com",

// API Key (example format)
"N8N_API_KEY": "n8n_api_1234567890abcdef"
```

### 3. Restart Cursor

- **Quit Cursor completely** (Cmd+Q on Mac, Alt+F4 on Windows)
- **Reopen Cursor**
- **Open this project**

### 4. Test It!

Ask the AI in Cursor:

```
Are you connected to n8n-mcp? Show me available tools.
```

Or try:

```
Search for Slack nodes in n8n
```

---

## 🎯 What You Can Do Now

### Build Workflows
```
"Create a webhook workflow that sends data to Slack"
```

### Search Nodes
```
"Find all email-related nodes in n8n"
```

### Use Templates
```
"Show me n8n templates for AI automation"
```

### Validate Workflows
```
"Validate this workflow configuration: [paste JSON]"
```

### Manage Workflows
```
"List all workflows in my n8n instance"
```

---

## 📚 Learn More

- **[MCP_SETUP.md](./MCP_SETUP.md)** - Detailed setup guide
- **[CLAUDE.md](./CLAUDE.md)** - Complete workflow building guidelines
- **[n8n-mcp GitHub](https://github.com/czlonkowski/n8n-mcp)** - Full documentation

---

## 🆘 Need Help?

**Connection issues?** Check [MCP_SETUP.md](./MCP_SETUP.md) → Troubleshooting section

**API key not working?** Ensure it's created in n8n Settings → API

**Docker setup?** See [MCP_SETUP.md](./MCP_SETUP.md) → Advanced Configuration
