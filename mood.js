// Function to update the current date without time
function updateCurrentDate() {
    const now = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const formattedDate = now.toLocaleDateString('en-US', options);
    document.getElementById('currentDate').value = formattedDate;
  }
  
  // Function to handle mood selection
  function handleMoodSelection() {
    const moodOptions = document.querySelectorAll('.mood-option');
    let selectedMood = null;
  
    moodOptions.forEach((option) => {
      option.addEventListener('click', () => {
        // Remove 'selected' class from all options
        moodOptions.forEach((opt) => opt.classList.remove('selected'));
  
        // Add 'selected' class to the clicked option
        option.classList.add('selected');
  
        // Store the selected mood
        selectedMood = option.getAttribute('data-mood');
      });
    });
  
    return () => selectedMood; // Return a function to get the selected mood
  }
  
  // Function to initialize the mood chart
  function initializeMoodChart(ctx) {
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: [], // Dates will be added here
        datasets: [
          {
            label: 'Mood Trend',
            data: [], // Mood scores will be added here
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Mood Score',
            },
            ticks: {
              callback: (value) => {
                // Map numeric values back to mood labels
                const moodLabels = ['Bad', 'Poor', 'Average', 'Good', 'Excellent'];
                return moodLabels[value];
              },
            },
          },
        },
      },
    });
  }
  
  // Function to save mood data and update the chart
  function saveMoodData(chart, date, moodLabel) {
    // Map mood labels to numeric values for Chart.js
    const moodMap = { Bad: 0, Poor: 1, Average: 2, Good: 3, Excellent: 4 };
    const moodValue = moodMap[moodLabel];
  
    // Update chart data
    chart.data.labels.push(date);
    chart.data.datasets[0].data.push(moodValue);
    chart.update();
  
    // Save data to localStorage
    const moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
    moodHistory.push({ date, moodLabel });
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
  
    // Print data to console log
    console.log(`Mood submitted: ${moodLabel} on ${date}`);
  }
  
  // Function to load mood history from localStorage
  function loadMoodHistory(chart) {
    const moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
    moodHistory.forEach((entry) => {
      const moodMap = { Bad: 0, Poor: 1, Average: 2, Good: 3, Excellent: 4 };
      chart.data.labels.push(entry.date);
      chart.data.datasets[0].data.push(moodMap[entry.moodLabel]);
    });
    chart.update();
  }
  
  // Function to handle form submission
  function handleSubmit(chart) {
    const submitButton = document.getElementById('submitButton');
    const progressInput = document.getElementById('progressInput');
    const getSelectedMood = handleMoodSelection();
  
    submitButton.addEventListener('click', () => {
      const selectedMood = getSelectedMood(); // Get the selected mood
      const progressMessage = progressInput.value.trim(); // Get the progress message
  
      if (!selectedMood) {
        alert('Please select a mood.');
        return;
      }
  
      if (!progressMessage) {
        alert('Please enter your progress.');
        return;
      }
  
      // Get today's date
      const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
  
      // Check if data for today already exists
      const moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
      const isDuplicate = moodHistory.some((entry) => entry.date === today);
  
      if (isDuplicate) {
        alert('You have already submitted your mood for today.');
        return;
      }
  
      // Map selected mood to label
      const moodLabelMap = { Bad: 'Bad', Neutral: 'Poor', Great: 'Average', Good: 'Good', Excellent: 'Excellent' };
      const moodLabel = moodLabelMap[selectedMood] || 'Average';
  
      // Save mood data and update the chart
      saveMoodData(chart, today, moodLabel);
  
      // Reset the form
      progressInput.value = '';
      document.querySelectorAll('.mood-option').forEach((opt) => opt.classList.remove('selected'));
  
      alert('Your daily check-in has been submitted successfully!');
    });
  }
  
  // Function to clear the chart and localStorage
  function clearChart(chart) {
    const clearButton = document.getElementById('clearButton');
    clearButton.addEventListener('click', () => {
      // Clear localStorage
      localStorage.removeItem('moodHistory');
  
      // Reset chart data
      chart.data.labels = [];
      chart.data.datasets[0].data = [];
      chart.update();
  
      alert('All mood data and the chart have been cleared.');
    });
  }
  
  // Initialize the app
  document.addEventListener('DOMContentLoaded', () => {
    // Update the date immediately
    updateCurrentDate();
  
    // Initialize the mood chart
    const ctx = document.getElementById('moodChart').getContext('2d');
    const moodChart = initializeMoodChart(ctx);
  
    // Load mood history from localStorage
    loadMoodHistory(moodChart);
  
    // Handle form submission
    handleSubmit(moodChart);
  
    // Handle clearing the chart
    clearChart(moodChart);
  });