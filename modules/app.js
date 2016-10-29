import React from 'react';

import Header from './components/Header';
import Footer from './components/Footer';

import * as libraryService from './services/library-service';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            signedIn: false,
            adminStatus: false,
            username: "",
            pageTitle: "Library"
        }
    }

    componentDidMount() {
        this.session();
    }

    setPageTitle(title) {
        this.setState({pageTitle: title});
    }

    session() {
        libraryService.isSignedIn()
            .then(data => {
                this.setState({
                    signedIn: data.status,
                    adminStatus: data.admin,
                    username: data.username
                });
            });
    }

    render() {

        return (
            <div className="components flex flex-column">
                <Header signedIn={this.state.signedIn} adminStatus={this.state.adminStatus} pageTitle={this.state.pageTitle} username={this.state.username} session={this.session.bind(this)}/>
                {this.props.children && React.cloneElement(this.props.children, {signedIn: this.state.signedIn, adminStatus: this.state.adminStatus, setPageTitle: this.setPageTitle.bind(this)})}
                <Footer/>
            </div>
        );
    }
};

export default App;
