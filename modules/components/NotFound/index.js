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
                    <p className="error-404">404: Page Not Found</p>
                </div>
            </MuiThemeProvider>
        );
    }
};

export default NotFound;
