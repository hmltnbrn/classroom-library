import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './app';
import Home from './components/Home';
import CheckedOut from './components/CheckedOut';
import Students from './components/Students';
import Student from './components/Students/components/Student'
import Admin from './components/Admin';
import NotFound from './components/NotFound';

module.exports = (
    <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="/out" component={CheckedOut}/>
        <Route path="/students" component={Students}/>
        <Route path="/students/:studentId" component={Student}/>
        <Route path="/admin" component={Admin}/>
        <Route path="*" component={NotFound}/>
    </Route>
);
