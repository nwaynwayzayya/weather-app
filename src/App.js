import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to get weather icon based on weather condition
  const getWeatherIcon = (weatherCode, isDay = true) => {
    const icons = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌦️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return icons[weatherCode] || '🌤️';
  };

  // Format time from timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  async function getWeather() {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=e32470e57b4b3e4dfa858cacc39197fb&units=metric`
      );
      const data = await response.json();
      
      if (response.ok) {
        setWeather(data);
        setCity(""); // Clear input after successful search
      } else {
        setError(data.message || "City not found");
        setWeather(null);
      }
    } catch (error) {
      setError("Unable to fetch weather data. Please try again.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  // Handle enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getWeather();
    }
  };

  return (
    <div className="app">
      <h1>Weather App</h1>

      {/* Search Container */}
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <button onClick={getWeather} disabled={loading || !city.trim()}>
            {loading ? "Loading..." : "Get Weather"}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && <div className="loading">Fetching weather data...</div>}

      {/* Error State */}
      {error && <div className="error-message">{error}</div>}

      {/* Weather Results */}
      {weather && weather.main && (
        <div className="weather-card">
          <div className="weather-header">
            <h2 className="city-name">{weather.name}, {weather.sys.country}</h2>
          </div>

          <div className="weather-main">
            <div className="temperature-section">
              <div className="main-temp">{Math.round(weather.main.temp)}°C</div>
              <div className="weather-desc">{weather.weather[0].description}</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', marginTop: '10px' }}>
                Feels like {Math.round(weather.main.feels_like)}°C
              </div>
            </div>
            <div className="weather-icon">
              {getWeatherIcon(weather.weather[0].icon)}
            </div>
          </div>

          <div className="weather-details">
            <div className="detail-item">
              <div className="detail-label">Humidity</div>
              <div className="detail-value">{weather.main.humidity}%</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Pressure</div>
              <div className="detail-value">{weather.main.pressure} hPa</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Wind Speed</div>
              <div className="detail-value">{weather.wind?.speed || 0} m/s</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Visibility</div>
              <div className="detail-value">{weather.visibility ? (weather.visibility / 1000).toFixed(1) + ' km' : 'N/A'}</div>
            </div>
            {weather.sys.sunrise && (
              <div className="detail-item">
                <div className="detail-label">Sunrise</div>
                <div className="detail-value">{formatTime(weather.sys.sunrise)}</div>
              </div>
            )}
            {weather.sys.sunset && (
              <div className="detail-item">
                <div className="detail-label">Sunset</div>
                <div className="detail-value">{formatTime(weather.sys.sunset)}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
