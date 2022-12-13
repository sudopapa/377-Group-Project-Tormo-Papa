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

  console.log(reply);

  return reply;
}

// Pull addresses
function getAddresses(array) {
  if (!item.location_1) { return; }
  let addrList = [];
  array.forEach((item) => {
    addrList += item.location_1;
  });
  // eslint-disable-next-line consistent-return
  return addrList;
}

// Get latlong
function getLatLong(list) {
  const geocoder = new google.maps.Geocoder();
  const address = '10791 Forest Edge Cir';
  geocoder.geocode({address: address}, (results, status) => {
    if (status === 'OK') {
      console.log(results);
    } else {
      alert('Geocode error; + status');
    }
  });
}

// Map Creation
function initMap() {
  console.log('initMap');

  const testData = {
    data: {lat: 24.6408, lng: 46.7728, count: 3}
  };

  const baseLayer = L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a>'
    }
  );
  const cfg = {
    radius: 40,
    useLocalExtrema: true,
    valueField: 'price'
  };

  const heatmapLayer = new HeatmapOverlay(cfg);

  const min = 0;
  const max = 10;

  const propertyHeatMap = new L.Map('map', {
    center: new L.LatLng(39.275, -76.613),
    zoom: 15,
    layers: [baseLayer, heatmapLayer]
  });

  heatmapLayer.setData({
    min: min,
    max: max,
    data: testData
  });
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