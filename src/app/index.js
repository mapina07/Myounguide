import React, { Component } from 'react';
import { render } from 'react-dom';
import App from './App';
import reducer from '../store/reducers/auth';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

const composeEnhances=window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store=createStore(reducer,composeEnhances(
    applyMiddleware(thunk)
));

const app=(
    <Provider store={store}>
        <App/>
    </Provider>
)

render(app,document.getElementById('app'));