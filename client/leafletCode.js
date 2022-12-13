// Imports
// import { tileLayer, Map, LatLng } from 'leaflet';
// import HeatmapOverlay from 'leaflet-heatmap';

// Leaflet Map w/Heatmap Code
function initMap() {
  const testData = {
    max: 8,
    data: [{lat: 24.6408, lng: 46.7728, count: 3}, {lat: 50.75, lng: -1.55, count: 1}]
  };

  const baseLayer = tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '...',
      maxZoom: 18
    }
  );

  const cfg = {
    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
    // if scaleRadius is false it will be the constant radius used in pixels
    radius: 2,
    maxOpacity: 0.8,
    // scales the radius based on map zoom
    scaleRadius: true,
    // if set to false the heatmap uses the global maximum for colorization
    // if activated: uses the data maximum within the current map boundaries
    //   (there will always be a red spot with useLocalExtremas true)
    useLocalExtrema: true,
    // which field name in your data represents the latitude - default "lat"
    latField: 'lat',
    // which field name in your data represents the longitude - default "lng"
    lngField: 'lng',
    // which field name in your data represents the data value - default "value"
    valueField: 'count'
  };
  //
  const heatmapLayer = HeatmapOverlay(cfg);

  const map = new Map('map-canvas', {
    center: new LatLng(25.6586, -80.3568),
    zoom: 4,
    layers: [baseLayer, heatmapLayer]
  });

  heatmapLayer.setData(testData);
}


/*
// Initial Leaflet Map
const map = L.map('map').setView([38.9897, -76.9378], 11);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
 */

  // const pageMap = initMap();