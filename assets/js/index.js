// api call https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
// search variables
const dontGetExcitedItsFree = "6d22149510653199e733a7b2e1f24c54";
let cityName = "";
let recentSearches = [];
// TODO: form to search for city
const headerEl = $("header");
const mainEl = $("main");
const searchInputEl = $("#city-searched");
const searchFormEl = $("#search-form");
// event listenters
$("#search-button").on("click", getCity);

// will give the lat and long, name, state, country. You can also omitt the country
// {
//   "name": "Torrance",
//   "local_names": {
//       "en": "Torrance"
//   },
//   "lat": 33.8358492,
//   "lon": -118.3406288,
//   "country": "US",
//   "state": "California"
// }
function getCity() {
  cityName = searchInputEl.val();
  const limit = 1;
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&${limit}&appid=${dontGetExcitedItsFree}`)
    .then(response => response.json())
    .then(data => {
      const lat = data[0].lat;
      const lon = data[0].lon;
      getCurrentWeather(lat, lon);
    });
}

function printSearchedCity(currentData){
  const timecode = currentData.dt;
  const temp = currentData.temp;
  const windSpeed = currentData.wind_speed;
  const humidity = currentData.humidity;
  const uvIndex = currentData.uvi;
  const icon = getIcon(currentData.weather[0].icon);
  const description = currentData.weather[0].description;
}
// data.current.dt for current time in timecode
// data.current.temp for temperature
// data.current.wind_speed for current wind speed
// data.current.humidity for humidity
// data.current.uvi for uv index
// data.current.weather[0].icon for special icon
// data.current.weather[0].description for brief description
function getCurrentWeather(lat, lon){
  fetch(`https://api.openweathermap.org/data/2.5/onecall?exclude=minutely&units=imperial&lat=${lat}&lon=${lon}&appid=${dontGetExcitedItsFree}`)
  .then(response => response.json())
  .then(data => {
    printSearchedCity(data.current);
  });
}

function printFiveDayForcast(daily){
  const timeCode = daily.dt;
  const icon = getIcon(daily.weather[0].icon); 
  const minTemp = daily.temp.min;
  const maxTemp = daily.temp.max;
  const windSpeed = daily.wind_speed;
  const humidity = daily.humidity;
  const description = daily.weather[0].description;
}


// data.daily[i].dt for timecode
// data.daily[i].weather[0].icon
// data.daily[i].temp.min 
// data.daily[i].temp.max
// data.daily[i].temp.day
// data.daily[i].wind_speed
// data.daily[i].humidity
// data.daily[i].weather[0].description
function getFiveDayForcast(lat, lon){
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&&appid=${dontGetExcitedItsFree}`)
  .then(response => response.json())
  .then(data => {
    for (let i=0;i<5;i++){
      printFiveDayForcast(data.daily[i]);
    }
  });
}
// TODO: get 5 day forcast from API
// TODO: single city focus gives: cityname, the date, icon for conditions, favorable, moderate, severe
// TODO: 5 day forcast gives, date, icon for conditions, temp, wind speed, humidity
// TODO: search history in local storage. 8 in history in the example.
// TODO: foundation might be a good bootsrap alternative

function getIcon(iconCode){
  fetch(`http://openweathermap.org/img/wn/${iconCode}@2x.png`)
  .then(response => response.json())
  .then(data => console.log(data));
}

function handleRecentSearches(cityName){
  if (recentSearches.includes(cityName)){
    const index  = recentSearches.indexOf(cityName);
    const removedCity = recentSearches.splice(index, 1);
    recentSearches.unshift(removedCity);
  } else if (recentSearches.length < 8){
    recentSearches.unshift(cityName);
  } else {
    recentSearches.pop()
    recentSearches.unshift(cityName);
  }
}





// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
// call to get lat and lon



