---
name: Job Advisor Enhancements (Revised)
overview: Agent git publish step and per-run job-fit dashboard HTML aligned with index.html. Serverless Cloud Agent launch deferred—not in scope for current testing on GitHub Pages.
todos:
  - id: agent-step5-git
    content: Add Step 5 (git add/commit/push job-advisor-web) to Job-Advisor-for-Job-Seekers.md
    status: completed
  - id: per-run-dashboard
    content: Define runs/<slug>/ dashboard.html + template; align with index.html theme
    status: completed
isProject: false
---

# Job Advisor Enhancements (Revised)

**Out of scope for this revision:** Serverless `POST /api/launch-job-advisor`, Cursor Cloud Agents API from the Apply form, and any client-exposed API keys. Revisit when moving beyond GitHub Pages static testing.

---

## 1) Agent doc: Final step — write outputs + git add / commit / push

**File:** [.cursor/agents/Job-Advisor-for-Job-Seekers.md](.cursor/agents/Job-Advisor-for-Job-Seekers.md)

Add a **final mandatory section** after existing steps (e.g. after Step 4 / `job-fit-dashboard.json`), titled **Step 5: Persist and publish to GitHub**:

- From the **workspace root** (repo root), run:
  - `git add job-advisor-web/`
  - `git commit -m "job-advisor: <company> <short-date> — report and dashboards"` (or a descriptive message including company and role slug)
  - `git push origin <current-branch>` — do not wait for PR or CI
- Applies whenever the agent completes the Job Advisor workflow, **whether** the run is local Cursor or a cloud agent with shell + git credentials.
- If `git` fails (no remote, auth failure, detached HEAD), report the error clearly and list which files under `job-advisor-web/` the user should commit manually.

**Optional:** One-line mirror in [job-advisor-web/AGENT_INSTRUCTIONS.md](job-advisor-web/AGENT_INSTRUCTIONS.md) for the `request.json` handoff workflow.

---

## 2) Per-run job-fit dashboard HTML (aligned with index.html)

**Goal:** Each completed run produces a **standalone HTML file** that matches the ServiceNow-style dashboard in [job-advisor-web/index.html](job-advisor-web/index.html) (score hero, Chart.js charts, tabs, CSS variables / theme) and includes **links** to the markdown artifacts for that run (company research + job match / combined report).

**Conventions:**

- **Latest for main index:** Keep `job-advisor-web/report.md` as today so [index.html](job-advisor-web/index.html) + `getReportUrl()` / GitHub Pages `report.md` behavior stays unchanged.
- **Per-run layout** (example):
  - `job-advisor-web/runs/<slug>/dashboard.html`
  - Optional sibling `job-advisor-web/runs/<slug>/job-fit.json` (same shape as `job-fit-dashboard.json` for that run)
  - **Slug:** e.g. `2025-03-20-moveworks-sse` from date + company + role short token.

**Implementation approach:**

1. **Shared presentation:** Extract or duplicate the dashboard **CSS** and **Chart.js + renderDashboard-equivalent logic** so `runs/.../dashboard.html` does not drift from `index.html`. Options: shared `job-advisor-web/dashboard-shared.css` + small `dashboard-app.js`, or a documented HTML template the agent copies and fills.
2. **Data:** Embed JSON in-page (`<script type="application/json" id="dash-data">`) or load `job-fit.json` next to the HTML (works on GitHub Pages same-origin).
3. **Agent steps:** After writing `report.md`, `job-fit-dashboard.json`, and any `*-Company-Research-Report.md` files, **generate** `runs/<slug>/dashboard.html` (and optional JSON) from the same structured data; add footer/header links to relative paths for `.md` files (e.g. `../../Moveworks-Company-Research-Report.md`, `../../report.md` or run-specific match file if split).
4. **Step 5** includes `git add` for new `runs/<slug>/` paths.

**Files likely touched:** [Job-Advisor-for-Job-Seekers.md](.cursor/agents/Job-Advisor-for-Job-Seekers.md), [index.html](job-advisor-web/index.html) (optional refactor for shared assets), new template or assets under `job-advisor-web/`.

---

## Deferred (not in this revision)

- Apply form: removing misleading submit / wiring **secure** Cloud Agent launch via serverless proxy and `CURSOR_API_KEY`.
- `.env.example` and deployment docs for Cursor API.
- CORS and rate limiting for a public launch endpoint.

When you are ready to implement those, treat them as a **separate** follow-up plan.

---

## Implementation order

1. Update **Job-Advisor-for-Job-Seekers.md** with Step 5 (git) and per-run file naming + `runs/<slug>/dashboard.html` generation instructions.
2. Add **template / shared assets** for per-run dashboard parity with **index.html**.
3. Optionally update **AGENT_INSTRUCTIONS.md** and **README.md** with the new artifacts and slug rules.
