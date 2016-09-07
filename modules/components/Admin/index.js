import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Tabs, Tab} from 'material-ui/Tabs';

import AddUser from './components/AddUser';
import ChangePassword from './components/ChangePassword';
import AddBook from './components/AddBook';
import UpdateBook from './components/UpdateBook';
import AddStudent from './components/AddStudent';
import UpdateStudent from './components/UpdateStudent';

import * as libraryService from './../../services/library-service';

class Admin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            books: [],
            students: []
        }
    }

    componentDidMount() {
        this.props.setPageTitle("Admin");
        this.findStudents();
        this.findBooks();
    }

    findBooks() {
        libraryService.findAllBookTitles()
            .then(data => {
                this.setState({
                    books: data.books
                });
            });
    }

    findStudents() {
        libraryService.findAllStudents({active: "all"})
            .then(data => {
                this.setState({
                    students: data.students
                });
            });
    }
    
    render() {

        const tabStyle = {
            position: 'fixed',
            zIndex: 9
        };

        const inkStyle = {
            position: 'fixed',
            zIndex: 9,
            top: 112
        };
        
        return (
            <MuiThemeProvider>
                <div className="admin">
                    {this.props.adminStatus == false ? 
                        <p className="paper-container">You do not have access to this page.</p> :
                        <Tabs
                            className="tab-container"
                            contentContainerClassName="tab-content"
                            tabItemContainerStyle={tabStyle}
                            inkBarStyle={inkStyle}>
                            <Tab label="Users">
                                <div className="paper-container">
                                    <div>
                                        <AddUser/>
                                    </div>
                                    <div>
                                        <ChangePassword/>
                                    </div>
                                </div>
                            </Tab>
                            <Tab label="Books">
                                <div className="paper-container">
                                    <div>
                                        <AddBook findBooks={this.findBooks.bind(this)}/>
                                    </div>
                                    <div>
                                        <UpdateBook books={this.state.books} findBooks={this.findBooks.bind(this)}/>
                                    </div>
                                </div>
                            </Tab>
                            <Tab label="Students">
                                <div className="paper-container">
                                    <div>
                                        <AddStudent findStudents={this.findStudents.bind(this)}/>
                                    </div>
                                    <div>
                                        <UpdateStudent students={this.state.students} findStudents={this.findStudents.bind(this)}/>
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    }
                </div>
            </MuiThemeProvider>
        );
    }
};

export default Admin;
