import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import store from "state/store";

import 'bootstrap/dist/css/bootstrap.min.css';
import App from "ui/App";
import { initFromLocation } from "state/navigation/actions";

import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("app-root")
);
store.dispatch(initFromLocation(window.location.pathname, window.location.search));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
