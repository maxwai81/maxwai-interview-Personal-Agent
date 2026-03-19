# n8n-MCP Setup Guide for Cursor

This guide will help you configure n8n-mcp to work with your self-hosted n8n server in Cursor.

## 🚀 Quick Setup

### Step 1: Get Your n8n API Credentials

1. **Open your n8n instance** (your self-hosted server)
2. **Go to Settings → API**
3. **Create a new API key** and copy it
4. **Note your n8n server URL** (e.g., `https://n8n.yourdomain.com` or `http://localhost:5678`)

### Step 2: Configure MCP Server

The `.mcp.json` file has been created in your project root. You need to update it with your credentials:

```bash
# Open the .mcp.json file and replace:
# - YOUR_N8N_SERVER_URL with your actual n8n server URL
# - YOUR_N8N_API_KEY with your actual API key
```

**Example for local development:**
```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["-y", "n8n-mcp@latest"],
      "env": {
        "MCP_MODE": "stdio",
        "LOG_LEVEL": "error",
        "DISABLE_CONSOLE_OUTPUT": "true",
        "N8N_API_URL": "http://localhost:5678",
        "N8N_API_KEY": "n8n_api_xxxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

**Example for production server:**
```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["-y", "n8n-mcp@latest"],
      "env": {
        "MCP_MODE": "stdio",
        "LOG_LEVEL": "error",
        "DISABLE_CONSOLE_OUTPUT": "true",
        "N8N_API_URL": "https://n8n.yourdomain.com",
        "N8N_API_KEY": "n8n_api_xxxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

### Step 3: Restart Cursor

After updating `.mcp.json`, restart Cursor to load the MCP server:

1. **Quit Cursor completely** (Cmd+Q on Mac)
2. **Reopen Cursor**
3. **Open your project**

### Step 4: Verify Installation

In Cursor, ask the AI:

```
Can you check if n8n-mcp is connected? Please list the available n8n MCP tools.
```

You should see a list of available tools including:
- `search_nodes`
- `get_node`
- `validate_node`
- `n8n_create_workflow`
- `n8n_get_workflow`
- And more...

## 🔧 Advanced Configuration

### Using Docker (Alternative Method)

If you prefer Docker for isolation:

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "--init",
        "-e", "MCP_MODE=stdio",
        "-e", "LOG_LEVEL=error",
        "-e", "DISABLE_CONSOLE_OUTPUT=true",
        "-e", "N8N_API_URL=http://host.docker.internal:5678",
        "-e", "N8N_API_KEY=your-api-key",
        "ghcr.io/czlonkowski/n8n-mcp:latest"
      ]
    }
  }
}
```

**Note:** Use `http://host.docker.internal:5678` if your n8n is running locally on Docker.

### Environment Variables

You can also create a `.env` file (already templated as `.env.example`):

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your actual credentials
nano .env
```

## 📚 Available Features

With your self-hosted n8n connected, you'll have access to:

### Documentation Tools (17 tools)
- ✅ Search 1,084+ nodes (core + community)
- ✅ Get node details and configurations
- ✅ Validate workflows before deployment
- ✅ Access 2,709 workflow templates
- ✅ Search by node type, service, complexity

### Workflow Management (13 tools)
- ✅ Create new workflows
- ✅ Update existing workflows
- ✅ Delete workflows
- ✅ List all workflows
- ✅ Deploy templates directly
- ✅ Auto-fix common errors

### Execution Management (3 tools)
- ✅ Test/trigger workflows
- ✅ List execution history
- ✅ Get execution details

## 🎯 Next Steps

1. **Read the CLAUDE.md file** - Comprehensive workflow building guidelines
2. **Try building a workflow** - Ask: "Create a simple webhook to Slack workflow"
3. **Explore templates** - Ask: "Show me available n8n templates for email automation"
4. **Install n8n-skills** (Optional) - Enhanced AI capabilities for building workflows

## 🛠️ Troubleshooting

### "MCP server not found" error

1. Check if `.mcp.json` is in your project root
2. Restart Cursor completely
3. Verify npx is installed: `npx --version`

### "Connection failed" error

1. Verify your n8n server is running and accessible
2. Check your N8N_API_URL is correct
3. Verify your N8N_API_KEY is valid
4. If using localhost, ensure n8n is running on the specified port

### "Permission denied" error

1. Check your API key has proper permissions in n8n
2. Create a new API key if needed

### Docker connection issues

If using Docker and connecting to local n8n:
- Use `http://host.docker.internal:5678` instead of `http://localhost:5678`
- Ensure Docker is running

## 📖 Resources

- **n8n-mcp Repository**: https://github.com/czlonkowski/n8n-mcp
- **n8n-skills Repository**: https://github.com/czlonkowski/n8n-skills
- **n8n Documentation**: https://docs.n8n.io
- **MCP Protocol**: https://modelcontextprotocol.io

## 🔐 Security Notes

- ⚠️ **Never commit `.mcp.json` with real API keys to version control**
- ✅ Use environment variables for sensitive data
- ✅ Add `.mcp.json` to `.gitignore` if it contains secrets
- ✅ Use read-only API keys when possible

---

**Need help?** Check the [CLAUDE.md](./CLAUDE.md) file for comprehensive workflow building guidelines.
