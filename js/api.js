/* ==================================================
   FlowBalance | api.js
   Handles: Motivational Quotes (JSON Fetch)
   Practicals Covered: 6, 7, 9, 10
================================================== */

const quoteBox = document.getElementById("quoteBox");
const quoteCompact = document.getElementById("quoteCompact");

/* -------------------------------------------
   LOAD RANDOM MOTIVATIONAL QUOTE
-------------------------------------------- */
async function loadMotivationalQuote() {
  try {
    // Fetching local JSON file (Practical 10)
    const response = await fetch("data/quotes.json");
    const data = await response.json();

    // Pick random quote
    const randomIndex = Math.floor(Math.random() * data.quotes.length);
    const quoteObj = data.quotes[randomIndex];

    const { text, author } = quoteObj;

    // REGEX + STRING CLEANING (Practical 6)
    const cleanText = text.trim().replace(/\s+/g, " ");

    // UPDATE DOM (Practical 7)
    if (quoteBox) {
      quoteBox.innerHTML = `
        <p class="quote-text">"${cleanText}"</p>
        <p class="quote-author">— ${author}</p>
      `;
    }
    if (quoteCompact) {
      quoteCompact.textContent = `"${cleanText}"`;
    }

  } catch (err) {
    console.error("Quote API Error:", err);

    // Fallback quote
    const fallback = "Stay positive, keep moving!";
    if (quoteBox) {
      quoteBox.innerHTML = `
        <p class="quote-text">"${fallback}"</p>
        <p class="quote-author">— FlowBalance</p>
      `;
    }
    if (quoteCompact) quoteCompact.textContent = `"${fallback}"`;
  }
}

/* -------------------------------------------
   AUTO LOAD QUOTE ON PAGE LOAD
-------------------------------------------- */
if (quoteBox || quoteCompact) {
  loadMotivationalQuote();
}
