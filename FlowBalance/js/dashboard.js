/* ==================================================
   FlowBalance | dashboard.js (Project-first Dashboard)
   - Manages fb_projects in localStorage
   - Renders project cards
   - Quick Add form handling
   - Project preview modal
   - Analytics counters and Chart (Chart.js)
   Practicals covered: 5, 7, 9, 10, (3,4)
================================================== */

(function () {
  // DOM Elements
  const projectsGrid = document.getElementById("projects");
  const openQuickAdd = document.getElementById("openQuickAdd");
  const quickAddSection = document.getElementById("quick-add");
  const projectForm = document.getElementById("projectForm");
  const cancelQuickAdd = document.getElementById("cancelQuickAdd");

  const statTotalProjects = document.getElementById("statTotalProjects");
  const statPublished = document.getElementById("statPublished");
  const statUnpublished = document.getElementById("statUnpublished");

  const projectModal = document.getElementById("projectModal");
  const closeModal = document.getElementById("closeModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalTags = document.getElementById("modalTags");
  const modalLive = document.getElementById("modalLive");
  const modalRepo = document.getElementById("modalRepo");

  const navUser = document.getElementById("navUser");
  const quoteCompact = document.getElementById("quoteCompact");

  // Chart related
  const chartCanvas = document.getElementById("summaryChart");
  let projectChart = null;

  // Projects array (load from localStorage)
  let projects = JSON.parse(localStorage.getItem("fb_projects")) || [];

  /* ---------------------------
     UTIL: Save & Load
  --------------------------- */
  function saveProjects() {
    localStorage.setItem("fb_projects", JSON.stringify(projects));
  }

  function loadProjects() {
    projects = JSON.parse(localStorage.getItem("fb_projects")) || [];
  }

  /* ---------------------------
     RENDER: Project Card
  --------------------------- */
  function createProjectCard(proj) {
    const card = document.createElement("article");
    card.className = "card project-card slide-in";
    card.dataset.id = proj.id;

    const publishedBadge = proj.liveUrl ? `<span class="badge published">Published</span>` : `<span class="badge draft">Draft</span>`;
    const tagsHtml = (proj.tags || []).slice(0, 4).map(t => `<span class="tag">${t.trim()}</span>`).join(" ");

    card.innerHTML = `
      <div class="card-head">
        <h3 class="proj-title">${escapeHtml(proj.title)}</h3>
        ${publishedBadge}
      </div>

      <p class="proj-desc">${escapeHtml(proj.description)}</p>

      <div class="proj-meta">
        <div class="proj-tags">${tagsHtml}</div>
        <div class="proj-actions">
          <button class="secondary-btn small-btn preview-btn">Preview</button>
          <button class="secondary-btn small-btn open-live-btn">Open</button>
          <button class="danger-btn small-btn delete-proj-btn">Delete</button>
        </div>
      </div>
    `;

    // Event: Preview
    card.querySelector(".preview-btn").addEventListener("click", () => openProjectModal(proj.id));

    // Event: Open Live (if URL exists)
    const openLiveBtn = card.querySelector(".open-live-btn");
    openLiveBtn.addEventListener("click", () => {
      if (proj.liveUrl) {
        window.open(proj.liveUrl, "_blank");
      } else {
        // If no live URL, open repo if available
        if (proj.repoUrl) window.open(proj.repoUrl, "_blank");
        else showToast("No live/repo URL available for this project.", true);
      }
    });

    // Event: Delete
    card.querySelector(".delete-proj-btn").addEventListener("click", () => {
      if (confirm(`Delete project "${proj.title}"? This cannot be undone.`)) {
        projects = projects.filter(p => p.id !== proj.id);
        saveProjects();
        renderProjectsGrid();
        updateAnalytics();
        updateChart();
      }
    });

    return card;
  }

  /* ---------------------------
     RENDER: Grid
  --------------------------- */
  function renderProjectsGrid() {
    projectsGrid.innerHTML = "";

    if (projects.length === 0) {
      const empty = document.createElement("div");
      empty.className = "card";
      empty.innerHTML = `<p>No projects yet. Click "Add Project" to create your portfolio entries.</p>`;
      projectsGrid.appendChild(empty);
      return;
    }

    // Create cards
    projects.forEach(proj => {
      const card = createProjectCard(proj);
      projectsGrid.appendChild(card);
    });
  }

  /* ---------------------------
     ANALYTICS
  --------------------------- */
  function updateAnalytics() {
    const total = projects.length;
    const published = projects.filter(p => p.liveUrl && p.liveUrl.trim().length > 0).length;
    const unpublished = total - published;

    statTotalProjects.textContent = total;
    statPublished.textContent = published;
    statUnpublished.textContent = unpublished;
  }

  /* ---------------------------
     CHART (Project counts)
  --------------------------- */
  function updateChart() {
    if (!chartCanvas) return;

    const total = projects.length;
    const published = projects.filter(p => p.liveUrl && p.liveUrl.trim().length > 0).length;
    const unpublished = total - published;

    const labels = ["Total", "Published", "Unpublished"];
    const data = [total, published, unpublished];

    // destroy existing chart
    if (projectChart) projectChart.destroy();

    projectChart = new Chart(chartCanvas, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Projects",
          data,
          backgroundColor: ["#4b73ff", "#4caf50", "#f39c12"]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  /* ---------------------------
     QUICK ADD Toggle
  --------------------------- */
  function showQuickAdd() {
    quickAddSection.classList.remove("hidden");
    quickAddSection.classList.add("fade-in");
  }

  function hideQuickAdd() {
    quickAddSection.classList.add("hidden");
  }

  openQuickAdd.addEventListener("click", () => showQuickAdd());
  cancelQuickAdd.addEventListener("click", () => hideQuickAdd());

  /* ---------------------------
     FORM: Add Project
  --------------------------- */
  projectForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    try {
      const title = document.getElementById("projTitle").value.trim();
      const description = document.getElementById("projDesc").value.trim();
      const tagsRaw = document.getElementById("projTags").value.trim();
      const liveUrl = document.getElementById("projUrl").value.trim();
      const repoUrl = document.getElementById("projRepo").value.trim();

      if (!title || !description) throw new Error("Title and description are required.");

      // sanitize tags into array
      const tags = tagsRaw ? tagsRaw.split(",").map(t => t.trim()).filter(Boolean) : [];

      const newProj = {
        id: Date.now(),
        title,
        description,
        tags,
        liveUrl,
        repoUrl,
        createdAt: new Date().toISOString()
      };

      projects.unshift(newProj); // newest first
      saveProjects();
      renderProjectsGrid();
      updateAnalytics();
      updateChart();
      projectForm.reset();
      hideQuickAdd();
      showToast("Project added ✔️");

    } catch (err) {
      console.error("Project Add Error:", err);
      showToast(err.message || "Failed to add project", true);
    }
  });

  /* ---------------------------
     MODAL: Open / Close
  --------------------------- */
  function openProjectModal(id) {
    const proj = projects.find(p => p.id === id);
    if (!proj) return;

    modalTitle.textContent = proj.title;
    modalDesc.textContent = proj.description;
    modalTags.textContent = `Tags: ${(proj.tags || []).join(", ") || "—"}`;

    if (proj.liveUrl) {
      modalLive.href = proj.liveUrl;
      modalLive.style.display = "inline-block";
    } else {
      modalLive.style.display = "none";
    }

    if (proj.repoUrl) {
      modalRepo.href = proj.repoUrl;
      modalRepo.style.display = "inline-block";
    } else {
      modalRepo.style.display = "none";
    }

    projectModal.classList.remove("hidden");
  }

  closeModal.addEventListener("click", () => {
    projectModal.classList.add("hidden");
  });

  // close modal on outside click
  projectModal.addEventListener("click", (e) => {
    if (e.target === projectModal) projectModal.classList.add("hidden");
  });

  /* ---------------------------
     SMALL HELPERS
  --------------------------- */
  // Basic XSS escape for inserted text
  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // showToast from utils.js if available, otherwise fallback
  function showToast(msg, isError = false) {
    if (typeof window.showToast === "function") {
      window.showToast(msg, isError);
    } else {
      alert(msg);
    }
  }

  /* ---------------------------
     NAV: Username & Quote
  --------------------------- */
  function initNavUser() {
    const savedName = localStorage.getItem("fb_username") || "You";
    if (navUser) navUser.textContent = savedName;
  }

  async function loadCompactQuote() {
    // try utils.getRandomQuote if exists, otherwise try api's loadMotivationalQuote
    try {
      if (typeof getRandomQuote === "function") {
        const q = await getRandomQuote();
        if (quoteCompact) quoteCompact.textContent = `"${q}"`;
      } else {
        // If api.js is loaded it uses quoteBox; we instead show a simple line
        if (quoteCompact) quoteCompact.textContent = "Stay focused. Ship code.";
      }
    } catch (err) {
      if (quoteCompact) quoteCompact.textContent = "Stay focused. Ship code.";
    }
  }

  /* ---------------------------
     INIT: Render initial state
  --------------------------- */
  function init() {
    loadProjects();
    renderProjectsGrid();
    updateAnalytics();
    updateChart();
    initNavUser();
    loadCompactQuote();
  }

  // run
  init();

  /* ---------------------------
     Expose for debugging (optional)
  --------------------------- */
  window.FB = window.FB || {};
  window.FB.projects = projects;
  window.FB.reloadProjects = function () {
    loadProjects();
    renderProjectsGrid();
    updateAnalytics();
    updateChart();
  };

})();
