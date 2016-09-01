import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {Router, browserHistory} from 'react-router';

import routes from './modules/routes';

injectTapEventPlugin();

ReactDOM.render(
    <Router routes={routes} history={browserHistory}/>,
    document.getElementById('main')
);
