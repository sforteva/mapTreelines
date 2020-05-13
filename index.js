import 'ol/ol.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {defaults as defaultControls} from 'ol/control.js';
import MousePosition from 'ol/control/MousePosition.js';
import {createStringXY} from 'ol/coordinate.js';
import Feature from 'ol/Feature.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Circle as CircleStyle, Fill, Point, Stroke, Style} from 'ol/style.js';
import BingMaps from 'ol/source/BingMaps.js';

var feature = null;
var ob = null;
var left = screen.width;
var top = screen.height;

var select = document.getElementById('layer-select');

var layersBing = [];
var i, ii;
/**************************** Mouse Position **************************************************/
var mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(4),
  projection: 'EPSG:4326',
  // comment the following two lines to have the mouse position
  // be placed within the map.
  className: 'custom-mouse-position',
  target: document.getElementById('mouse-position'),
  undefinedHTML: '&nbsp;'
});
/*
var projectionSelect = document.getElementById('projection');
projectionSelect.addEventListener('change', function(event) {
  mousePositionControl.setProjection(event.target.value);
});

var precisionInput = document.getElementById('precision');
precisionInput.addEventListener('change', function(event) {
  var format = createStringXY(event.target.valueAsNumber);
  mousePositionControl.setCoordinateFormat(format);
});*/

/*******************************************************************************/

var image = new CircleStyle({
  radius: 5,
  fill: new Fill({ color: 'green' }),
  stroke: new Stroke({color: 'red', width: 2})
});

var styles = {
  'Point': new Style({
    image: image
  }),
  'LineString': [new Style({
    stroke: new Stroke({
        color: 'green',
        width: 1
    }),
  'Name': new Text()
})],
  text: new Text()
};


var styleFunction = function(feature) {
  return styles[feature.getGeometry().getType()];
};

var vectorLayer = new VectorLayer({
  source: new VectorSource({
    url: '/Treeline_sites_190905.geojson',
    format: new GeoJSON()
  }),
  style: styleFunction
});

//var features = vectorLayer.getSource().getFeatureById('1');
///*console.info(features[1])
/*for (var i in features) {
   var feature = features[i];
   if (ol.extent.containsExtent(viewExtent, feature.getGeometry().getExtent())) {                        
      console.log("id: " + feature.getId());
   }
}*/

function mouseX(evt) {
  if (evt.pageX) {
      return evt.pageX;
  } else if (evt.clientX) {
     return evt.clientX + (document.documentElement.scrollLeft ?
         document.documentElement.scrollLeft :
         document.body.scrollLeft);
  } else {
      return null;
  }
}

function mouseY(evt) {
  if (evt.pageY) {
      return evt.pageY;
  } else if (evt.clientY) {
     return evt.clientY + (document.documentElement.scrollTop ?
     document.documentElement.scrollTop :
     document.body.scrollTop);
  } else {
      return null;
  }
}

var RoadLayer = new TileLayer({
  visible: false,
  preload: Infinity,
  source: new BingMaps({
    key: 'AvGzNukYJp4GwdFrZobJZNY2_n5BR3Jpw-EgLpA9jxKntezyi-ZeGGjkhic03JHt ',
    imagerySet: 'Road'
    // use maxZoom 19 to see stretched tiles instead of the BingMaps
    // "no photos at this zoom level" tiles
    // maxZoom: 19
  })
})

var AerialLayer = new TileLayer({
  visible: false,
  preload: Infinity,
  source: new BingMaps({
    key: 'AvGzNukYJp4GwdFrZobJZNY2_n5BR3Jpw-EgLpA9jxKntezyi-ZeGGjkhic03JHt ',
    imagerySet: 'Aerial'
    // use maxZoom 19 to see stretched tiles instead of the BingMaps
    // "no photos at this zoom level" tiles
    // maxZoom: 19
  })
})

var map = new Map({
  controls: defaultControls().extend([mousePositionControl]),
  layers: [
    RoadLayer,
    AerialLayer,
    vectorLayer
  ],
  target: 'map',
  view: new View({
    center: [-6655.5402445057125, 6709968.258934638],
    zoom: 2
  })
});

function flyToStore(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 15
  });
  console.info(currentFeature.geometry.coordinates);
}
  



map.on('click', function(evt){
  
  document.getElementById("showOnPointermove").className = "hide";
  if (evt.dragging) {
    return;
  } 
  if (evt!=null) {
    feature = map.forEachFeatureAtPixel(
        evt.pixel, function(ft, l) { return ft; }
    );
    if (feature) {
      document.getElementById("stImageOnClick").src =  feature.get('Link_Main_Pict');
      document.getElementById("stNameOnClick").innerHTML = "Photo: " + feature.get('Photographer main picture');
      //document.getElementById("stNameOnClick").href = feature.get('Link_Main_Pict');
      //document.getElementById("Country").innerHTML = feature.get('Country');

      document.getElementById("Location").innerHTML = "<strong>"+ feature.get('Name') + "," + feature.get('Mountain_range') + "</strong>";
      document.getElementById("Elevation").innerHTML = "<b>Elevation:</b> " + feature.get('Elevation_upper');
      document.getElementById("Tree_Species").innerHTML = "<b>Tree species:</b> <i>" + feature.get('Tree_Species') + "</i>";
      document.getElementById("Alpine_Veg").innerHTML = "<b>Alpine vegetation:</b> " + feature.get('Alpine_Vegetation');
      document.getElementById("Description").innerHTML = "<p></p>" +feature.get('Description');
      document.getElementById("more").href = feature.get('Link_Main_Pict');
      ob = document.getElementById("showOnClick");
      ob.className = "onClick";  
      //ob.style.left = mouseY(event) + "px";
      //ob.style.width = 140 + "px";
      //ob.style.maxHeight = left -10 + "px";
      
      //ob.style.top =  mouseY(event) + 'px';
      //ob.style.left = mouseX(event) + 'px';
      window.event.returnValue = false;
    }  
  }
});

map.on('pointermove', function(evt){
  /*document.getElementById("showOnPointermove").className = "hide";*/
  if (evt.dragging) {
    return;
  }
  //alert(evt.pixel);
  ob = document.getElementById("showOnPointermove");
  if (evt!=null) {
    feature = map.forEachFeatureAtPixel(
        evt.pixel, function(ft, l) { return ft; }
    );
    map.forEachFeatureAtPixel(
      evt.pixel, function(ft, l) { return ft; }
  );
    if (feature) {
      
      //document.getElementById("showOnClick").className = "hide";
      document.getElementById("stImage").src = feature.get('Link_Main_Pict');
      document.getElementById("stName").innerHTML = feature.get('Name');
      document.getElementById("stName").href = feature.get('Link_Main_Pict');
      ob.className = "onHover";  
      ob.style.top =  mouseY(event) + 'px';
      ob.style.left = mouseX(event) + 'px';
    
      window.event.returnValue = false;
      if (evt.dragging) {
        ob.className = "onHover";  
        ob.style.top =  "0" + 'px';
        ob.style.left = "0" + 'px';
        return;
    }
      //console.info(evt.coordinates);
        //you can see all properties with getProperties()
      //console.info(feature.getProperties());
        //and you can get directly a property
      //console.info(feature.get('Name'));
    }
  }
});

function onChange() {
  var style = select.value;
  if (style == 'Road'){AerialLayer.setVisible(false);RoadLayer.setVisible(true)}
  else if (style == 'Aerial'){AerialLayer.setVisible(true);RoadLayer.setVisible(false)}
}
select.addEventListener('change', onChange);
onChange();

  