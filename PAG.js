// Example dashboard data structure
let dashboard_json = {
  sessions_detail: [
    {
      name: "GI CANCER",
      hall: "AL RAS 2",
      capacity: 500,
      total_registrations: 645,
      unique: 381,
      categories: {
        "Oncology Specialist": 59,
        "Head & Neck Oncologist": 3,
        "Physician": 132,
        "Dietician": 7,
        "Pediatric Specialist": 3,
        "Anesthesiologist": 7,
        "Surgical Oncologist": 11,
        "Surgical Specialist": 1,
        "General Surgeon": 60,
        "Urologist": 9,
        "Radiology Specialist": 25,
        "Nurses": 131,
        "Oncology Nurses": 7,
        "Others & Allied Hcp": 92,
        "Academia": 97
      }
    },
    // Add other sessions here
  ]
};

// Create dashboard HTML from JSON
function buildDashboard() {
  const dashboard = document.getElementById("dashboard");
  dashboard.innerHTML = '';
  dashboard_json.sessions_detail.forEach(session => {
    const sessionDiv = document.createElement('div');
    sessionDiv.className = 'session';
    let html = `<h3>${session.name}</h3>
                <div class="hall-name"><strong>Hall: ${session.hall}</strong></div>
                <p>Capacity: ${session.capacity} | Total Registrations: ${session.total_registrations}</p>
                <p>UNIQUE: ${session.unique}</p>`;
    Object.keys(session.categories).forEach(cat => {
      html += `<div class="category-label">${cat}</div>
               <div class="bar-container">
                 <div class="bar" style="width:${session.categories[cat]}%">${session.categories[cat]}</div>
               </div>`;
    });
    sessionDiv.innerHTML = html;
    dashboard.appendChild(sessionDiv);
  });
}

// Build edit form
function buildForm() {
  const formContainer = document.getElementById('editFormContainer');
  formContainer.innerHTML = '';
  dashboard_json.sessions_detail.forEach((session, sIndex) => {
    const sessionDiv = document.createElement('div');
    sessionDiv.style.marginBottom = '20px';
    sessionDiv.innerHTML = `<h3>${session.name}</h3>`;
    Object.keys(session.categories).forEach(category => {
      const value = session.categories[category];
      const field = document.createElement('div');
      field.innerHTML = `
        <label>${category}:</label>
        <input type="number" data-session="${sIndex}" data-category="${category}" value="${value}" style="width:80px">
      `;
      sessionDiv.appendChild(field);
    });
    formContainer.appendChild(sessionDiv);
  });
}

// Edit and Save buttons
document.addEventListener('DOMContentLoaded', () => {
  buildDashboard();
  const editBtn = document.getElementById('editBtn');
  const saveBtn = document.getElementById('saveBtn');
  const formContainer = document.getElementById('editFormContainer');

  editBtn.addEventListener('click', () => {
    buildForm();
    formContainer.style.display = 'block';
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
  });

  saveBtn.addEventListener('click', () => {
    formContainer.querySelectorAll('input').forEach(input => {
      const sessionIndex = input.dataset.session;
      const category = input.dataset.category;
      const val = parseFloat(input.value) || 0;
      dashboard_json.sessions_detail[sessionIndex].categories[category] = val;
    });
    buildDashboard();
    formContainer.style.display = 'none';
    saveBtn.style.display = 'none';
    editBtn.style.display = 'inline-block';
    alert("Dashboard updated!");
  });
});

// Back button
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "index.html";
});
