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
const rightSideDivEl = $("right-side")
const cityFocusDivEl = $("#city-focus");
const focusCityNameEl = $("#focus-city-name");
const focusDateEl = $("#focus-date");
const focusTempEl = $("#focus-temp");
const focusWindEl = $("#focus-wind");
const focusHumidityEl = $("#focus-humidity");
const focusUvIndexEl = $("#focus-uv-index");
// five day forcast area
const fiveDayForcastDivEl = $("#five-day-forcast");

// event listenters
$("#search-button").on("click", function(e){
  getCity(searchInputEl.val());
  fiveDayForcastDivEl.empty();
});
// functions
function getCity(city) {
  cityName = city;
  searchFormEl.trigger("reset");
  if (cityName.split(" ").length > 1){
    // thank you to Max Favilli from stackoverflow for this one
    cityName = cityName.toLowerCase().split(' ').map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
  } else {
    cityName = cityName[0].toUpperCase() + cityName.substring(1);
  }
  const limit = 1;
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&${limit}&appid=${dontGetExcitedItsFree}`)
    .then(response => response.json())
    .then(data => {
      if (data[0].lat && data[0].lon){
        const lat = data[0].lat;
        const lon = data[0].lon;
        getCurrentWeather(lat, lon);
        getFiveDayForcast(lat, lon);
        handleRecentSearches(cityName);
        printRecentSearches();
      }
    }).catch((err)=>handleSearchError(err));
  
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
  const iconEl = $("<img>").attr("src", icon);
  focusCityNameEl.append(iconEl);
  
  
  localStorage.setItem("citySearches", recentSearches.join(", "))
}

function getCurrentWeather(lat, lon){
  fetch(`https://api.openweathermap.org/data/2.5/onecall?exclude=minutely&units=imperial&lat=${lat}&lon=${lon}&appid=${dontGetExcitedItsFree}`)
  .then(response => response.json())
  .then(data => {
    printSearchedCity(data.current);
  })
  .catch(()=>handleSearchError())
}

function printFiveDayForcast(daily){
  const date = dayjs.unix(daily.dt).format("M/D/YYYY");
  const icon = getIcon(daily.weather[0].icon); 
  const minTemp = daily.temp.min;
  const maxTemp = daily.temp.max;
  const windSpeed = daily.wind_speed;
  const humidity = daily.humidity;
  // const description = daily.weather[0].description;
  const fiveDayForcastCardEl = $("<div>").attr({"id": "five-day-card", "class": "col-2 p-1 pt-2"});
  const dateTitleEl = $("<h3>").text(date);
  const iconEl = $("<img>").attr("src", icon);
  const tempEl = $("<p>").text(`Temp: ${minTemp}°F - ${maxTemp}°F`);
  const windEl = $("<p>").text(`Wind: ${windSpeed} MPH`);
  const humidityEl = $("<p>").text(`Humidity: ${humidity} %`);
  fiveDayForcastCardEl.append(dateTitleEl, iconEl, tempEl, windEl, humidityEl);
  fiveDayForcastDivEl.append(fiveDayForcastCardEl);
  $("#five-day-forcast-title").text("Five Day Forcast").css("color", "black");

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
  cityEl.on("click", (e)=> {
    getCity(e.target.textContent);
    fiveDayForcastDivEl.empty();
  })
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
}

// will display a modal if there is a problem with any yelp fetch request. 
function handleSearchError(){
  $("#search-error-message-display").text("Sorry! It seems like there was an error with your search.");
  $("#searchErrorModal").modal('show');
  recentSearches.splice(0, 1);
  $(document).on("keypress", (e)=> e.key === "Enter" ? $(".close-button").trigger("click") : console.log("now what?"));
}

function init(){
  if (localStorage.getItem("citySearches") !== null){
    let makeList = localStorage.getItem("citySearches").split(", ");
    recentSearches = [...makeList];
    printRecentSearches();
    getCity(recentSearches[0]);
  }
}

init();