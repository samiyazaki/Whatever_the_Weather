//These are my variables. There are many like it, but this one is mine.
var searchHerstoryList = $("#search-history-list");
var searchCity = $("#search-city");
var searchCityButton = $("#search-city-button");
var currentCity = $("#current-city");
var currentTemp = $("#current-temp");
var currentHumidity = $("#current-humidity");
var currentWindSpeed = $("#current-wind-speed");
var weatherContent = $("#weather-content");
var APIkey = "a0af21eae700b0b06e138c8932d7db83"; //API key variable to avoid retyping it every time? Dude on Youtube told me to try it and I am fairly whelmed.
var cityList = [];
/*var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)*/
var currentDate = dayjs().format("dddd, MM/DD/YYYY"); //dayjs to help us find the time and utilize data for the 5 day forecast

$("#current-date").text("(" + currentDate + ")");
initializeHistory(); // loads the localStorage cities so you can see them on the side

searchCityButton.on("click", function (event) { //click the search button to start the process
  event.preventDefault();//Don't want the page to reload
  var searchValue = searchCity.val().trim();//setting the searchvalue to the input, removing extra spaces so I don't get errors or multiples of the same location
  currentConditionsRequest(searchValue);// For the AJAX request to openWeather API
  searchHistory(searchValue);// Adding the value to the history to store it for my glowy list
  searchCity.val("");
});

$(document).on("submit", function (event) { //Want to go faster? The same function as above works on hitting the enter key
  event.preventDefault(); 
  var searchValue = searchCity.val().trim();
  currentConditionsRequest(searchValue); 
  searchHistory(searchValue); 
  searchCity.val(""); 
});

searchHerstoryList.on("click", "li.city-btn", function (event) {
  var value = $(this).data("value");
  currentConditionsRequest(value);
  searchHistory(value);
});

function currentConditionsRequest(searchValue) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    searchValue +
    "&units=imperial&appid=" +
    APIkey;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    currentCity.text(response.name);
    currentCity.append("<small class ='text-muted' id='current-date'>");
    $("#current-date").text("(" + currentDate + ")");
    currentCity.append(
      "<img src='https://openweathermap.org/img/w/" +
        response.weather[0].icon +
        ".png' alt='" +
        response.weather[0].main +
        "' />"
    );
    currentTemp.text(response.main.temp);
    currentTemp.append(" " + "&deg; F");
    currentHumidity.text(response.main.humidity + " %");
    currentWindSpeed.text(response.wind.speed + " MPH");

    var lat = response.coord.lat;
    var lon = response.coord.lon;

    var forecastURL =
      "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=" +
      APIkey +
      "&lat=" +
      lat +
      "&lon=" +
      lon;

    $.ajax({
      url: forecastURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      $("#five-day-forecast").empty();
      for (var i = 1; i < response.list.length; i += 8) {
        var forecastDateString = dayjs(response.list[i].dt_txt).format(
          "dddd, MM/DD/YYYY"
        );
        console.log(forecastDateString);

        var forecastCol = $(
          "<div class='col-12 col-md-6 col-lg forecast-day mb-3'>"
        );
        var forecastCard = $("<div class='card'>");
        var forecastCardBody = $("<div class='card-body'>");
        var forecastDate = $("<h5 class ='card-title'>");
        var forecastIcon = $("<img>");
        var forecastTemp = $("<p class ='card-text mb-0'>");
        var forecastHumidity = $("<p class ='card-text mb-0'>");
        var forecastWindSpeed = $("<p class = 'card-text mb-0'>");

        $("#five-day-forecast").append(forecastCol);
        forecastCol.append(forecastCard);
        forecastCard.append(forecastCardBody);

        forecastCardBody.append(forecastDate);
        forecastCardBody.append(forecastIcon);
        forecastCardBody.append(forecastTemp);
        forecastCardBody.append(forecastHumidity);
        forecastCardBody.append(forecastWindSpeed);

        forecastIcon.attr(
          "src",
          "https://openweathermap.org/img/w/" +
            response.list[i].weather[0].icon +
            ".png"
        );
        forecastIcon.attr("alt", response.list[i].weather[0].main);
        forecastDate.text(forecastDateString);
        forecastTemp.text(response.list[i].main.temp);
        forecastTemp.prepend("Temp: ");
        forecastTemp.append(" &deg;F");
        forecastHumidity.text(response.list[i].main.humidity);
        forecastHumidity.prepend("Humidity: ");
        forecastHumidity.append(" %");
        forecastWindSpeed.text(response.list[i].wind.speed);
        forecastWindSpeed.prepend("Wind Speed: ");
        forecastWindSpeed.append("MPH");
      }
    });
  });
}

function searchHistory(searchValue) {
  if (searchValue) {
    if (cityList.indexOf(searchValue) === -1) {
      cityList.push(searchValue);

      listArray();
      clearHistoryButton.removeClass("hide");
      weatherContent.removeClass("hide");
    } else {
      var removeIndex = cityList.indexOf(searchValue);
      cityList.splice(removeIndex, 1);

      cityList.push(searchValue);

      listArray();
    }
  }
}

function listArray() {
  searchHerstoryList.empty();

  cityList.forEach(function (city) {
    var searchHistoryItem = $('<li class ="list-group-item city-btn">');
    searchHistoryItem.attr("data-value", city);
    searchHistoryItem.text(city);
    searchHerstoryList.prepend(searchHistoryItem);
  });

  localStorage.setItem("cities", JSON.stringify(cityList));
}

function initializeHistory() {
  if (localStorage.getItem("cities")) {
    cityList = JSON.parse(localStorage.getItem("cities"));
    var lastIndex = cityList.length - 1;

    listArray();

    if (cityList.length !== 0) {
      currentConditionsRequest(cityList[lastIndex]);
      weatherContent.removeClass("hide");
    }
  }
}
