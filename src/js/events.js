//معرفتش أجيب ال API key خالص سجلت على الموقع بتاع Ticket Master ومتبعتليش على الايميل تأكيد التسجيل ولا حاجة
const eventApiKey = "FQy4HArVdBbZ87AHrbfdhSXRgyE5NUbrh6GaL8enMUeh";


//get all events
export async function getAllEvents(city, countryCode) {
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${eventApiKey}&city=${encodeURIComponent(city)}&countryCode=${countryCode}&size=20`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}


//display events
export function displayEvents(events, eventsContent) {
    eventsContent.innerHTML = "";
    if (!events || events.length == 0) {
        eventsContent.innerHTML = `
            <div class="holidays-empty-state">
                <div class="holidays-empty-icon">
                    <i class="fa-solid fa-ticket"></i>
                </div>
                <h3>No Events Found</h3>
                <p>No events are available for this city right now. Try another city.</p>
            </div>
        `;
        return;
    }
    for (let i = 0 ; i < events.length ; i++) {
        const event = events[i];
        const eventCard = document.createElement("div");
        eventCard.className = "event-card";
        const eventImage = event.images && event.images.length > 0 ? event.images[0].url : "https://placehold.co/400x200?text=Event";
        const eventCategory = event.classifications && event.classifications.length > 0 ? event.classifications[0].segment.name : "Event";
        const eventDate = event.dates ?.start ?.localDate || "Date not available";
        const eventTime = event.dates ?.start ?.localTime || "";
        const eventVenue = event._embedded ?.venues ?.[0] ?.name || "Location not available";
        const eventCity = event._embedded ?.venues ?.[0] ?.city ?.name || "";
        const eventName = event.name;
        const eventUrl = event.url || "#";
        eventCard.innerHTML = `
            <div class="event-card-image">
                <img src="${eventImage}" alt="${eventName}">
                <span class="event-card-category">${eventCategory}</span>
                <button class="event-card-save" type="button">
                    <i class="fa-regular fa-heart"></i>
                </button>
            </div>
            <div class="event-card-body">
                <h3>${eventName}</h3>
                <div class="event-card-info">
                    <div>
                        <i class="fa-regular fa-calendar"></i>
                        ${eventDate} ${eventTime}
                    </div>
                    <div>
                        <i class="fa-solid fa-location-dot"></i>
                        ${eventVenue}, ${eventCity}
                    </div>
                </div>
                <div class="event-card-footer">
                    <button class="btn-event" type="button">
                        <i class="fa-regular fa-heart"></i> Save
                    </button>
                    <a href="${eventUrl}" target="_blank" class="btn-buy-ticket">
                        <i class="fa-solid fa-ticket"></i> Buy Tickets
                    </a>
                </div>
            </div>
        `;
        eventsContent.append(eventCard);
    }
}


//display no city selected
export function displayNoCitySelected(eventsContent) {
    eventsContent.innerHTML = `
        <div class="holidays-empty-state">
            <div class="holidays-empty-icon">
                <i class="fa-solid fa-earth-americas"></i>
            </div>
            <h3>No City Selected</h3>
            <p>Select a country and city from the dashboard to explore events</p>
            <button class="holidays-dashboard-btn" type="button">
                Go to Dashboard
            </button>
        </div>
    `;
    const dashboardButton = eventsContent.querySelector(".holidays-dashboard-btn");
    dashboardButton.addEventListener("click", function () {
        document.querySelector('.nav-item[data-view="dashboard"]').click();
    });
}