import axios from 'axios';

const API_BASE = "https://bibliapp.herokuapp.com/api/";

axios.defaults.baseURL = API_BASE;
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const API =
    {
        AUTHORS: 'authors',
        BOOKS: 'books'
    };

export const ROUTES =
    {
        EMPTY: '/',
        AUTHORS: '/authors',
        BOOKS: '/books'
    };

let _ROUTES_TITLE = {};
_ROUTES_TITLE[ROUTES.AUTHORS] = "Authors";
_ROUTES_TITLE[ROUTES.BOOKS] = "Books";

export const ROUTES_TITLE = _ROUTES_TITLE;