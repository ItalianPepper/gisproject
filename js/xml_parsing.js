/**
 * Created by Paolo on 06/02/2020.
 */
/**Variabili globali
 * markersSet sono gli oggetti di Leaflet di tipo Maker presenti sulla mappa
 * markersData contiene gli oggetti JSON*
 * roads contiene tutte le strade di Torino  e i relativi limiti di velocità
 * traffic_lights contiene le coordinate dei semafori di Torino
 * meansSpeed contiene il valore di media della velocità di una strada (media delle medie)
 * meansVehicle contiene il valore di media del numero di veicoli lungo la strada (media delle medie)
 * Entrambi presentano la stessa chiave, preservazione dell'integrità dei dati.*/

var markersSet = {};
var markersData = {};
var roads = {};
//var traffic_lights = {};
var meansSpeed = {};
var meansVehicle = {};

$.ajax({
    type: "GET",
    url: "./local/stradeDiTorino.csv",
    dataType: "text",
    success: function (response) {
        parserCsv(response);
    }
});

/**
$.ajax({
    type: "GET",
    url: "./local/traffic_lights_turin",
    dataType: "json",
    success: function (response) {
        add_traffic_lights(response);
    }
});
**/

$.ajax({
    type: "GET",
    url: "http://opendata.5t.torino.it/get_fdt",
    dataType: "xml",
    success: function (response) {
        parsing_xml(response);
    }
});


var default_arrow = L.icon({
    iconUrl: './icon/round_navigation_default_blue_18dp.png',
    iconSize: [30, 30],
    iconAnchor: [30, 30],
    popupAnchor: [-3, -30],
    shadowUrl: './icon/round_navigation_shadow_18dp.png',
    shadowSize: [30, 30],
    shadowAnchor: [25, 25]
});


var traffic_light = L.icon({
    iconUrl: 'icon/baseline_traffic_black_18dp.png',
    iconSize: [15, 15],
    iconAnchor: [15, 15],
    popupAnchor: [-3, -15],
});

/**
 * Questa funzione prende in input una pagina XML, ne ricava i dati li transforma in oggetti JSON.
 * Gli oggetti JSON vengono passati ad una funzione per rappresentarli come Marker sulla mappa.*/

function parsing_xml(doc_page_xml) {
    //'FDT_data' è il tag xml della pagina degli Open Data di Torino

    var fdt_data_list = doc_page_xml.getElementsByTagName("FDT_data");


    var list_obj = [];

    var i = 0;

    while (i < fdt_data_list.length) {

        var markerId = "marker_" + i;
        var roadName = fdt_data_list[i].getAttribute(["Road_name"]);
        var lat = fdt_data_list[i].getAttribute(["lat"]);
        var lng = fdt_data_list[i].getAttribute(["lng"]);
        var accuracy = fdt_data_list[i].getAttribute(["accuracy"]);
        var direction = fdt_data_list[i].getAttribute(["direction"]);
        // Figlio dell'elemento XML che contiene numero di macchine all'ora
        // e la velocità media delle auto.

        var speedflow = fdt_data_list[i].getElementsByTagName("speedflow");
        var flow = speedflow[0].getAttribute(["flow"]);
        var speed = speedflow[0].getAttribute(["speed"]);

        var splitInfo = getSpeedLimitRoad(roadName);
        //console.log(splitInfo)
        var speedLimit = splitInfo.split(":")[1];
        var type_street = splitInfo.split(":")[0];

        var resultObj = {
            "Road_name": roadName, "lat": lat, "lng": lng, "accuracy": accuracy,
            "flow": flow, "speed": speed, "direction": direction, "speedLimit": speedLimit, "type_street":type_street
        };
        list_obj.push(resultObj);
        i++;
    }
    addMarkersOnMap(list_obj);
    getMeansSpeedsOnStreet();
    //getMeansVehiclesOnStreet();
}


function addMarkersOnMap(futureMarkers) {

    var i = 0;

    while (i < futureMarkers.length) {

        var marker = L.marker([futureMarkers[i].lat, futureMarkers[i].lng], {
            opacity: 0.7,
            riseOnHover: true,
            riseOffest: 300,
            icon: default_arrow
        })
            .bindPopup(futureMarkers[i].Road_name + "<br> Auto per ora: " + futureMarkers[i].flow
                + "<br>Velocità Media: " + futureMarkers[i].speed + "km/h<br> Limite velocità: " + futureMarkers[i].speedLimit + " km/h")
            .on("click", function (e) {

                this.setOpacity(1.0);
                setTimeout(function () {
                    e.target.setOpacity(0.7);
                }, 1500);

            });

        var marker_id = "marker_" + i;
        markersSet[marker_id] = marker;
        markersData[marker_id] = futureMarkers[i];
        marker.addTo(map);
        i++;
    }

}

function parserCsv(response) {

    var res_array = String(response).split(/\r?\n|\r/);

    var header = res_array[0];

    for (var i = 1; i < res_array.length; i++) {
        var splitted = res_array[i].split(";");
        roads[splitted[1]] = splitted[0]+":"+splitted[3];
    }

}

function getSpeedLimitRoad(roadName) {

    if (roadName in roads) {
       // console.log(roads[roadName]);
        return roads[roadName];
    }

    //console.log("key " + key + " has value " + roads[key]);
    //se il nome della strada ricercata non è incluso nell'array, viene restituita una stima del limite velocità
    // in base alla tipologia di strada
    return "secondary:50";
}


/**Calcolo la media dei veicoli per ora lungo tutta la strada ( media delle medie)
function getMeansVehiclesOnStreet() {

    var roads_sum = {};
    var counter_roads = {};

    for (var markId in markersData) {

        if(markersData[markId].accuracy > 50) {
            var keyInRoads = markersData[markId].Road_name;
            var flow = markersData[markId].flow;

            if (keyInRoads in roads_sum) {
                var old_value_k = roads_sum[keyInRoads];
                roads_sum[keyInRoads] = old_value_k + flow;

                var old_value = counter_roads[keyInRoads];
                counter_roads[keyInRoads] = old_value + 1;


            } else {
                roads_sum[keyInRoads] = flow;
                counter_roads[keyInRoads] = 1;
            }
        }

    }

    for (var keyinrs in roads_sum){

        var sum = roads_sum[keyinrs];

        var count = counter_roads[keyinrs];

        meansVehicle[keyinrs] = sum/count;
    }
}*/

/**Calcolo la media delle velocità media per ora lungo tutta la strada ( media delle medie) */
function getMeansSpeedsOnStreet(){

    let old_value;
    var roads_sum = {};
    var counter_roads = {};

    for (var markId in markersData) {

        if(markersData[markId].accuracy > 50) {

            var keyInRoads = markersData[markId].Road_name;
            var speed = parseFloat(markersData[markId].speed).toFixed(2);

            if (keyInRoads in roads_sum) {
                var old_svalue = parseFloat(roads_sum[keyInRoads]).toFixed(2);
                var new_value = old_svalue + speed;
                roads_sum[keyInRoads] = parseFloat(new_value).toFixed(2);

                counter_roads[keyInRoads] = counter_roads[keyInRoads] + 1;


            } else {
                roads_sum[keyInRoads] = parseFloat(speed).toFixed(2);
                counter_roads[keyInRoads] = 1;
            }
        }

    }

    for (var keyinrs in roads_sum){

        var sum = roads_sum[keyinrs];

        var count = counter_roads[keyinrs];
        var mean = parseFloat(sum).toFixed(2)/parseFloat(count).toFixed(2);

        meansSpeed[keyinrs] = parseFloat(mean).toFixed(2);
    }

}

/**
function add_traffic_lights(response) {
    var data = response.elements;
    var i = 0;

    while (i < data.length) {

        if (data[i].lat != null && data[i].lon != null) {

            var marker = L.marker([data[i].lat, data[i].lon], {
                opacity: 0.5,
                riseOnHover: true,
                riseOffest: 300,
                icon: traffic_light
            });

            marker.addTo(map);

            var marker_id = "tr_lights_" + i;

            traffic_lights[marker_id] = {"lat": data[i].lat, "lng": data[i].lon};
        }

        i++;
    }

}**/