/* ==================================================
   FlowBalance | auth.js
   Login & Registration • JWT Storage • Redirect
================================================== */

(function () {
  const API_BASE = window.FlowBalance?.apiBase || "http://localhost:8000/api";

  const tabLogin = document.getElementById("tabLogin");
  const tabRegister = document.getElementById("tabRegister");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const authError = document.getElementById("authError");
  const loginSubmit = document.getElementById("loginSubmit");
  const registerSubmit = document.getElementById("registerSubmit");

  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");
  const registerName = document.getElementById("registerName");
  const registerEmail = document.getElementById("registerEmail");
  const registerPassword = document.getElementById("registerPassword");
  const registerPasswordConfirm = document.getElementById("registerPasswordConfirm");

  /* ---------------------------
     Check: already logged in?
  --------------------------- */
  function checkAuth() {
    const token = localStorage.getItem("fb_token");
    if (token) {
      window.location.href = "dashboard.html";
    }
  }

  /* ---------------------------
     Toggle Login / Register
  --------------------------- */
  function showLogin() {
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    hideError();
    loginForm.reset();
    registerForm.reset();
  }

  function showRegister() {
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    hideError();
    loginForm.reset();
    registerForm.reset();
  }

  /* ---------------------------
     Error display
  --------------------------- */
  function showError(msg) {
    authError.textContent = msg;
    authError.classList.remove("hidden");
    authError.setAttribute("role", "alert");
  }

  function hideError() {
    authError.textContent = "";
    authError.classList.add("hidden");
  }

  /* ---------------------------
     Form validation
  --------------------------- */
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");
  }

  function validateLogin() {
    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!email) {
      showError("Please enter your email.");
      return false;
    }
    if (!validateEmail(email)) {
      showError("Please enter a valid email address.");
      return false;
    }
    if (!password) {
      showError("Please enter your password.");
      return false;
    }
    if (password.length < 6) {
      showError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  }

  function validateRegister() {
    const name = registerName.value.trim();
    const email = registerEmail.value.trim();
    const password = registerPassword.value;
    const confirm = registerPasswordConfirm.value;

    if (!name) {
      showError("Please enter your name.");
      return false;
    }
    if (!email) {
      showError("Please enter your email.");
      return false;
    }
    if (!validateEmail(email)) {
      showError("Please enter a valid email address.");
      return false;
    }
    if (!password) {
      showError("Please enter a password.");
      return false;
    }
    if (password.length < 6) {
      showError("Password must be at least 6 characters.");
      return false;
    }
    if (password !== confirm) {
      showError("Passwords do not match.");
      return false;
    }
    return true;
  }

  /* ---------------------------
     API: Login
  --------------------------- */
  function setLoading(btn, loading) {
    if (!btn) return;
    btn.disabled = loading;
    btn.textContent = loading ? "Please wait..." : (btn.id === "loginSubmit" ? "Log in" : "Create account");
  }

  async function handleLogin(e) {
    e.preventDefault();
    hideError();

    if (!validateLogin()) return;

    setLoading(loginSubmit, true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail.value.trim(),
          password: loginPassword.value,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        showError(data.message || "Login failed. Please try again.");
        return;
      }

      if (data.success && data.data?.token) {
        localStorage.setItem("fb_token", data.data.token);
        localStorage.setItem("fb_username", data.data.name || "You");
        window.location.href = "dashboard.html";
      } else {
        showError("Login failed. Invalid response.");
      }
    } catch (err) {
      console.error("Login error:", err);
      showError("Network error. Is the server running at " + API_BASE + "?");
    } finally {
      setLoading(loginSubmit, false);
    }
  }

  /* ---------------------------
     API: Register
  --------------------------- */
  async function handleRegister(e) {
    e.preventDefault();
    hideError();

    if (!validateRegister()) return;

    setLoading(registerSubmit, true);

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerName.value.trim(),
          email: registerEmail.value.trim(),
          password: registerPassword.value,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        showError(data.message || "Registration failed. Please try again.");
        return;
      }

      if (data.success && data.data?.token) {
        localStorage.setItem("fb_token", data.data.token);
        localStorage.setItem("fb_username", data.data.name || "You");
        window.location.href = "dashboard.html";
      } else {
        showError("Registration failed. Invalid response.");
      }
    } catch (err) {
      console.error("Register error:", err);
      showError("Network error. Is the server running at " + API_BASE + "?");
    } finally {
      setLoading(registerSubmit, false);
    }
  }

  /* ---------------------------
     Init
  --------------------------- */
  checkAuth();

  tabLogin.addEventListener("click", showLogin);
  tabRegister.addEventListener("click", showRegister);
  loginForm.addEventListener("submit", handleLogin);
  registerForm.addEventListener("submit", handleRegister);
})();
