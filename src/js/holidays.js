//get holidays
export async function getAllHolidays(year , code){
    const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${code}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}


//display holidays
export function displayHolidays(holidays, holidaysContent) {
    holidaysContent.innerHTML = "";
    for (let i = 0; i < holidays.length; i++) {
        const holiday = holidays[i];
        const holidayCard = document.createElement("div");
        holidayCard.classList.add("holiday-card");
        const holidayCardHeader = document.createElement("div");
        holidayCardHeader.classList.add("holiday-card-header");
        const holidayDateBox = document.createElement("div");
        holidayDateBox.classList.add("holiday-date-box");
        const daySpan = document.createElement("span");
        daySpan.classList.add("day");
        const monthSpan = document.createElement("span");
        monthSpan.classList.add("month");
        const holidayDate = new Date(holiday.date);
        daySpan.textContent = holidayDate.getDate();
        monthSpan.textContent = holidayDate.toLocaleString("en-US", { month : "short" });
        holidayDateBox.append(daySpan);
        holidayDateBox.append(monthSpan);
        const holidayActionButton = document.createElement("button");
        holidayActionButton.classList.add("holiday-action-btn");
        const heartIcon = document.createElement("i");
        heartIcon.classList.add("fa-regular", "fa-heart");
        holidayActionButton.append(heartIcon);
        holidayCardHeader.append(holidayDateBox, holidayActionButton);
        const holidayTitle = document.createElement("h3");
        holidayTitle.textContent = holiday.name;
        const holidayName = document.createElement("p");
        holidayName.classList.add("holiday-name");
        holidayName.textContent = holiday.localName;
        const holidayCardFooter = document.createElement("div");
        holidayCardFooter.classList.add("holiday-card-footer");
        const holidayDayBadge = document.createElement("span");
        holidayDayBadge.classList.add("holiday-day-badge");
        const holidayCalendarIcon = document.createElement("i");
        holidayCalendarIcon.classList.add("fa-regular", "fa-calendar");
        const holidayWeekDay = holidayDate.toLocaleString("en-US", { weekday: "long" });
        holidayDayBadge.append(holidayCalendarIcon, ` ${holidayWeekDay}`);
        const holidayTypeBadge = document.createElement("span");
        holidayTypeBadge.classList.add("holiday-type-badge");
        holidayTypeBadge.textContent = holiday.types[0];
        holidayCardFooter.append(holidayDayBadge , holidayTypeBadge);
        holidayCard.append(holidayCardHeader , holidayTitle , holidayName , holidayCardFooter);
        holidaysContent.append(holidayCard);
    }
}


//display no country selected
export function displayNoCountrySelected(holidaysContent) {
    holidaysContent.innerHTML = `
        <div class="holidays-empty-state">
            <div class="holidays-empty-icon">
                <i class="fa-solid fa-earth-americas"></i>
            </div>
            <h3>No Country Selected</h3>
            <p>Select a country from the dashboard to explore public holidays</p>
            <button class="holidays-dashboard-btn" type="button">
                Go to Dashboard
            </button>
        </div>
    `;
    const dashboardButton = holidaysContent.querySelector(".holidays-dashboard-btn");
    dashboardButton.addEventListener("click", function () { document.querySelector('.nav-item[data-view="dashboard"]').click(); });
}