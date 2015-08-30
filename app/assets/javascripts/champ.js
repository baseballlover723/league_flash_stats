$( document ).ready(function() {
    console.log( "ready!" );

    // var foo = <%= {:lol => ["lmaonade", "rotflcopter"]}.to_json.html_safe } %>

    // var js_obj = <%= @champion.to_json.to_s.html_safe %>;
    // console.log("test");
    // console.log(test);

    //getLocation();

    console.log(obj.name);
    
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

    
    var data = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: "My Second dataset",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };

    var options = {

        ///Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines : true,

        //String - Colour of the grid lines
        scaleGridLineColor : "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth : 1,

        //Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,

        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: true,

        //Boolean - Whether the line is curved between points
        bezierCurve : true,

        //Number - Tension of the bezier curve between points
        bezierCurveTension : 0.4,

        //Boolean - Whether to show a dot for each point
        pointDot : true,

        //Number - Radius of each point dot in pixels
        pointDotRadius : 4,

        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth : 1,

        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius : 20,

        //Boolean - Whether to show a stroke for datasets
        datasetStroke : true,

        //Number - Pixel width of dataset stroke
        datasetStrokeWidth : 2,

        //Boolean - Whether to fill the dataset with a colour
        datasetFill : true,

        //String - A legend template
        legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

    };

    var ctx = document.getElementById("chart").getContext("2d");
    var myLineChart = new Chart(ctx).Line(data, options);


    var data2 = [
        {
            value: 300,
            color:"#F7464A",
            highlight: "#FF5A5E",
            label: "Red"
        },
        {
            value: 50,
            color: "#46BFBD",
            highlight: "#5AD3D1",
            label: "Green"
        },
        {
            value: 100,
            color: "#FDB45C",
            highlight: "#FFC870",
            label: "Yellow"
        }
    ];

    var options2 = {
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

    var ctx2 = document.getElementById("chart2").getContext("2d");
    var myDoughnutChart = new Chart(ctx2).Doughnut(data2, options2);
});
 
function getCheckedCheckboxesFor(checkboxName) {
    var allName = "all";
    var checkboxes = document.querySelectorAll('input[name="' + checkboxName + '"]:checked'), values = [];
    Array.prototype.forEach.call(checkboxes, function(element) {
        values.push(element.value);
    });

    var all = document.querySelectorAll('input[name="' + allName + '"]:checked');
    Array.prototype.forEach.call(all, function(element) {
        element.checked = false;
    });

    console.log(values);
    return values;
}

function checkedAll(){
    var checkboxName = "rank";
    var allName = "all";
    var checkboxes = document.querySelectorAll('input[name="' + checkboxName + '"]:checked');
    Array.prototype.forEach.call(checkboxes, function(element) {
        element.checked = false;
    });

    var all = document.querySelectorAll('input[name="' + allName + '"]:checked'), values = [];
    Array.prototype.forEach.call(all, function(element) {
        values.push(element.value);
    });
    console.log(values);
    return values;
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