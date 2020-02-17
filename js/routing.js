// docs: https://developer.mapquest.com/docs/api-reference/leaflet-plugins/classes/
//https://developer.mapquest.com/documentation/mapquest-js/v1.3/l-mapquest-directions-routeshape/

var sessionId = null;
/** Array contente tutti i punti selezionati dalla mappa*/
var shapePoints = [];

var green_arrow = L.icon({
    iconUrl: './icon/round_navigation_green_18dp.png',
    iconSize: [30, 30],
    iconAnchor: [30, 30],
    popupAnchor: [-3, -30],
    shadowUrl: './icon/round_navigation_shadow_18dp.png',
    shadowSize: [30, 30],
    shadowAnchor: [25, 25]
});

var orange_arrow = L.icon({
    iconUrl: './icon/round_navigation_orange_18dp.png',
    iconSize: [30, 30],
    iconAnchor: [30, 30],
    popupAnchor: [-3, -30],
    shadowUrl: './icon/round_navigation_shadow_18dp.png',
    shadowSize: [30, 30],
    shadowAnchor: [25, 25]
});

var red_arrow = L.icon({
    iconUrl: './icon/round_navigation_red_18dp.png',
    iconSize: [30, 30],
    iconAnchor: [30, 30],
    popupAnchor: [-3, -30],
    shadowUrl: './icon/round_navigation_shadow_18dp.png',
    shadowSize: [30, 30],
    shadowAnchor: [25, 25]
});

var error_accuracy_arrow = L.icon({
    iconUrl: './icon/round_navigation_shadow_18dp.png',
    iconSize: [30, 30],
    iconAnchor: [30, 30],
    popupAnchor: [-3, -30],
    shadowUrl: './icon/round_navigation_shadow_18dp.png',
    shadowSize: [30, 30],
    shadowAnchor: [25, 25]
});


var dir = MQ.routing.directions().on('success', function(data) {

    if (data.route.shape.shapePoints.length > 1){
        shapePoints = data.route.shape.shapePoints;
    }

    if (data.route.sessionId != undefined && data.route.shape.shapePoints.length < 2){

        //Serve per effettuare in seguito chiamate di tipo Route Shape
        sessionId =  data.route.sessionId;

    }
    indication(data);
});

var routeLayer = MQ.routing.routeLayer({
    directions: dir,
    fitBounds: true
});

/**Listener per il rilascio del Marker di MapQuest, fa inoltre partire l'analisi di lat e lng della route*/

routeLayer.on("markerDragEnd",function(e){

    dir.routeShape({
        'sessionId':sessionId,
        'fullShape':true
    });

    /** MarkerSet è una variabile globale contente tutti i marker presenti sulla mappa ed è
     *  cretato nel file 'xml_parsing.js'
     */
    checkMarkersOnRoute(markersSet, markersData, shapePoints)

});

routeLayer.on("routeRibbonUpdated",function(e){

    dir.routeShape({
        'sessionId':sessionId,
        'fullShape':true
    });

    /** MarkerSet è una variabile globale contente tutti i marker presenti sulla mappa ed è
     *  cretato nel file 'xml_parsing.js'
     */
    checkMarkersOnRoute(markersSet, markersData, shapePoints)

});

map.addLayer(routeLayer);

//Init dei punti sulla mappa fissati a Torino centro
dir.route({
    locations: [
        {latLng: {lat: 45.0633141, lng: 7.6692847}},
        {latLng: {lat: 45.0633141, lng: 7.6692847}}
    ]
});


function indication(data){

    var legs = data.route.legs,
        html = '',
        maneuvers,
        i;

    if (legs && legs.length) {
        maneuvers = legs[0].maneuvers;

        for (i = 0; i < maneuvers.length; i++) {
            html += (i + 1) + '. &nbsp;&nbsp;';
            if (maneuvers[i].narrative.includes("left"))
                html += '<img src="icon/arrowLeft.png" width="59" height="40">';
            else if (maneuvers[i].narrative.includes("right"))
                html += '<img src="icon/arrowRight.png" width="59" height="40">';
            else if (maneuvers[i].narrative.includes("straight"))
                html += '<img src="icon/straight.png" width="59" height="40">';
            else if (maneuvers[i].narrative.includes("becomes"))
                html += '<img src="icon/crossRoad.png" width="50" height="40">';
            else if (i == maneuvers.length - 1)
                html += '<img src="icon/finish.png" width="59" height="40">';
            else if (i == 0)
                html += '<img src="icon/start.png" width="50" height="40">';
            html += maneuvers[i].narrative + '<br>';
        }

        L.DomUtil.get('route-narrative').innerHTML = html;
    }
}


function checkMarkersOnRoute(markersSet, markersData, shapePoints){
    /**@param markers Array dei Marker presenti sulla mappa
     * @param shapePoints Array dei punti presenti nella route
     * Questa funziona colora i marker che sono presenti nella route selezionata dall'utente*/

    var routeSelected = [];

    if (shapePoints.length > 0) {

        for (var markId in markersSet){

           for (var j = 0; j < shapePoints.length; j++) {

               var markerOnMap = markersSet[markId];

               var m_lat = fixedFloatConversion(markerOnMap._latlng.lat);
               var m_lng = fixedFloatConversion(markerOnMap._latlng.lng);
               var s_lat = fixedFloatConversion(shapePoints[j].lat);
               var s_lng = fixedFloatConversion(shapePoints[j].lng);

               //VERIFICARE
               var sub_lat = m_lat - s_lat;
               var sub_lng = m_lng - s_lng;
               var threshold = 100;

              // console.log(sub_lat+" "+sub_lng);

               if (sub_lat <= threshold && sub_lng <= threshold && sub_lat >=-threshold && sub_lng >=-threshold){

                   markersSet[markId].setOpacity(1.0);

                   routeSelected.push(markId);

                   var marker_data = markersData[markId];
                   // da sostituire con il limite di velocità della strada.
                   var speedLimit = marker_data.speedLimit;

                   // (flusso reale all'ora/ flusso stimato all'ora considerando il limite)/ l'accuratezza
                   if (marker_data.accuracy != -1 && marker_data.accuracy > 50) {

                       // var metrics = ((marker_data.flow * marker_data.speed)/(marker_data.flow*speedLimit)) * (marker_data.accuracy/100);

                       var metrics = (marker_data.speed)/(speedLimit);

                       if (metrics < 0.49){
                           markersSet[markId].setIcon(red_arrow);
                       }else if(metrics >= 0.49 && metrics <= 0.7){
                           markersSet[markId].setIcon(orange_arrow);
                       }else if(metrics >0.7){
                           markersSet[markId].setIcon(green_arrow);
                       }

                   }else{
                       markersSet[markId].setIcon(error_accuracy_arrow);
                   }

               }

           }
       }
    }
    /** Tutti i marker che non sono nella route vengono portati a default.*/
    for (var markId in markersSet){
        if (!(routeSelected.includes(markId))){
            markersSet[markId].setIcon(default_arrow);
        }
    }
}

/***JavaScript è limitante con le operazioni sui float*/
function fixedFloatConversion(numberf){
    var x = numberf*10000;

    var res = x - Math.floor(x);

    x = x - res;
    return x

}

