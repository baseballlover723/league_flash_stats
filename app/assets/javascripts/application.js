// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .
//= require foundation

$(document).foundation();

//get weather information from the openweathermap api and display it with a widget
function getWeather(latitude, longitude){
	console.log('getting weather');
  var weather = {};
  $.ajax({
    url: 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude,
    type : 'GET',
    dataType : 'json',
    data : {

    },
    success : function(resp) {
      weather = {
        //all weather is given in kelvin, conver to fahrenheit
        current: ((resp.main.temp - 273.15) * 1.8 + 32).toFixed(2),
        max: ((resp.main.temp_max - 273.15) * 1.8 + 32).toFixed(2),
        min: ((resp.main.temp_min - 273.15) * 1.8 + 32).toFixed(2),
        humidity: resp.main.humidity,
        //clouds in %
        clouds: resp.clouds.all,
        //wind in meters/second
        //multiply by 2.23 to make it miles/hr
        wind: resp.wind.speed * 2.23694,
        description: resp.weather[0].description,
        icon: "http://openweathermap.org/img/w/" + resp.weather[0].icon + ".png"
      };
      makeWeatherWidget(weather);
    },
      error : function(XMLHttpRequest, textStatus, errorThrown) {
        alert(XMLHttpRequest);
    }
  });
}

function toTitleCase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function makeWeatherWidget(weather){
  var weatherArea = document.getElementById('weatherArea');
  weatherArea.style.height = "220px";


  var currentTemperature = document.createElement("span");
  currentTemperature.innerHTML = "Current Temperature: " + weather.current + "&degF";
  currentTemperature.style.height = "30px";
  currentTemperature.style.width = "290px";
  currentTemperature.style.fontSize = "18px";
  currentTemperature.style.paddingTop = "19px";
  currentTemperature.style.textAlign = "center";
  currentTemperature.style.display = "inline-block";
  currentTemperature.style.marginLeft = "35%";
  weatherArea.appendChild(currentTemperature);

  var weatherPic = document.createElement("img");
  weatherPic.src = weather.icon;
  weatherPic.style.width = "5%";
  weatherArea.appendChild(weatherPic);

  var highLow = document.createElement("div");
  highLow.innerHTML = "High: " + weather.max + "&degF  Low: " + weather.min + "&degF";
  highLow.style.height = "20px";
  highLow.style.width = "100%";
  highLow.style.float = "right";
  highLow.style.fontSize = "16px";
  highLow.style.paddingTop = "3px";
  highLow.style.paddingBottom = "3px";
  highLow.style.textAlign = "center";
  weatherArea.appendChild(highLow);

  var cloud = document.createElement("div");
  cloud.innerHTML = "Clouds: " + weather.clouds + "%";
  cloud.style.height = "20px";
  cloud.style.width = "100%";
  cloud.style.float = "right";
  cloud.style.fontSize = "16px";
  cloud.style.paddingTop = "3px";
  cloud.style.paddingBottom = "3px";
  cloud.style.textAlign = "center";
  weatherArea.appendChild(cloud);

  var humidity = document.createElement("div");
  humidity.innerHTML = "Humidity: " + weather.humidity + "%";
  humidity.style.height = "20px";
  humidity.style.width = "100%";
  humidity.style.float = "right";
  humidity.style.fontSize = "16px";
  humidity.style.paddingTop = "3px";
  humidity.style.paddingBottom = "3px";
  humidity.style.textAlign = "center";
  weatherArea.appendChild(humidity);

  var wind = document.createElement("div");
  wind.innerHTML = "Wind: " + weather.wind.toFixed(2) + "MPH";
  wind.style.height = "20px";
  wind.style.width = "100%";
  wind.style.float = "right";
  wind.style.fontSize = "16px";
  wind.style.paddingTop = "3px";
  wind.style.paddingBottom = "3px";
  wind.style.textAlign = "center";
  weatherArea.appendChild(wind);

  var description = document.createElement("div");
  description.innerHTML = toTitleCase(weather.description) + ".  <span id='greatDay'>Great Weather to Play League In</span>";
  description.style.height = "20px";
  description.style.width = "100%";
  description.style.float = "right";
  description.style.fontSize = "16px";
  description.style.paddingTop = "3px";
  description.style.paddingBottom = "3px";
  description.style.textAlign = "center";
  weatherArea.appendChild(description);

}