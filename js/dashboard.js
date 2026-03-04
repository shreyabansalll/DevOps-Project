/* ==================================================
   FlowBalance | dashboard.js
   Overview: Stats, Recent Projects, Recent Tasks, Expense Chart
================================================== */

(function () {
  const statTotalProjects = document.getElementById("statTotalProjects");
  const statTotalTasks = document.getElementById("statTotalTasks");
  const statCompletedTasks = document.getElementById("statCompletedTasks");
  const statPendingTasks = document.getElementById("statPendingTasks");
  const statMonthlyExpenses = document.getElementById("statMonthlyExpenses");
  const recentProjectsEl = document.getElementById("recentProjects");
  const recentTasksEl = document.getElementById("recentTasks");
  const chartCanvas = document.getElementById("expenseChart");
  const navUser = document.getElementById("navUser");

  let expenseChart = null;

  function getProjects() {
    return JSON.parse(localStorage.getItem("fb_projects")) || [];
  }

  function getTasks() {
    return JSON.parse(localStorage.getItem("fb_tasks")) || [];
  }

  function getExpenses() {
    return JSON.parse(localStorage.getItem("fb_expenses")) || [];
  }

  function getMonthlyExpenses() {
    const expenses = getExpenses();
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    return expenses
      .filter(e => {
        const d = e.createdAt ? new Date(e.createdAt) : new Date();
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      })
      .reduce((sum, e) => sum + (e.amount || 0), 0);
  }

  function getTotalExpenses() {
    const expenses = getExpenses();
    return expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  }

  function updateStats() {
    const projects = getProjects();
    const tasks = getTasks();
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.length - completed;

    const monthlyAmount = getMonthlyExpenses();
    const totalAmount = getTotalExpenses();
    const displayAmount = monthlyAmount > 0 ? monthlyAmount : totalAmount;

    if (statTotalProjects) statTotalProjects.textContent = projects.length;
    if (statTotalTasks) statTotalTasks.textContent = tasks.length;
    if (statCompletedTasks) statCompletedTasks.textContent = completed;
    if (statPendingTasks) statPendingTasks.textContent = pending;
    if (statMonthlyExpenses) statMonthlyExpenses.textContent = `₹${displayAmount.toLocaleString("en-IN")}`;
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderRecentProjects() {
    if (!recentProjectsEl) return;

    const projects = getProjects();
    const recent = projects.slice(0, 5);

    if (recent.length === 0) {
      recentProjectsEl.innerHTML = `<li class="overview-empty muted">No projects yet. <a href="projects.html">Add one</a></li>`;
      return;
    }

    recentProjectsEl.innerHTML = recent
      .map(
        (p) =>
          `<li class="overview-item slide-in">
            <a href="projects.html">${escapeHtml(p.title)}</a>
            <span class="muted">${p.liveUrl ? "Published" : "Draft"}</span>
          </li>`
      )
      .join("");
  }

  function renderRecentTasks() {
    if (!recentTasksEl) return;

    const tasks = getTasks();
    const recent = tasks.slice(0, 5);

    if (recent.length === 0) {
      recentTasksEl.innerHTML = `<li class="overview-empty muted">No tasks yet. <a href="tasks.html">Add one</a></li>`;
      return;
    }

    recentTasksEl.innerHTML = recent
      .map(
        (t) =>
          `<li class="overview-item slide-in">
            <span>${t.completed ? "✅" : "⬜"} ${escapeHtml(t.name)}</span>
            <span class="tag tag-${(t.priority || "Medium").toLowerCase()}">${t.priority || "Medium"}</span>
          </li>`
      )
      .join("");
  }

  function renderExpenseChart() {
    if (!chartCanvas || typeof Chart === "undefined") return;

    const expenses = getExpenses();
    const byCategory = {};

    expenses.forEach((e) => {
      const cat = e.category || "Miscellaneous";
      byCategory[cat] = (byCategory[cat] || 0) + (e.amount || 0);
    });

    const labels = Object.keys(byCategory).length ? Object.keys(byCategory) : ["No expenses"];
    const data = Object.keys(byCategory).length ? Object.values(byCategory) : [0];

    const colors = ["#4b73ff", "#8b6bff", "#4caf50", "#f39c12", "#ff6b6b", "#6ea8ff"];

    if (expenseChart) expenseChart.destroy();

    expenseChart = new Chart(chartCanvas, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: labels.map((_, i) => colors[i % colors.length]),
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "right" }
        }
      }
    });
  }

  function initNavUser() {
    const savedName = localStorage.getItem("fb_username") || "You";
    if (navUser) navUser.textContent = savedName;
  }

  function init() {
    updateStats();
    renderRecentProjects();
    renderRecentTasks();
    renderExpenseChart();
    initNavUser();
  }

  init();

  window.FB = window.FB || {};
  window.FB.refreshDashboard = function () {
    updateStats();
    renderRecentProjects();
    renderRecentTasks();
    renderExpenseChart();
  };
})();
