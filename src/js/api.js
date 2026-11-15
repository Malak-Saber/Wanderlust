const apiKey = "rc_live_8b2e7597c5b4473b9562e19116a700aa";


//get all countries
export async function getAllCountries(){
    const url = `https://date.nager.at/api/v3/AvailableCountries`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}


//get all details of the country
export async function getCountryDetails(code){
    const url = `https://countries.dev/alpha/${code}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}


//get cities of the country
export async function getCountryCities(code){
    const url = `https://countries.dev/cities?country=${code}&limit=3`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}


//get more details of the country
export async function getMoreCountryDetails(code){
    const url = `https://api.restcountries.com/countries/v5/codes.alpha_2/${code}`;
    const response = await fetch(url , { headers: { "Authorization": `Bearer ${apiKey}` } });
    const data = await response.json();
    return data;
}