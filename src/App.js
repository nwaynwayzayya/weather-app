import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  async function getWeather() {
    if (!city) return;
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=e32470e57b4b3e4dfa858cacc39197fb&units=metric`
      );
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  }

  return (
    <div className="app">
      <h1>Weather App</h1>

      {/* Input field */}
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      {/* Button to fetch weather */}
      <button onClick={getWeather}>Get Weather</button>

      {/* Show results */}
      {weather && weather.main ? (
        <div className="weather-info">
          <h2>{weather.name}</h2>
          <p>🌡️ {weather.main.temp}°C</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>☁️ {weather.weather[0].description}</p>
        </div>
      ) : weather && weather.message ? (
        <p style={{ color: "red" }}>{weather.message}</p>
      ) : null}
    </div>
  );
}

export default App;
