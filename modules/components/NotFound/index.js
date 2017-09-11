import React from 'react';
import DocumentTitle from 'react-document-title';

class NotFound extends React.Component {

    componentDidMount() {
        this.props.setPageTitle("Not Found");
    }
    
    render() {
        
        return (
            <DocumentTitle title="Library | Not Found">
                <div className="not-found">
                    <p className="error-404 mono">404: Page Not Found</p>
                    <img src="images/squidward_frown.png" className="error-404-img" alt="Awwwww"/>
                </div>
            </DocumentTitle>
        );
    }
};

export default NotFound;
