// Get the context for the chart
const ctx = document.getElementById("gdpChart").getContext("2d");

// Create the chart with the data passed from the template
let gdpChart = new Chart(ctx, {
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
    indexAxis: 'x',
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Top 10 Countries by GDP Per Capita - ${document.getElementById('year').value}`,
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
          color: '#333',
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  }
});

// Add event listeners for real-time updates when selections change
document.getElementById('year').addEventListener('change', updateChart);
document.getElementById('population').addEventListener('change', updateChart);

// Function to update the chart using the API endpoint
async function updateChart() {
  const year = document.getElementById('year').value;
  const population = document.getElementById('population').value;
  
  try {
    // Use your existing API endpoint
    const response = await fetch(`/api/gdp?year=${year}&min_population=${population}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    
    // Extract country names and GDP values from the API response
    const countries = data.map(item => item.country);
    const gdpValues = data.map(item => item.gdp_per_capita);
    
    // Update chart data
    gdpChart.data.labels = countries;
    gdpChart.data.datasets[0].data = gdpValues;
    
    // Update chart title with selected year
    gdpChart.options.plugins.title.text = `Top 10 Countries by GDP Per Capita - ${year}`;
    
    // Update the chart
    gdpChart.update();
    
  } catch (error) {
    console.error('Error fetching chart data:', error);
    alert('Failed to update chart data. Please try again.');
  }
}

// Also allow form submission for users who prefer to click the button
document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();
  updateChart();
});