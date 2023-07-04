
var colorSize = function(depth){
    if(depth > 90){
        return "red"
    } else if(depth > 30){
        return "orange"
    } else if(depth > 10){
        return "yellow"
    } else{
        return "green"
    }
    }

var style = function(feature){
    return {
    color: "black",
    weight: 0.5,
    fillColor: colorSize(feature.geometry.coordinates[2]),
    fillOpacity: 0.5,
    radius: feature.properties.mag * 10}
}

var earthquakeLayer = L.layerGroup()

function coordinatesList() {
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then((data) =>{
    var coordinates = L.geoJson(data, {
        pointToLayer: function(feature,coordinates){
            return L.circleMarker(coordinates)
        },
        style: style,
        onEachFeature: function(feature,layer){
            layer.bindPopup(`<h1> Magnitude: ${feature.properties.mag} <br> Place: ${feature.properties.place} <br>
            Latitude:${feature.geometry.coordinates[1]} <br> Longitude: ${feature.geometry.coordinates[0]} <br> Depth: ${feature.geometry.coordinates[2]}<h1>`)
        }
    })
    coordinates.addTo(earthquakeLayer)
    earthquakeLayer.addTo(myMap);    
    }) 
}

var overlays = {
    cities: earthquakeLayer 
}

var myMap = L.map("map", 
{
    center: [39.3210, - 111.0937],
    zoom: 6,
    layers: [earthquakeLayer]
}
);

var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
street.addTo(myMap);
 
 var grayscale = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
});

var tiles ={
    grayscale : grayscale
}

L.control.layers(tiles, overlays).addTo(myMap);

var legend = L.control({
    position: "bottomright"
})
legend.onAdd = function(){
    var div = L.DomUtil.create("div", "legend")
    var labels = ["< 10","10-30","30-90","> 90"]
    var colorBox = ["green","yellow","orange","red"]
  
    for (i = 0 ; i < labels.length; i++){
        div.innerHTML += `<div> <div class= "box" style="background: ${colorBox[i]}"></div>${labels[i]}</div> `
    }
    return div
}
legend.addTo(myMap);

coordinatesList();