/**
 * Renders the ServiceNow-style dashboard from job-fit JSON (same shape as job-fit-dashboard.json).
 * Used by per-run pages under job-advisor-web/runs/<slug>/dashboard.html
 */
(function (global) {
  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  /** Inline **bold** after escaping other text. */
  function formatInlineBold(text) {
    if (!text) return '';
    const segments = String(text).split(/\*\*/);
    let html = '';
    for (let i = 0; i < segments.length; i++) {
      html += (i % 2 === 0) ? escapeHtml(segments[i]) : '<strong>' + escapeHtml(segments[i]) + '</strong>';
    }
    return html;
  }

  /**
   * Subset markdown for company research executive summaries: ##, ###, - lists, **bold**, paragraphs.
   */
  function simpleMarkdownToHtml(md) {
    md = String(md || '').replace(/\r\n/g, '\n');
    const lines = md.split('\n');
    const out = [];
    let i = 0;
    let inUl = false;
    function closeUl() {
      if (inUl) {
        out.push('</ul>');
        inUl = false;
      }
    }
    while (i < lines.length) {
      const t = lines[i].trim();
      if (!t) {
        closeUl();
        i++;
        continue;
      }
      if (t.startsWith('## ')) {
        closeUl();
        out.push('<h2>' + formatInlineBold(t.slice(3)) + '</h2>');
        i++;
        continue;
      }
      if (t.startsWith('### ')) {
        closeUl();
        out.push('<h3>' + formatInlineBold(t.slice(4)) + '</h3>');
        i++;
        continue;
      }
      if (t.startsWith('- ')) {
        if (!inUl) {
          out.push('<ul>');
          inUl = true;
        }
        out.push('<li>' + formatInlineBold(t.slice(2)) + '</li>');
        i++;
        continue;
      }
      closeUl();
      const paraLines = [t];
      i++;
      while (i < lines.length) {
        const nt = lines[i].trim();
        if (!nt) break;
        if (nt.startsWith('##') || nt.startsWith('###') || nt.startsWith('- ')) break;
        paraLines.push(nt);
        i++;
      }
      out.push('<p>' + formatInlineBold(paraLines.join(' ')) + '</p>');
    }
    closeUl();
    return out.join('\n');
  }

  function renderFromJson(data) {
    if (!data || !data.overallMatch) return false;
    const score = data.overallMatch.score ?? 0;
    const summary = data.overallMatch.summary || '';
    const dims = (data.granularScores || []).map(function (g) {
      return { name: g.dimension || g.name || '—', score: g.score, rationale: g.rationale || '' };
    });

    const scoreCircle = document.getElementById('scoreCircle');
    const scoreValue = document.getElementById('scoreValue');
    const summaryText = document.getElementById('summaryText');
    if (scoreCircle) scoreCircle.style.setProperty('--score', String(score));
    if (scoreValue) scoreValue.textContent = score;
    if (summaryText) summaryText.textContent = summary || 'No summary available.';

    try {
      if (global.radarChart && typeof global.radarChart.destroy === 'function') {
        global.radarChart.destroy();
        global.radarChart = null;
      }
    } catch (_) { global.radarChart = null; }
    try {
      if (global.barChart && typeof global.barChart.destroy === 'function') {
        global.barChart.destroy();
        global.barChart = null;
      }
    } catch (_) { global.barChart = null; }

    if (dims.length > 0 && typeof Chart !== 'undefined') {
      const radarEl = document.getElementById('radarChart');
      const barEl = document.getElementById('barChart');
      if (radarEl) {
        global.radarChart = new Chart(radarEl.getContext('2d'), {
          type: 'radar',
          data: {
            labels: dims.map(function (d) { return d.name; }),
            datasets: [{
              label: 'Score',
              data: dims.map(function (d) { return d.score; }),
              fill: true,
              backgroundColor: 'rgba(13, 148, 136, 0.2)',
              borderColor: '#0d9488',
              borderWidth: 2,
              pointBackgroundColor: '#0d9488',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: '#0d9488'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: { left: 10, right: 10, top: 10, bottom: 10 } },
            scales: {
              r: {
                min: 0,
                max: 100,
                ticks: { stepSize: 25, font: { size: 10 } },
                pointLabels: { font: { size: 10 } }
              }
            },
            plugins: { legend: { display: false } }
          }
        });
      }
      if (barEl) {
        global.barChart = new Chart(barEl.getContext('2d'), {
          type: 'bar',
          data: {
            labels: dims.map(function (d) { return d.name; }),
            datasets: [{
              label: 'Score',
              data: dims.map(function (d) { return d.score; }),
              backgroundColor: dims.map(function (d) {
                return d.score >= 85 ? 'rgba(13, 148, 136, 0.7)' :
                  d.score >= 75 ? 'rgba(13, 148, 136, 0.5)' : 'rgba(124, 58, 237, 0.7)';
              }),
              borderColor: dims.map(function (d) {
                return d.score >= 85 ? '#0d9488' : d.score >= 75 ? '#0d9488' : '#7c3aed';
              }),
              borderWidth: 1
            }]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: { left: 5, right: 10, top: 5, bottom: 5 } },
            scales: {
              x: { min: 0, max: 100 },
              y: { ticks: { font: { size: 10 } } }
            },
            plugins: { legend: { display: false } }
          }
        });
      }
    }

    const execSection = document.getElementById('companyResearchSummarySection');
    const execBody = document.getElementById('companyResearchExecutiveSummary');
    const execMd = data.companyResearch && data.companyResearch.highlights
      ? data.companyResearch.highlights.executiveSummary
      : '';
    if (execSection && execBody) {
      const text = execMd != null ? String(execMd).trim() : '';
      if (text) {
        execBody.innerHTML = simpleMarkdownToHtml(text);
        execSection.hidden = false;
      } else {
        execBody.innerHTML = '';
        execSection.hidden = true;
      }
    }

    const strengths = data.strengths || [];
    const gaps = data.gaps || [];
    const focus = data.interviewPrepFocus || [];
    const actions = data.actionableRecommendations || [];

    const sl = document.getElementById('strengthsList');
    const gl = document.getElementById('gapsList');
    const fl = document.getElementById('focusList');
    const al = document.getElementById('actionsList');

    if (sl) {
      sl.innerHTML = strengths.map(function (s) { return '<li>' + escapeHtml(String(s)) + '</li>'; }).join('') ||
        '<li>No strengths listed.</li>';
    }
    if (gl) {
      gl.innerHTML = gaps.map(function (g) {
        return '<li><div class="gap-item"><strong>' + escapeHtml(g.gap || '') + '</strong><span>' +
          escapeHtml(g.recommendation || '') + '</span></div></li>';
      }).join('') || '<li>No gaps listed.</li>';
    }
    if (fl) {
      fl.innerHTML = focus.map(function (f) { return '<li>' + escapeHtml(String(f)) + '</li>'; }).join('') ||
        '<li>No interview prep focus listed.</li>';
    }
    if (al) {
      al.innerHTML = actions.map(function (a) { return '<li>' + escapeHtml(String(a)) + '</li>'; }).join('') ||
        '<li>No actionable recommendations listed.</li>';
    }

    document.querySelectorAll('.dash-tab').forEach(function (tab) {
      tab.onclick = function () {
        document.querySelectorAll('.dash-tab').forEach(function (t) { t.classList.remove('active'); });
        document.querySelectorAll('.dash-tab-content').forEach(function (c) { c.classList.remove('active'); });
        tab.classList.add('active');
        var id = 'dash-' + tab.dataset.dashTab;
        var el = document.getElementById(id);
        if (el) el.classList.add('active');
      };
    });

    return true;
  }

  /**
   * Loads job-fit data. Tries fetch first (works over http/https). If fetch fails
   * (common when opening dashboard.html via file:// — browsers block local fetch),
   * falls back to <script type="application/json" id="job-fit-embed"> duplicated from job-fit.json.
   */
  async function loadJobFitJson(url) {
    const bust = (url.indexOf('?') >= 0 ? '&' : '?') + 't=' + Date.now();
    try {
      const r = await fetch(url + bust);
      if (!r.ok) throw new Error('Failed to load ' + url);
      return r.json();
    } catch (err) {
      const el = document.getElementById('job-fit-embed');
      if (el && el.textContent.trim()) {
        try {
          return JSON.parse(el.textContent);
        } catch (parseErr) {
          console.warn('job-fit-embed: JSON parse failed', parseErr);
        }
      }
      throw err;
    }
  }

  /**
   * For per-run dashboard.html: call once `dashboardRunApp` exists (after deferred script loads).
   */
  function initRunPage(jobFitUrl) {
    const url = jobFitUrl || './job-fit.json';
    const fail = function (msg) {
      const el = document.getElementById('summaryText');
      if (el) el.textContent = msg || 'Could not load job-fit.json for this run.';
    };
    loadJobFitJson(url).then(function (data) {
      renderFromJson(data);
    }).catch(function () {
      fail('Could not load job-fit.json for this run.');
    });
  }

  global.dashboardRunApp = {
    renderFromJson: renderFromJson,
    loadJobFitJson: loadJobFitJson,
    initRunPage: initRunPage
  };
})(typeof window !== 'undefined' ? window : this);
