import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountry } from './js/fetchApi';
const DEBOUNCE_DELAY = 300;

const inputRef = document.querySelector('#search-box');
const listCountry = document.querySelector('.country-list');
const infoCountry = document.querySelector('.country-info');

function onUserInput() {
  let userQuery = inputRef.value.trim();
  if (userQuery.length === 0) {
    Notiflix.Notify.failure('Please enter name of country!!!');
    return;
  }
  fetchCountry(userQuery)
    .then(country => {
      clearMarkUp();
      if (country.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (country.length === 1) {
        renderInfoCountry(country);
      } else if (country.length >= 2 && country.length <= 10) {
        renderListCountry(country);
      }
    })
    .catch(renderErrorInfo);
}
function clearMarkUp() {
  listCountry.innerHTML = '';
  infoCountry.innerHTML = '';
}
function renderInfoCountry([{ name, capital, population, flags, languages }]) {
  const markUpInfoCountry = `<img src='${flags.svg}' alt='flag of ${
    name.official
  }' width='100'/>
  <span class="country_title">${name.official}</span> 
  <p class="country_text">Capital: <span class="country_info">${capital}</span></p>
  <p class="country_text">Population: <span class="country_info">${population}</span></p>
  <p class="country_text">Languages: <span class="country_info">${Object.values(
    languages
  ).join(', ')}</span></p>`;
  infoCountry.innerHTML = markUpInfoCountry;
}

function renderListCountry(country) {
  const markUpListCountry = country
    .map(({ name, flags }) => {
      return `<li><img src='${flags.svg}' alt='flag of ${name.official}' width='100'/><span class="country_text"> ${name.common}</span></li>`;
    })
    .join('');
  listCountry.innerHTML = markUpListCountry;
}

function renderErrorInfo(error) {
  console.log(error.message);
  Notiflix.Notify.failure('Oops, there is no country with that name');
  clearMarkUp();
}
inputRef.addEventListener('input', debounce(onUserInput, DEBOUNCE_DELAY));
