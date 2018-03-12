var app = {

  /** ICON Setting **/
  icons : {
    'publictap' : new L.Icon({
       iconUrl: './icon/publictap.png'
    }),
    'waterkiosk' : new L.Icon({
       iconUrl: './icon/waterkiosk.png'
    }),
    'valve' : new L.Icon({
       iconSize: [24,24],
       iconUrl: './icon/valve.png'
    }),
    'reservoir' : new L.Icon({
       iconUrl: './icon/reservoir.png'
    }),
    'watersource' : new L.Icon({
       iconUrl: './icon/water_source.png'
    }),
    'springwater' : new L.Icon({
       iconUrl: './icon/spring_water.png'
    }),
    'borehole' : new L.Icon({
       iconUrl: './icon/borehole.png'
    })
  },

  /** Initialize **/
  init : function(){
    var map = L.map('map').setView([-1.904962,30.499550], 13);
    L.control.polylineMeasure({
      showMeasurementsClearControl: true
    }).addTo(map);
    L.control.mousePosition().addTo(map);
    L.easyPrint({elementsToHide: 'a'}).addTo(map)
    L.control.locate().addTo(map);
    
    /** Base Map Layer **/
    var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });
    
    var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });
    
    var googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });
    
    var basemap = {
      'OpenStreetMap' : osm,
      'Google Streets' : googleStreets,
      'Google Hybrid' : googleHybrid,
      'Google Terrain' : googleTerrain
    };
    
    var overlays = {
      'Water' : {},
      'Administrative' : {}
    };
    
    /** Administrative Map **/
    $.getJSON('./geojson/admin_district.geojson',function(data){
      var layer = new L.GeoJSON(data,{
        style: function(feature) {
          return {color: "#000000",weight:1.5};
        }
      }).addTo(map);
      overlays.Administrative['District'] = layer;
    });
    
    /**
    $.getJSON('./geojson/admin_sector.geojson',function(data){
      var layer = new L.GeoJSON(data,{
        style: function(feature) {
          return {color: "#000000",weight:1.6};
        }
      }).addTo(map);
      overlays.Administrative['Sector'] = layer;
    });
    **/
    
    /** Overlay Map **/
    $.getJSON('./geojson/pipeline.geojson',function(data){
      var layer = new L.GeoJSON(data,{
        style: function(feature) {
          return {color: "#0000FF",weight:2.0};
        },
        onEachFeature: function (feature, layer) {
           layer.bindTooltip('<h1>Pipeline</h1><br><table border="1"><tr><td>WSSName</td><td>' + feature.properties.WSSName + '</td></tr><tr><td>Types</td><td>' + feature.properties.Types + '</td></tr></table>');
        }
      }).addTo(map);
      overlays.Water['Pipeline'] = layer;
    });
    
    $.getJSON('./geojson/public_tap.geojson',function(data){
      var layer = new L.GeoJSON(data,{
        pointToLayer: function(feature, latlng) {
          return L.marker(latlng, {icon: app.icons.publictap});
        },
        onEachFeature: function (feature, layer) {
          layer.bindTooltip('<h1>Public Tap</h1><br><table border="1"><tr><td>Status</td><td>' + feature.properties.Functional + '</td></tr><tr></table>');
        }
      }).addTo(map);
      overlays.Water['Public Tap'] = layer;
    });
    
    $.getJSON('./geojson/water_kiosk.geojson',function(data){
      var layer = new L.GeoJSON(data,{
        pointToLayer: function(feature, latlng) {
          return L.marker(latlng, {icon: app.icons.waterkiosk});
        },
        onEachFeature: function (feature, layer) {
          layer.bindTooltip('<h1>Water Kiosk</h1><br><table border="1"><tr><td>Status</td><td>' + feature.properties.Functional + '</td></tr><tr></table>');
        }
      }).addTo(map);
      overlays.Water['Water Kiosk'] = layer;
    });
    
    $.getJSON('./geojson/valve_chamber.geojson',function(data){
      var layer = new L.GeoJSON(data,{
        pointToLayer: function(feature, latlng) {
          return L.marker(latlng, {icon: app.icons.valve});
        },
        onEachFeature: function (feature, layer) {
          layer.bindTooltip('<h1>Valve Chamber</h1><br><table border="1"><tr><td>Status</td><td>' + feature.properties.Functional + '</td></tr><tr></table>');
        }
      }).addTo(map);
      overlays.Water['Valve Chamber'] = layer;
    });
    
    $.getJSON('./geojson/reservoir_tank.geojson',function(data){
      var layer = new L.GeoJSON(data,{
        pointToLayer: function(feature, latlng) {
          return L.marker(latlng, {icon: app.icons.reservoir});
        },
        onEachFeature: function (feature, layer) {
          layer.bindTooltip('<h1>Reservoir Tank</h1><br><table border="1"><tr><td>Type</td><td>' + feature.properties.Type + '</td></tr><tr><td>Date of Construction</td><td>' + feature.properties.Const_Year + '</td></tr><tr><td>Capacity(m3)</td><td>' + feature.properties.Size + '</td></tr><tr><td>Material</td><td>' + feature.properties.Materials + '</td></tr><tr><td>Status</td><td>' + feature.properties.Functional + '</td></tr><tr></table>');
        }
      }).addTo(map);
      overlays.Water['Reservoir Tank'] = layer;
    });
    
    $.getJSON('./geojson/water_source.geojson',function(data){
      var layer = new L.GeoJSON(data,{
        pointToLayer: function(feature, latlng) {
          return L.marker(latlng, {icon: app.icons.watersource});
        },
        onEachFeature: function (feature, layer) {
          layer.bindTooltip('<h1>Water Source</h1><br><table border="1"><tr><td>Type</td><td>' + feature.properties.Type + '</td></tr><tr><td>Date of Construction</td><td>' + feature.properties.Const_Year + '</td></tr><tr><td>Status</td><td>' + feature.properties.Functional + '</td></tr><tr></table>');
        }
      }).addTo(map);
      overlays.Water['Water Source'] = layer;
    });
    
    $.getJSON('./geojson/improved_spring.geojson',function(data){
      var layer = new L.GeoJSON(data,{
        pointToLayer: function(feature, latlng) {
          return L.marker(latlng, {icon: app.icons.springwater});
        },
        onEachFeature: function (feature, layer) {
          layer.bindTooltip('<h1>Improved Spring</h1><br><table border="1"><tr><td>Respondent No</td><td>' + feature.properties['Respondent No'] + '</td></tr><tr><td>District</td><td>' + feature.properties['District'] + '</td></tr><tr><td>Sector</td><td>' + feature.properties['Sector'] + '</td></tr><tr><td>Cell</td><td>' + feature.properties['Cell'] + '</td></tr><tr><td>Village</td><td>' + feature.properties['Village'] + '</td></tr><tr><td>Functionality of water point<br>at the time of a spot check</td><td>' + feature.properties['Functionality of water point at the time of a spot check'] + '</td></tr></table>');
        }
      }).addTo(map);
      overlays.Water['Improved Spring'] = layer;
    });
    
    $.getJSON('./geojson/borehole.geojson',function(data){
      var layer = new L.GeoJSON(data,{
        pointToLayer: function(feature, latlng) {
          return L.marker(latlng, {icon: app.icons.borehole});
        },
        onEachFeature: function (feature, layer) {
          layer.bindTooltip('<h1>Borehole</h1><br><table border="1"><tr><td>Respondent No</td><td>' + feature.properties['Respondent No'] + '</td></tr><tr><td>District</td><td>' + feature.properties['District'] + '</td></tr><tr><td>Sector</td><td>' + feature.properties['Sector'] + '</td></tr><tr><td>Cell</td><td>' + feature.properties['Cell'] + '</td></tr><tr><td>Village</td><td>' + feature.properties['Village'] + '</td></tr><tr><td>Hand pump type</td><td>' + feature.properties['Hand pump type'] + '</td></tr><tr><td>Functionality of water point<br>at the time of a spot check</td><td>' + feature.properties['Functionality of water point at the time of a spot check'] + '</td></tr></table>');
        }
      }).addTo(map);
      overlays.Water['Borehole'] = layer;
    });
    
    setTimeout(function(){
      L.control.groupedLayers(basemap,overlays).addTo(map);
    },3000);
  
  }
};

$(document).ready(function(){
  app.init();
});