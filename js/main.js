/**
 * Created by Paolo on 06/02/2020.
 */

//Coordinate di Torino
var lat = 45.0633141;
var lon = 7.6692847;
var zoom = 12;

var map = L.map('map').setView([lat, lon], zoom);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: ' <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> '+
    '| <a href="https://developer.mapquest.com/">MapQuest</a> powered'
}).addTo(map);