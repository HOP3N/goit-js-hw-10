import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

input.addEventListener(
  'input',
  debounce(e => {
    const onTrimValue = input.value.trim();
    cleanHTML();
    if (onTrimValue !== '') {
      fetchCountries(onTrimValue).then(onDataFound => {
        if (onDataFound.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (onDataFound.length === 0) {
          Notiflix.Notify.failure('Oops, there is no country with that name');
        } else if (onDataFound.length >= 2 && onDataFound.length <= 10) {
          renderCountryList(onDataFound);
        } else if (onDataFound.length === 1) {
          renderCountry(onDataFound);
        }
      });
    }
  }, DEBOUNCE_DELAY)
);

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li>
    <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="28" hight="18">
    <p>${country.name.official}</p>
    </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderCountry(countries) {
  const markup = countries
    .map(country => {
      return `<li>
    <img src="${country.flags.svg}" alt="Flag of ${
        country.name.official
      }" width="28" hight="18">
    <p>${country.name.official}</p>
    <p>Capital: ${country.capital}</p>
    <p>Population: ${country.population}</p>
    <p>Language: ${Object.values(country.languages)}</p>
    </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function cleanHTML() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
