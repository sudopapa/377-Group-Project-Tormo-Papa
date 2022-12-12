/* eslint-disable no-console */
import express from 'express';
import apiRoutes from './routes/apiRoutes.js';
import request from 'request';



const app = express();

const PORT = process.env.PORT || 3030;
const staticFolder = 'client';

// -------------------- Insertion of heatmap script -------------------

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

// ----------------- Insertion of heatmap javascript --------------

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(staticFolder));
app.use('/api', apiRoutes);

async function bootServer() {
  try {
    app.listen(PORT, () => {
      console.log(`Listening on: http//localhost:${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
}

bootServer();
