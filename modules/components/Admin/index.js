import React from 'react';
import DocumentTitle from 'react-document-title';
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
        if (this.props.adminStatus === true) {
            this.findBooks();
            this.findStudents();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.adminStatus === false && nextProps.adminStatus === true) {
            this.findBooks();
            this.findStudents();
        }
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

        if (this.props.adminStatus === true) {
            return (
                <DocumentTitle title="Library | Admin">
                    <div className="admin">
                        <Tabs
                            className="tab-container"
                            contentContainerClassName="tab-content"
                            tabItemContainerStyle={tabStyle}
                            inkBarStyle={inkStyle}>
                            <Tab label="Users">
                                <div className="flex flex-wrap">
                                    <AddUser/>
                                    <ChangePassword/>
                                </div>
                            </Tab>
                            <Tab label="Books">
                                <div className="flex flex-wrap">
                                    <AddBook findBooks={this.findBooks.bind(this)}/>
                                    <UpdateBook books={this.state.books} findBooks={this.findBooks.bind(this)}/>
                                </div>
                            </Tab>
                            <Tab label="Students">
                                <div className="flex flex-wrap">
                                    <AddStudent findStudents={this.findStudents.bind(this)}/>
                                    <UpdateStudent students={this.state.students} findStudents={this.findStudents.bind(this)}/>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </DocumentTitle>
            );
        }
        else {
            return (
                <DocumentTitle title="Library | Admin">
                    <div className="admin flex flex-column align-center">
                        <p>You do not have access to this page.</p>
                    </div>
                </DocumentTitle>
            );
        }
    }
};

export default Admin;
