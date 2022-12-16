var searchHistoryList = $('#search-history-list');
var searchCityInput = $('#search-city');
var searchCityButton = $('#search-city-button');
var clearHistoryButton = $('#clear-history');

var currentCity =$("#current-city");
var currentTemp =$("#current-temp");
var currentHumidity =$("#current-humidity");
var currentWindSpeed =$("current-wind-speed");
var UVindex = $("#uv-index");

var weatherContent = $("#weather-content");

var APIkey = "a0af21eae700b0b06e138c8932d7db83";

var cityList = [];

var currentDate = dayjs().format('L');
$("#current-date").text("(" + currentDate + ")");

initializeHostory();
showClear();

$(document).on("submit", function(event){
    event.preventDefault();

    var searchValue = searchCityInput.val().trim();

    currentConditionsRequest(searchValue)
    searchHistoryList(searchValue);
    searchCityInput.val("");
});