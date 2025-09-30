// =======================
// --- Elements ---
// =======================
const totalElem = document.getElementById('totalRegistrations');
const prevTotalElem = document.getElementById('prevTotalRegistrations'); 
const abstractElem = document.getElementById('abstractSubmissions');
const countriesElem = document.getElementById('participatingCountries');
const prevCountriesElem = document.getElementById('prevParticipatingCountries');

// Category inputs in the modal
const editDoctors = document.querySelector('#editCategoryTable tbody tr:nth-child(1) input');
const editNurses = document.querySelector('#editCategoryTable tbody tr:nth-child(2) input');
const editAllied = document.querySelector('#editCategoryTable tbody tr:nth-child(3) input');

const dashboardSessionsBody = document.getElementById('dashboardSessionsBody');
const editSessionsBody = document.getElementById('editSessionsBody');

const categoryChartEl = document.getElementById('categoryChart');
const uaeChartEl = document.getElementById('uaeChart');
const regionalChartEl = document.getElementById('regionalChart');

const editModal = document.getElementById('editModal');
const cancelEdit = document.getElementById('cancelEdit');
const saveEdit = document.getElementById('saveEdit');

const editTotal = document.getElementById('editTotal');
const editPrevTotal = document.getElementById('editPrevTotal'); 
const editAbstract = document.getElementById('editAbstract');
const editPrevAbstract = document.getElementById('editPrevAbstract'); 
const editCountries = document.getElementById('editCountries');
const editPrevCountries = document.getElementById('editPrevCountries'); 

const editUAE1 = document.getElementById('editUAE1');
const editUAE2 = document.getElementById('editUAE2');
const editUAE3 = document.getElementById('editUAE3');
const editPrevUAE1 = document.getElementById('editPrevUAE1');
const editPrevUAE2 = document.getElementById('editPrevUAE2');
const editPrevUAE3 = document.getElementById('editPrevUAE3');

const editRegional = document.getElementById('editRegional');
const editAPAC = document.getElementById('editAPAC');
const editInternational = document.getElementById('editInternational');
const editPrevRegional = document.getElementById('editPrevRegional');
const editPrevAPAC = document.getElementById('editPrevAPAC');
const editPrevInternational = document.getElementById('editPrevInternational');

// Floating menu elements
const menuBtn = document.getElementById('menuBtn');
const menuOptions = document.getElementById('menuOptions');
const editBtnOverlay = document.getElementById('editBtnOverlay');

// =======================
// --- Floating Menu ---
// =======================
menuBtn?.addEventListener('click', () => {
  menuOptions.classList.toggle('hidden');
});

// Close menu if clicked outside
document.addEventListener('click', (e) => {
  if (!menuBtn.contains(e.target) && !menuOptions.contains(e.target)) {
    menuOptions.classList.add('hidden');
  }
});

// =======================
// --- Charts ---
// =======================
let categoryChart, uaeChart, regionalChart;

// =======================
// --- Load Data ---
// =======================
async function loadData() {
  try {
    let data = JSON.parse(localStorage.getItem('dashboardData'));
    if (!data) {
      const response = await fetch('dashboard_data.json');
      data = await response.json();
      localStorage.setItem('dashboardData', JSON.stringify(data));
    }
    populateDashboard(data);
  } catch (err) {
    console.error('Error loading data:', err);
    alert("Could not load dashboard data. Check if 'dashboard_data.json' exists.");
  }
}

// =======================
// --- Populate Dashboard ---
// =======================
function populateDashboard(data) {
  totalElem.textContent = data.summary.total_registration;
  if (prevTotalElem) prevTotalElem.textContent = `Previous: ${data.summary.previous_registration || 0}`;
  abstractElem.textContent = data.summary.abstract_sub;
  countriesElem.textContent = data.summary.participating_countries;
  if (prevCountriesElem) prevCountriesElem.textContent = `Previous: ${data.summary.previous_countries || 0}`;
  updateCategoryChart(data);
  updateUAEChart(data);
  updateRegionalChart(data);
  populateSessions(data);
}

// =======================
// --- Charts Update ---
// =======================
function updateCategoryChart(data) {
  const chartData = [data.category.doctors, data.category.nurses, data.category.allied_hcp];
  if (!categoryChart) {
    categoryChart = new Chart(categoryChartEl, {
      type: 'doughnut',
      data: { labels: ['Doctors', 'Nurses', 'Allied HCP'], datasets: [{ data: chartData, backgroundColor: ['#6366f1', '#22c55e', '#f97316'] }] },
      options: { plugins: { legend: { position: 'bottom' }, datalabels: { color: '#fff', font: { weight: 'bold', size: 14 }, formatter: v => v } } },
      plugins: [ChartDataLabels]
    });
  } else {
    categoryChart.data.datasets[0].data = chartData;
    categoryChart.update();
  }
}

function updateUAEChart(data) {
  const prev = [data.uaePrev?.dxb_shj || 0, data.uaePrev?.abu_dhabi_al_ain || 0, data.uaePrev?.other_emirates || 0];
  const current = [data.uae.dxb_shj, data.uae.abu_dhabi_al_ain, data.uae.other_emirates];
  if (!uaeChart) {
    uaeChart = new Chart(uaeChartEl, {
      type: 'bar',
      data: { labels: ['Dxb-Shj', 'Abu Dhabi-Al Ain', 'Other Emirates'], datasets: [{ label: 'Previous', data: prev, backgroundColor: '#93c5fd' }, { label: 'Current', data: current, backgroundColor: '#1d4ed8' }] },
      options: { responsive: true, scales: { y: { beginAtZero: true, max: 2000 } }, plugins: { legend: { position: 'bottom' }, datalabels: { anchor: 'end', align: 'end', color: '#000', font: { weight: 'bold', size: 12 } } } },
      plugins: [ChartDataLabels]
    });
  } else {
    uaeChart.data.datasets[0].data = prev;
    uaeChart.data.datasets[1].data = current;
    uaeChart.update();
  }
}

function updateRegionalChart(data) {
  const prev = [data.regionalPrev?.regional || 0, data.regionalPrev?.apac || 0, data.regionalPrev?.international || 0];
  const current = [data.regional.regional, data.regional.apac, data.regional.international];
  if (!regionalChart) {
    regionalChart = new Chart(regionalChartEl, {
      type: 'bar',
      data: { labels: ['Regional', 'APAC', 'International'], datasets: [{ label: 'Previous', data: prev, backgroundColor: '#93c5fd' }, { label: 'Current', data: current, backgroundColor: '#1d4ed8' }] },
      options: { responsive: true, scales: { y: { beginAtZero: true, max: 250 } }, plugins: { legend: { position: 'bottom' }, datalabels: { anchor: 'end', align: 'end', color: '#000', font: { weight: 'bold', size: 12 } } } },
      plugins: [ChartDataLabels]
    });
  } else {
    regionalChart.data.datasets[0].data = prev;
    regionalChart.data.datasets[1].data = current;
    regionalChart.update();
  }
}

// =======================
// --- Sessions Table ---
// =======================
function populateSessions(data){
  dashboardSessionsBody.innerHTML = '';
  editSessionsBody.innerHTML = '';
  data.sessions.forEach((s,i)=>{
    const deficit = (s.planned || s.target || 0) - (s.unique || 0);
    // Dashboard row
    const trDash = document.createElement('tr');
    trDash.className='border-b hover:bg-gray-50';
    trDash.innerHTML=`
      <td>${s.name}</td>
      <td>${s.planned || s.target || 0}</td>
      <td>${s.previous || 0}</td>
      <td>${s.current || 0}</td>
      <td>${s.unique || 0}</td>
      <td>${s.oncologist || 0}</td>
      <td class="${deficit >= 0 ? 'text-red-600' : 'text-green-600'}">${deficit}</td>
    `;
    dashboardSessionsBody.appendChild(trDash);
    // Edit row
    const trEdit = document.createElement('tr');
    trEdit.innerHTML=`
      <td>${s.name}</td>
      <td><input type="number" value="${s.planned || s.target || 0}" class="w-full border p-1 rounded"></td>
      <td><input type="number" value="${s.previous || 0}" class="w-full border p-1 rounded"></td>
      <td><input type="number" value="${s.current || 0}" class="w-full border p-1 rounded"></td>
      <td><input type="number" value="${s.unique || 0}" class="w-full border p-1 rounded"></td>
      <td><input type="number" value="${s.oncologist || 0}" class="w-full border p-1 rounded"></td>
      <td readonly class="text-gray-500">${deficit}</td>
    `;
    editSessionsBody.appendChild(trEdit);
  });
}

// =======================
// --- Edit Modal ---
// =======================
function openEditModal() {
  const pwd = prompt("Enter password to edit:");
  if(pwd!=='EIOC2025') return alert("Incorrect password!");
  const data = JSON.parse(localStorage.getItem('dashboardData'));
  if(!data) return alert("No data available!");

  // --- Summary ---
  editTotal.value = data.summary.total_registration;
  if(editPrevTotal) editPrevTotal.value = data.summary.previous_registration || 0;
  editAbstract.value = data.summary.abstract_sub;
  if(editPrevAbstract) editPrevAbstract.value = data.summary.previous_abstract || 0;
  editCountries.value = data.summary.participating_countries;
  if(editPrevCountries) editPrevCountries.value = data.summary.previous_countries || 0;

  // --- UAE ---
  editUAE1.value = data.uae.dxb_shj;
  editUAE2.value = data.uae.abu_dhabi_al_ain;
  editUAE3.value = data.uae.other_emirates;
  if(editPrevUAE1) editPrevUAE1.value = data.uaePrev?.dxb_shj || 0;
  if(editPrevUAE2) editPrevUAE2.value = data.uaePrev?.abu_dhabi_al_ain || 0;
  if(editPrevUAE3) editPrevUAE3.value = data.uaePrev?.other_emirates || 0;

  // --- Regional ---
  editRegional.value = data.regional.regional;
  editAPAC.value = data.regional.apac;
  editInternational.value = data.regional.international;
  if(editPrevRegional) editPrevRegional.value = data.regionalPrev?.regional || 0;
  if(editPrevAPAC) editPrevAPAC.value = data.regionalPrev?.apac || 0;
  if(editPrevInternational) editPrevInternational.value = data.regionalPrev?.international || 0;

  // --- Category ---
  editDoctors.value = data.category.doctors;
  editNurses.value = data.category.nurses;
  editAllied.value = data.category.allied_hcp;

  editModal.classList.remove('hidden');
}

// Bind floating menu edit button
editBtnOverlay?.addEventListener('click', openEditModal);

// =======================
// --- Modal Controls ---
// =======================
cancelEdit?.addEventListener('click', ()=>editModal.classList.add('hidden'));

saveEdit?.addEventListener('click', async () => {
  const data = JSON.parse(localStorage.getItem('dashboardData')) || {};
  // --- Summary ---
  data.summary.total_registration = Number(editTotal.value);
  if(editPrevTotal) data.summary.previous_registration = Number(editPrevTotal.value);
  data.summary.abstract_sub = Number(editAbstract.value);
  if(editPrevAbstract) data.summary.previous_abstract = Number(editPrevAbstract.value);
  data.summary.participating_countries = Number(editCountries.value);
  if(editPrevCountries) data.summary.previous_countries = Number(editPrevCountries.value);

  // --- UAE ---
  data.uae.dxb_shj = Number(editUAE1.value);
  data.uae.abu_dhabi_al_ain = Number(editUAE2.value);
  data.uae.other_emirates = Number(editUAE3.value);
  data.uaePrev = {
    dxb_shj: Number(editPrevUAE1?.value || 0),
    abu_dhabi_al_ain: Number(editPrevUAE2?.value || 0),
    other_emirates: Number(editPrevUAE3?.value || 0)
  };

  // --- Regional ---
  data.regional.regional = Number(editRegional.value);
  data.regional.apac = Number(editAPAC.value);
  data.regional.international = Number(editInternational.value);
  data.regionalPrev = {
    regional: Number(editPrevRegional?.value || 0),
    apac: Number(editPrevAPAC?.value || 0),
    international: Number(editPrevInternational?.value || 0)
  };

  // --- Category ---
  data.category = { doctors: Number(editDoctors.value), nurses: Number(editNurses.value), allied_hcp: Number(editAllied.value) };

  // --- Sessions ---
  editSessionsBody.querySelectorAll('tr').forEach((tr, i) => {
    const inputs = tr.querySelectorAll('input');
    if(inputs.length){
      const s = data.sessions[i];
      s.target = Number(inputs[0].value);
      s.previous = Number(inputs[1].value);
      s.current = Number(inputs[2].value);
      s.unique = Number(inputs[3].value);
      s.oncologist = Number(inputs[4].value);
      s.deficit = s.target - s.current;
    }
  });

  localStorage.setItem('dashboardData', JSON.stringify(data));

  try {
    const response = await fetch('http://127.0.0.1:5000/save-dashboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if(result.status==='success') alert('Dashboard saved successfully on the server!');
    else alert('Failed to save dashboard on the server.');
  } catch(err){
    console.error(err);
    alert('Data saved locally only.');
  }

  populateDashboard(data);
  editModal.classList.add('hidden');
});

// =======================
// --- Initialize ---
// =======================
loadData();
