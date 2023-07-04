//variable to hold depth function, styling the circles according to their depth
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
//variable to hold circles markers style, according to the depth function and magnitude
var style = function(feature){
    return {
    color: "black",
    weight: 0.5,
    fillColor: colorSize(feature.geometry.coordinates[2]),
    fillOpacity: 0.5,
    radius: feature.properties.mag * 10}
}
//creating layer group to add all markers at once
var earthquakeLayer = L.layerGroup()
//load geojson api data for all earthquakes of the past 7 Days
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
//create toggle option to show or hide the markers
var overlays = {
    cities: earthquakeLayer 
}
//create map coordinates
var myMap = L.map("map", 
{
    center: [39.3210, - 111.0937],
    zoom: 6,
    layers: [earthquakeLayer]
}
);
//add layer
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
street.addTo(myMap);
 //grayscale layer
 var grayscale = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
});
//add greyscale
var tiles ={
    grayscale : grayscale
}
//add the toggle option to the map
L.control.layers(tiles, overlays).addTo(myMap);
//create legend and adjust the position
var legend = L.control({
    position: "bottomright"
})
legend.onAdd = function(){
    var div = L.DomUtil.create("div", "legend")
    var labels = ["< 10","10-30","30-90","> 90"]
    var colorBox = ["green","yellow","orange","red"]
    //var labels = ["> 90", "30-90", "10-30","< 10"]
    //var colorBox = ["red", "orange", "yellow", "green"]
    for (i = 0 ; i < labels.length; i++){
        div.innerHTML += `<div> <div class= "box" style="background: ${colorBox[i]}"></div>${labels[i]}</div> `
    }
    return div
}
legend.addTo(myMap);
//call the function
coordinatesList();