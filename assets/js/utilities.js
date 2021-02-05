/**
 * -------------------------------------------------------------
 *  
 * File: utilities.js
 * Project: Amoplex Technologies
 * File Created: Wednesday, 3rd February 2021 1:04:29 am
 * Author: Lucas Schüller (lucas@amoplex.de)
 * -----
 * Last Modified: Wednesday, 3rd February 2021 1:04:30 am
 * Modified By: Lucas Schüller (lucas@amoplex.de)
 * -----
 * Copyright - 2021 Amoplex Technologies
 *  
 * -------------------------------------------------------------
 */

function calcTime(timezone) {
    var date = new Date();
    var utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    var nd = new Date(utc + (3600000 * timezone));
    return nd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}