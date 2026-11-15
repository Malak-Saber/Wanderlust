//get city coordinates for weather
export async function getCityCoordinates(city, countryCode) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    const cityData = data.results.find(function (item) { return item.country_code === countryCode; }) || data.results[0];
    return { latitude: cityData.latitude , longitude: cityData.longitude , cityName: cityData.name , countryName: cityData.country };
}


//get weather forecast
export async function getWeatherForecast(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,uv_index&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}


//get weather condition
function getWeatherCondition(code) {
    const weatherConditions = {
        0: ["Clear sky", "fa-sun"],
        1: ["Mainly clear", "fa-sun"],
        2: ["Partly cloudy", "fa-cloud-sun"],
        3: ["Overcast", "fa-cloud"],
        45: ["Fog", "fa-smog"],
        48: ["Depositing rime fog", "fa-smog"],
        51: ["Light drizzle", "fa-cloud-rain"],
        53: ["Moderate drizzle", "fa-cloud-rain"],
        55: ["Dense drizzle", "fa-cloud-showers-heavy"],
        61: ["Slight rain", "fa-cloud-rain"],
        63: ["Moderate rain", "fa-cloud-rain"],
        65: ["Heavy rain", "fa-cloud-showers-heavy"],
        71: ["Slight snow", "fa-snowflake"],
        73: ["Moderate snow", "fa-snowflake"],
        75: ["Heavy snow", "fa-snowflake"],
        80: ["Rain showers", "fa-cloud-showers-heavy"],
        81: ["Moderate rain showers", "fa-cloud-showers-heavy"],
        82: ["Violent rain showers", "fa-cloud-showers-heavy"],
        95: ["Thunderstorm", "fa-cloud-bolt"],
        96: ["Thunderstorm with hail", "fa-cloud-bolt"],
        99: ["Thunderstorm with heavy hail", "fa-cloud-bolt"]
    };
    return weatherConditions[code] || ["Unknown", "fa-cloud"];
}


//display weather
export function displayWeather(data, cityName, weatherContent) {
    const current = data.current;
    const daily = data.daily;
    const hourly = data.hourly;
    const currentCondition = getWeatherCondition(current.weather_code);
    weatherContent.innerHTML = `
        <div class="weather-hero-card weather-sunny">
            <div class="weather-location">
                <i class="fa-solid fa-location-dot"></i>
                <span>${cityName}</span>
                <span class="weather-time">${new Date(current.time).toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
            </div>
            <div class="weather-hero-main">
                <div class="weather-hero-left">
                    <div class="weather-hero-icon">
                        <i class="fa-solid ${currentCondition[1]}"></i>
                    </div>
                    <div class="weather-hero-temp">
                        <span class="temp-value">${Math.round(current.temperature_2m)}</span>
                        <span class="temp-unit">°C</span>
                    </div>
                </div>
                <div class="weather-hero-right">
                    <div class="weather-condition">${currentCondition[0]}</div>
                    <div class="weather-feels">Feels like ${Math.round(current.apparent_temperature)}°C</div>
                    <div class="weather-high-low">
                        <span class="high"><i class="fa-solid fa-arrow-up"></i> ${Math.round(daily.temperature_2m_max[0])}°</span>
                        <span class="low"><i class="fa-solid fa-arrow-down"></i> ${Math.round(daily.temperature_2m_min[0])}°</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="weather-details-grid">
            <div class="weather-detail-card">
                <div class="detail-icon humidity"><i class="fa-solid fa-droplet"></i></div>
                <div class="detail-info">
                    <span class="detail-label">Humidity</span>
                    <span class="detail-value">${current.relative_humidity_2m}%</span>
                </div>
            </div>
            <div class="weather-detail-card">
                <div class="detail-icon wind"><i class="fa-solid fa-wind"></i></div>
                <div class="detail-info">
                    <span class="detail-label">Wind</span>
                    <span class="detail-value">${current.wind_speed_10m} km/h</span>
                </div>
            </div>
            <div class="weather-detail-card">
                <div class="detail-icon uv"><i class="fa-solid fa-sun"></i></div>
                <div class="detail-info">
                    <span class="detail-label">UV Index</span>
                    <span class="detail-value">${current.uv_index}</span>
                </div>
            </div>
            <div class="weather-detail-card">
                <div class="detail-icon precip"><i class="fa-solid fa-cloud-rain"></i></div>
                <div class="detail-info">
                    <span class="detail-label">Precipitation</span>
                    <span class="detail-value">${daily.precipitation_probability_max[0]}%</span>
                </div>
            </div>
        </div>
        <div class="weather-section">
            <h3 class="weather-section-title"><i class="fa-solid fa-clock"></i> Hourly Forecast</h3>
            <div class="hourly-scroll">
                ${hourly.temperature_2m.slice(0, 12).map(function (temperature, index) {
                    const condition = getWeatherCondition(hourly.weather_code[index]);
                    const hour = new Date(hourly.time[index]).toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
                    return `
                        <div class="hourly-item ${index === 0 ? "now" : ""}">
                            <span class="hourly-time">${index === 0 ? "Now" : hour}</span>
                            <div class="hourly-icon"><i class="fa-solid ${condition[1]}"></i></div>
                            <span class="hourly-temp">${Math.round(temperature)}°</span>
                        </div>
                    `;
                }).join("")}
            </div>
        </div>
        <div class="weather-section">
            <h3 class="weather-section-title"><i class="fa-solid fa-calendar-week"></i> 7-Day Forecast</h3>
            <div class="forecast-list">
                ${daily.time.map(function (date, index) {
                    const condition = getWeatherCondition(daily.weather_code[index]);
                    const day = new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" });
                    const dateText = new Date(date + "T00:00:00").toLocaleDateString("en-US", { day: "numeric", month: "short" });
                    return `
                        <div class="forecast-day ${index === 0 ? "today" : ""}">
                            <div class="forecast-day-name">
                                <span class="day-label">${index === 0 ? "Today" : day}</span>
                                <span class="day-date">${dateText}</span>
                            </div>
                            <div class="forecast-icon"><i class="fa-solid ${condition[1]}"></i></div>
                            <div class="forecast-temps">
                                <span class="temp-max">${Math.round(daily.temperature_2m_max[index])}°</span>
                                <span class="temp-min">${Math.round(daily.temperature_2m_min[index])}°</span>
                            </div>
                            <div class="forecast-precip">${daily.precipitation_probability_max[index]}%</div>
                        </div>
                    `;
                }).join("")}
            </div>
        </div>
    `;
}


//display no city selected
export function displayNoCitySelected(weatherContent) {
    weatherContent.innerHTML = `
        <div class="holidays-empty-state">
            <div class="holidays-empty-icon">
                <i class="fa-solid fa-cloud-sun"></i>
            </div>
            <h3>No City Selected</h3>
            <p>Select a country and city from the dashboard to see the weather forecast</p>
            <button class="holidays-dashboard-btn" type="button">
                Go to Dashboard
            </button>
        </div>
    `;
    const dashboardButton = weatherContent.querySelector(".holidays-dashboard-btn");
    dashboardButton.addEventListener("click", function () { document.querySelector('.nav-item[data-view="dashboard"]').click(); });
}