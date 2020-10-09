
var API_KEY = "pk.eyJ1Ijoia2lydXNoYW4iLCJhIjoiY2tnMWx6ajN4MDBxOTJ4cXFrbDhpOXQ3YyJ9.pTLf9cMtxESdYgq7FmDjIw"
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });


  // Create map, giving it the streetmap and earthquake layers to display when run
  var myMap = L.map("map", {
    center: [
      40.7, -94.5
    ],
    zoom: 6,
    
  });

  streetmap.addTo(myMap)
  // Create a layer control
  // Pass in baseMaps and overlayMaps
  // Add the layer control to the map

  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

  //Three functions: 1 style, 1 radius and 1 color

    function mapStyle(feature){
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: mapColor(feature.properties.mag),
            color: "#000000",
            radius: mapRadius(feature.properties.map),
            strple: true,
            weight: 0.5
        };


    }


    function mapColor(magnitude) {
        switch (true) {
            case magnitude > 5:
                return "red";
            case magnitude > 4:
                return "orange";
            case magnitude > 3:
                return "yellow";
            case magnitude > 2:
                return "green";
            case magnitude > 1:
                return "blue";
            default:
                return "white";
        }
    }


    function mapRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }

        return magnitude * 4;
    }


    // Adding GeoJSON layer
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);

        },

        style: mapStyle,

        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(myMap)

    // creating the legends

    var legend = L.control({
        position: "bottomright"
    });    
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");

        var grades = [0,1,2,3,4,5]
        var colors = ["white","blue","green","yellow","orange","red"];

        for (var i= 0; i < grades.length; i++) {
            div.innerHTML +=
            "<i style='background: " + colors[i] + "'></i> " +
            grades[i] + (grades[i+1] ? "&ndash;" + grades[i+1] + "<br>" : "+");

        }

        return div;
    };

    legend.addTo(myMap);
  });