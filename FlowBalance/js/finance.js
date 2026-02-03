/* ==================================================
   FlowBalance | finance.js
   Handles: Expense Logic, Calculations, Validation
   Practicals Covered: 2, 3, 4, 5, 7, 8, 9
================================================== */

const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const totalAmount = document.getElementById("totalAmount");

let expenses = JSON.parse(localStorage.getItem("fb_expenses")) || [];

/* ---------------------------
   RENDER EXPENSE LIST (DOM)
--------------------------- */
function renderExpenses() {
  expenseList.innerHTML = "";

  // Higher-order function: reduce() → total
  let total = expenses.reduce((sum, item) => sum + item.amount, 0);

  // Create <li> items dynamically
  expenses.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("slide-in"); // animation class

    li.innerHTML = `
      <span>${item.name} – ₹${item.amount} (${item.category})</span>
      <button class="secondary-btn small-btn delete-btn">Delete</button>
    `;

    // Delete expense
    li.querySelector(".delete-btn").addEventListener("click", () => {
      deleteExpense(item.id);
    });

    expenseList.appendChild(li);
  });

  totalAmount.textContent = `Total: ₹${total}`;
}

/* ---------------------------
   ADD EXPENSE
--------------------------- */
function addExpense(name, amount, category) {
  const expense = {
    id: Date.now(), // unique ID
    name,
    amount,
    category,
  };

  expenses.push(expense);
  saveExpenses();
  renderExpenses();
}

/* ---------------------------
   DELETE EXPENSE
--------------------------- */
function deleteExpense(id) {
  expenses = expenses.filter((item) => item.id !== id);
  saveExpenses();
  renderExpenses();
}

/* ---------------------------
   SAVE TO LOCAL STORAGE
--------------------------- */
function saveExpenses() {
  localStorage.setItem("fb_expenses", JSON.stringify(expenses));
}

/* ---------------------------
   FORM SUBMISSION
--------------------------- */
expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nameInput = document.getElementById("expenseName").value.trim();
  const amountInput = parseFloat(document.getElementById("expenseAmount").value);
  const categoryInput = document.getElementById("expenseCategory").value;

  // Regex validation for name (Practical 6)
  const nameRegex = /^[A-Za-z\s]+$/;

  try {
    if (!nameRegex.test(nameInput)) {
      throw new Error("Expense name should contain letters only.");
    }

    if (isNaN(amountInput) || amountInput <= 0) {
      throw new Error("Amount must be a positive number.");
    }

    // Add expense
    addExpense(nameInput, amountInput, categoryInput);

    // Clear form
    expenseForm.reset();

  } catch (err) {
    alert(err.message);
    console.error("Input Validation Error:", err);
  }
});

// Initial render
renderExpenses();
