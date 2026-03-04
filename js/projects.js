/* ==================================================
   FlowBalance | projects.js
   Manages fb_projects in localStorage
   Renders project cards, Quick Add form, Project preview modal
================================================== */

(function () {
  const projectsGrid = document.getElementById("projects");
  const openQuickAdd = document.getElementById("openQuickAdd");
  const quickAddSection = document.getElementById("quick-add");
  const projectForm = document.getElementById("projectForm");
  const cancelQuickAdd = document.getElementById("cancelQuickAdd");

  const projectModal = document.getElementById("projectModal");
  const closeModal = document.getElementById("closeModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalTags = document.getElementById("modalTags");
  const modalLive = document.getElementById("modalLive");
  const modalRepo = document.getElementById("modalRepo");

  const navUser = document.getElementById("navUser");

  let projects = JSON.parse(localStorage.getItem("fb_projects")) || [];

  function saveProjects() {
    localStorage.setItem("fb_projects", JSON.stringify(projects));
  }

  function loadProjects() {
    projects = JSON.parse(localStorage.getItem("fb_projects")) || [];
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function showToast(msg, isError = false) {
    if (typeof window.showToast === "function") {
      window.showToast(msg, isError);
    } else {
      alert(msg);
    }
  }

  function createProjectCard(proj) {
    const card = document.createElement("article");
    card.className = "card project-card slide-in";
    card.dataset.id = proj.id;

    const publishedBadge = proj.liveUrl ? `<span class="badge published">Published</span>` : `<span class="badge draft">Draft</span>`;
    const tagsHtml = (proj.tags || []).slice(0, 4).map(t => `<span class="tag">${escapeHtml(String(t).trim())}</span>`).join(" ");

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

    card.querySelector(".preview-btn").addEventListener("click", () => openProjectModal(proj.id));

    const openLiveBtn = card.querySelector(".open-live-btn");
    openLiveBtn.addEventListener("click", () => {
      if (proj.liveUrl) {
        window.open(proj.liveUrl, "_blank");
      } else if (proj.repoUrl) {
        window.open(proj.repoUrl, "_blank");
      } else {
        showToast("No live/repo URL available for this project.", true);
      }
    });

    card.querySelector(".delete-proj-btn").addEventListener("click", () => {
      if (confirm(`Delete project "${proj.title}"? This cannot be undone.`)) {
        projects = projects.filter(p => p.id !== proj.id);
        saveProjects();
        renderProjectsGrid();
        showToast("Project deleted.");
      }
    });

    return card;
  }

  function renderProjectsGrid() {
    if (!projectsGrid) return;
    projectsGrid.innerHTML = "";

    if (projects.length === 0) {
      const empty = document.createElement("div");
      empty.className = "card empty-state";
      empty.innerHTML = `<p class="muted">No projects yet. Click "Add Project" to create your portfolio entries.</p>`;
      projectsGrid.appendChild(empty);
      return;
    }

    projects.forEach(proj => {
      projectsGrid.appendChild(createProjectCard(proj));
    });
  }

  function showQuickAdd() {
    if (quickAddSection) {
      quickAddSection.classList.remove("hidden");
      quickAddSection.classList.add("fade-in");
    }
  }

  function hideQuickAdd() {
    if (quickAddSection) quickAddSection.classList.add("hidden");
  }

  if (openQuickAdd) openQuickAdd.addEventListener("click", showQuickAdd);
  if (cancelQuickAdd) cancelQuickAdd.addEventListener("click", hideQuickAdd);

  if (projectForm) {
    projectForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
      try {
        const title = document.getElementById("projTitle").value.trim();
        const description = document.getElementById("projDesc").value.trim();
        const tagsRaw = document.getElementById("projTags").value.trim();
        const liveUrl = document.getElementById("projUrl").value.trim();
        const repoUrl = document.getElementById("projRepo").value.trim();

        if (!title || !description) throw new Error("Title and description are required.");

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

        projects.unshift(newProj);
        saveProjects();
        renderProjectsGrid();
        projectForm.reset();
        hideQuickAdd();
        showToast("Project added ✔️");
      } catch (err) {
        console.error("Project Add Error:", err);
        showToast(err.message || "Failed to add project", true);
      }
    });
  }

  function openProjectModal(id) {
    const proj = projects.find(p => p.id === id);
    if (!proj || !projectModal) return;

    modalTitle.textContent = proj.title;
    modalDesc.textContent = proj.description;
    modalTags.textContent = `Tags: ${(proj.tags || []).join(", ") || "—"}`;
    modalLive.href = proj.liveUrl || "#";
    modalRepo.href = proj.repoUrl || "#";
    modalLive.style.display = proj.liveUrl ? "inline-block" : "none";
    modalRepo.style.display = proj.repoUrl ? "inline-block" : "none";
    projectModal.classList.remove("hidden");
  }

  if (closeModal) closeModal.addEventListener("click", () => projectModal.classList.add("hidden"));
  if (projectModal) projectModal.addEventListener("click", (e) => { if (e.target === projectModal) projectModal.classList.add("hidden"); });

  function initNavUser() {
    const savedName = localStorage.getItem("fb_username") || "You";
    if (navUser) navUser.textContent = savedName;
  }

  function init() {
    loadProjects();
    renderProjectsGrid();
    initNavUser();
  }

  init();

  window.FB = window.FB || {};
  window.FB.projects = projects;
  window.FB.reloadProjects = function () {
    loadProjects();
    renderProjectsGrid();
  };
})();
