import React from 'react';
import ReactDom from 'react-dom';
import App from '../App';
import Login from '../App/Login';
import Regedit from '../App/Regedit';

import {
    BrowserRouter as Router,
    StaticRouter, 
    Route,
    Link,
    Redirect
} from 'react-router-dom';

const container = document.querySelector('#container');

let fakeAuth = { 'isAuthenticated': false };

// 权限路由
const AuthRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        fakeAuth.isAuthenticated ? (
            <Component {...props} />
        ) : (
                <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />
            )
    )} />
)

ReactDom.render(
    <Router>
        <div>
            <AuthRoute exact path="/" component={App} />
            <Route path="/login" component={Login} />
            <Route path="/regedit" component={Regedit} />
        </div>
    </Router>
    , container)

if (module.hot) {
    module.hot.accept();
}