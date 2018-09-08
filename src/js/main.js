//load our custom elements
require("component-leaflet-map");
require("component-responsive-frame");

//get access to Leaflet and the map
var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;

var ich = require("icanhaz");
var templateFile = require("./_popup.html");
ich.addTemplate("popup", templateFile);

var data = require("./homeless_schoolD.geo.json");


var mapElement = document.querySelector("leaflet-map");

if (mapElement) {
  var L = mapElement.leaflet;
  var map = mapElement.map;

  map.scrollWheelZoom.disable();

  var focused = false;

  var all = "changeHomeless";

  var commafy = s => (s*1).toLocaleString().replace(/\.0+$/, "");

   data.features.forEach(function(f) {
	["changeHomeless", "changeAll"].forEach(function(prop) {
		f.properties[prop] = (f.properties[prop] * 100).toFixed(0);
	});
  ["bedYouth", "bedFamily"].forEach(function(prop) {
    f.properties[prop] = commafy(f.properties[prop]);
  });
	});

var onEachFeature = function(feature, layer) {
  layer.bindPopup(ich.popup(feature.properties))
  layer.on({
  	     mouseover: function(e) {
        layer.setStyle({ weight: 2.5, fillOpacity: .8 });
      },
      mouseout: function(e) {
        if (focused && focused == layer) { return }
        layer.setStyle({ weight: 1.5, fillOpacity: 0.6
         });
      }
    });
};

var getColor = function(d) {
    var value = d[all];
    if (typeof value == "string") {
      value = Number(value.replace(/,/, ""));
    }
    // console.log(value)
    if (typeof value != "undefined") {
      // condition ? if-true : if-false;
     return value >= 100 ? '#d73027' :
        value >= 50 ? '#fdae61' :
        value >= 0.0001 ? '#fee090' :
        value >= 0.00 ? '#E5E5E5' :
        value >= -49 ? '#abd9e9' :
        value >= -99.0 ? '#74add1' :
             
             '#4575b4' ;
    } else {
      return "gray"
    }
  };

  var style = function(feature) {
    var s = {
      fillColor: getColor(feature.properties),
      weight: 1.5,
      opacity: .1,
      color: '#000',
      fillOpacity: 0.6
    };
    return s;
  }

  var geojson = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);

}

map.createPane("top");
map.getPane("top").style.zIndex = 999;
var topLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
  pane: "top",
}).addTo(map);

 map.scrollWheelZoom.disable();

