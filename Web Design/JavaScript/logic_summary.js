var geojson;

var myMap = L.map('fem-map').setView([51.5074, -0.1278], 2);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + "pk.eyJ1IjoiZGFuaWVsbGVobyIsImEiOiJjazlweGpyZTAwZjVvM3BycmM1OTM2MHk0In0.219ncmTIvxFW-tKUB_kDsg", {
    id: 'mapbox/light-v9',
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    zoomOffset: -1
}).addTo(myMap);


function getColor(d) {
  return d > 42  ? '#56222e' :
         d > 36  ? '#803345' :
         d > 26  ? '#be5b72' :
         d > 18  ? '#DAA095' :
                   '#f2ddd9' ;
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.fem_laborforce),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 1
    };
}

// // Happens on mouse hover
function highlight(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 3,
        color: '#ffd32a',
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    displayInfo.update(layer.feature.properties);
  }

 //// Happens on mouse out  
  function reset(e) {
    geojson.resetStyle(e.target);
    displayInfo.update();
  }

  function zoomToCountry(e) {
    myMap.fitBounds(e.target.getBounds());
  }


  function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlight,
        mouseout: reset,
        click: zoomToCountry
    });
  }

  // Zoom out function
  var extentControl = L.Control.extend({
    options: {
        position: 'topleft'
    },
    onAdd: function (map) {
        var llBounds = map.getBounds();
        var container = L.DomUtil.create('div', 'extentControl');
        $(container).css('background', 'url(css/extend.png) no-repeat 50% 50%').css('width', '26px').css('height', '26px').css('outline', '1px black');
        $(container).on('click', function () {
            map.fitBounds(llBounds);
        });
        return container;
       }
    })
    
    myMap.addControl(new extentControl());




  // Legend
  var legend = L.control({
    position: 'bottomright'
    }
  );

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        colors = [0,18, 26, 36, 42],
        labels = [];

    div.innerHTML += '<h4>Female Laborforce <br> (% of Total Labor Force)</h4>';

    // Loops through GDP data and grabs colors for each range and puts them in the legend’s key
    for (var i = 0; i < colors.length; i++) {
     div.innerHTML +=
        '<i style="background:' + getColor(colors[i] + 1) + '"></i>'  +
         colors[i] + (colors[i + 1] ? '&ndash;' + colors[i + 1] + '<br>' : '+');

    }

    return div;
  };

   legend.addTo(myMap);


   //Filter display of the map by particular year
   function showData(p_year) {
    geojson =  L.geoJson(workforceData, {
      filter: function(feature, layer) {
        return feature.properties.year == p_year;},
      style: style,
      onEachFeature: onEachFeature}
      ).addTo(myMap)};



  // On hover control that displays information about hovered upon country
  var displayInfo = L.control();

  displayInfo.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
      this.update();
      return this._div;
  }; 
  
// Passes properties of hovered upon country and displays it in the control
displayInfo.update = function (props) {

    this._div.innerHTML = '<h2>Female Laborforce</h2>' +  (props ?
        '<h3>' + props.year + '</h3>' + 
        '<b>' + 'Female laborforce: ' + '</b>' + props.fem_laborforce + '%' +'<br />' +
        '<b>' +  'Country: ' + '</b>' + props.country_name  +'<br />' +
        '<b>' +  'Continent: ' + '</b>' + props.continent_name  +'<br />' 
        : 'Hover over a country');
};





displayInfo.addTo(myMap);




 // Happens on mouse hover
 function highlight(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        color: '#ffd32a'
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    // Updates custom legend on hover
    displayInfo.update(layer.feature.properties);
  }

  // Happens on mouse out
  function reset(e) {
    geojson.resetStyle(e.target);
    // Resets custom legend when user unhovers
    displayInfo.update();
  }




  function processData(data) {
    var timestamps = [];
    var min = Infinity; 
    var max = -Infinity;
    for (var feature in data.features) {
      var properties = data.features[feature].properties; 
      for (var attribute in properties) { 
        if ( attribute == 'year') {		
          if ( $.inArray(attribute,timestamps) === -1) {
            timestamps.push(attribute);		
          }
          if (properties[attribute] < min) {	
            min = properties[attribute];
          }
          if (properties[attribute] > max) { 
            max = properties[attribute]; 
          }
        }
      }
    }
    return {
      timestamps : timestamps,
      min : min,
      max : max
    }
  }
function createSliderUI(slider_data) {
  var sliderControl = L.control({ position: 'bottomleft'} );
  sliderControl.onAdd = function(map) {
    var slider = L.DomUtil.create("input", "slider");
    L.DomEvent.addListener(slider, 'mousedown', function(e) { 
      L.DomEvent.stopPropagation(e); 
    });
    $(slider)
      .attr({'type':'range', 
        'max': slider_data.max, 
        'min': 1990, 
        'step': 1,
        'value': String(slider_data.max)})
        .on('input change', function() {
        showData($(this).val().toString());
        $(".temporal-legend").text(this.value);
      });
    return slider;
  }
sliderControl.addTo(myMap)
createTemporalLegend(slider_data.max);
}

var slider_data = processData(workforceData);

showData(slider_data.max);

createSliderUI(slider_data);

function createTemporalLegend(startTimestamp) {
  var temporalLegend = L.control({ position: 'bottomleft' }); 
  temporalLegend.onAdd = function(map) { 
    var output = L.DomUtil.create("output", "temporal-legend");
    $(output).text(startTimestamp)
    return output; 
  }
  temporalLegend.addTo(myMap); 
}

