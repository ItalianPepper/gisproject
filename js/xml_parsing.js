/**
 * Created by Paolo on 06/02/2020.
 */
var _JsonData;
var roads = [];

$.ajax({
    type:"GET",
    url:"http://opendata.5t.torino.it/get_fdt",
    dataType:"xml",
    success: function(response){
        parserExcel();
        parsing_xml(response)
        //console.log(roads);

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

        var speedLimit=getSpeedLimitRoad(roadName);

        var resultObj = {"Road_name":roadName, "lat":lat, "lng":lng, "accuracy":accuracy,
        "flow":flow, "speed":speed, "direction":direction, "speedLimit":speedLimit};
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

function parserExcel(){

    fetch('excelFile/SegnaleticheTorino.xlsx').then(function (res) {
        /* get the data as a Blob */
        if (!res.ok) throw new Error("fetch failed");
        return res.arrayBuffer();
    })
        .then(function (ab) {
            /* parse the data when it is received */
            var data = new Uint8Array(ab);
            var workbook = XLSX.read(data, {
                type: "array"
            });

            var first_sheet_name = workbook.SheetNames[0];
            /* Get worksheet */
            var worksheet = workbook.Sheets[first_sheet_name];

            _JsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
            /************************ End of conversion ************************/


            $.each(_JsonData, function (index, value) {
                roads[value.name]=value.name;
        //       console.log(value.name+" speed:"+value.maxspeed);
            });

        });
}

function getSpeedLimitRoad(roadName){
    for (var key in roads) {
        //if(key.includes(roadName))
          //  return  roads[roadName];
        console.log("key " + key + " has value " + roads[key]);
    }
    //se il nome della strada ricercata non è incluso nell'array, viene restituita una stima del limite velocità in base alla tipologia di strada
    return 40;
}