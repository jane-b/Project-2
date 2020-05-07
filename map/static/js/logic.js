var workforce_json = "../processed_data/final_workforce_data.json"

// Create the tile layer that will be the background of our map
var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: "pk.eyJ1IjoiZGFuaWVsbGVobyIsImEiOiJjazlweGpyZTAwZjVvM3BycmM1OTM2MHk0In0.219ncmTIvxFW-tKUB_kDsg"
});

var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: "pk.eyJ1IjoiZGFuaWVsbGVobyIsImEiOiJjazlweGpyZTAwZjVvM3BycmM1OTM2MHk0In0.219ncmTIvxFW-tKUB_kDsg"
});

var layers = {
    workforce: new L.LayerGroup()
};

// Create a map object
var myMap = L.map("map", {
    center: [ 15.5994, -28.6731],
    zoom: 3,
    layers: [
        grayscale,
        outdoors,
        layers.workforce
    ]
 });

 var baseMaps = {
    "Grayscale": grayscale,
    "Outdoors": outdoors
};

var overlayMaps = {
    "Workforce": layers.workforce
};

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

function getColor(d) {
    return d > 42 ? '#800026' :
           d > 36  ? '#E31A1C' :
           d > 26  ? '#FD8D3C' :
           d > 18  ? '#FED976' :
                     '#FFEDA0' ;
}

// // Create a legend to display information about our map
// var legend = L.control({position: 'bottomright'});

// legend.onAdd = function (map) {

//     // When the layer control is added, insert a div with the class of "legend"
//     var div = L.DomUtil.create('div', 'info legend'),
//         grades = [0,18, 26, 36, 42]; 

//         // loop through our density intervals and generate a label with a colored square for each interval
//         for (var i = 0; i < grades.length; i++) {
//             div.innerHTML += '<i style= "background:' + getColor(grades[i] + 1) + '"></i> ' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//             console.log(getColor(grades[i]+1))
//         }
//         return div;
//         };

// // Add the legend to the map       
// legend.addTo(myMap);

d3.json(workforce_json, function(response){

    var filtered_workforce = response.data.filter(data => data.year == 2016);
    console.log(filtered_workforce)

    for (var i = 0; i < filtered_workforce.length; i++) {
        

        var laborforce = filtered_workforce[i].fem_laborforce
        var lat = filtered_workforce[i].lat
        var long = filtered_workforce[i].long

        if (laborforce){

            var marker = L.circle([lat,long], {
                fillOpacity: 0.8,
                weight: 1,
                color: 'white',
                fillColor: getColor(laborforce),
                radius: laborforce *10000
            })
             
            marker.addTo(layers['workforce'])

            }

        
        }
    });


    

