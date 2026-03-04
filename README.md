# 🌑 FlowBalance — Productivity + Portfolio Dashboard  
**Tech Dark Dashboard | Hybrid Layout | JS + LocalStorage + Chart.js**

FlowBalance is a modern, dark-mode productivity dashboard that unifies **project management**, **task tracking**, **finance monitoring**, and **personal preferences** into a single SaaS-style web application.  
Designed with a **tech dark theme, neon accents, glass cards, and a hybrid layout**, the app behaves like a real productivity platform—not a typical student assignment.

This project demonstrates complete practical coverage of **JavaScript, DOM manipulation, JSON, charting, form handling, error handling, ES6+ features, and web storage**, making it a strong portfolio showcase.

---

## 🚀 Features

### 🔹 **Project Management (Portfolio Module)**
- Add, preview, delete, and showcase projects  
- Tags, descriptions, repo links, live demo links  
- Project preview modal with clean UI  
- Analytics: total, published, unpublished  
- Fully persistent via `localStorage (fb_projects)`

---

### 🔹 **Task Manager**
- Add, update, delete tasks  
- Priority support (High/Medium/Low)  
- Task completion + filtering  
- Pomodoro Timer (start/pause/reset)  
- Progress analytics  
- Stored in `localStorage (fb_tasks)`

---

### 🔹 **Finance Tracker**
- Add expenses with name, amount, category  
- Total spend, category summaries  
- Clean fintech-style UI  
- Chart.js visualizations  
- Stored in `localStorage (fb_expenses)`

---

### 🔹 **Landing Page**
- Username setup + greeting persisted  
- Motivational quote fetched from JSON  
- Glass-morphism hero section  
- Smooth neon-accent animations  

---

### 🔹 **Settings Module**
- Update username  
- Dark mode toggle  
- Clear/reset data  
- Preference persistence

---

### 🔹 **Analytics & Visualization**
- Chart.js bar charts  
- Dashboard KPI cards  
- Task progress stats  
- Finance summaries  

---

## 🧩 Architecture & Tech Highlights

### **Frontend Stack**
- **HTML5**  
- **CSS3** (custom dark UI system + neon accents + glass blur)  
- **JavaScript (ES6+)**  
- **Chart.js**  
- **JSON (mock API)**  

### **Data Persistence**
- All app modules use `localStorage` for state management  
- Data keys:
  - `fb_projects`
  - `fb_tasks`
  - `fb_expenses`
  - `fb_theme`
  - `fb_username`

### **Project Structure**
