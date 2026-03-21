# n8n Workflow Builder

This project enables Claude to build high-quality n8n workflows using the n8n MCP server and n8n skills.

## Environment

- **n8n Instance**: n8n Cloud
- **MCP Server**: n8n-mcp (czlonkowski/n8n-mcp)
- **Skills**: n8n-skills (czlonkowski/n8n-skills)

## Available MCP Tools

All tools are provided by the n8n-mcp server. Reference: https://github.com/czlonkowski/n8n-mcp

### Documentation & Discovery

| Tool | Purpose |
|------|---------|
| `tools_documentation` | Access MCP tool documentation |
| `search_nodes` | Full-text search across 1,084 nodes (filter by core/community/verified) |
| `get_node` | Retrieve node details (minimal/standard/full modes) |
| `validate_node` | Validate node configuration |
| `validate_workflow` | Complete workflow validation including AI Agent checks |

### Workflow Management

| Tool | Purpose |
|------|---------|
| `n8n_create_workflow` | Create new workflows |
| `n8n_get_workflow` | Retrieve existing workflows |
| `n8n_update_workflow` | Full workflow update |
| `n8n_update_partial_workflow` | Partial workflow update |
| `n8n_delete_workflow` | Delete workflows |
| `n8n_list_workflows` | List all workflows |
| `n8n_validate_workflow` | Validate before deployment |

### Execution Management

| Tool | Purpose |
|------|---------|
| `n8n_test_workflow` | Test/trigger workflows |
| `n8n_list_executions` | List execution history |
| `n8n_get_execution` | Get execution details |
| `n8n_delete_execution` | Delete execution records |

## Available Skills

These skills activate automatically based on context. Reference: https://github.com/czlonkowski/n8n-skills

1. **n8n Expression Syntax** - Correct `{{}}` patterns and variable access
2. **n8n MCP Tools Expert** - Effective use of MCP server tools
3. **n8n Workflow Patterns** - 5 proven architectural approaches
4. **n8n Validation Expert** - Interpret and resolve validation errors
5. **n8n Node Configuration** - Operation-aware node setup
6. **n8n Code JavaScript** - JavaScript in Code nodes
7. **n8n Code Python** - Python with limitations awareness

## Workflow Building Process

### 1. Understand Requirements

- Clarify the workflow's purpose and triggers
- Identify required integrations and data flow
- Determine error handling needs

### 2. Search Templates First

```
search_templates → Find similar workflows
get_template → Get workflow JSON as starting point
```

### 3. Research Nodes

```
search_nodes → Find appropriate nodes
get_node → Get configuration details
```

### 4. Build Incrementally

- Start with trigger node
- Add nodes one at a time
- Validate after each addition

### 5. Validate Before Deployment

```
validate_workflow → Check for errors
Fix any issues → Re-validate
```

### 6. Test

```
n8n_test_workflow → Run with test data
Verify outputs → Adjust as needed
```

## Safety Rules

- **NEVER edit production workflows directly** - Always create copies
- **NEVER deploy without validation** - Use `validate_workflow` first
- **NEVER skip required_workflow_tests** - Always test with realistic data
- **NEVER skip testing** - Always test with realistic data
- **NEVER use default values blindly** - Configure parameters explicitly

## Quality Standards

### Before Creating

- Search templates for existing patterns
- Understand all required node configurations
- Plan error handling strategy

### During Building

- Validate nodes as you add them
- Use proper n8n expression syntax
- Follow established workflow patterns

### Before Deployment

- Run `validate_workflow` with strict profile
- Test with representative data
- Verify error handling works

## Workflow Patterns

Use these 5 proven patterns as architectural foundations:

1. **Webhook Processing** - External triggers → Process → Respond
2. **HTTP API Integration** - Fetch data → Transform → Store/Send
3. **Database Operations** - Query → Process → Update
4. **AI Workflows** - Input → AI processing → Output handling
5. **Scheduled Tasks** - Cron trigger → Actions → Results

## Expression Syntax

### Core Variables

- `$json` - Current node data
- `$node["NodeName"].json` - Data from specific node
- `$now` - Current timestamp
- `$env.VARIABLE_NAME` - Environment variables

### Critical Gotchas

⚠️ **Webhook data is under `$json.body`** not `$json`

```javascript
// ❌ WRONG
{{ $json.name }}

// ✅ CORRECT
{{ $json.body.name }}
```

### When NOT to Use Expressions

- **Code nodes** - Use native JavaScript/Python instead
- **Complex logic** - Move to Code node for maintainability
- **Multiple conditions** - Use IF or Switch nodes

## Validation Strategy

### Level 1 - Quick Check (before building)

```
validate_node({nodeType, config, mode: 'minimal'})
```

### Level 2 - Comprehensive (before building)

```
validate_node({nodeType, config, mode: 'full', profile: 'runtime'})
```

### Level 3 - Complete (after building)

```
validate_workflow(workflow)
```

### Level 4 - Post-Deployment

```
n8n_validate_workflow({id})
n8n_autofix_workflow({id})
n8n_executions({action: 'list'})
```

## Common Mistakes & Fixes

### 1. Default Values Cause Failures

❌ **FAILS at runtime**
```json
{resource: "message", operation: "post", text: "Hello"}
```

✅ **WORKS - all parameters explicit**
```json
{resource: "message", operation: "post", select: "channel", channelId: "C123", text: "Hello"}
```

### 2. Webhook Data Access

❌ **WRONG**
```javascript
return [{ json: { name: $json.name } }];
```

✅ **CORRECT**
```javascript
return [{ json: { name: $json.body.name } }];
```

### 3. Code Node Return Format

❌ **WRONG**
```javascript
return { name: "value" };
```

✅ **CORRECT**
```javascript
return [{ json: { name: "value" } }];
```

### 4. IF Node Connections

IF nodes have **two outputs** (TRUE and FALSE). Use the `branch` parameter:

✅ **CORRECT - Route to TRUE branch**
```json
{
  "type": "addConnection",
  "source": "if-node-id",
  "target": "success-handler-id",
  "sourcePort": "main",
  "targetPort": "main",
  "branch": "true"
}
```

✅ **CORRECT - Route to FALSE branch**
```json
{
  "type": "addConnection",
  "source": "if-node-id",
  "target": "failure-handler-id",
  "sourcePort": "main",
  "targetPort": "main",
  "branch": "false"
}
```

### 5. Node Type Format

⚠️ **MCP tools use different formats than workflow JSON**

**In MCP tools:**
```
nodes-base.httpRequest
nodes-base.slack
```

**In workflow JSON:**
```
n8n-nodes-base.HttpRequest
n8n-nodes-base.Slack
```

## Batch Operations

Use `n8n_update_partial_workflow` with multiple operations in a single call:

✅ **GOOD - Batch multiple operations**
```json
n8n_update_partial_workflow({
  id: "wf-123",
  operations: [
    {type: "updateNode", nodeId: "slack-1", changes: {...}},
    {type: "updateNode", nodeId: "http-1", changes: {...}},
    {type: "cleanStaleConnections"}
  ]
})
```

❌ **BAD - Separate calls**
```json
n8n_update_partial_workflow({id: "wf-123", operations: [{...}]})
n8n_update_partial_workflow({id: "wf-123", operations: [{...}]})
```

## AI Agent Workflows

When building AI Agent workflows, validate:

- Language model connection present
- AI tools properly connected (8 connection types supported)
- Streaming mode constraints met
- Memory configuration correct
- Output parser setup validated

## Response Format

### Initial Creation

```
[Silent tool execution in parallel]

Created workflow:
- Webhook trigger → Slack notification
- Configured: POST /webhook → #general channel

Validation: ✅ All checks passed
```

### Modifications

```
[Silent tool execution]

Updated workflow:
- Added error handling to HTTP node
- Fixed required Slack parameters

Changes validated successfully.
```

## Template Attribution

When using templates:

**MANDATORY ATTRIBUTION**: "Based on template by **[author.name]** (@[username]). View at: [url]"

Templates may need updates - always validate before deployment.

## Most Popular n8n Nodes

For quick reference when using `get_node`:

1. **n8n-nodes-base.code** - JavaScript/Python scripting
2. **n8n-nodes-base.httpRequest** - HTTP API calls
3. **n8n-nodes-base.webhook** - Event-driven triggers
4. **n8n-nodes-base.set** - Data transformation
5. **n8n-nodes-base.if** - Conditional routing
6. **n8n-nodes-base.manualTrigger** - Manual workflow execution
7. **n8n-nodes-base.respondToWebhook** - Webhook responses
8. **n8n-nodes-base.scheduleTrigger** - Time-based triggers
9. **@n8n/n8n-nodes-langchain.agent** - AI agents
10. **n8n-nodes-base.googleSheets** - Spreadsheet integration

**Note:** LangChain nodes use the `@n8n/n8n-nodes-langchain.` prefix, core nodes use `n8n-nodes-base.`

## Important Rules

### Core Behavior

1. **Silent execution** - No commentary between tools
2. **Parallel by default** - Execute independent operations simultaneously
3. **Templates first** - Always check before building (2,709 available)
4. **Multi-level validation** - Quick check → Full validation → Workflow validation
5. **Never trust defaults** - Explicitly configure ALL parameters

### Performance

- **Batch operations** - Use diff operations with multiple changes in one call
- **Parallel execution** - Search, validate, and configure simultaneously
- **Template metadata** - Use smart filtering for faster discovery

### Code Node Usage

- **Avoid when possible** - Prefer standard nodes
- **Only when necessary** - Use code node as last resort
- **AI tool capability** - ANY node can be an AI tool (not just marked ones)

## References

- **n8n-mcp Repository**: https://github.com/czlonkowski/n8n-mcp
- **n8n-skills Repository**: https://github.com/czlonkowski/n8n-skills
- **n8n Documentation**: https://docs.n8n.io
- **MCP Tools Documentation**: Use `tools_documentation()` for best practices

## Example Workflow

### Template-First Approach

```
// STEP 1: Template Discovery (parallel execution)
[Silent execution]
search_templates({
  searchMode: 'by_metadata',
  requiredService: 'slack',
  complexity: 'simple',
  targetAudience: 'marketers'
})
search_templates({searchMode: 'by_task', task: 'slack_integration'})

// STEP 2: Use template
get_template(templateId, {mode: 'full'})
validate_workflow(workflow)

// Response after all tools complete:
"Found template by **David Ashby** (@cfomodz).
View at: https://n8n.io/workflows/2414

Validation: ✅ All checks passed"
```

### Building from Scratch (if no template)

```
// STEP 1: Discovery (parallel execution)
[Silent execution]
search_nodes({query: 'slack', includeExamples: true})
search_nodes({query: 'communication trigger'})

// STEP 2: Configuration (parallel execution)
[Silent execution]
get_node({nodeType: 'n8n-nodes-base.slack', detail: 'standard', includeExamples: true})
get_node({nodeType: 'n8n-nodes-base.webhook', detail: 'standard', includeExamples: true})

// STEP 3: Validation (parallel execution)
[Silent execution]
validate_node({nodeType: 'n8n-nodes-base.slack', config, mode: 'minimal'})
validate_node({nodeType: 'n8n-nodes-base.slack', config: fullConfig, mode: 'full', profile: 'runtime'})

// STEP 4: Build
// Construct workflow with validated configs
// ⚠️ Set ALL parameters explicitly

// STEP 5: Validate
[Silent execution]
validate_workflow(workflowJson)

// Response after all tools complete:
"Created workflow: Webhook → Slack
Validation: ✅ Passed"
```

---

## Job Advisor (this repo)

This workspace also contains **job-advisor-web** and the **Job-Advisor-for-Job-Seekers** agent (`.cursor/agents/Job-Advisor-for-Job-Seekers.md`). For Cursor / Cloud agents:

- **Do not** invoke `Task` / `Job-Advisor-for-Job-Seekers` unless the user **explicitly names** that agent in their message.
- **Do not** push or merge to **`main`** unless the user **explicitly asks**; after job-fit work, push only the **current branch**. Details: `.cursorrules` and `job-advisor-web/AGENT_INSTRUCTIONS.md`.

---

**Built with ❤️ for the n8n community**  
Making AI + n8n workflow creation delightful
