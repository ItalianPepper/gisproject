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
                html += (i+1) + '. ';
                html += maneuvers[i].narrative + '<br>';
            }

            L.DomUtil.get('route-narrative').innerHTML = html;
        }
    });

dir.route({
    locations: [
        { latLng: { lat: 45.07479, lng: 7.72452 } },
        { latLng: { lat: 45.07443, lng: 7.72149 } },
    ]
});

map.addLayer(MQ.routing.routeLayer({
    directions: dir,
    fitBounds: true
}));


