// API Module
const APIController = (function() {
  // API Methods
  const _getToken = async () => {
    const accessToken = 'BQACX0bVaTJ99cc7DJwDua1RqDnpj-VXOPacGoI51GypyRWNwCS2wJdlkd--TIFoVXpSNCppN1D_Xv4RvJhu8d9gHzwVOVyuzgdpzaAw96yjWAOTtXtvnQDcj8TrHXq3aIKxbgPSbIdnJJDz74jcb0lNbQztUxoemvnvdyZ0DtwyzO8QAuNXlNiMgfUNaFFm7XU';
    return accessToken;
  };

  const _getGenres = async (token) => {
    const limit = 10;

    const result = await fetch('https://api.spotify.com/v1/browse/categories', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}`}
    });

    const data = await result.json();
    return data.categories.items;
  };

  return {
    getToken() {
      return _getToken();
    },

    getGenres(token) {
      return _getGenres(token);
    }
  };
}());

// Leaflet Map w/Heatmap Code

const testData = {
  max: 8,
  data: [{lat: 24.6408, lng: 46.7728, count: 3}, {lat: 50.75, lng: -1.55, count: 1}]
};

const baseLayer = L.tileLayer(
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

const heatmapLayer = new HeatmapOverlay(cfg);

const map = new L.Map('map-canvas', {
  center: new L.LatLng(25.6586, -80.3568),
  zoom: 4,
  layers: [baseLayer, heatmapLayer]
});

heatmapLayer.setData(testData);

/*
// Initial Leaflet Map
const map = L.map('map').setView([38.9897, -76.9378], 11);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
 */