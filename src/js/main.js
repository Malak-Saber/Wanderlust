import { getAllCountries } from "./api.js";
import { getCountryDetails } from "./api.js";
import { getCountryCities } from "./api.js";
import { getMoreCountryDetails } from "./api.js";
import { getAllHolidays, displayHolidays, displayNoCountrySelected } from "./holidays.js";
import { getAllEvents, displayEvents, displayNoCitySelected } from "./events.js";
import { getCityCoordinates, getWeatherForecast, displayWeather, displayNoCitySelected as displayWeatherNoCitySelected } from "./weather.js";
import { getLongWeekends, displayLongWeekends, displayNoCountrySelected as displayLongWeekendsNoCountrySelected } from "./long-weekends.js";
import { getExchangeRates , displayConversionResult , displayPopularCurrencies } from "./currency.js";
import { getSunTimes , displaySunTimes , displayNoCitySelected as displaySunTimesNoCitySelected } from "./sun-times.js";


//showing countries
const globalCountry = document.getElementById("global-country");
const countries = await getAllCountries();
for( let i=0 ; i<countries.length ; i++){
    const country = countries[i];
    const option = document.createElement("option");
    option.value = country.countryCode;
    option.innerText = country.name;
    globalCountry.append(option);
}
const globalCity = document.getElementById("global-city");
const eventsContent = document.getElementById("events-content");


//sidebar
const sidebarItem = document.querySelectorAll(".nav-item");
const viewPage = document.querySelectorAll(".view");
for ( let i = 0 ; i < sidebarItem.length ; i++ ) {
    sidebarItem[i].addEventListener("click", function () {
        const selectedview = sidebarItem[i].getAttribute("data-view");
        for ( let j = 0 ; j < viewPage.length ; j++ ) {
            viewPage[j].classList.remove("active");
        }
        console.log(selectedview);
        console.log(document.getElementById(`${selectedview}-view`));
        document.getElementById(`${selectedview}-view`).classList.add("active");
        if (selectedview === "events" && globalCity.value === "") {
            displayNoCitySelected(eventsContent);
        }
        for ( let k = 0 ; k < sidebarItem.length ; k++ ) {
            sidebarItem[k].classList.remove("active");
        }
        sidebarItem[i].classList.add("active");
        if (selectedview === "events" && globalCity.value === "") {
            displayNoCitySelected(eventsContent);
        }
        if (selectedview === "weather") {
            if (globalCity.value === "") {
                displayWeatherNoCitySelected(weatherContent);
            } else {
                showWeather();
            }
        }
        if (selectedview === "long-weekends") {
            if (globalCountry.value === "") {
                displayLongWeekendsNoCountrySelected(longWeekendsContent);
            } else {
                showLongWeekends();
            }
        }
        if (selectedview === "sun-times") {
            if (globalCity.value === "" || globalCountry.value === "") {
                displaySunTimesNoCitySelected(sunTimesContent);
            } else {
                showSunTimes();
            }
        }
    });
}



//showing details of selected country
const globalYear = document.getElementById("global-year");
const holidaysSelection = document.getElementById("holidays-selection");
const holidaysContent = document.getElementById("holidays-content");
const countryName = document.getElementById("country-name");
const officialName = document.querySelector(".official-name");
const countryFlag = document.querySelector(".dashboard-country-flag");
const countryRegion = document.getElementById("country-region-text");
const localTimeValue = document.querySelector(".local-time-value");
const localTimeZone = document.querySelector(".local-time-zone");
let clockInterval;
const capitaldetails = document.getElementById("capitaldetails");
const populationdetails = document.getElementById("populationdetails");
const areadetails = document.getElementById("areadetails");
const regiondetails = document.getElementById("regiondetails");
const callingcode = document.getElementById("callingcode");
const drivingsidedetails = document.getElementById("drivingsidedetails");
const weekstartingdetails = document.getElementById("weekstartingdetails");
const currencydetails = document.getElementById("currencydetails");
const languagedetails = document.getElementById("languagedetails");
const neighborsdetails = document.getElementById("neighborsdetails");
const currentdatetime = document.getElementById("current-datetime");
const selecteddestination = document.getElementById("selected-destination");
selecteddestination.style.display = "none";
const selectedcountryflag = document.getElementById("selected-country-flag");
const selectedcountryname = document.getElementById("selected-country-name");
const selectedcityname = document.getElementById("selected-city-name");
const clearselectionbtn = document.getElementById("clear-selection-btn");
const btnmaplink = document.querySelector(".btn-map-link");
const dashboardCountryInfo = document.getElementById("dashboard-country-info");
dashboardCountryInfo.style.display = "none";
const countryInfoPlaceholder = document.getElementById("country-info-placeholder");
countryInfoPlaceholder.style.display = "block";
const exploreBtn = document.getElementById("global-search-btn");
const weatherContent = document.getElementById("weather-content");
const longWeekendsContent = document.getElementById("lw-content");
const currencyAmount = document.getElementById("currency-amount");
const currencyFrom = document.getElementById("currency-from");
const currencyTo = document.getElementById("currency-to");
const convertBtn = document.getElementById("convert-btn");
const swapCurrenciesBtn = document.getElementById("swap-currencies-btn");
const currencyResult = document.getElementById("currency-result");
const popularCurrencies = document.getElementById("popular-currencies");
const sunTimesContent = document.getElementById("sun-times-content");


//date time
function updateDateTime() {
    const now = new Date();
    currentdatetime.innerHTML = now.toLocaleString("en-US", {
        timeZone: "Africa/Cairo",
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
}
updateDateTime();


//selecting a country
globalCountry.addEventListener("change", async function () {
    const selectedCode = globalCountry.value;
    const option = document.createElement("option");
    option.value = "";
    option.innerText = "Select City";
    option.disabled = true;
    option.selected = true;
    globalCity.innerHTML = "";
    globalCity.append(option);
    displayNoCitySelected(eventsContent);

    //Details
    const countryDetails = await getCountryDetails(selectedCode);
    const moreDetails = await getMoreCountryDetails(selectedCode);
    console.log(moreDetails);
    console.log(countryDetails);
    countryName.innerHTML = countryDetails.name;
    officialName.innerHTML = moreDetails.data.objects[0].names.official;
    selecteddestination.style.display = "flex";
    selectedcountryflag.src = countryDetails.flags.png;
    selectedcountryflag.alt = countryDetails.name;
    selectedcountryname.innerHTML = countryDetails.name;
    selectedcityname.innerHTML = countryDetails.capital;
    countryFlag.src = countryDetails.flags.png;
    countryFlag.alt = countryDetails.name;
    countryRegion.innerHTML = countryDetails.region + " • " + countryDetails.subregion;
    localTimeZone.innerHTML = countryDetails.timezones[0];
    const offset = countryDetails.timezones[0].slice(3);
    const sign = offset.startsWith("-") ? -1 : 1;
    const [hours, minutes] = offset.slice(1).split(":").map(Number);
    const offsetInMinutes = sign * (hours * 60 + minutes);
    function updateClock() {
        const countryDate = new Date(Date.now() + offsetInMinutes * 60000);
        localTimeValue.innerText = countryDate.toLocaleTimeString("en-US", {
            timeZone: "UTC",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        });
    }
    clearInterval(clockInterval);
    updateClock();
    clockInterval = setInterval(updateClock, 1000);
    capitaldetails.innerHTML = countryDetails.capital;
    populationdetails.innerHTML = countryDetails.population;
    areadetails.innerHTML = countryDetails.area + "  km²";
    regiondetails.innerHTML = countryDetails.region;
    callingcode.innerHTML = "+" + countryDetails.callingCodes[0];
    drivingsidedetails.innerHTML = moreDetails.data.objects[0].cars.driving_side;
    weekstartingdetails.innerHTML = moreDetails.data.objects[0].date.start_of_week;
    currencydetails.innerHTML = countryDetails.currencies[0].name + "  (" + countryDetails.currencies[0].code + "  " + countryDetails.currencies[0].symbol + ")";
    languagedetails.innerHTML = countryDetails.languages[0].name;
    neighborsdetails.innerHTML = "";
    for( let i = 0 ; i<countryDetails.borders.length ; i++){
        neighborsdetails.innerHTML += `
        <span class="extra-tag border-tag">${countryDetails.borders[i]}</span>
        `
    }
    btnmaplink.href = `https://www.google.com/maps/place/${countryDetails.name}`;

    const countryCities = await getCountryCities(selectedCode);
    for( let i=0 ; i<countryCities.length ; i++){
        const city = countryCities[i];
        const option = document.createElement("option");
        option.innerText = city.name;
        globalCity.append(option);
    }
});


//clear button
clearselectionbtn.addEventListener("click", function () {
    selecteddestination.style.display = "none";
    globalCountry.value = "";
    globalCity.value = "";
    dashboardCountryInfo.style.display = "none";
    countryInfoPlaceholder.style.display = "block";
    displayNoCountrySelected(holidaysContent);
    displayNoCitySelected(eventsContent);
    displayWeatherNoCitySelected(weatherContent);
    displayLongWeekendsNoCountrySelected(longWeekendsContent);
});


//explore button
exploreBtn.addEventListener("click", function () {
    if (globalCountry.value == "") {
        alert("Please select a country first");
        return;
    }
    dashboardCountryInfo.style.display = "block";
    countryInfoPlaceholder.style.display = "none";
});


//showing holidays
async function showHolidays() {
    const countryCode = globalCountry.value;
    const year = globalYear.value;
    if (countryCode === "") {
        displayNoCountrySelected(holidaysContent);
        return;
    }
    const holidays = await getAllHolidays(year, countryCode);
    displayHolidays(holidays, holidaysContent);
}


globalCountry.addEventListener("change", showHolidays);
globalYear.addEventListener("change", showHolidays);
displayNoCountrySelected(holidaysContent);


globalCity.addEventListener("change", async function () {
    console.log("City Changed");
    const cityName = globalCity.value;
    const countryCode = globalCountry.value;
    if (cityName === "" || countryCode === "") {
        displayNoCitySelected(eventsContent);
        return;
    }
    const eventsData = await getAllEvents(cityName, countryCode);
    const events = eventsData._embedded?.events || [];
    displayEvents(events, eventsContent);
});
displayNoCitySelected(eventsContent);


//show weather
async function showWeather() {
    const cityName = globalCity.value;
    const countryCode = globalCountry.value;
    if (cityName === "" || countryCode === "") {
        displayWeatherNoCitySelected(weatherContent);
        return;
    }
    const coordinates = await getCityCoordinates(cityName, countryCode);
    const weatherData = await getWeatherForecast(coordinates.latitude, coordinates.longitude);
    displayWeather(weatherData, coordinates.cityName, weatherContent);
}



globalCity.addEventListener("change", function () {
    if (globalCity.value !== "") {
        showWeather();
    } else {
        displayWeatherNoCitySelected(weatherContent);
    }
});

if (globalCity.value !== "" && globalCountry.value !== "") {
    showWeather();
} else {
    displayWeatherNoCitySelected(weatherContent);
}


//show long weekends
async function showLongWeekends() {
    const countryCode = globalCountry.value;
    const year = globalYear.value;
    if (countryCode === "") {
        displayLongWeekendsNoCountrySelected(longWeekendsContent);
        return;
    }
    const longWeekends = await getLongWeekends(year, countryCode);
    displayLongWeekends(longWeekends, longWeekendsContent);
}


globalCountry.addEventListener("change", function () {
    if (globalCountry.value === "") {
        displayLongWeekendsNoCountrySelected(longWeekendsContent);
    } else {
        showLongWeekends();
    }
});


globalYear.addEventListener("change", function () {
    if (globalCountry.value !== "") {
        showLongWeekends();
    }
});


if (globalCountry.value !== "") {
    showLongWeekends();
} else {
    displayLongWeekendsNoCountrySelected(longWeekendsContent);
}


//converting currency
async function convertCurrency() {
    const amount = Number(currencyAmount.value);
    const from = currencyFrom.value;
    const to = currencyTo.value;
    if (currencyAmount.value === "" || amount < 0) {
        return;
    }
    const data = await getExchangeRates(from);
    const rate = data.rates[to];
    displayConversionResult( amount , from , to , rate , data.time_last_update_utc , currencyResult );
}


convertBtn.addEventListener("click", function () {
    convertCurrency();
});


swapCurrenciesBtn.addEventListener("click", function () {
    const fromValue = currencyFrom.value;
    currencyFrom.value = currencyTo.value;
    currencyTo.value = fromValue;
    convertCurrency();
});


async function loadPopularCurrencies() {
    const data = await getExchangeRates("USD");
    displayPopularCurrencies(data.rates, popularCurrencies);
}
loadPopularCurrencies();
convertCurrency();


//show sun times
async function showSunTimes() {
    const cityName = globalCity.value;
    const countryCode = globalCountry.value;
    if (cityName === "" || countryCode === "") {
        displaySunTimesNoCitySelected(sunTimesContent);
        return;
    }
    const coordinates = await getCityCoordinates(cityName, countryCode);
    const countryName = globalCountry.options[globalCountry.selectedIndex].textContent;
    const countryFlag = document.querySelector("#sun-times-view .selection-flag");
    const countryLabel = document.querySelector("#sun-times-view .current-selection-badge span:not(.selection-city)");
    const cityLabel = document.querySelector("#sun-times-view .selection-city");
    countryFlag.src = `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
    countryFlag.alt = countryName;
    countryLabel.textContent = countryName;
    cityLabel.textContent = `• ${coordinates.cityName}`;
    const sunTimesData = await getSunTimes( coordinates.latitude , coordinates.longitude );
    displaySunTimes( sunTimesData , coordinates.cityName , sunTimesContent );   
}


globalCity.addEventListener("change", function () {
    if (globalCity.value !== "") {
        showSunTimes();
    } else {
        displaySunTimesNoCitySelected(sunTimesContent);
    }
});


globalCountry.addEventListener("change", function () {
    if (globalCity.value === "") {
        displaySunTimesNoCitySelected(sunTimesContent);
    }
});


if (globalCity.value !== "" && globalCountry.value !== "") {
    showSunTimes();
} else {
    displaySunTimesNoCitySelected(sunTimesContent);
}