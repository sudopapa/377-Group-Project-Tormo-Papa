

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
  })
}

// Main Function
async function mainEvent() {
  const form = document.querySelector('.main_form');
  const submit = document.querySelector('#get-loc');

  const results = await fetch('/api/internetPG');
  const resultsArray = await results.json();

  if (resultsArray.data?.length > 0) {
    const currentList = [];

    form.addEventListener('input', (event) => {
      console.log('input', event.target.value);
      const filteredLocs = filterData(currentList, event.target.value);
      injectHTML(filteredLocs);
    });

    form.addEventListener('submit', (submitEvent) => {
      submitEvent.preventDefault();
      injectHTML(currentList);
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => mainEvent());