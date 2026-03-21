# Per-run job fit dashboards

Each Job Advisor run can produce a **slugged folder** under `job-advisor-web/runs/`:

| Path | Purpose |
|------|---------|
| `runs/<slug>/dashboard.html` | Standalone dashboard (same theme as `index.html` Dashboard tab) |
| `runs/<slug>/job-fit.json` | Same JSON shape as `job-fit-dashboard.json` for that run |

**Slug convention:** `YYYY-MM-DD-<company-short>-<role-short>` (e.g. `2026-03-19-moveworks-sse`).

**Shared assets** (do not duplicate):

- `../dashboard-shared.css` — ServiceNow-style dashboard styles
- `../dashboard-run-app.js` — Renders charts and tabs from `job-fit.json`

**Source links** in each `dashboard.html` should point to the markdown files for that run (company research, match report, `report.md`) using relative paths to `job-advisor-web/`.

After adding or updating a run, include `job-advisor-web/` in git (see Job-Advisor agent Step 5).
