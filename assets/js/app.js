/**
 * -------------------------------------------------------------
 *  
 * File: app.js
 * Project: WeatherApp
 * File Created: Tuesday, 2nd February 2021 5:21:24 pm
 * Author: Lucas Schüller (lucas@amoplex.de)
 * -----
 * Last Modified: Tuesday, 2nd February 2021 5:21:24 pm
 * Modified By: Lucas Schüller (lucas@amoplex.de)
 * -------------------------------------------------------------
 */

$(document).ready(() => {
    getData("2950159", 1); //CityID Berlin
    getData("5128581", 2); //CityID New York
    getData("2643743", 3); //CityID London

    setInterval(() => {
        updateCurrent(); //Update every 20 Seconds
    }, 20000);
});

/**
 * Update current Weather conditions 
 *
 * @author Lucas Schüller
 */
function updateCurrent() {
    $(".main .card-wrapper").each(function(index) {
        getData($(this).attr("data-cityid") + "", index + 1);
    });
}

/**
 * Send Api request to Weather API via Backend for hidden API Key
 *
 * @author Lucas Schüller
 * 
 * @param {String | object} loc
 * @param {Number} card
 * @returns {undefined | false} 
 */
function getData(loc, card) {
    if (typeof loc === "string") {
        $.ajax({
            type: "GET",
            url: `https://cdn.amoplex.de/backend/WeatherApp/request.php?id=${loc}`,
            success: function(response) {
                try {
                    data = JSON.parse(response);
                } catch (e) {
                    console.error(response);
                    showMessage(card, 0, "WeatherAPI request failed, see console");
                    return false;
                }
                setData(card, data);
            }
        });
    } else if (typeof loc === "object") {
        $.ajax({
            type: "GET",
            url: `https://cdn.amoplex.de/backend/WeatherApp/request.php?lat=${loc.lat}&lon=${loc.lon}`,
            success: function(response) {
                try {
                    data = JSON.parse(response);
                } catch (e) {
                    console.error(response);
                    showMessage(card, 0, "WeatherAPI request failed, see console");
                    return false;
                }
                setData(card, data);
            }
        });
    } else {
        console.error("WeatherApp | Must be LatLon Object or CityId String");
        return false;
    }
}

/**
 * Translate JSON to Card
 *
 * @author Lucas Schüller
 * @param {Number} card
 * @param {JSON} data
 * @returns {undefined} 
 */
function setData(card, data) {
    if (!data) return;
    if (data.cod == "200") {
        $(".main #c" + card).attr("data-overlay", "false");
        $(".main #c" + card).attr("data-cityID", data.id);
        $(".main #c" + card).attr("data-weatherIcon", data.weather[0].icon.substring(0, data.weather[0].icon.length - 1));
        if (data.weather[0].icon.includes("01")) $(".main #c" + card).attr("data-weatherIcon", data.weather[0].icon);
        $(".main #c" + card).attr("data-weather", data.weather[0].main);
        $(gS("locName", card)).html(data.name + ", " + data.sys.country);
        $(gS("locTime", card)).html(calcTime(data.timezone));
        $(gS("weatherTemp", card)).html(Math.round(data.main.temp) + "°c");
        $(gS("weatherName", card)).html(data.weather[0].main);
        $(gS("weatherDesc", card)).html(data.weather[0].description);
        $(gS("windSpeed", card)).html(data.wind.speed + "m/s");
        $(gS("windDirection", card)).html(data.wind.deg + "°");
        $(gS("tempMin", card)).html(data.main.temp_min + "°c");
        $(gS("tempMax", card)).html(data.main.temp_max + "°c");
        $(gS("humidity", card)).html(data.main.humidity + "%");
        $(gS("pressure", card)).html(data.main.pressure + "hPa");
    } else if (data.cod === "404") {
        showMessage(card, data.cod, data.message);
    } else if (data.cod === "429") {
        showMessage(card, data.cod, "WeatherAPI request limit exceeded. Please wait a few minutes.");
        console.error(data.message);
    } else {
        showMessage(card, "500", "Received unknown error code(" + data.cod + ") from WeatherAPI");
        console.error(data.message);
    }
}

/**
 * Shortcut for data Selector
 *
 * @author Lucas Schüller
 * @param {String} dataType
 * @param {Number} card
 * @returns {String} Selector with attr filled in 
 */
function gS(dataType, card) {
    return `.main #c${card} [data-type='${dataType}']`;
}

/**
 * Get Weather at clients Position
 *
 * @author Lucas Schüller
 */
function myPosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(locSuccess, locError, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
    } else {
        showMessage(2, 1, "Geolocation is not supported by your device");
    }
}

/**
 * Get data at Location
 *
 * @author Lucas Schüller
 * @param {JSON} loc
 */
function locSuccess(loc) {
    getData({ lat: loc.coords.latitude, lon: loc.coords.longitude }, 2);
}

/**
 * Throw error
 *
 * @author Lucas Schüller
 * @param {JSON} error
 */
function locError(error) {
    showMessage("2", error.code, error.message);
}

/**
 * Show Card error Message
 *
 * @author Lucas Schüller
 * @param {Number} card
 * @param {Number} errorCode
 * @param {String} msg
 */
function showMessage(card, errorCode, msg) {
    $(".main #c" + card + " .message").html(`<h2>Error</h2><h4>Code: ${errorCode}<br> ${msg}</h4>`);
    let dataAttr = $(".main #c" + card).attr("data-weather");
    $(".main #c" + card).attr("data-weather", "message");
    $(".main #c" + card).attr("data-overlay", "true");
    setTimeout(() => {
        $(".main #c" + card).attr("data-overlay", "false");
        setTimeout(() => {
            $(".main #c" + card).attr("data-weather", dataAttr);
            $(".main #c" + card + " .message").html("");
        }, 1200);
    }, 5000);
}