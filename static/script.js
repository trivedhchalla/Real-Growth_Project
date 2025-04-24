const ctx = document.getElementById("gdpChart").getContext("2d");

// Example chart where countries are on x-axis and data grouped by year
const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: chartLabels, // Country names on X axis
    datasets: [{
      label: "GDP Per Capita",
      data: chartData,
      backgroundColor: "#4F46E5"
    }]
  },
  options: {
    indexAxis: 'x', // Ensure horizontal bars if needed
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Top 10 Countries by GDP Per Capita',
        font: {
          size: 20
        },
        color: '#333'
      },
      legend: {
        labels: {
          color: '#333'
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Country',
          color: '#333',
          font: {
            size: 14
          }
        },
        ticks: {
          color: '#333'
        }
      },
      y: {
        title: {
          display: true,
          text: 'GDP Per Capita (USD)',
          color: '#333',
          font: {
            size: 14
          }
        },
        beginAtZero: true,
        ticks: {
          color: '#333'
        }
      }
    }
  }
});
