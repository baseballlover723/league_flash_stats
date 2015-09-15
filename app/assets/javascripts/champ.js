var winChart, lossChart;
var has_charts = false;

var chartOptions = {
    //Boolean - Whether we should show a stroke on each segment
    segmentShowStroke: true,

    //String - The colour of each segment stroke
    segmentStrokeColor: "#fff",

    //Number - The width of each segment stroke
    segmentStrokeWidth: 2,

    //Number - The percentage of the chart that we cut out of the middle
    percentageInnerCutout: 50, // This is 0 for Pie charts

    //Number - Amount of animation steps
    animationSteps: 100,

    //String - Animation easing effect
    animationEasing: "easeOutBounce",

    //Boolean - Whether we animate the rotation of the Doughnut
    animateRotate: true,

    //Boolean - Whether we animate scaling the Doughnut from the centre
    animateScale: false,

    //String - A legend template
    legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

};

$(document).ready(function () {
    var helpers = Chart.helpers;
    // console.log( "ready!" );

    if (window.location.protocol == "http:") {
        getLocation();
    }

    function showPosition(position) {
        getWeather(position.coords.latitude, position.coords.longitude);
    }

    function getLocation() {
        if (navigator.geolocation) {
            if (document.getElementById("currentTemp")) {
                // console.log("already there");
            }
            else {
                navigator.geolocation.getCurrentPosition(showPosition);
            }
        }
        else {
            alert("Geolocation is not supported by this browser. Will not be able to display weather widget.");
        }
    }

    var startingData1 = [
        {
            value: 50,
            color: "#F7464A",
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
            color: "#F7464A",
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

    if (document.getElementById("chart")) {
        has_charts = true;
        var ctx = document.getElementById("chart").getContext("2d");
        winChart = new Chart(ctx).Doughnut(startingData1, chartOptions);
        var legendHolder = document.createElement("div");
        legendHolder.innerHTML = winChart.generateLegend();
        helpers.each(legendHolder.firstChild.childNodes, function (legendNode, index) {
            legendNode.style.backgroundColor = winChart.segments[index].fillColor;
            helpers.addEvent(legendNode, 'mouseover', function () {
                var activeSegment = winChart.segments[index];
                activeSegment.save();
                winChart.showTooltip([activeSegment]);
                activeSegment.restore();
            });
        });
        helpers.addEvent(legendHolder.firstChild, 'mouseout', function () {
            winChart.draw();
        });
        winChart.chart.canvas.parentNode.parentNode.appendChild(legendHolder.firstChild);

        var ctx2 = document.getElementById("chart2").getContext("2d");
        lossChart = new Chart(ctx2).Doughnut(startingData2, chartOptions);
        var legendHolder2 = document.createElement("div");
        legendHolder2.innerHTML = lossChart.generateLegend();
        helpers.each(legendHolder2.firstChild.childNodes, function (legendNode, index) {
            legendNode.style.backgroundColor = lossChart.segments[index].fillColor;
            helpers.addEvent(legendNode, 'mouseover', function () {
                var activeSegment = lossChart.segments[index];
                // console.log('activeSegment');
                activeSegment.save();
                lossChart.showTooltip([activeSegment]);
                activeSegment.restore();
            });
        });
        helpers.addEvent(legendHolder2.firstChild, 'mouseout', function () {
            lossChart.draw();
        });
        lossChart.chart.canvas.parentNode.parentNode.appendChild(legendHolder2.firstChild);
    }
    //automatically select all ranks
    $('#allRanksCheckbox').click();
});

function getCheckedCheckboxesFor(callback) {
    var checkboxName = 'rank';
    var allName = "all";
    var checkboxes = document.querySelectorAll('input[name="' + checkboxName + '"]:checked'), values = [];
    Array.prototype.forEach.call(checkboxes, function (element) {
        values.push(element.value);
    });

    var all = document.querySelectorAll('input[name="' + allName + '"]:checked');
    Array.prototype.forEach.call(all, function (element) {
        element.checked = false;
    });

    populateTables(values, callback);

    return values;
}

function checkedAll(callback) {
    var checkboxName = "rank";
    var allName = "all";
    var checkboxes = document.querySelectorAll('input[name="' + checkboxName + '"]:checked');
    Array.prototype.forEach.call(checkboxes, function (element) {
        element.checked = false;
    });

    values = ["unranked", "bronze", "silver", "gold", "platinum", "diamond", "master", "challenger"];
    populateTables(values, callback);
    return values;
}

function populateTables(ranks, callback) {
    //console.log("populating tables");
    resetColors();

    populateTable("overall", overallData, ranks);
    topWinsLosses = populateTable("top", topData, ranks);
    midWinsLosses = populateTable("mid", midData, ranks);
    botWinsLosses = populateTable("bot", botData, ranks);
    jungleWinsLosses = populateTable("jungle", jungleData, ranks);

    deleteDisposables();
    if (has_charts) {
        updateChart(topWinsLosses.wins, jungleWinsLosses.wins, midWinsLosses.wins, botWinsLosses.wins, true);
        updateChart(topWinsLosses.losses, jungleWinsLosses.losses, midWinsLosses.losses, botWinsLosses.losses, false);
    }
}


function populateTable(lane, data, ranks) {
    var zero = 0;
    var wins = 0;
    var losses = 0;

    var releventData = getRank(data.flash_on_d, ranks);
    $('#' + lane + ' .dGamesOverall').html(releventData.games);
    $('#' + lane + ' .dWinsOverall').html(releventData.wins);
    $('#' + lane + ' .dLossesOverall').html(releventData.losses);
    var percent = parseFloat(isNaN((releventData.wins * 100 / releventData.games).toFixed(2)) ? zero.toFixed(2) : (releventData.wins * 100 / releventData.games).toFixed(2));
    $('#' + lane + ' .dPercentOverall').html(percent);
    wins += releventData.wins;
    losses += releventData.losses;

    releventData = getRank(data.flash_on_f, ranks);
    $('#' + lane + ' .fGamesOverall').html(releventData.games);
    $('#' + lane + ' .fWinsOverall').html(releventData.wins);
    $('#' + lane + ' .fLossesOverall').html(releventData.losses);
    var percent2 = parseFloat(isNaN((releventData.wins * 100 / releventData.games).toFixed(2)) ? zero.toFixed(2) : (releventData.wins * 100 / releventData.games).toFixed(2));
    $('#' + lane + ' .fPercentOverall').html(percent2);
    wins += releventData.wins;
    losses += releventData.losses;

    releventData = getRank(data.no_flash, ranks);
    $('#' + lane + ' .nGamesOverall').html(releventData.games);
    $('#' + lane + ' .nWinsOverall').html(releventData.wins);
    $('#' + lane + ' .nLossesOverall').html(releventData.losses);
    var percent3 = parseFloat(isNaN((releventData.wins * 100 / releventData.games).toFixed(2)) ? zero.toFixed(2) : (releventData.wins * 100 / releventData.games).toFixed(2));
    $('#' + lane + ' .nPercentOverall').html(percent3);
    wins += releventData.wins;
    losses += releventData.losses;

    if (percent == percent2 && percent2 == percent3) {
        //all equal
        $('#' + lane + ' .dPercentOverall').addClass("winner");
        $('#' + lane + ' .fPercentOverall').addClass("winner");
        $('#' + lane + ' .nPercentOverall').addClass("winner");
    }
    else if (percent > percent2) {
        //percent1 > percent2
        if (percent > percent3) {
            //percent1 is the biggest
            $('#' + lane + ' .dPercentOverall').addClass("winner");
        }
        else {
            //percent3 is the biggest
            $('#' + lane + ' .nPercentOverall').addClass("winner");
        }
    }
    else {
        //percent2 > percent3
        if (percent2 > percent3) {
            //percent2 is the biggest
            $('#' + lane + ' .fPercentOverall').addClass("winner");
        }
        else {
            //percent3 is the bigggest
            $('#' + lane + ' .nPercentOverall').addClass("winner");
        }
    }
    return {wins: wins, losses: losses};
}

function resetColors() {
    //console.log("reset colors");
    var cells = $(".dPercentOverall, .fPercentOverall, .nPercentOverall");
    cells.each(function(i) {
       $(this).removeClass("winner");
    });
}

function deleteDisposables() {
    var elements = document.getElementsByClassName("disposable");
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function updateChart(top, jungle, mid, bot, isWinChart) {
    //console.log("update chart");
    if (isWinChart) {
        if (top == 0 && jungle == 0 && mid == 0 && bot == 0) {
            var noData = document.createElement("h4");
            noData.className = "disposable";
            noData.innerHTML = "No Data";
            document.getElementById("chart1Holder").appendChild(noData);
        }
        else {
            winChart.segments[0].value = top;
            winChart.segments[1].value = jungle;
            winChart.segments[2].value = mid;
            winChart.segments[3].value = bot;
            winChart.update();
            deleteDisposables();
        }
    }
    else {
        if (top == 0 && jungle == 0 && mid == 0 && bot == 0) {
            var noData = document.createElement("h4");
            noData.className = "disposable";
            noData.innerHTML = "No Data";
            document.getElementById("chart2Holder").appendChild(noData);
        }
        else {
            lossChart.segments[0].value = top;
            lossChart.segments[1].value = jungle;
            lossChart.segments[2].value = mid;
            lossChart.segments[3].value = bot;
            lossChart.update();
            deleteDisposables();
        }
    }
}

function getRank(buckets, ranks) {
    var obj = {games: 0, wins: 0, losses: 0};
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
function getWeather(latitude, longitude) {
    // console.log('getting weather');
    var weather = {};
    $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude,
        type: 'GET',
        dataType: 'json',
        data: {},
        success: function (resp) {
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
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest);
        }
    });
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function makeWeatherWidget(weather) {
    var weatherArea = document.createElement('div');
    weatherArea.id = 'weatherArea';
    weatherArea.style.height = "240px";

    var header = document.createElement("h3");
    header.innerHTML = "Should You Play League With This Weather?";
    weatherArea.appendChild(header);


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

    var hint = document.createElement("div");
    hint.innerHTML = "Hint: It's always great weather to play league in.";
    hint.style.fontSize = "12px";
    hint.style.textAlign = "center";
    hint.style.height = "15px";
    hint.style.marginTop = "105px";
    weatherArea.appendChild(hint);

    document.getElementById("weatherWrapper").appendChild(weatherArea);
}