import dayjs from 'dayjs';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';

import App from './App';
import reportWebVitals from './reportWebVitals';

import './index.css';

// TODO: Why can't use import?
const minMax = require('dayjs/plugin/minMax');
const weekday = require('dayjs/plugin/weekday');

dayjs.extend(minMax);
dayjs.extend(weekday);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
