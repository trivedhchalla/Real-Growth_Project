const yearSelect = document.getElementById("year");
const popSelect = document.getElementById("population");
const ctx = document.getElementById("gdpChart").getContext("2d");
const updateButton = document.getElementById("updateChart");

// Populate year dropdown
const years = Array.from({ length: 2023 - 1960 + 1 }, (_, i) => 1960 + i);
years.forEach(year => {
  const opt = document.createElement("option");
  opt.value = year;
  opt.textContent = year;
  if (year === 2023) opt.selected = true;
  yearSelect.appendChild(opt);
});

let chart;

// Fetch data and render chart
async function fetchData() {
  const year = yearSelect.value;
  const minPopulation = popSelect.value;

  const response = await fetch(`/api/gdp?year=${year}&min_population=${minPopulation}`);
  const data = await response.json();

  const labels = data.map(d => d.country);
  const values = data.map(d => d.gdp_per_capita);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: "GDP Per Capita",
        data: values,
        backgroundColor: "#4F46E5"
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      scales: {
        x: {
          beginAtZero: true
        }
      }
    }
  });
}

// Run only when button is clicked
updateButton.addEventListener("click", fetchData);

// Optionally fetch default chart on page load
window.onload = fetchData;
