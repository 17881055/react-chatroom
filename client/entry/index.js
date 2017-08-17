import React from 'react';
import ReactDom from 'react-dom';

import App from '../App';
import {
    BrowserRouter as Router,
    StaticRouter, // for server rendering
    Route,
    Link
} from 'react-router-dom';

const container = document.getElementById('container');

ReactDom.render(
    <Router>
        <Route path="/" component={App} />
    </Router>
    , container)

if (module.hot) {
    module.hot.accept();
}