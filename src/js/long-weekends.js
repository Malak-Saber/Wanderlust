//get long weekends
export async function getLongWeekends(year, countryCode) {
    const url = `https://date.nager.at/api/v3/LongWeekend/${year}/${countryCode}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}


//display long weekends
export function displayLongWeekends(longWeekends, longWeekendsContent) {
    if (longWeekends.length == 0) {
        longWeekendsContent.innerHTML = `
            <div class="holidays-empty-state">
                <div class="holidays-empty-icon">
                    <i class="fa-solid fa-calendar-xmark"></i>
                </div>
                <h3>No Long Weekends Found</h3>
                <p>There are no long weekend opportunities for this country and year.</p>
            </div>
        `;
        return;
    }
    longWeekendsContent.innerHTML = longWeekends.map(function (longWeekend, index) {
        const startDate = new Date(longWeekend.startDate + "T00:00:00");
        const endDate = new Date(longWeekend.endDate + "T00:00:00");
        const datesText = `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
        const bridgeDays = longWeekend.bridgeDays || [];
        let daysHTML = "";
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dateText = currentDate.toISOString().split("T")[0];
            const dayName = currentDate.toLocaleDateString("en-US", { weekday: "short" });
            const dayNumber = currentDate.getDate();
            const dayNumberOfWeek = currentDate.getDay();
            const weekendClass = dayNumberOfWeek === 0 || dayNumberOfWeek === 6 ? "weekend" : "";
            const bridgeClass = bridgeDays.includes(dateText) ? "bridge" : "";
            daysHTML += `
                <div class="lw-day ${weekendClass} ${bridgeClass}">
                    <span class="name">${dayName}</span>
                    <span class="num">${dayNumber}</span>
                </div>
            `;
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return `
            <div class="lw-card">
                <div class="lw-card-header">
                    <span class="lw-badge">
                        <i class="fa-solid fa-calendar-days"></i>
                        ${longWeekend.dayCount} Days
                    </span>
                    <button class="holiday-action-btn" type="button">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                </div>
                <h3>Long Weekend #${index + 1}</h3>
                <div class="lw-dates">
                    <i class="fa-regular fa-calendar"></i>
                    ${datesText}
                </div>
                <div class="lw-info-box ${longWeekend.needBridgeDay ? "warning" : "success"}">
                    <i class="fa-solid ${longWeekend.needBridgeDay ? "fa-info-circle" : "fa-check-circle"}"></i>
                    ${longWeekend.needBridgeDay ? "Requires taking a bridge day off" : "No extra days off needed!"}
                </div>
                <div class="lw-days-visual">
                    ${daysHTML}
                </div>
            </div>
        `;
    }).join("");
}


//display no country selected
export function displayNoCountrySelected(longWeekendsContent) {
    longWeekendsContent.innerHTML = `
        <div class="holidays-empty-state">
            <div class="holidays-empty-icon">
                <i class="fa-solid fa-umbrella-beach"></i>
            </div>
            <h3>No Country Selected</h3>
            <p>Select a country from the dashboard to discover long weekend opportunities</p>
            <button class="holidays-dashboard-btn" type="button">
                Go to Dashboard
            </button>
        </div>
    `;
    const dashboardButton = longWeekendsContent.querySelector(".holidays-dashboard-btn");
    dashboardButton.addEventListener("click", function () { document.querySelector('.nav-item[data-view="dashboard"]').click(); });
}