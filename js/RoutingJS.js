var dir;


dir = MQ.routing.directions()
    .on('success', function(data) {
        var legs = data.route.legs,
            html = '',
            maneuvers,
            i;

        if (legs && legs.length) {
            maneuvers = legs[0].maneuvers;

            for (i=0; i < maneuvers.length; i++) {
                //html += (i+1) + '. ';
                if(maneuvers[i].narrative.includes("left"))
                    html +='<img src="icon/arrowLeft.png" width="59" height="40">&nbsp;&nbsp;';
                else if(maneuvers[i].narrative.includes("right"))
                    html +='<img src="icon/arrowRight.png" width="59" height="40">&nbsp;&nbsp;';
                else if(maneuvers[i].narrative.includes("straight"))
                    html +='<img src="icon/straight.png" width="59" height="40">&nbsp;&nbsp;';
                else if(maneuvers[i].narrative.includes("becomes"))
                    html +='<img src="icon/crossRoad.png" width="50" height="40">&nbsp;&nbsp;';
                else if(i==maneuvers.length-1)
                    html +='<img src="icon/finish.png" width="59" height="40">&nbsp;&nbsp;';
                else if(i==0)
                    html +='<img src="icon/start.png" width="50" height="40">&nbsp;&nbsp;';
                html += maneuvers[i].narrative + '<br>';
            }

            L.DomUtil.get('route-narrative').innerHTML = html;
        }
    });

dir.route({
    locations: [
        { latLng: { lat: 45.07479, lng: 7.72452 } },
        { latLng: { lat: 45.07443, lng: 7.72149 } },
    ],

});




map.addLayer(MQ.routing.routeLayer({
    directions: dir,
    fitBounds: true
}));