// api call https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
// search variables
const dontGetExcitedItsFree = "6d22149510653199e733a7b2e1f24c54";
let cityName = "";
let recentSearches = [];
// element references
const headerEl = $("header");
const mainEl = $("main");
const searchInputEl = $("#city-searched");
const searchFormEl = $("#search-form");
const recentSearchesEl = $("#recent-searches");
// city focus area
const cityFocusDivEl = $("#city-focus");
const focusCityNameEl = $("#focus-city-name");
const focusDateEl = $("#focus-date");
const focusTempEl = $("#focus-temp");
const focusWindEl = $("#focus-wind");
const focusHumidityEl = $("#focus-humidity");
const focusUvIndexEl = $("#focus-uv-index");
// event listenters
$("#search-button").on("click", getCity);
// functions
function getCity() {
  cityName = searchInputEl.val();
  cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1) // will miss more than the first word
  const limit = 1;
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&${limit}&appid=${dontGetExcitedItsFree}`)
    .then(response => response.json())
    .then(data => {
      const lat = data[0].lat;
      const lon = data[0].lon;
      getCurrentWeather(lat, lon);
    });
  handleRecentSearches(cityName);
  printRecentSearches();
}

function printSearchedCity(currentData){
  const dateParse = dayjs.unix(currentData.dt);
  focusCityNameEl.text(cityName + " (");
  let newFocusDate = $("<span id='focus-date'>").text(dateParse.format("MM-DD-YYYY") + ")");
  focusCityNameEl.append(newFocusDate)
  focusTempEl.text("Temp: " + currentData.temp + "°F");
  focusWindEl.text("Wind: " + currentData.wind_speed + "MPH");
  focusHumidityEl.text("Humidity: " + currentData.humidity + "%");
  focusUvIndexEl.text("UV Index: ");
  let newFocusUvi = $("<span id='focus-uvi'>").text(currentData.uvi);
  focusUvIndexEl.append(newFocusUvi);
  const icon = getIcon(currentData.weather[0].icon);
  const description = currentData.weather[0].description;
  const iconEl = $("<img>").attr("src", icon);
  focusCityNameEl.append(iconEl);
}

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

function printRecentSearches(){
  // TODO: removed anything already displayed on the page
  if (recentSearchesEl.children().length > 0){
    for (let i=0;i<recentSearchesEl.children().length;i++){
      recentSearchesEl.children()[i].remove();// removing all but the last search
    }
  }

  recentSearchesEl.html("")
  recentSearches.forEach(city=>{
  const cityEl = $("<button>").text(city);
  cityEl.addClass("recent-search-item btn");
  recentSearchesEl.append(cityEl);
  })
  
  }

function getFiveDayForcast(lat, lon){
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&&appid=${dontGetExcitedItsFree}`)
  .then(response => response.json())
  .then(data => {
    for (let i=0;i<5;i++){
      printFiveDayForcast(data.daily[i]);
    }
  });
}


function getIcon(iconCode){
  return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function handleRecentSearches(cityName){
  if (recentSearches.includes(cityName)){
    const index  = recentSearches.indexOf(cityName);
    const removedCity = recentSearches.splice(index, 1);
    console.log(removedCity)
    recentSearches.unshift(removedCity[0]);
  } else if (recentSearches.length < 8){
    recentSearches.unshift(cityName);
  } else {
    recentSearches.pop()
    recentSearches.unshift(cityName);
  }
  console.log(recentSearches);
}

// TODO: search history in local storage. 8 in history in the example.