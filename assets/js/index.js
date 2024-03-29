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
// search button will call the get city method as well as refresh the five-day forcast.
$("#search-button").on("click", function (e) {
  getCity(searchInputEl.val());
  fiveDayForcastDivEl.empty();
});
// The open weather API seemed to have problems at times if the state was given without a country code, so the 
// user is limited to just providing a city name for now.
function getCity(city) {
  cityName = city.toLowerCase()
  if (city.match(/,/g)) {
    // a modal will be called if this error is triggered
    handleSearchError();
    return;
  } 
  searchFormEl.trigger("reset");
  // if the city name has more than one word, this statement will title case the city
  if (cityName.split(" ").length > 1) {
    // thank you to Max Favilli from stackoverflow for this one
    cityName = cityName.toLowerCase().split(' ').map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
  } else {
    cityName = cityName[0].toUpperCase() + cityName.substring(1);
    
  }
  // fetch request will return the latitude and longitude for a given city, then call the current and 5-day forcast.
  // If the search is successful, the city will be saved in local storage and printed to the screen.
  const limit = 1;
  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&${limit}&appid=${dontGetExcitedItsFree}`)
    .then(response => response.json())
    .then(data => {
      if (data[0].lat && data[0].lon) {
        const lat = data[0].lat;
        const lon = data[0].lon;
        getCurrentWeather(lat, lon);
        getFiveDayForcast(lat, lon);
        handleRecentSearches(cityName);
        printRecentSearches();
      }
    }).catch((err) => handleSearchError(err));

}
// Here we will print the current weather data to the screen and save the search to local storage.
function printSearchedCity(currentData) {
  const dateParse = dayjs.unix(currentData.dt);
  focusCityNameEl.text(cityName + " (");
  let newFocusDate = $("<span id='focus-date'>").text(dateParse.format("MM-DD-YYYY") + ")");
  focusCityNameEl.append(newFocusDate)
  focusTempEl.text("Temp: " + currentData.temp + "°F");
  focusWindEl.text("Wind: " + currentData.wind_speed + "MPH");
  focusHumidityEl.text("Humidity: " + currentData.humidity + "%");
  let uviBackgroundColor = "";
  if (currentData.uvi >= 0 && currentData.uvi < 2){
    uviBackgroundColor = "rgb(59, 124, 84)";//green
  } else if (currentData.uvi >= 3 && currentData.uvi < 5){
    uviBackgroundColor = "#7D7036"//yellow
  } else {
    uviBackgroundColor = "#7D332F"//red
  }
  focusUvIndexEl.text("UV Index: ");
  let newFocusUvi = $("<span id='focus-uvi'>").text(currentData.uvi).css({"padding": "4px 12px", "background-color": `${uviBackgroundColor}`, "color": "white", "border-radius": "3px"});
  focusUvIndexEl.append(newFocusUvi);
  const icon = getIcon(currentData.weather[0].icon);
  const iconEl = $("<img>").attr("src", icon);
  focusCityNameEl.append(iconEl);


  localStorage.setItem("citySearches", recentSearches.join(", "))
}
// function will get current weather for the specific geolocation.
function getCurrentWeather(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/onecall?exclude=minutely&units=imperial&lat=${lat}&lon=${lon}&appid=${dontGetExcitedItsFree}`)
    .then(response => response.json())
    .then(data => {
      printSearchedCity(data.current);
    })
    .catch(() => handleSearchError())
}
// function will print the 5-day forcast to screen.
function printFiveDayForcast(daily) {
  const date = dayjs.unix(daily.dt).format("M/D/YYYY");
  const icon = getIcon(daily.weather[0].icon);
  const temp = daily.temp.day;
  const windSpeed = daily.wind_speed;
  const humidity = daily.humidity;
  const fiveDayForcastCardEl = $("<div>").attr({"class": "five-day-card col-2 p-1 pt-2" });
  const dateTitleEl = $("<h3>").text(date);
  const iconEl = $("<img>").attr("src", icon);
  const tempEl = $("<p>").text(`Temp: ${temp}°F`);
  const windEl = $("<p>").text(`Wind: ${windSpeed} MPH`);
  const humidityEl = $("<p>").text(`Humidity: ${humidity} %`);
  fiveDayForcastCardEl.append(dateTitleEl, iconEl, tempEl, windEl, humidityEl);
  fiveDayForcastDivEl.append(fiveDayForcastCardEl);
  $("#five-day-forcast-title").text("Five Day Forcast").css("color", "black");

}
// function will print the recently searched cities
function printRecentSearches() {

  if (recentSearchesEl.children().length > 0) {
    for (let i = 0; i < recentSearchesEl.children().length; i++) {
      recentSearchesEl.children()[i].remove();
    }
  }
// neat trick to clear the html. The recent-search-item buttons will also be given event listeners for 
// repeat searches at a later point.
  recentSearchesEl.html("")
  recentSearches.forEach(city => {
    const cityEl = $("<button>").text(city);
    cityEl.addClass("recent-search-item btn");
    cityEl.on("click", (e) => {
      getCity(e.target.textContent);
      fiveDayForcastDivEl.empty();
    })
    recentSearchesEl.append(cityEl);
  })
}
// fetch the five-day forcast
function getFiveDayForcast(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${dontGetExcitedItsFree}`)
    .then(response => response.json())
    .then(data => {
      for (let i = 0; i < 5; i++) {
        printFiveDayForcast(data.daily[i]);
      }
    });
}

// url for the appropriate weather icon.
function getIcon(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
// function will keep the order of recent searches accurate and limited to up to 8 recent searches
function handleRecentSearches(cityName) {
  if (recentSearches.includes(cityName)) {
    const index = recentSearches.indexOf(cityName);
    const removedCity = recentSearches.splice(index, 1);
    recentSearches.unshift(removedCity[0]);
  } else if (recentSearches.length < 8) {
    recentSearches.unshift(cityName);
  } else {
    recentSearches.pop()
    recentSearches.unshift(cityName);
  }
}

// will display a modal if are errors on the search or API calls.  
function handleSearchError() {
  $("#search-error-message-display").text("Sorry! It seems like there was an error with your search. Try to only list a city.");
  $("#searchErrorModal").modal('show');
  recentSearches.splice(0, 1);
  $(document).on("keypress", (e) => {
    if (e.key === "Enter") {
      $(".close-button").trigger("click")
    }
  })
}
// call local storage at the start of the page load and display the recent searches to the screen.
function init() {
  if (localStorage.getItem("citySearches") !== null) {
    let makeList = localStorage.getItem("citySearches").split(", ");
    recentSearches = [...makeList];
    printRecentSearches();
    getCity(recentSearches[0]);
  }
}

init();