/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



function WeatherBundle(){
    var latStr = 0.0;
    var lonStr = 0.0;
    var units = "metric";
    var weatherDir;
}

WeatherBundle.currentWeather = function(data)
{
//    console.log(data);
    updateWeatherPattern(data.weather, this.weatherDir);
    updateToD(data);
    updateTemp(data);
    updateWind(data);
    if(!("precipitation" in data)) {
        data.precipitation = {};
        data.precipitation.value = 0;
    }
    updatePrecipitation(data.precipitation);
    updateClouds(data);
    updateVisibility(data.visibility);
}

WeatherBundle.hourlyWeather = function(data)
{
//    console.log(data);
    for(const [key, value] of Object.entries(data)){
        for(const [key, value] of Object.entries(data)){
//            console.log(value);
            var time = new Date(value.dt*1000);
//            time.setUTCSeconds();
            console.log(time.getHours());
        }
    }
}

/**
 * @todo
 * @param {type} data
 * @returns {undefined}
 */
WeatherBundle.dailyWeather = function(data)
{
//    console.log(data);
}

/**
 * @todo 
 * @param {type} data
 * @returns {undefined}
 */
WeatherBundle.minuteWeather = function(data)
{
//    console.log(data);
}

WeatherBundle.updateWeather = async function(time, hourly=true){
    var hourlyInt = hourly ? 1 : 0;
    $.ajax({
        url: "https://admin.yii.rsocreations.co.uk/weather-cache-location/get-weather?lat="+this.latStr+"&lon="+this.lonStr+"&time="+time+"&hourly="+hourlyInt,
        error: function(data){
            console.log(data);
        },
        success: function(data){
            data = JSON.parse(data);
            console.log(data);
            updateToD(data, hourly);
            updateWeatherPattern(data, this.weatherDir, hourly);
            updateTemp(data, hourly);
            updateWind(data, hourly);
            if(!("precipitation" in data)) {
                data.precipitation = {};
                data.precipitation.value = 0;
            }
            updatePrecipitation(data.precipitation, hourly);
            updateClouds(data, hourly);
            updateVisibility(data.visibility, hourly);
        }
    });
}

WeatherBundle.getWeather = function(weatherDirFromBackend, timeVal){
    if(typeof(weatherDirFromBackend) != undefined)      //only need weatherDir once
        this.weatherDir = weatherDirFromBackend;
//    var time = $('#time').html();
    var time = timeVal;
    updateWeather(time, false);
}

WeatherBundle.updateWeatherPattern = function(data, weatherDir, hourly){
//    console.log(data);
    switch(data.weather_id){
        case 200:   //thunderstorm light rain
        case 201:   //thunderstrom with rain
        case 202:   //thunderstorm with heavy rain
        case 210:   //thunderstorm light
        case 211:   //thunderstorm
        case 212:   //thunderstorm heavy
        case 221:   //thunderstorm ragged
        case 230:   //thunderstorm with light drizzle
        case 231:   //thunderstorm with drizzle
        case 232:   //thunderstorm with heavy drizzle
            var img = 'thunder.svg';
            break;
        case 300:   //drizzle light intensity
        case 301:   //drizzle
        case 302:   //drizzle heavy intensity
        case 310:   //drizzle light intensity / rain
        case 311:   //drizzle rain
        case 312:   //drizzle heavy intensity / rain
        case 313:   //drizzle / shower rain
        case 314:   //drizzle / heavy shower rain
        case 321:   //drizzle shower
            var img = 'rainy-4.svg';
            break;
        case 500:   //rain light
        case 501:   //rain moderate
        case 502:   //rain heavy intensity
        case 503:   //rain very heavy
        case 504:   //rain extreme
        case 511:   //rain freezing
        case 520:   //rain light intensity
        case 521:   //rain shower
        case 522:   //rain heavy intensity shower
        case 531:   //rain ragged shower
            var img = 'rainy-6.svg';
            break;
        case 600:   //snow light
        case 601:   //snow 
        case 602:   //snow heavy
        case 611:   //sleet
        case 612:   //sleet light shower
        case 613:   //sleet shower
        case 615:   //snow / light rain 
        case 616:   //snow / rain
        case 620:   //snow light shower
        case 621:   //snow shower
        case 622:   //snow heavy shower
            var img = 'snowy4.svg';
            break;
        case 701:   //mist
        case 711:   //smoke
        case 721:   //haze
        case 731:   //sand / dust whirls
        case 741:   //fog
        case 751:   //sand
        case 761:   //dust
        case 762:   //volcanic ash
        case 771:   //squalls
        case 781:   //tornado
            
            break;
        case 800:   //clear sky
        case 801:   //clouds
        case 802:   //scattered clouds 25-50%
        case 803:   //scattered clouds 51-84%
        case 804:   //scattered clouds 85-100%
            var img = 'cloudy.svg';
            break;
    }
    
    var weatherImg = '<img src="'+weatherDir+'/animated/'+img+'">';
    if(hourly){
        $('#weather').empty();
        $('#weather').append('<p>Weather</p>');
    }
    $('#weather').append(weatherImg); 
}

WeatherBundle.updateToD = function(data, hourly){
    if(hourly)
        return;
    var sunUpTime = new Date(data.sunrise);
    var sunDownTime = new Date(data.sunset);
    var sunUp = ('0'+sunUpTime.getHours()).slice(-2)+':'+('0'+sunUpTime.getMinutes()).slice(-2) +':'+('0'+sunUpTime.getSeconds()).slice(-2);
    var sunDown = ('0'+sunDownTime.getHours()).slice(-2)+':'+('0'+sunDownTime.getMinutes()).slice(-2)+':'+('0'+sunDownTime.getSeconds()).slice(-2);
    $('#sunUp').append(sunUp);
    $('#sunDown').append(sunDown);
}

WeatherBundle.updateTemp = function(data, hourly){
    var tempMin = data.temp_min;
    var tempMax = data.temp_max;
    var currTemp = '<p>'+data.temp+'&#xb0;C</p>';
    if(hourly){
        $('#temperature').empty();
        $('#temperature').append('<p>Temperature</p>');
    }
    $('#temperature').append(currTemp);
}

WeatherBundle.updateWind = function(data, hourly){
    var gust;
    if(typeof(data.speed) != undefined)
    {
        data.speed = data.wind_speed;
        data.gust = data.wind_gust;
        data.deg = data.wind_deg == null ? 'Undefined' : data.wind_deg;
    }
    if(this.units == "metric"){
        var speed = (data.speed * 2.237).toFixed(2);     //mph = m/s * 2.237
        if(typeof(data.gust) != undefined && data.gust != 'undefined')
            gust = (data.gust * 2.237).toFixed(2);
        else
            gust = 0;
    }

    var wind = '<p>'+speed+' mph</p>';
    gust = '<p>'+gust+' mph</p>';
    var dir = '<p>'+data.wind_direction+'</p>';
    if(hourly){
        $('#wind').empty();
        $('#gusts').empty();
        $('#windDir').empty();
        $('#wind').append('<p>Wind</p>');
        $('#gusts').append('<p>Gusts</p>');
        $('#windDir').append('<p>Wind Dir.</p>');
    }
    $('#wind').append(wind);
    $('#gusts').append(gust);
    $('#windDir').append(dir);
}

WeatherBundle.updatePrecipitation = function(data, hourly) {
    var precipitation = '<p>'+data.value+' mm</p>';
    var mode = '<p>'+data.mode+'</p>';
    if(hourly){
        $('#precipitation').empty();
        $('#precipitation').append('<p>Precipitation</p>');
    }
    $('#precipitation').append(precipitation);
}

WeatherBundle.updateClouds = function(data, hourly) {
    if(typeof(data.all) != 'undefined')
        var clouds = '<p>'+data.all+'%</p>';
    else
        var clouds = '<p>'+data.clouds+'%</p>';
    if(hourly){
        $('#clouds').empty();
        $('#clouds').append('<p>Clouds</p>');
    }
    $('#clouds').append(clouds);
}

WeatherBundle.updateVisibility = function(data, hourly) {
    var visibility = '<p>'+data+' m</p>';
    if(hourly){
        $('#visibility').empty();
        $('#visibility').append('<p>Visibility</p>');
    }
    $('#visibility').append(visibility);
}