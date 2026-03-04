/* ==================================================
   FlowBalance | api.js
   Handles: Motivational Quotes (JSON Fetch)
   Practicals Covered: 6, 7, 9, 10
================================================== */

const quoteBox = document.getElementById("quoteBox");

/* -------------------------------------------
   LOAD RANDOM MOTIVATIONAL QUOTE
-------------------------------------------- */
async function loadMotivationalQuote() {
  try {
    // Fetching local JSON file (Practical 10)
    const response = await fetch("js/quotes.json");
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

  } catch (err) {
    console.error("Quote API Error:", err);

    // Fallback quote
    if (quoteBox) {
      quoteBox.innerHTML = `
        <p class="quote-text">"Stay positive, keep moving!"</p>
        <p class="quote-author">— FlowBalance</p>
      `;
    }
  }
}

/* -------------------------------------------
   AUTO LOAD QUOTE ON PAGE LOAD
-------------------------------------------- */
if (quoteBox) {
  loadMotivationalQuote();
}
