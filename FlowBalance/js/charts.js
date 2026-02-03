/* ==================================================
   FlowBalance | charts.js
   Handles: Chart Rendering for Dashboard
   Practicals Covered: 5, 7, 9, 10 (BONUS Visualization)
================================================== */

/* --------------------------------------------
   GLOBAL CHART CONTEXT
--------------------------------------------- */
const chartCanvas = document.getElementById("summaryChart");
let summaryChart = null;

/* --------------------------------------------
   GET DATA FROM LOCAL STORAGE
--------------------------------------------- */
let expenses = JSON.parse(localStorage.getItem("fb_expenses")) || [];
let tasks = JSON.parse(localStorage.getItem("fb_tasks")) || [];

/* --------------------------------------------
   PREPARE CHART DATA
--------------------------------------------- */
function getChartData() {
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  return {
    totalExpenses,
    totalTasks,
    completedTasks,
  };
}

/* --------------------------------------------
   CREATE BAR CHART (Chart.js)
--------------------------------------------- */
function renderSummaryChart() {
  if (!chartCanvas) return;

  const { totalExpenses, totalTasks, completedTasks } = getChartData();

  // Destroy previous chart instance (important)
  if (summaryChart !== null) {
    summaryChart.destroy();
  }

  summaryChart = new Chart(chartCanvas, {
    type: "bar",
    data: {
      labels: ["Expenses (₹)", "Tasks", "Completed Tasks"],
      datasets: [
        {
          label: "FlowBalance Stats",
          data: [totalExpenses, totalTasks, completedTasks],
          backgroundColor: ["#4b73ff", "#6a6f7c", "#4caf50"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}

/* --------------------------------------------
   AUTO-LOAD MOCK DATA (JSON)
   Only if no user data exists
--------------------------------------------- */
async function loadMockChartData() {
  if (expenses.length > 0 || tasks.length > 0) {
    renderSummaryChart();
    return;
  }

  try {
    const res = await fetch("js/data.json");
    const data = await res.json();

    expenses = data.expenses;
    tasks = data.tasks;

    localStorage.setItem("fb_expenses", JSON.stringify(expenses));
    localStorage.setItem("fb_tasks", JSON.stringify(tasks));

    renderSummaryChart();

  } catch (err) {
    console.error("Chart JSON Load Error:", err);
  }
}

/* --------------------------------------------
   INIT
--------------------------------------------- */
loadMockChartData();
