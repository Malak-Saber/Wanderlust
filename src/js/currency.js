//get currency changes
export async function getExchangeRates(currency) {
    const url = `https://open.er-api.com/v6/latest/${currency}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}


//display results of conversion
export function displayConversionResult(amount, from, to, rate, updatedAt, currencyResult) {
    const convertedAmount = amount * rate;
    const formattedAmount = new Intl.NumberFormat( "en-US" , { minimumFractionDigits : 2 , maximumFractionDigits : 2 } ).format(amount);
    const formattedResult = new Intl.NumberFormat( "en-US" , { minimumFractionDigits : 2 , maximumFractionDigits : 2 } ).format(convertedAmount);
    currencyResult.innerHTML = `
        <div class="conversion-display">
            <div class="conversion-from">
                <span class="amount">${formattedAmount}</span>
                <span class="currency-code">${from}</span>
            </div>
            <div class="conversion-equals">
                <i class="fa-solid fa-equals"></i>
            </div>
            <div class="conversion-to">
                <span class="amount">${formattedResult}</span>
                <span class="currency-code">${to}</span>
            </div>
        </div>
        <div class="exchange-rate-info">
            <p>1 ${from} = ${rate.toFixed(4)} ${to}</p>
            <small>Last updated: ${new Date(updatedAt).toLocaleString("en-US")}</small>
            <small>Rates by <a href="https://www.exchangerate-api.com" target="_blank">ExchangeRate-API</a></small>
        </div>
    `;
}


//display popular currencies
export function displayPopularCurrencies(rates, popularCurrencies) {
    const currencyCards = popularCurrencies.querySelectorAll(".popular-currency-card");
    for (let i = 0; i < currencyCards.length; i++) {
        const currencyCode = currencyCards[i].querySelector(".code").textContent.trim();
        const rateElement = currencyCards[i].querySelector(".rate");
        if (rates[currencyCode] !== undefined) {
            rateElement.textContent = Number(rates[currencyCode]).toFixed(4);
        } else {
            rateElement.textContent = "N/A";
        }
    }
}