/* ==================================================
   FlowBalance | storage.js
   Handles: User Preferences, Theme, Data Persistence
   Practicals Covered: 6, 7, 8, 9
================================================== */

/* ---------------------------
   LOAD SAVED USERNAME
--------------------------- */
const usernameInput = document.getElementById("usernameInput");
const saveNameBtn = document.getElementById("saveNameBtn");

if (usernameInput && saveNameBtn) {
  // Load stored name on page load
  const savedName = localStorage.getItem("fb_username");
  if (savedName) {
    usernameInput.value = savedName;
  }

  // Save name
  saveNameBtn.addEventListener("click", () => {
    let name = usernameInput.value.trim();

    // String validation using Regex (Practical 6)
    const nameRegex = /^[A-Za-z\s]+$/;

    try {
      if (!nameRegex.test(name)) {
        throw new Error("Name must contain letters only.");
      }

      localStorage.setItem("fb_username", name);
      alert("Name saved successfully!");

    } catch (err) {
      console.error("Name Error:", err);
      alert(err.message);
    }
  });
}


/* ---------------------------
   DARK MODE TOGGLE
--------------------------- */
const themeToggle = document.getElementById("themeToggle");

// Apply saved theme on load
const savedTheme = localStorage.getItem("fb_theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  if (themeToggle) themeToggle.checked = true;
}

// Toggle theme using checkbox
if (themeToggle) {
  themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
      document.body.classList.add("dark");
      localStorage.setItem("fb_theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("fb_theme", "light");
    }
  });
}


/* ---------------------------
   RESET ALL DATA
--------------------------- */
const clearDataBtn = document.getElementById("clearDataBtn");

if (clearDataBtn) {
  clearDataBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset all FlowBalance data?")) {
      localStorage.clear();
      sessionStorage.clear();
      alert("All data cleared!");
      location.reload();
    }
  });
}
