// api call https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
// search variables



// TODO: form to search for city
// const headerEl = $("header");
// const mainEl = $("main");
// const searchInputEl = $("#city-searched");
// const searchFormEl = $("#search-form");
// // event listenters
// $("#search-button").on("click", ()=>cityName = searchInputEl.val());


// TODO: get 5 day forcast from API
// TODO: single city focus gives: cityname, the date, icon for conditions, favorable, moderate, severe
// TODO: 5 day forcast gives, date, icon for conditions, temp, wind speed, humidity
// TODO: search history in local storage. 8 in history in the example.
// TODO: foundation might be a good bootsrap alternative





// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
// call to get lat and lon


var cityName = "Los Angeles";
const stateCode = "CA";
const countryCode = 1;
const limit = 5;
const dontGetExcitedItsFree = "6d22149510653199e733a7b2e1f24c54";
fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&${limit}&appid=${dontGetExcitedItsFree}`)
  .then(response => response.json())
  .then(data => console.log(data));