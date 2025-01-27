// Create the 'basemap' tile layer that will be the background of our map.

// Creating basemap tile layer
let basemap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");


// Create the map object with center and zoom options.
let map = L.map("map", {
  // centering on San Francisco
  center: [37.7749, -122.4194],
  zoom:5
});

// Then add the 'basemap' tile layer to the map.

basemap.addTo(map);

// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. Pass the magnitude and depth of the earthquake into two separate functions
  // to calculate the color and radius.
  // function that makes magnitude determine radius and depth determines color
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight:0.5,
    };
  }

  // This function determines the color of the marker based on the depth of the earthquake.
  // creating function that determines the color of the marker based on the depth of the earthquake
  function getColor(depth) {
    if (depth > 90) return "#FF5F65";
    if (depth > 70) return "#FCA35D";
    if (depth > 50) return "#FDB72A";
    if (depth > 30) return "#F7DB11";
    if (depth > 10) return "#DCF400";
    return "#A3F600";
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  // Creating function that determines the radius of the earthquake marker based on its magnitude
  function getRadius(magnitude) {
    if (magnitude === 0) return 1;
    return magnitude * 4;
  }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);

    },
    // Set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        `<b>Magnitude:</b> ${feature.properties.mag}<br>` +
        `<b>Depth:</b> ${feature.geometry.coordinates[2]} km<br>` +
        `<b>Location:</b> ${feature.properties.place}`
      );

    },
  }).addTo(map);

  // Create a legend control object.
  let legend = L.control({
    position: "bottomright",
  });

  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "legend");

    // Initialize depth intervals and colors for the legend
    const depthInt = [-10, 10 , 30 , 50 , 70 , 90];
    const colors = ["#A3F600", "#DCF400", "#F7DB11", "#FDB72A", "#FCA35D", "#FF5F65"];

    // Loop through our depth intervals to generate a label with a colored square for each interval.
    for (let i = 0; i < depthInt.length; i++){
      div.innerHTML +=
        `<i style="background: ${colors[i]}"></i> ` +
        depthInt[i] +
        (depthInt[i + 1] ? `&ndash;${depthInt[i + 1]}<br>` : "+");
    }

    return div;
  };

  // Finally, add the legend to the map.
  legend.addTo(map);
});
