//These are my variables. There are many like it, but this one is mine.
var searchHerstoryList = $("#search-history-list");
var searchCity = $("#search-city");
var searchCityButton = $("#search-city-button");
var currentCity = $("#current-city");
var currentTemp = $("#current-temp");
var currentHumidity = $("#current-humidity");
var currentWindSpeed = $("#current-wind-speed");
var weatherContent = $("#weather-content");
var cityList = [];
/*var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)*/
var currentDate = dayjs().format("dddd, MM/DD/YYYY"); //dayjs to help us find the time and utilize data for the 5 day forecast

$("#current-date").text("(" + currentDate + ")");
initializeHistory(); // loads the localStorage cities so you can see them on the side

searchCityButton.on("click", function () { //click the search button to start the process
  event.preventDefault();//Don't want the page to reload
  var searchValue = searchCity.val().trim();//setting the searchvalue to the input, removing extra spaces so I don't get errors or multiples of the same location
  currentConditionsRequest(searchValue);// For the AJAX request to openWeather API
  searchHistory(searchValue);// Adding the value to the history to store it for my glowy list
  searchCity.val("");
});

$(document).on("submit", function () { //Want to go faster? The same function as above works on hitting the enter key
  event.preventDefault(); 
  var searchValue = searchCity.val().trim();
  currentConditionsRequest(searchValue); 
  searchHistory(searchValue); 
  searchCity.val(""); 
});

searchHerstoryList.on("click", "li.city-btn", function () { // When one of the city buttons are clicked in the "Herstory" list, run the function
  var value = $(this).data("value"); //sets the search value to the stored item value
  currentConditionsRequest(value);
  searchHistory(value);
});

function currentConditionsRequest(searchValue) { //Here's where we make an AJAX request to the OpenWeatherMap API to retrieve current conditions in the city input which is set as searchValue
  var queryURL = 
    "https://api.openweathermap.org/data/2.5/weather?q=" +//pulling from the secure site
    searchValue + //utilizing the input value item 
    "&units=imperial&appid=a0af21eae700b0b06e138c8932d7db83"; // Sets the measurements to "colonizer" instead of the metric system because I'm from America and we are contrarians.

  $.ajax({ //AJAX call; not to the inferior greek prince of Salamis, but an Asynchronous JavaScript And XML call. To send and receive data in multiple formats.
    url: queryURL, //using the variable URL we created with my API key to get the data for the current date for the city input
    method: "GET", //get the data from the API site
  }).then(function (get) { // get is the argument used to pass the data from the api
    console.log(get);
    currentCity.text(get.name); // sets the returned name to text
    currentCity.append("<small class ='text-muted' id='current-date'>"); // adds dayjs data to the form
    $("#current-date").text("(" + currentDate + ")");
    currentCity.append(
      "<img src='https://openweathermap.org/img/w/" +
      get.weather[0].icon + // gets icon from openweathermap
        ".png' alt='" +
        get.weather[0].main + //gets alt text from openweathermap
        "' />"
    );
    currentTemp.text(get.main.temp ); // pulls current temperature data from openweathermap
    currentTemp.append(" " + "&deg; F"); // Adds the degree symbol and F for farenheit because I used imperial data. Couldn't get the degree symbol to work in the previous call so I added an append.
    currentHumidity.text(get.main.humidity + " %"); // gets the humidity and adds %
    currentWindSpeed.text(get.wind.speed + " MPH"); // gets the wind speed and adds MPH

    var lat = get.coord.lat; // gets lat and long data from OpenWeatherMap and creates coordinates 
    var lon = get.coord.lon;

    var forecastURL = //setting up another URL for an AJAX call, but including the lat and lon coordinates
      "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=a0af21eae700b0b06e138c8932d7db83" +

      "&lat=" +
      lat +
      "&lon=" +
      lon;

    $.ajax({ //Looking familiar?
      url: forecastURL,
      method: "GET",
    }).then(function (get) {
      console.log(get);
      $("#five-day-forecast").empty();
      for (var i = 1; i < get.list.length; i += 8) { //Setting up the 5 day forecast data
        var forecastDateString = dayjs(get.list[i].dt_txt).format(
          "dddd, MM/DD/YYYY" // Using dayjs format to set the date info 
        );
        console.log(forecastDateString);

        var forecastCol = $(
          "<div class='col-12 col-md-6 col-lg forecast-day mb-3'>" //creating the variables as cards so they can be created and populated with the data pulled from OpenWeatherMap
        );
        var forecastCard = $("<div class='card'>");
        var forecastCardBody = $("<div class='card-body'>");
        var forecastDate = $("<h5 class ='card-title'>"); // giving the date a header 5 element to make it slightly bigger
        var forecastIcon = $("<img>"); //including the pulled icon image
        var forecastTemp = $("<p class ='card-text mb-0'>");
        var forecastHumidity = $("<p class ='card-text mb-0'>");
        var forecastWindSpeed = $("<p class = 'card-text mb-0'>");

        $("#five-day-forecast").append(forecastCol);
        forecastCol.append(forecastCard);
        forecastCard.append(forecastCardBody);

        forecastCardBody.append(forecastDate); //appending each of the cards with data drawn from the variables
        forecastCardBody.append(forecastIcon);
        forecastCardBody.append(forecastTemp);
        forecastCardBody.append(forecastHumidity);
        forecastCardBody.append(forecastWindSpeed);

        forecastIcon.attr(
          "src",
          "https://openweathermap.org/img/w/" +
          get.list[i].weather[0].icon +
            ".png"
        );
        forecastIcon.attr("alt", get.list[i].weather[0].main);
        forecastDate.text(forecastDateString);
        forecastTemp.text(get.list[i].main.temp); // get the data from the site
        forecastTemp.prepend("Temp: "); // set the text before
        forecastTemp.append(" &deg;F"); // set the symbol after
        forecastHumidity.text(get.list[i].main.humidity);
        forecastHumidity.prepend("Humidity: ");
        forecastHumidity.append(" %");
        forecastWindSpeed.text(get.list[i].wind.speed);
        forecastWindSpeed.prepend("Wind Speed: ");
        forecastWindSpeed.append("MPH");
      }
    });
  });
}

function searchHistory(searchValue) { // searching the prior items added to the list and stored in local
  if (searchValue) {
    if (cityList.indexOf(searchValue) === -1) { // if it's not there, add it in
      cityList.push(searchValue);

      listArray();
      weatherContent.removeClass("hide");
    } else {
      var removeIndex = cityList.indexOf(searchValue);
      cityList.splice(removeIndex, 1); // if it's there, 

      cityList.push(searchValue);

      listArray();
    }
  }
}

function listArray() {
  searchHerstoryList.empty(); // clears the search list

  cityList.forEach(function (city) {
    var searchHistoryItem = $('<li class ="list-group-item city-btn">');
    searchHistoryItem.attr("data-value", city);
    searchHistoryItem.text(city);
    searchHerstoryList.prepend(searchHistoryItem);
  });

  localStorage.setItem("cities", JSON.stringify(cityList)); // set input items to "cities" and setting it to a JSON string so it persists beyond page reloads
}

function initializeHistory() {
  if (localStorage.getItem("cities")) { // searches for local storage items called "cities" 
    cityList = JSON.parse(localStorage.getItem("cities")); // gets items labeled "cities" from local storage
    var lastIndex = cityList.length - 1;

    listArray();

    if (cityList.length !== 0) { // if there is anything in the list...
      currentConditionsRequest(cityList[lastIndex]);
      weatherContent.removeClass("hide"); // stop hiding the list
    }
  }
}
