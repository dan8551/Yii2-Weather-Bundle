/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



function WeatherBundle(lat, lon, weatherUrl, units, drone_arr, timeVal){
//    var latStr = 0.0;
//    var lonStr = 0.0;
    var weatherDir;
    
    //construct
    this.timeVal = timeVal;
    this.latStr = lat;
    this.lonStr = lon;
    this.weatherUrl = weatherUrl;
    this.units = units;
    this.drone_arr = drone_arr;
    this.goodToFly = [];
    this.success = '#28a745';
    this.warning = '#ffc107';
    this.danger = '#dc3545';
    return this;
}

WeatherBundle.prototype.drone_arr = [];

WeatherBundle.prototype.currentWeather = function(data)
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

WeatherBundle.prototype.hourlyWeather = function(data)
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
WeatherBundle.prototype.dailyWeather = function(data)
{
//    console.log(data);
}

/**
 * @todo 
 * @param {type} data
 * @returns {undefined}
 */
WeatherBundle.prototype.minuteWeather = function(data)
{
//    console.log(data);
}

WeatherBundle.prototype.updateWeather = async function(time, hourly=true){
    var hourlyInt = hourly ? 1 : 0;
    console.log(this.weatherDir);
    var scope = this;
    $.ajax({
        url: this.weatherUrl+"?lat="+this.latStr+"&lon="+this.lonStr+"&time="+time+"&hourly="+hourlyInt,
        error: function(data){
            console.log(data);
        },
        success: function(data){
            data = JSON.parse(data);
            console.log(data);
            scope.updateToD(data, hourly);
            scope.updateWeatherPattern(data, scope.weatherDir, hourly);
            scope.updateTemp(data, hourly);
            scope.updateWind(data, hourly);
            if(!("precipitation" in data)) {
                data.precipitation = {};
                data.precipitation.value = 0;
            }
            scope.updatePrecipitation(data.precipitation, hourly);
            scope.updateClouds(data, hourly);
            scope.updateVisibility(data.visibility, hourly);
        }
    });
}

WeatherBundle.prototype.getWeather = async function(weatherDirFromBackend, timeVal){
    console.log(timeVal);
    if(typeof(weatherDirFromBackend) != undefined)      //only need weatherDir once
        this.weatherDir = weatherDirFromBackend;
//    var time = $('#time').html();
    this.time = timeVal;
    this.updateWeather(this.time, false);
}

WeatherBundle.prototype.updateWeatherPattern = function(data, weatherDir, hourly){
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
    $('#weather').css('background-color', this.warning);
}

WeatherBundle.prototype.updateToD = function(data, hourly){
    if(hourly)
        return;
    var sunUpTime = new Date(data.sunrise);
    var sunDownTime = new Date(data.sunset);
    var sunUp = ('0'+sunUpTime.getHours()).slice(-2)+':'+('0'+sunUpTime.getMinutes()).slice(-2) +':'+('0'+sunUpTime.getSeconds()).slice(-2);
    var sunDown = ('0'+sunDownTime.getHours()).slice(-2)+':'+('0'+sunDownTime.getMinutes()).slice(-2)+':'+('0'+sunDownTime.getSeconds()).slice(-2);
    $('#sunUp').append(sunUp);
    $('#sunDown').append(sunDown);
    $('#TOD').css('background-color', this.warning);
}

WeatherBundle.prototype.updateTemp = function(data, hourly){
    console.log(data);
    this.tempMin = data.temp_min;
    this.tempMax = data.temp_max;
    this.currTemp = '<p>'+data.temp+'&#xb0;C</p>';
    if(hourly){
        $('#temperature').empty();
        $('#temperature').append('<p>Temperature</p>');
    }
    $('#temperature').append(this.currTemp);
}

WeatherBundle.prototype.updateWind = function(data, hourly){
//    var gust;
    if(typeof(data.speed) != undefined)
    {
        data.speed = data.wind_speed;
        data.gust = data.wind_gust;
        data.deg = data.wind_deg == null ? 'Undefined' : data.wind_deg;
    }
    if(this.units == "metric"){
        this.wind_speed = (data.speed * 2.237).toFixed(2);     //mph = m/s * 2.237
        if(typeof(data.gust) != undefined && data.gust != 'undefined')
            this.wind_gust = (data.gust * 2.237).toFixed(2);
        else
            gust = 0;
    }
console.log(this);
    var wind = '<p>'+this.wind_speed+' mph</p>';
    var gust = '<p>'+this.wind_gust+' mph</p>';
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
    $('#windDir').css('background-color', this.success);
}

WeatherBundle.prototype.updatePrecipitation = function(data, hourly) {
    this.precipitation = data.value;
    var precipitation = '<p>'+data.value+' mm</p>';
    var mode = '<p>'+data.mode+'</p>';
    if(hourly){
        $('#precipitation').empty();
        $('#precipitation').append('<p>Precipitation</p>');
    }
    $('#precipitation').append(precipitation);
}

WeatherBundle.prototype.updateClouds = function(data, hourly) {
    if(typeof(data.all) != 'undefined')
    {
        this.clouds = data.all;
        var clouds = '<p>'+data.all+'%</p>';
    }
    else
    {
        this.clouds = data.clouds;
        var clouds = '<p>'+data.clouds+'%</p>';
    }
    if(hourly){
        $('#clouds').empty();
        $('#clouds').append('<p>Clouds</p>');
    }
    $('#clouds').append(clouds);
}

WeatherBundle.prototype.updateVisibility = function(data, hourly) {
    this.visibility = data;
    var visibility = '<p>'+data+' m</p>';
    if(hourly){
        $('#visibility').empty();
        $('#visibility').append('<p>Visibility</p>');
    }
    $('#visibility').append(visibility);
}

WeatherBundle.prototype.checkGoodToFly = function() 
{
    console.log(this.drone_arr.length);
    for(var i=0; i<this.drone_arr.length; i++)
    {
        var drone = this.drone_arr[i];
        console.log(drone);
        this.checkTemperature(drone);
        this.checkWind(drone);
        this.checkGust(drone);
        this.checkPrecipitation(drone);
        this.checkCloudCover(drone);
        this.checkVisibility(drone);
    }
    $('#goodToFly').append('<p>'+this.timeVal+'</p>');
    if(this.goodToFly.includes(false))
    {
        $('#goodToFly').css('background-color', this.danger);
    }else
    {
        console.log(this.goodToFly);
        $('#goodToFly').css('background-color', this.success);
        $('#goodToFly h2').html('Good To Fly');
    }
}

WeatherBundle.prototype.checkTemperature = function(data)
{
    console.log(data);
    if(data.min_operating_temp != 'undefined' && data.max_operating_temp != 'undefined' && data.min_operating_temp < this.currTemp && data.max_operating_temp > this.currTemp )
    {
        this.goodToFly.push(true);
        $('#temperature').css('background-color', this.success);
    }
    else
    {
        this.goodToFly.push(false);
        $('#temperature').css('background-color', this.danger);
    }
}

WeatherBundle.prototype.checkWind = function(data)
{
    console.log(data.max_wind_speed_resistance > Math.max(this.wind_speed, this.wind_gust));
    console.log(Math.max(parseInt(this.wind_speed), parseInt(this.wind_gust)));
    if(data.max_wind_speed_resistance != 'undefined' && data.max_wind_speed_resistance > Math.max(this.wind_speed, this.wind_gust))
    {
        this.goodToFly.push(true);
        $('#wind').css('background-color', this.success);
    }
    else
    {
        this.goodToFly.push(false);
        $('#wind').css('background-color', this.danger);
    }
}

WeatherBundle.prototype.checkGust = function(data)
{
    if(data.max_wind_speed_resistance != 'undefined' && data.max_wind_speed_resistance > this.wind_gust)
    {
        this.goodToFly.push(true);
        $('#gusts').css('background-color', this.success);
    }
    else
    {
        this.goodToFly.push(false);
        $('#gusts').css('background-color', this.danger);
    }
}

WeatherBundle.prototype.checkPrecipitation = function(data)
{
    if(this.precipitation < 40)
    {
        this.goodToFly.push(true);
        $('#precipitation').css('background-color', this.success);
    }
    else
    {
        this.goodToFly.push(false);
        $('#precipitation').css('background-color', this.danger);
    }
}

WeatherBundle.prototype.checkCloudCover = function(data)
{
    if(this.cloudCover == undefined || this.cloudCover < 75)
    {
        this.goodToFly.push(true);
        $('#clouds').css('background-color', this.success);
    }
    else
    {
        this.goodToFly.push(false);
        $('#clouds').css('background-color', this.warning);
    }
}

WeatherBundle.prototype.checkVisibility = function(data)
{
    console.log(this.visibility);
    if(this.visibility > 2000)
    {
        this.goodToFly.push(true);
        $('#visibility').css('background-color', this.success);
    }
    else
    {
        this.goodToFly.push(false);
        $('#visibility').css('background-color', this.warning);
    }
}