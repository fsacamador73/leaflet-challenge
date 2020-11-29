// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var myMap = L.map("map", {
    center: [33.98, -39.17],
    zoom: 2
  });
  
  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  }).addTo(myMap);
  

// URL for all last 7 days earthquakes from USGS website
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Function for marker color
function markerColor(mag){
    return mag > 5 ? "#d73027":
        mag > 4 ? "#fc8d59" :
        mag > 3 ? "#fee08b":
        mag > 2 ? "#d9ef8b":
        mag > 1 ? "#91cf60":
        "#1a9850";
}

// Pull the data from USGS website
d3.json(url, function(data) {

    for (var i = 0; i < data.features.length; i++) {
        
        // Extract from the json the data corresponding to coordinates, magnitude, time and location
        var coordinates = data.features[i].geometry.coordinates;
        var mag = data.features[i].properties.mag;
        var date = new Date(data.features[i].properties.time);
        var location = data.features[i].properties.place;

        // Create the markers
        L.circle([coordinates[1], coordinates[0]], {
            color: "#E3E3E3",
            weight: 1,
            fillColor: markerColor(mag),
            fillOpacity: 0.5,
            radius: mag * 50000
        }).bindPopup("<h1>" + location + "</h1><hr><h3> Magnitude: " + mag + "</h3>" + "<p>" + date + "</p>")
        .addTo(myMap);
    }

// Set Up Legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"), 
    magnitudeLevels = [0, 1, 2, 3, 4, 5];

    div.innerHTML += "<h3>Magnitude</h3>"

    for (var i = 0; i < magnitudeLevels.length; i++) {
        div.innerHTML +=
            '<i style="background: ' + markerColor(magnitudeLevels[i] + 1) + '"></i> ' +
            magnitudeLevels[i] + (magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
    }
    return div;
};

// Add legend to the Map
legend.addTo(myMap);

});