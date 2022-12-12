

function filterData(array, input) {
  return array.filter((item) => {
    if (!item.school_name) { return; }
    const lowerCase = item.school_name.toLowerCase();
    const lowerCaseQuery = input.toLowerCase();
    // eslint-disable-next-line consistent-return
    return lowerCase.includes(lowerCaseQuery);
  });
}

function injectHTML() {
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

async function getData() {
  const url = 'https://data.princegeorgescountymd.gov/resource/vkdv-rvfx.json';
  const data = await fetch(url);
  const json = await data.json();
  const reply = json.filter((item) => Boolean(item.school_name));

  console.log(reply)

  return reply;
}

// Main Function
async function mainEvent() {
  const form = document.querySelector('.main_form');
  const submit = document.querySelector('#get-loc');

  const resultsArray = await getData();

  console.log(results);

  if (resultsArray.length > 0) {
    const currentList = [];

    form.addEventListener('input', (event) => {
      console.log('input', event.target.value);
      const filteredLocs = filterData(currentList, event.target.value);
      injectHTML(filteredLocs);
    });

    form.addEventListener('submit', (submitEvent) => {
      submitEvent.preventDefault();
      injectHTML(filteredLocs);
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => mainEvent());