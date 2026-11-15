//get sun times
export async function getSunTimes(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=sunrise,sunset,daylight_duration&timezone=auto&forecast_days=1`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}


//formatting time
function formatTime(time) {
    const timePart = time.split("T")[1];
    const [hours, minutes] = timePart.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);
    return date.toLocaleTimeString("en-US", { hour: "2-digit" , minute: "2-digit" , hour12: true });
}


//get minutes
function getMinutes(time) {
    const timePart = time.split("T")[1];
    const [hours, minutes] = timePart.split(":");
    return Number(hours) * 60 + Number(minutes);
}


//formatting duration
function formatDuration(seconds) {
    const totalMinutes = Math.round(seconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
}


//formatting minutes
function formatMinutes(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const date = new Date();
    date.setHours(hours, remainingMinutes, 0, 0);
    return date.toLocaleTimeString("en-US", { hour: "2-digit" , minute: "2-digit" , hour12: true });
}


//display sun times
export function displaySunTimes(data, cityName, sunTimesContent) {
    if (!data) {
        sunTimesContent.innerHTML = `
            <div class="holidays-empty-state">
                <div class="holidays-empty-icon">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
                <h3>Unable to Load Sun Times</h3>
                <p>We couldn't get sunrise and sunset information for this location. Please try again.</p>
            </div>
        `;
        return;
    }
    const sunrise = data.daily.sunrise[0];
    const sunset = data.daily.sunset[0];
    const daylightSeconds = data.daily.daylight_duration[0];
    const sunriseMinutes = getMinutes(sunrise);
    const sunsetMinutes = getMinutes(sunset);
    const solarNoonMinutes = Math.round((sunriseMinutes + sunsetMinutes) / 2);
    const daylight = formatDuration(daylightSeconds);
    const darkness = formatDuration(86400 - daylightSeconds);
    const daylightPercentage = ((daylightSeconds / 86400) * 100).toFixed(1);
    const date = new Date(`${sunrise.split("T")[0]}T12:00:00`);
    const formattedDate = date.toLocaleDateString("en-US", { month: "long" , day: "numeric" , year: "numeric" });
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    sunTimesContent.innerHTML = `
        <div class="sun-main-card">
            <div class="sun-main-header">
                <div class="sun-location">
                    <h2>
                        <i class="fa-solid fa-location-dot"></i>
                        ${cityName}
                    </h2>
                    <p>Sun times for your selected location</p>
                </div>
                <div class="sun-date-display">
                    <div class="date">${formattedDate}</div>
                    <div class="day">${dayName}</div>
                </div>
            </div>
            <div class="sun-times-grid">
                <div class="sun-time-card sunrise">
                    <div class="icon">
                        <i class="fa-solid fa-sun"></i>
                    </div>
                    <div class="label">Sunrise</div>
                    <div class="time">${formatTime(sunrise)}</div>
                    <div class="sub-label">Sun appears above horizon</div>
                </div>
                <div class="sun-time-card noon">
                    <div class="icon">
                        <i class="fa-solid fa-sun"></i>
                    </div>
                    <div class="label">Solar Noon</div>
                    <div class="time">${formatMinutes(solarNoonMinutes)}</div>
                    <div class="sub-label">Sun at its highest point</div>
                </div>
                <div class="sun-time-card sunset">
                    <div class="icon">
                        <i class="fa-solid fa-sun"></i>
                    </div>
                    <div class="label">Sunset</div>
                    <div class="time">${formatTime(sunset)}</div>
                    <div class="sub-label">Sun goes below horizon</div>
                </div>
                <div class="sun-time-card daylight">
                    <div class="icon">
                        <i class="fa-solid fa-hourglass-half"></i>
                    </div>
                    <div class="label">Day Length</div>
                    <div class="time">${daylight}</div>
                    <div class="sub-label">Total daylight</div>
                </div>
            </div>
        </div>
        <div class="day-length-card">
            <h3>
                <i class="fa-solid fa-chart-pie"></i>
                Daylight Distribution
            </h3>
            <div class="day-progress">
                <div class="day-progress-bar">
                    <div class="day-progress-fill" style="width: ${daylightPercentage}%"></div>
                </div>
            </div>
            <div class="day-length-stats">
                <div class="day-stat">
                    <div class="value">${daylight}</div>
                    <div class="label">Daylight</div>
                </div>
                <div class="day-stat">
                    <div class="value">${daylightPercentage}%</div>
                    <div class="label">of 24 Hours</div>
                </div>
                <div class="day-stat">
                    <div class="value">${darkness}</div>
                    <div class="label">Darkness</div>
                </div>
            </div>
        </div>
    `;
}


//display no city selected
export function displayNoCitySelected(sunTimesContent) {
    sunTimesContent.innerHTML = `
        <div class="holidays-empty-state">
            <div class="holidays-empty-icon">
                <i class="fa-solid fa-sun"></i>
            </div>
            <h3>No City Selected</h3>
            <p>Select a country and city from the dashboard to discover sunrise and sunset times.</p>
            <button class="holidays-dashboard-btn" type="button">Go to Dashboard</button>
        </div>
    `;
    const dashboardButton = sunTimesContent.querySelector(".holidays-dashboard-btn");
    dashboardButton.addEventListener("click", function () { document.querySelector('.nav-item[data-view="dashboard"]').click(); });
}