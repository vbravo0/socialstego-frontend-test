import axios from "axios";
const R = require('ramda');

const FLICKR_API_KEY = process.env.REACT_APP_FLICKR_API_KEY
const FLICK_URL = 'https://api.flickr.com/services/rest'
const FORMAT = 'json'
const NO_JSON_CALLBACK = 1
const BASE = `${FLICK_URL}?api_key=${FLICKR_API_KEY}&format=${FORMAT}&nojsoncallback=${NO_JSON_CALLBACK}`

// Devuelve una URL para llamar a la API de Flickr
// Mas info: https://www.flickr.com/services/api/
// @method: Metodo a llamar (ej. method = 'flickr.people.findByUsername')
// @params: Parametros del metodo (ej. params = { username: 'philip' })
//
// @return: Un string del tipo 'https://api.flickr.com/services/rest?method....'
//          con su api key, formato JSON, metodo y sus parametros
export const flickr_url = (method, params) => {
  const keys = Object.keys(params)
  const method_params = keys.map(key => `&${key}=${params[key]}`).join("")
  const method_call = `&method=${method}${method_params}`
  const URL = `${BASE}${method_call}`
  return URL
};

export const getFlickr = async (method, params) => {
  const url = flickr_url(method, params)
  const res = await axios.get(url);
  return res.data;
};

// params debe contener
// - username
export const peopleFindByUsername = async (params) => {
  return await getFlickr('flickr.people.findByUsername', params)
};

// params debe contener
// - user_id
// - per_page: Cantidad maxima de photos
export const peopleGetPhotos = async (params) => {
  return await getFlickr('flickr.people.getPhotos', params)
};

// params
// - user_id
export const peopleGetInfo = async (params) => {
  return await getFlickr('flickr.people.getInfo', params)
};

// params
// - photo_id
// devuelve los tamaños de una foto
export const photosGetSizes = async (params) => {
  return await getFlickr('flickr.photos.getSizes', params)
};

// params
// - user_id (opcional, si no devuelve los propios favoritos)
export const favoritesGetList = async (params) => {
  return await getFlickr('flickr.favorites.getList', params)
}

export const getUserID = async (username) => {
  const res = await peopleFindByUsername({ username: username });
  return res.user.id
};

export const getUsername = async (userID) => {
  const res = await peopleGetInfo({ user_id: userID });
  return res.person.username._content
};

// Devuelve los photoIDs de un usuario
// @user_id: id de usuario
// @per_page: cantidad de fotos
//
// @return: lista con id de photo y titulo
export const getPhotoIDAndTitle = async (user_id, per_page) => {
  const res = await peopleGetPhotos({ user_id: user_id, per_page: per_page });
  const photos = res.photos.photo.map(photo => { return ({ id: photo.id, title: photo.title }) });
  return photos;
};

export const getSizes = async (photo_id) => {
  const res = await photosGetSizes({ photo_id: photo_id })
  return res.sizes.size
};

// Devuelve una lista de los usuarios a los que le dió
// favorito
export const getFavoriteUsernames = async (userID) => {
  const res = await favoritesGetList({ user_id: userID })
  const ownerIDs = R.uniq(res.photos.photo.map(p => p.owner));
  const usernames = Promise.all(ownerIDs.map(async id => await getUsername(id)))
  return usernames
};

// Devuelve una lista con los user ID de los favoritos
export const getFavoriteUserIDs = async (userID) => {
  const res = await favoritesGetList({ user_id: userID })
  const ownerIDs = R.uniq(res.photos.photo.map(p => p.owner));
  return ownerIDs
};



