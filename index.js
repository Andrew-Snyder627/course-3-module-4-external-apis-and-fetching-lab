// index.js
const API_KEY = "299b1d81f8fc5f322edc66b804355202";

// Step 1: Fetch Data from the API
// - Create a function `fetchWeatherData(city)`
// - Use fetch() to retrieve data from the OpenWeather API
// - Handle the API response and parse the JSON
// - Log the data to the console for testing
async function fetchWeatherData(city) {
  if (!city) throw new Error("Please enter a city name");
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("City not found");
      }
      throw new Error(response.statusText || `Error: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    throw err;
  }
}

// Step 2: Display Weather Data on the Page
// - Create a function `displayWeather(data)`
// - Dynamically update the DOM with weather details (e.g., temperature, humidity, weather description)
// - Ensure the function can handle the data format provided by the API

function displayWeather(data) {
  const weatherDisplay = document.getElementById("weather-display");
  if (!data || !data.main || !data.weather) {
    weatherDisplay.innerHTML = "<p>Weather data unavailable.</p>";
    return;
  }
  const city = data.name;
  const tempC = (data.main.temp - 273.15).toFixed(0); // From kelvin to C, will implement F later
  const humidity = data.main.humidity;
  const description = data.weather[0].description;

  weatherDisplay.innerHTML = `
  <h2>Weather in ${city}</h2>
  <p><strong>Temperature:</strong> ${temp}&deg;C</p>
  <p><strong>Humidity:</strong> ${humidity}%</p>
  <p><strong>Conditions:</strong> ${description}</p>
  `;
}

function showLoadingSpinner() {
  document.getElementById("loading-spinner").style.display = "block";
}

function hideLoadingSpinner() {
  document.getElementById("loading-spinner").style.display = "none";
}

// Step 3: Handle User Input
// - Add an event listener to the button to capture user input
// - Retrieve the value from the input field
// - Call `fetchWeatherData(city)` with the user-provided city name
document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("fetch-weather");
  const input = document.getElementById("city-input");
  button.addEventListener("click", async () => {
    const city = input.value.trim();
    clearDisplay();
    showLoadingSpinner();
    try {
      const data = await fetchWeatherData(city);
      displayWeather(data);
    } catch (err) {
      displayError(err.message);
    } finally {
      hideLoadingSpinner();
    }
  });
});

// Step 4: Implement Error Handling
// - Create a function `displayError(message)`
// - Handle invalid city names or network issues
// - Dynamically display error messages in a dedicated section of the page

function displayError(message) {
  const errorDiv = document.getElementById("error-message");
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
}

function clearDisplay() {
  document.getElementById("weather-display").innerHTML = "";
  const errorDiv = document.getElementById("error-message");
  errorDiv.textContent = "";
  errorDiv.classList.add("hidden");
  hideLoadingSpinner();
}
// Step 5: Optimize Code for Maintainability
// - Refactor repetitive code into reusable functions
// - Use async/await for better readability and to handle asynchronous operations
// - Ensure all reusable functions are modular and clearly named

// BONUS: Loading Indicator
// - Optionally, add a loading spinner or text while the API request is in progress

// BONUS: Additional Features
// - Explore adding more features, such as displaying additional weather details (e.g., wind speed, sunrise/sunset)
// - Handle edge cases, such as empty input or API rate limits

// Event Listener for Fetch Button
// - Attach the main event listener to the button to start the process

if (typeof module !== "undefined") {
  module.exports = { fetchWeatherData, displayWeather, displayError };
}
