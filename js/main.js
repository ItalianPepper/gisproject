/**
 * Created by Paolo on 06/02/2020.
 */

//Coordinate di Torino
var lat = 45.0633141;
var lon = 7.6692847;
var zoom = 12;

var map = L.map('map').setView([lat, lon], zoom);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://developer.mapquest.com/documentation/leaflet-plugins/routing/">MapQuest </a>contributors'
}).addTo(map);


/**
L.marker([lat,lon]).addTo(map)
    .bindPopup('Città Metropolitana <br> di  Torino.')
    .openPopup();
 */