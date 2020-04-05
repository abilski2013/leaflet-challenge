// Create a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.pirates",
  accessToken: API_KEY
}).addTo(myMap);


d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson', function(data) {
    console.log(data);
    
    function markerSize(magnitude) {
        return magnitude * 20000;
    }
      
    
    function color(magnitude) {
    return magnitude < 1 ? '#DA70D6' :
           magnitude < 2.5 ? '#BA55D3' :
           magnitude < 4.5 ? '#8A2BE2' :
           magnitude < 6 ? '#8B008B' :
                           '#4B0082' ;
    };
        
//    console.log(data.features[0].properties.mag)
//    console.log(data.features[0].geometry.coordinates[1])
//    console.log(data.features[0].geometry.coordinates[0])
//    
    for (var i=0; i < data.features.length; i++) {
        L.circle([data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]], {
            fillOpacity: .75,
            color: "white",
            weight: .5,
            fillColor: color(data.features[i].properties.mag),
            radius: markerSize(data.features[i].properties.mag) 
        }).bindPopup("<h3>" + data.features[i].properties.title + "<br><p class='link'><a href='" + data.features[i].properties.url + "' target='_blank'>" + data.features[i].properties.url + "</a></p></h3>").addTo(myMap);
    }
    
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [Infinity, 6, 4.5, 2.5, 1],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + color(grades[i] - .1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '>');
        }

        return div;
    };

    legend.addTo(myMap);

});