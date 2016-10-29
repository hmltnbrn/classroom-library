import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class NotFound extends React.Component {

    componentDidMount() {
        this.props.setPageTitle("Not Found");
    }
    
    render() {
        
        return (
            <MuiThemeProvider>
                <div className="not-found">
                    <p className="error-404 mono">404: Page Not Found</p>
                    <img src="images/squidward_frown.png" className="error-404-img" alt="Awwwww"/>
                </div>
            </MuiThemeProvider>
        );
    }
};

export default NotFound;
