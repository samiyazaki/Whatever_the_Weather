var searchHistoryList = $('#search-history-list');
var searchCityInput = $('#search-city');
var searchCityButton = $('#search-city-button');

var currentCity =$("#current-city");
var currentTemp =$("#current-temp");
var currentHumidity =$("#current-humidity");
var currentWindSpeed =$("current-wind-speed");


var weatherContent = $("#weather-content");

var APIkey = "a0af21eae700b0b06e138c8932d7db83";

var cityList = [];

var currentDate = dayjs().format('L');
$("#current-date").text("(" + currentDate + ")");

initializeHistory();
showClear();

$(document).on("submit", function(){
    event.preventDefault();

    var searchValue = searchCityInput.val().trim();

    currentConditionsRequest(searchValue)
    searchHistoryList(searchValue);
    searchCityInput.val("");
});

searchCityButton.on("click", function(event){
    event.preventDefault();
    var searchValue = searchCityInput.val().trim();
    currentConditionsRequest(searchValue)
    searchHistory(searchValue);
    searchCityInput.val("");
});

searchHistoryList.on("click","li.city-btn", function(event){
    var value=$(this).data("value");
    currentConditionsRequest(value);
    searchHistory(value);
});

function currentConditionsRequest(searchValue) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&units=imperial&appid=" + APIkey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(functio(response){
        console.log(response);
        currentCity.text(response.name);
        currentCity.append("<small class ='text-muted' id='current-date'>");
        $("#current-date").text("(" + currentDate + ")");
        currentCity.append("<img src='https://openweathermap.org/img/w/" +response.weather[0].icon +B)
    })
}