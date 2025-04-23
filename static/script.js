const ctx = document.getElementById("gdpChart").getContext("2d");

const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: chartLabels,
    datasets: [{
      label: "GDP Per Capita",
      data: chartData,
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
