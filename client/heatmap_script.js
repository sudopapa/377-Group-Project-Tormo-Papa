import request from 'request';

const accessToken = 'BQACX0bVaTJ99cc7DJwDua1RqDnpj-VXOPacGoI51GypyRWNwCS2wJdlkd--TIFoVXpSNCppN1D_Xv4RvJhu8d9gHzwVOVyuzgdpzaAw96yjWAOTtXtvnQDcj8TrHXq3aIKxbgPSbIdnJJDz74jcb0lNbQztUxoemvnvdyZ0DtwyzO8QAuNXlNiMgfUNaFFm7XU';
  
const countries = [];

// Set the headers
const headers = {
  'Authorization': 'Bearer ' + accessToken
}

// Configure the request
const options = {
  url: 'https://api.spotify.com/v1/browse/categories',
  method: 'GET',
  headers: headers
}

// Start the request
request(options, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    // Parse the response body
    const data = JSON.parse(body);

    // Loop through the genres and add each country to the array
    data.categories.items.forEach(genre => {
      countries.push(genre.country);
    });

    // Print the array of countries
    console.log(countries);
  }
});



// Initial Leaflet Map
const map = L.map('map').setView([38.9897, -76.9378], 11);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// Add a marker for each country in the countries array
countries.forEach(country => {
  L.marker([country.latitude, country.longitude]).addTo(map);
});

// Leaflet Map w/Heatmap Code
/*
var testData = {
    max: 8,
    data: [{lat: 24.6408, lng:46.7728, count: 3},{lat: 50.75, lng:-1.55, count: 1}, ...]
  };

  var baseLayer = L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      attribution: '...',
      maxZoom: 18
    }
  );

  var cfg = {
    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
    // if scaleRadius is false it will be the constant radius used in pixels
    "radius": 2,
    "maxOpacity": .8,
    // scales the radius based on map zoom
    "scaleRadius": true,
    // if set to false the heatmap uses the global maximum for colorization
    // if activated: uses the data maximum within the current map boundaries
    //   (there will always be a red spot with useLocalExtremas true)
    "useLocalExtrema": true,
    // which field name in your data represents the latitude - default "lat"
    latField: 'lat',
    // which field name in your data represents the longitude - default "lng"
    lngField: 'lng',
    // which field name in your data represents the data value - default "value"
    valueField: 'count'
  };

  var heatmapLayer = new HeatmapOverlay(cfg);

  var map = new L.Map('map-canvas', {
    center: new L.LatLng(25.6586, -80.3568),
    zoom: 4,
    layers: [baseLayer, heatmapLayer]
  });

  heatmapLayer.setData(testData);

*/