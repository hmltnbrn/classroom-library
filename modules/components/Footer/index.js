import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class Footer extends React.Component {

    render() {

        return (
            <MuiThemeProvider>
                <div className="footer">
                    <div className="horiz-rule"></div>
                    <div>
                        Built by <a href="http://www.brianhamilton.me" target="_blank">Brian Hamilton</a> with <a href="https://nodejs.org/en/" target="_blank">Node.js</a> and <a href="http://facebook.github.io/react/" target="_blank">React</a>
                    </div>
                    <div>
                        View source code on <a href="https://github.com/hmltnbrn/library-check-out" target="_blank">GitHub</a>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
};

export default Footer;
