<?php
/*
* -------------------------------------------------------------
*
* File: request.php
* Project: Amoplex Technologies
* File Created: Tuesday, 2nd February 2021 11:58:21 pm
* Author: Lucas Schüller (lucas@amoplex.de)
* -----
* Last Modified: Tuesday, 2nd February 2021 11:58:21 pm
* Modified By: Lucas Schüller (lucas@amoplex.de)
* -----
* Copyright - 2021 Amoplex Technologies
*
* -------------------------------------------------------------
*/
include_once("api_keys.php");
$url = 'api.openweathermap.org/data/2.5/weather?';
if (isset($_GET["id"])) {
  $request_url = $url . 'id=' . $_GET["id"];
} else {
  $request_url = $url . 'lat=' . $_GET["lat"] . "&lon=" . $_GET["lon"];
}
$request_url = $request_url. "&units=metric&lang=en";
$request_url = $request_url. "&appid=" . $weatherApiKey;
$curl = curl_init($request_url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($curl);
curl_close($curl);
echo $response . PHP_EOL;
?>