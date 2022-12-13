// Imports
import { tileLayer, Map, LatLng } from 'leaflet';
import HeatmapOverlay from 'heatmap.js/plugins/leaflet-heatmap';

// Filters out items that don't include the input
function filterData(array, input) {
  return array.filter((item) => {
    if (!item.school_name) { return; }
    const lowerCase = item.school_name.toLowerCase();
    const lowerCaseQuery = input.toLowerCase();
    // eslint-disable-next-line consistent-return
    return lowerCase.includes(lowerCaseQuery);
  });
}

// Inject HTML
function injectHTML(list) {
  const target = document.querySelector('#loc_list');
  target.innerHTML = '';

  const listEl = document.createElement('ol');
  target.appendChild(listEl);
  list.forEach((item) => {
    const el = document.createElement('li');
    el.innerText = item.school_name;
    listEl.appendChild(el);
  });
}

// API Request Function
async function getData() {
  const url = 'https://data.princegeorgescountymd.gov/resource/vkdv-rvfx.json';
  const data = await fetch(url);
  const json = await data.json();
  const reply = json.filter((item) => Boolean(item.school_name));

  console.log(reply)

  return reply;
}

// Process 

// Map Creation
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

// Main Function
async function mainEvent() {
  const form = document.querySelector('.main_form');
  const submit = document.querySelector('#get-loc');

  const resultsArray = await getData();

  initMap();

  if (resultsArray.length > 0) {
    // const currentList = resultsArray;

    form.addEventListener('input', (event) => {
      console.log('input', event.target.value);
      const filteredLocs = filterData(resultsArray, event.target.value);
      injectHTML(filteredLocs);
    });

    form.addEventListener('submit', (submitEvent) => {
      submitEvent.preventDefault();
      injectHTML(resultsArray);
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => mainEvent());