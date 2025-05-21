/**
 * @jest-environment jsdom
 */

const { fetchWeatherData, displayWeather, displayError } = require("../index");

describe("fetchWeatherData", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("should fetch weather data for a valid city", async () => {
    const mockResponse = {
      name: "New York",
      main: { temp: 298.15, humidity: 50 },
      weather: [{ description: "clear sky" }],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const data = await fetchWeatherData("New York");
    expect(data.name).toBe("New York");
    expect(data.main.temp).toBe(298.15);
    expect(data.weather[0].description).toBe("clear sky");
  });

  it("should throw an error for an invalid city", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    await expect(fetchWeatherData("InvalidCity")).rejects.toThrow(
      "City not found"
    );
  });

  it("should throw an error for network issues", async () => {
    fetch.mockRejectedValueOnce(new Error("Network Error"));

    await expect(fetchWeatherData("New York")).rejects.toThrow("Network Error");
  });
});

describe("displayWeather", () => {
  let weatherDisplay;

  beforeEach(() => {
    document.body.innerHTML = '<div id="weather-display"></div>';
    weatherDisplay = document.getElementById("weather-display");
  });

  it("should display weather data on the page", () => {
    const mockData = {
      name: "New York",
      main: { temp: 298.15, humidity: 50 },
      weather: [{ description: "clear sky" }],
    };

    displayWeather(mockData);

    expect(weatherDisplay.innerHTML).toContain("New York");
    expect(weatherDisplay.innerHTML).toContain("25°C"); // 298.15 Kelvin to Celsius
    expect(weatherDisplay.innerHTML).toContain("50%");
    expect(weatherDisplay.innerHTML).toContain("clear sky");
  });
});

describe("displayError", () => {
  let errorMessage;

  beforeEach(() => {
    document.body.innerHTML = '<div id="error-message" class="hidden"></div>';
    errorMessage = document.getElementById("error-message");
  });

  it("should display an error message", () => {
    displayError("City not found");

    expect(errorMessage.textContent).toBe("City not found");
    expect(errorMessage.classList.contains("hidden")).toBe(false);
  });

  it("should replace any existing error message", () => {
    errorMessage.textContent = "Previous error";
    displayError("New error occurred");

    expect(errorMessage.textContent).toBe("New error occurred");
  });
});
