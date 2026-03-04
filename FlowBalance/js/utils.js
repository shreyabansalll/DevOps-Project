/* ==================================================
   FlowBalance | utils.js
   Reusable Helper Functions for the Entire App
   Practicals Covered: 2, 4, 6, 7
================================================== */

/* ---------------------------
   FORMAT CURRENCY (₹)
--------------------------- */
function formatCurrency(amount = 0) {
  // ES6 default parameter + template literal
  return `₹${amount.toLocaleString()}`;
}


/* ---------------------------
   VALIDATE STRING (Regex)
--------------------------- */
function validateText(input) {
  const regex = /^[A-Za-z0-9\s]+$/;
  return regex.test(input.trim());
}


/* ---------------------------
   CREATE DOM ELEMENT
--------------------------- */
function createElement(tag, className = "", innerHTML = "") {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
}


/* ---------------------------
   SHOW TOAST MESSAGE
   (Reusable small popup)
--------------------------- */
function showToast(message, isError = false) {
  const toast = createElement(
    "div",
    `toast ${isError ? "error" : "success"}`,
    message
  );

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("visible");
  }, 50);

  // Remove toast after animation
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}


/* ---------------------------
   RANDOM MOTIVATIONAL QUOTE
   (Optional enhancement)
--------------------------- */
async function getRandomQuote() {
  try {
    const res = await fetch("js/quotes.json");
    const data = await res.json();

    // Random quote using array length
    const randomIndex = Math.floor(Math.random() * data.quotes.length);
    return data.quotes[randomIndex];

  } catch (err) {
    console.error("Quote Fetch Error:", err);
    return "Stay positive, keep moving!";
  }
}
