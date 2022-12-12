import fetch from 'node-fetch';

// eslint-disable-next-line import/prefer-default-export
export async function loadInternetData(req, res, next) {
  try {
    const url = 'https://data.princegeorgescountymd.gov/resource/vkdv-rvfx.json';
    const data = await fetch(url);
    const json = await data.json();

    const reply = json.filter((item) => Boolean(item.school_name));

    console.log(json.length);
    req.internetData = reply;
    next();
  } catch (err) {
    console.log('Data request failed', err);
    res.json({ message: 'Data request failed', error: err });
  }
}