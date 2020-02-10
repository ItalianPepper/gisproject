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

        var speedLimit=getSpeedLimitRoad(roadName);

        var resultObj = {"Road_name":roadName, "lat":lat, "lng":lng, "accuracy":accuracy,
        "flow":flow, "speed":speed, "direction":direction, "speedLimit":speedLimit};
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
               // console.log(value.name+" speed:"+value.maxspeed);
            });

        });

}

function getSpeedLimitRoad(roadName){
    for (var key in roads) {
        if(key.includes(roadName))
            return  roads[roadName];
        //console.log("key " + key + " has value " + myArray[key]);
    }
}




