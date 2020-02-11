/**
 * Created by Paolo on 06/02/2020.
 */
$.ajax({
    type:"GET",
    url:"http://opendata.5t.torino.it/get_fdt",
    dataType:"xml",
    success: function(response){
        parsing_xml(response)
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

/**
 * Questa funzione prende in input una pagina XML, ne ricava i dati li transforma in oggetti JSON.
 * Gli oggetti JSON vengono passati ad una funzione per rappresentarli come Marker sulla mappa.*/

function parsing_xml(doc_page_xml){
    //'FDT_data' è il tag xml della pagina degli Open Data di Torino

    var fdt_data_list = doc_page_xml.getElementsByTagName("FDT_data");


    var list_obj = [];

    var i = 0;

    while(i < fdt_data_list.length){

        var markerId = "marker_"+i;
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

        var resultObj = {"marker_Id":markerId, "Road_name":roadName, "lat":lat, "lng":lng, "accuracy":accuracy,
            "flow":flow, "speed":speed, "direction":direction};
        list_obj.push(resultObj);
        i++;
    }
    addMarkersOnMap(list_obj)

}
/**Variabili globali
 * markersSet sono gli oggetti di Leaflet di tipo Maker presenti sulla mappa
 * markersData contiene gli oggetti JSON*
 * Entrambi presentano la stessa chiave, preservazione dell'integrità dei dati.*/

var markersSet = {};
var markersData = {};

function addMarkersOnMap(futureMarkers){

    var i = 0;

    while (i < futureMarkers.length){

        var marker = L.marker([futureMarkers[i].lat, futureMarkers[i].lng], {opacity:0.7, riseOnHover:true, riseOffest:300, icon:default_arrow})
            .bindPopup(futureMarkers[i].Road_name +"<br> Auto per ora:"+ futureMarkers[i].flow
                +"<br>Velocità Media: "+ futureMarkers[i].speed)
            .on("click", function(e){

                this.setOpacity(1.0);
                setTimeout(function () {
                    e.target.setOpacity(0.7);
                }, 1500);

            });

        var marker_id = "marker_"+i;
        markersSet[marker_id] = marker;
        markersData[marker_id] = futureMarkers[i];
        marker.addTo(map);
        i++;
    }

}
