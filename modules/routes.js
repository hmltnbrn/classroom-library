import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './App';
import Home from './components/Home';
import CheckedOut from './components/CheckedOut';
import Students from './components/Students';
import Admin from './components/Admin';
import NotFound from './components/NotFound';

module.exports = (
    <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="/out" component={CheckedOut}/>
        <Route path="/students" component={Students}/>
        <Route path="/admin" component={Admin}/>
        <Route path="*" component={NotFound}/>
    </Route>
);
