var winChart, lossChart;
var chartOptions = {
  //Boolean - Whether we should show a stroke on each segment
  segmentShowStroke : true,

  //String - The colour of each segment stroke
  segmentStrokeColor : "#fff",

  //Number - The width of each segment stroke
  segmentStrokeWidth : 2,

  //Number - The percentage of the chart that we cut out of the middle
  percentageInnerCutout : 50, // This is 0 for Pie charts

  //Number - Amount of animation steps
  animationSteps : 100,

  //String - Animation easing effect
  animationEasing : "easeOutBounce",

  //Boolean - Whether we animate the rotation of the Doughnut
  animateRotate : true,

  //Boolean - Whether we animate scaling the Doughnut from the centre
  animateScale : false,

  //String - A legend template
  legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

};

$( document ).ready(function() {
    console.log( "ready!" );
    
    function showPosition(position) {
        getWeather(position.coords.latitude, position.coords.longitude);
    }

    function getLocation()
    {
        if (navigator.geolocation)
        {
            if(document.getElementById("currentTemp"))
            {
                console.log("already there");
            }
            else
            {
                navigator.geolocation.getCurrentPosition(showPosition);
            }
        }
        else
        {
            alert("Geolocation is not supported by this browser. Will not be able to display weather widget.");
        }
    }

    var startingData1 = [
        {
            value: 50,
            color:"#F7464A",
            highlight: "pink",
            label: "Top"
        },
        {
            value: 50,
            color: "#46BFBD",
            highlight: "pink",
            label: "Jungle"
        },
        {
            value: 50,
            color: "#FDB45C",
            highlight: "pink",
            label: "Mid"
        },
        {
            value: 50,
            color: "purple",
            highlight: "pink",
            label: "Bot"
        }
    ];

    var startingData2 = [
        {
            value: 50,
            color:"#F7464A",
            highlight: "pink",
            label: "Top"
        },
        {
            value: 50,
            color: "#46BFBD",
            highlight: "pink",
            label: "Jungle"
        },
        {
            value: 50,
            color: "#FDB45C",
            highlight: "pink",
            label: "Mid"
        },
        {
            value: 50,
            color: "purple",
            highlight: "pink",
            label: "Bot"
        }
    ];


    var ctx = document.getElementById("chart").getContext("2d");
    winChart = new Chart(ctx).Doughnut(startingData1, chartOptions);

    var ctx2 = document.getElementById("chart2").getContext("2d");
    lossChart = new Chart(ctx2).Doughnut(startingData2, chartOptions);
});
 
function getCheckedCheckboxesFor(callback) {
  var checkboxName = 'rank';
    var allName = "all";
    var checkboxes = document.querySelectorAll('input[name="' + checkboxName + '"]:checked'), values = [];
    Array.prototype.forEach.call(checkboxes, function(element) {
        values.push(element.value);
    });

    var all = document.querySelectorAll('input[name="' + allName + '"]:checked');
    Array.prototype.forEach.call(all, function(element) {
        element.checked = false;
    });

    populateTables(values, callback);

    return values;
}

function checkedAll(callback){
    var checkboxName = "rank";
    var allName = "all";
    var checkboxes = document.querySelectorAll('input[name="' + checkboxName + '"]:checked');
    Array.prototype.forEach.call(checkboxes, function(element) {
        element.checked = false;
    });

    values = ["unranked", "bronze", "silver", "gold", "platinum", "diamond", "master", "challenger"];
    populateTables(values, callback);
    return values;
}

function populateTables(ranks, callback){
  //overall
  var releventOverallData = getRank(overallData.flash_on_d, ranks);
  $('#overall .dGamesOverall').html(releventOverallData.games);
  $('#overall .dWinsOverall').html(releventOverallData.wins);
  $('#overall .dLossesOverall').html(releventOverallData.losses);
  var percent = (releventOverallData.wins * 100 / releventOverallData.games).toFixed(2);
  $('#overall .dPercentOverall').html(isNaN(percent) ? 0 : percent);

  releventOverallData = getRank(overallData.flash_on_f, ranks);
  $('#overall .fGamesOverall').html(releventOverallData.games);
  $('#overall .fWinsOverall').html(releventOverallData.wins);
  $('#overall .fLossesOverall').html(releventOverallData.losses);
  percent = (releventOverallData.wins * 100 / releventOverallData.games).toFixed(2);
  $('#overall .fPercentOverall').html(isNaN(percent) ? 0 : percent);

  releventOverallData = getRank(overallData.no_flash, ranks);
  $('#overall .nGamesOverall').html(releventOverallData.games);
  $('#overall .nWinsOverall').html(releventOverallData.wins);
  $('#overall .nLossesOverall').html(releventOverallData.losses);
  percent = (releventOverallData.wins * 100 / releventOverallData.games).toFixed(2);
  $('#overall .nPercentOverall').html(isNaN(percent) ? 0 : percent);

  //top
  var releventTopData = getRank(topData.flash_on_d, ranks);
  var topWins = 0;
  var topLosses = 0;
  $('#top .dGamesOverall').html(releventTopData.games);
  $('#top .dWinsOverall').html(releventTopData.wins);
  $('#top .dLossesOverall').html(releventTopData.losses);
  percent = (releventTopData.wins * 100 / releventTopData.games).toFixed(2);
  $('#top .dPercentOverall').html(isNaN(percent) ? 0 : percent);
  topWins += releventTopData.wins;
  topLosses += releventTopData.losses;

  releventTopData = getRank(topData.flash_on_f, ranks);
  $('#top .fGamesOverall').html(releventTopData.games);
  $('#top .fWinsOverall').html(releventTopData.wins);
  $('#top .fLossesOverall').html(releventTopData.losses);
  percent = (releventTopData.wins * 100 / releventTopData.games).toFixed(2);
  $('#top .fPercentOverall').html(isNaN(percent) ? 0 : percent);
  topWins += releventTopData.wins;
  topLosses += releventTopData.losses;

  releventTopData = getRank(topData.no_flash, ranks);
  $('#top .nGamesOverall').html(releventTopData.games);
  $('#top .nWinsOverall').html(releventTopData.wins);
  $('#top .nLossesOverall').html(releventTopData.losses);
  percent = (releventTopData.wins * 100 / releventTopData.games).toFixed(2);
  $('#top .nPercentOverall').html(isNaN(percent) ? 0 : percent);
  topWins += releventTopData.wins;
  topLosses += releventTopData.losses;

  //jungle
  var releventJungleData = getRank(jungleData.flash_on_d, ranks);
  var jungleWins = 0;
  var jungleLosses = 0;
  $('#jungle .dGamesOverall').html(releventJungleData.games);
  $('#jungle .dWinsOverall').html(releventJungleData.wins);
  $('#jungle .dLossesOverall').html(releventJungleData.losses);
  percent = (releventJungleData.wins * 100 / releventJungleData.games).toFixed(2);
  $('#jungle .dPercentOverall').html(isNaN(percent) ? 0 : percent);
  jungleWins += releventJungleData.wins;
  jungleLosses += releventJungleData.losses;

  releventJungleData = getRank(jungleData.flash_on_f, ranks);
  $('#jungle .fGamesOverall').html(releventJungleData.games);
  $('#jungle .fWinsOverall').html(releventJungleData.wins);
  $('#jungle .fLossesOverall').html(releventJungleData.losses);
  percent = (releventJungleData.wins * 100 / releventJungleData.games).toFixed(2);
  $('#jungle .fPercentOverall').html(isNaN(percent) ? 0 : percent);
  jungleWins += releventJungleData.wins;
  jungleLosses += releventJungleData.losses;

  releventJungleData = getRank(jungleData.no_flash, ranks);
  $('#jungle .nGamesOverall').html(releventJungleData.games);
  $('#jungle .nWinsOverall').html(releventJungleData.wins);
  $('#jungle .nLossesOverall').html(releventJungleData.losses);
  percent = (releventJungleData.wins * 100 / releventJungleData.games).toFixed(2);
  $('#jungle .nPercentOverall').html(isNaN(percent) ? 0 : percent);
  jungleWins += releventJungleData.wins;
  jungleLosses += releventJungleData.losses;

  //middle
  var releventMidData = getRank(midData.flash_on_d, ranks);
  var midWins = 0;
  var midLosses = 0;

  // TOOD put this in methods
  $('#mid .dGamesOverall').html(releventMidData.games);
  $('#mid .dWinsOverall').html(releventMidData.wins);
  $('#mid .dLossesOverall').html(releventMidData.losses);
  percent = (releventMidData.wins * 100 / releventMidData.games).toFixed(2);
  $('#mid .dPercentOverall').html(isNaN(percent) ? 0 : percent);
  midWins += releventMidData.wins;
  midLosses += releventMidData.losses;

  releventMidData = getRank(midData.flash_on_f, ranks);
  $('#mid .fGamesOverall').html(releventMidData.games);
  $('#mid .fWinsOverall').html(releventMidData.wins);
  $('#mid .fLossesOverall').html(releventMidData.losses);
  percent = (releventMidData.wins * 100 / releventMidData.games).toFixed(2);
  $('#mid .fPercentOverall').html(isNaN(percent) ? 0 : percent);
  midWins += releventMidData.wins;
  midLosses += releventMidData.losses;

  releventMidData = getRank(midData.no_flash, ranks);
  $('#mid .nGamesOverall').html(releventMidData.games);
  $('#mid .nWinsOverall').html(releventMidData.wins);
  $('#mid .nLossesOverall').html(releventMidData.losses);
  percent = (releventMidData.wins * 100 / releventMidData.games).toFixed(2);
  $('#mid .nPercentOverall').html(isNaN(percent) ? 0 : percent);
  midWins += releventMidData.wins;
  midLosses += releventMidData.losses;

  //bot
  var releventBotData = getRank(botData.flash_on_d, ranks);
  var botWins = 0;
  var botLosses = 0;
  $('#bot .dGamesOverall').html(releventBotData.games);
  $('#bot .dWinsOverall').html(releventBotData.wins);
  $('#bot .dLossesOverall').html(releventBotData.losses);
  percent = (releventBotData.wins * 100 / releventBotData.games).toFixed(2);
  $('#bot .dPercentOverall').html(isNaN(percent) ? 0 : percent);
  botWins += releventBotData.wins;
  botLosses += releventBotData.losses;

  releventBotData = getRank(botData.flash_on_f, ranks);
  $('#bot .fGamesOverall').html(releventBotData.games);
  $('#bot .fWinsOverall').html(releventBotData.wins);
  $('#bot .fLossesOverall').html(releventBotData.losses);
  percent = (releventBotData.wins * 100 / releventBotData.games).toFixed(2);
  $('#bot .fPercentOverall').html(isNaN(percent) ? 0 : percent);
  botWins += releventBotData.wins;
  botLosses += releventBotData.losses;

  releventBotData = getRank(botData.no_flash, ranks);
  $('#bot .nGamesOverall').html(releventBotData.games);
  $('#bot .nWinsOverall').html(releventBotData.wins);
  $('#bot .nLossesOverall').html(releventBotData.losses);
  percent = (releventBotData.wins * 100 / releventBotData.games).toFixed(2);
  $('#bot .nPercentOverall').html(isNaN(percent) ? 0 : percent);
  botWins += releventBotData.wins;
  botLosses += releventBotData.losses;

  updateChart(topWins, jungleWins, midWins, botWins, true);
  updateChart(topLosses, jungleLosses, midLosses, botLosses, false);
}

function updateChart(top, jungle, mid, bot, isWinChart) {
  if(isWinChart){
    winChart.segments[0].value = top;
    winChart.segments[1].value = jungle;
    winChart.segments[2].value = mid;
    winChart.segments[3].value = bot;
    winChart.update();
  }
  else{
    lossChart.segments[0].value = top;
    lossChart.segments[1].value = jungle;
    lossChart.segments[2].value = mid;
    lossChart.segments[3].value = bot;
    lossChart.update();
  }
}

function getRank(buckets, ranks){
  var obj = {games:0, wins:0, losses:0};
  for (var bucket in buckets) {
    bucket = buckets[bucket];
    if (ranks.indexOf(bucket.rank) != -1) {
      var test = true;
      obj.games += isNaN(bucket.wins) ? 0 : bucket.wins;
      obj.games += isNaN(bucket.losses) ? 0 : bucket.losses;
      obj.wins += isNaN(bucket.wins) ? 0 : bucket.wins;
      obj.losses += isNaN(bucket.losses) ? 0 : bucket.losses;
    }
  }
  return obj;
}

//get weather information from the openweathermap api and display it with a widget
function getWeather(latitude, longitude){
    console.log('getting weather');
  var weather = {};
  $.ajax({
    url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude,
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
  currentTemperature.id = "currentTemp";
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