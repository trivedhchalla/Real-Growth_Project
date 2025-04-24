document.addEventListener('DOMContentLoaded', function() {
    // Chart instance
    let inflationChart = null;
    
    // Get DOM elements
    const countrySelect = document.getElementById('countrySelect');
    const chartCanvas = document.getElementById('inflationChart');
    const avgInflationElem = document.getElementById('avgInflation');
    const maxInflationElem = document.getElementById('maxInflation');
    const minInflationElem = document.getElementById('minInflation');
    const currentInflationElem = document.getElementById('currentInflation');
    
    // Years for the x-axis (1960-2023)
    const years = Array.from({length: 64}, (_, i) => i + 1960);
    
    // Fetch the list of countries from the backend
    fetch('/get_countries')
        .then(response => response.json())
        .then(data => {
            // Populate the dropdown with countries
            data.countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                countrySelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching countries:', error);
            alert('Failed to load countries. Please refresh the page.');
        });
    
    // Handle country selection
    countrySelect.addEventListener('change', function() {
        const selectedCountry = this.value;
        if (selectedCountry) {
            fetchCountryData(selectedCountry);
        }
    });
    
    // Fetch inflation data for a specific country
    function fetchCountryData(country) {
        fetch(`/get_inflation_data/${country}`)
            .then(response => response.json())
            .then(data => {
                updateChart(country, data.inflation_data);
                updateStatistics(data.inflation_data);
            })
            .catch(error => {
                console.error(`Error fetching data for ${country}:`, error);
                alert(`Failed to load data for ${country}. Please try again.`);
            });
    }
    
    // Update the chart with new data
    function updateChart(country, inflationData) {
        // Destroy previous chart if it exists
        if (inflationChart) {
            inflationChart.destroy();
        }
        
        // Create new chart
        inflationChart = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: `${country} Inflation Rate`,
                    data: inflationData,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.2,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#3498db'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `${country} - Inflation Rate (1960-2023)`,
                        font: {
                            size: 18
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `Inflation: ${context.parsed.y.toFixed(2)}%`;
                            }
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            callback: function(value, index) {
                                // Show every 5th year for better readability
                                const yr = this.getLabelForValue(value);
                                return yr % 5 === 0 ? yr : '';
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Inflation Rate (%)'
                        },
                        beginAtZero: true
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                }
            }
        });
    }
    
    // Update statistics panel
    function updateStatistics(inflationData) {
        // Filter out any potential NaN or undefined values
        const validData = inflationData.filter(value => !isNaN(value) && value !== null && value !== undefined);
        
        if (validData.length > 0) {
            // Calculate statistics
            const sum = validData.reduce((acc, curr) => acc + curr, 0);
            const avg = sum / validData.length;
            const max = Math.max(...validData);
            const min = Math.min(...validData);
            const current = inflationData[inflationData.length - 1];
            
            // Update DOM
            avgInflationElem.textContent = `${avg.toFixed(2)}%`;
            maxInflationElem.textContent = `${max.toFixed(2)}%`;
            minInflationElem.textContent = `${min.toFixed(2)}%`;
            currentInflationElem.textContent = `${current.toFixed(2)}%`;
        } else {
            // Reset if no valid data
            avgInflationElem.textContent = '-';
            maxInflationElem.textContent = '-';
            minInflationElem.textContent = '-';
            currentInflationElem.textContent = '-';
        }
    }
});