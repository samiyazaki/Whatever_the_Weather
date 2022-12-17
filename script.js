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
    }).then(function(response){
        console.log(response);
        currentCity.text(response.name);
        currentCity.append("<small class ='text-muted' id='current-date'>");
        $("#current-date").text("(" + currentDate + ")");
        currentCity.append("<img src='https://openweathermap.org/img/w/" + response.weather[0].icon + ".png' alt='" + response.weather[0].main + "' />")
        currentTemp.text(response.main.temp);
        currentTemp.append("&deg;F");
        currentHumidity.text(response.main.humidity +"%");
        currentWindSpeed.text(response.wind.speed + "MPH");

        var lat = response.coord.lat;
        var lon = response.coord.lon;

        var countryCode = response.sys.country;
        var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=" + APIkey +"&lat=" + lat + "&lon=" + lon;

        $.ajax({
            url: forecastURL,
            method: "GET"
        }).then(function(response){
            console.log(response);
            $('#five-day-forecast').empty();
            for (var i = 1; i< response.list.length; i+=8) {
                var forecastDateString = dayjs(response.list[i].dt_txt).format("L");
                console.log(forecastDateString);

                var forecastCol= $("<div class-'col-12 col-md-6 col-lg forecast-day mb-3'>");
                var forecastCard = $("<div class='card'>");
                var forecastCardBody=$("<div class='card-body'>");
                var forecastDate = $("<h5 class ='card-title'>");
                var forecastIcon = $("<img>");
                var forecastTemp = $("<p class ='card-text mb-0'>");
                var forecastHumidity = $("<p class ='card-text mb-0'>");

                forecastIcon.attr("src", "https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                forecastIcon.attr("alt", response.list[i].weather[0].main);
                forecastDate.text(forecastDateString);
                forecastTemp.text(response.list[i].main.temp);
                forecastTemp.prepend("temp: ");
                forecastTemp.append("&deg;F");
                forecastHumidity.text(response.list[i].main.humidity);
                forecastHumidity.prepend("Humidity: ");
                forecastHumidity.append("%");
            }
        });

        });

    };

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
