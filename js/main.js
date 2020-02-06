/**
 * Created by Paolo on 06/02/2020.
 */
var lat = 45.0633141;
var lon = 7.6692847;
var zoom = 9;

var map = L.map('map').setView([lat, lon ], zoom);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([lat,lon]).addTo(map)
    .bindPopup('Città Metropolitana <br> di  Torino.')
    .openPopup();