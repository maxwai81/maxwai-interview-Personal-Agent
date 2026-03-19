# Agent Instructions: File-Based Job Advisor Workflow

When the user says **"Process job-advisor-web/request.json"** or **"Run Job Advisor for the request in request.json"**:

## 1. Read the request

Read `job-advisor-web/request.json` and parse the JSON. Extract:
- `company` (required)
- `jobTitle`, `location`, `jobUrl`, `linkedinUrl` (optional)
- `resumeBase64`, `resumeFilename` (optional)

## 2. Handle resume

- If `resumeBase64` exists and is not `[TRUNCATED...]`:
  - Decode base64 to binary
  - Write to `assets/docs/` with filename from `resumeFilename` or `JobApplication-Resume.pdf`
  - Use that path in the subagent prompt
- If no resume or truncated: Use `./assets/docs/` and let the subagent find resumes there

## 3. Invoke Job-Advisor-for-Job-Seekers

Use `mcp_task` with `subagent_type: "Job-Advisor-for-Job-Seekers"` and a prompt like:

```
Run job fit analysis with:
- Company: [company]
- Job title: [jobTitle if provided]
- Location: [location if provided]
- Resume: [path from step 2]
- Job URL: [jobUrl if provided]
- LinkedIn: [linkedinUrl if provided]

IMPORTANT: When you complete the report, write the full markdown (company research + resume match report) to job-advisor-web/report.md so the web dashboard can auto-load it.
```

## 4. Ensure report.md exists

After the subagent returns:
- If the subagent wrote a file (e.g. a custom filename), copy/rename that content to `job-advisor-web/report.md`
- If the subagent returned the full report in its response, write it to `job-advisor-web/report.md`
- Tell the user: "Report saved. Refresh the Dashboard to view."
