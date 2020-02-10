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

/**
 * Questa funzione prende in input una pagina XML, ne ricava i dati li transforma in oggetti JSON.
 * Gli oggetti JSON vengono passati ad una funzione per rappresentarli come Marker sulla mappa.*/
function parsing_xml(doc_page_xml){
    //'FDT_data' è il tag xml della pagina degli Open Data di Torino

    var fdt_data_list = doc_page_xml.getElementsByTagName("FDT_data");

    var i = 0;
    var list_obj = [];

    while(i < fdt_data_list.length){

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

        //PARSER_EXCEL()

        var resultObj = {"Road_name":roadName, "lat":lat, "lng":lng, "accuracy":accuracy,
        "flow":flow, "speed":speed, "direction":direction}; //"speed":speed
        list_obj.push(resultObj);
        i++;
    }
    addMarkersOnMap(list_obj)


}

function addMarkersOnMap(futureMarkers){
    var i = 0;
    var myIcon;
    while (i < futureMarkers.length){
        if(futureMarkers[i].accuracy==100) {
            myIcon = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
                iconSize: [38, 95],
                iconAnchor: [22, 94],
                popupAnchor: [-3, -76],
                shadowAnchor: [22, 94]
            });
        }
        else if(futureMarkers[i].accuracy>20 && futureMarkers[i].accuracy<90){
            myIcon = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
                iconSize: [38, 95],
                iconAnchor: [22, 94],
                popupAnchor: [-3, -76],
                shadowAnchor: [22, 94]
            });
        }
        else{
            myIcon = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                iconSize: [38, 95],
                iconAnchor: [22, 94],
                popupAnchor: [-3, -76],
                shadowAnchor: [22, 94]
            });
        }


    /*var negativeIcon = new LeafIcon({iconUrl: './icon/arrowPositive.png'});
    var negativeIcon = new LeafIcon({iconUrl: './icon/arrowPositive.png'});*/

        L.marker([futureMarkers[i].lat, futureMarkers[i].lng],{icon: myIcon})
            .bindPopup(futureMarkers[i].Road_name +"<br> Auto per ora:"+ futureMarkers[i].flow
                +"<br>Velocità Media: "+ futureMarkers[i].speed)
            .addTo(map);
        i++;
    }
}



