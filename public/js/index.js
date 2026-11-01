/* eslint-disable */
import 'babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logoutBtn = document.querySelector('.nav__el--logout');
console.log(logoutBtn, 'fff');

if (mapBox && mapBox.dataset.mapboxToken) {
  const locations = JSON.parse(mapBox.dataset.locations);

  displayMap(locations, mapBox.dataset.mapboxToken);
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
