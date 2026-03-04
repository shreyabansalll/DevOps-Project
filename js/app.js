/* ==================================================
   FlowBalance | app.js
   Global Initialisation Script
   Practicals Covered: 1, 3, 7, 9
================================================== */

/* ---------------------------
   ENVIRONMENT INFO (Practical 1)
--------------------------- */
console.log("FlowBalance App Initialised.");
console.log("User Agent:", navigator.userAgent);
console.log("Platform:", navigator.platform);

console.table([
  { Task: "External JS Loaded", Status: "Success" },
  { Task: "Environment Check", Status: "Completed" }
]);

console.trace("App.js Execution Trace");


/* ---------------------------
   GREETING & USERNAME HANDLING
   (Supports index.html internal script)
--------------------------- */
(function loadUserGreeting() {
  const savedName = localStorage.getItem("fb_username");
  if (savedName) {
    console.log(`Welcome back, ${savedName}!`);
  }
})();


/* ---------------------------
   GLOBAL NAVIGATION HANDLER
--------------------------- */
function navigateTo(page) {
  window.location.href = page;
}


/* ---------------------------
   GLOBAL STORAGE CHECK
--------------------------- */
function checkStorageHealth() {
  console.log("Storage Check:");
  console.table({
    tasks: localStorage.getItem("fb_tasks") ? "Exists" : "Missing",
    expenses: localStorage.getItem("fb_expenses") ? "Exists" : "Missing",
    theme: localStorage.getItem("fb_theme") || "Not Set"
  });
}
checkStorageHealth();


/* ---------------------------
   OPTIONAL: GLOBAL EVENT (DEMO)
--------------------------- */
// Example of a global click listener (DOM Event usage)
document.addEventListener("click", () => {
  // Debug log for demonstration
  // console.log("User interacted with the page.");
});
