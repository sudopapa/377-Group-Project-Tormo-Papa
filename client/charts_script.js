// API Init
const { default: SpotifyWebApi } = require('spotify-web-api-js');
const Spotify = require('spotify-web-api-js');

const s = new Spotify();
const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken('BQBZp6lSx_VtsJ3lB7P52raLlzwrskbwumBEsGX-BD4lTCejdGPf9IwCJcJY98UMb2dDxSRudd6LrKd7N1gpQLTKIiT2OLVAkW-dqmjQDDilaVuHWhAFX_us25-8CFN1ivNjkECYFKrsg3JMu5D7TI14H_c1swFPr6muBeXH0oI2UjNIltBDewMF-UlY4aqu10WvBr0');

// Function for querying the API
function spotQuery() {
  spotifyApi.searchArtists();
}

//Inject HTML
function injectHTML(list) {
    console.log('fired injectHTML');
    const target = document.querySelector('#album_list');
    target.innerHTML = '';
  
    const listEl = document.createElement('ol');
    target.appendChild(listEl);
  
    list.forEach((item) => {
      const el = document.createElement('li');
      el.innerText = item.name;
      listEl.appendChild(el);
    });

// Main Function
async function mainEvent() {
  const form = document.querySelector('.main_form'); // get your main form so you can do JS with it
  const submit = document.querySelector('#get-spot'); // get a reference to your submit button

  form.addEventListener('input', (event) => {
    console.log('input', event.target.value);
    form.addEventListener('submit', (submitEvent) => {
          submitEvent.preventDefault();
          albumList = spotQuery(event.target.value);
          injectHTML(albumList);
  });
}