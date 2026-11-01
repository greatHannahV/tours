/* eslint-disable */
import 'babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logoutBtn = document.querySelector('.nav__el--logout');
console.log(logoutBtn, 'fff');

if (mapBox) {
  if (mapBox.dataset.mapboxToken) {
    const locations = JSON.parse(mapBox.dataset.locations);

    displayMap(locations, mapBox.dataset.mapboxToken);
  } else {
    mapBox.textContent =
      'Map is unavailable. Configure MAPBOX_ACCESS_TOKEN to enable it.';
  }
}
if (loginForm) {
  document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
} 
