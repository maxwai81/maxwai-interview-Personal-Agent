# Agent Instructions: File-Based Job Advisor Workflow

## Full automation (cloud / Cursor agents)

- **Auto-invoke Job-Advisor-for-Job-Seekers** for any job-fit, application-analysis, or “run job fit” request (including free-form chat that includes company + role and resume/LinkedIn). Use `mcp_task` / `Task` with `subagent_type: "Job-Advisor-for-Job-Seekers"` **without** requiring the user to type the agent name.
- After outputs exist under `job-advisor-web/`, follow **Step 5 then Step 6** in `.cursor/agents/Job-Advisor-for-Job-Seekers.md`: push the current branch, then **automatically merge to `main`** and `git push origin main` when allowed, else non-draft PR + auto-merge.

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

In job-fit-dashboard.json / runs/<slug>/job-fit.json, set companyResearch.highlights.executiveSummary to the company research executive summary in Markdown (## headings, bullets, **bold**). That text renders on per-run runs/<slug>/dashboard.html below the granular score charts.
```

## 4. Ensure report.md exists

After the subagent returns:
- If the subagent wrote a file (e.g. a custom filename), copy/rename that content to `job-advisor-web/report.md`
- If the subagent returned the full report in its response, write it to `job-advisor-web/report.md`
- **Canonical path:** `job-advisor-web/report.md` at the **repository root** (same folder as `index.html`). If the user opens `report.md` from a per-run dashboard link (`../../report.md`) via `file://`, the OS may open the browser or an editor depending on the OS; the main app (`index.html` Dashboard tab) loads the file via fetch when using a local HTTP server (recommended).
- Tell the user: "Report saved. Refresh the Dashboard to view."

**Per-run dashboard:** When creating `runs/<slug>/dashboard.html`, duplicate `job-fit.json` inside `<script type="application/json" id="job-fit-embed">` so charts load when the HTML file is opened without a server (see `runs/README.md`).

## 5. Git publish (when possible)

If the Job Advisor run created or updated files under `job-advisor-web/` (including `runs/<slug>/`), from the **repo root** run:

```bash
git add job-advisor-web/
git commit -m "job-advisor: request/processed"
git push origin HEAD
```

Then **automatically** land on **`main`** per Job-Advisor Step 6 (merge feature branch → `main` → `git push origin main`, or PR + auto-merge when protection requires it).

If git is not available in the environment, tell the user to commit and push manually.
