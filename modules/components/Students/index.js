import React from 'react';
import {Link} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import {Table, TableBody, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Tabs, Tab} from 'material-ui/Tabs';

import * as libraryService from './../../services/library-service';

class Students extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            students: {},
            inactive_students: []
        }
    }

    componentDidMount() {
        this.props.setPageTitle("Students");
        if (this.props.signedIn === true) this.findStudents();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.signedIn === true && this.props.signedIn === false) this.findStudents();
    }

    findStudents() {
        let _ = require('underscore');
        libraryService.findAllStudents({active: "all + books"})
            .then(data => {
                this.setState({
                    students: _.groupBy(data.students, function (d) {return d.class}),
                    inactive_students: data.inactive_students
                });
            });
    }
    
    render() {

        let mapObject = (object, callback) => {
            return Object.keys(object).map(function (key) {
                return callback(key, object[key]);
            });
        }

        const tabStyle = {
            position: 'fixed',
            zIndex: 9
        };

        const inkStyle = {
            position: 'fixed',
            zIndex: 9,
            top: 112
        };

        let studentsByClass = mapObject(this.state.students, function (key, value) {
            let listStudents = value.map(student => (
                <TableRow key={student.id}>
                    <TableRowColumn><Link to={"/students/" + student.id} activeClassName="active">{student.name}</Link></TableRowColumn>
                    <TableRowColumn>{student.total_out}</TableRowColumn>
                    <TableRowColumn>{student.books_out.join(" || ")}</TableRowColumn>
                </TableRow>
            ));
            return (
                <Tab
                    label={key}
                    key={key}>
                    <div className="flex flex-column align-center">
                        <Paper className="students-paper">
                            <Table
                                style={{tableLayout:'auto'}}
                                bodyStyle={{overflow:'auto'}}>
                                <TableBody
                                    displayRowCheckbox={false}>
                                    <TableRow>
                                        <TableHeaderColumn>Name</TableHeaderColumn>
                                        <TableHeaderColumn>Number of Books Out</TableHeaderColumn>
                                        <TableHeaderColumn>Books Out</TableHeaderColumn>
                                    </TableRow>
                                    {listStudents}
                                </TableBody>
                            </Table>
                        </Paper>
                    </div>
                </Tab>
            );
        });

        let inactiveStudents = this.state.inactive_students.map(student => {
            return (
                <TableRow key={student.id}>
                    <TableRowColumn><Link to={"/students/" + student.id} activeClassName="active">{student.name}</Link></TableRowColumn>
                    <TableRowColumn>{student.total_out}</TableRowColumn>
                    <TableRowColumn>{student.books_out.join(" || ")}</TableRowColumn>
                </TableRow>
            );
        });

        if (this.props.signedIn === true) {
            return (
                <MuiThemeProvider>
                    <div className="students">
                        <Tabs
                            className="tab-container"
                            contentContainerClassName="tab-content"
                            tabItemContainerStyle={tabStyle}
                            inkBarStyle={inkStyle}>
                            {studentsByClass}
                            <Tab
                                label="Inactive">
                                <div className="flex flex-column align-center">
                                    <Paper className="students-paper">
                                        <Table
                                            style={{tableLayout:'auto'}}
                                            bodyStyle={{overflow:'auto'}}>
                                            <TableBody
                                                displayRowCheckbox={false}>
                                                <TableRow>
                                                    <TableHeaderColumn>Name</TableHeaderColumn>
                                                    <TableHeaderColumn>Number of Books Out</TableHeaderColumn>
                                                    <TableHeaderColumn>Books Out</TableHeaderColumn>
                                                </TableRow>
                                                {inactiveStudents}
                                            </TableBody>
                                        </Table>
                                    </Paper>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </MuiThemeProvider>
            );
        }
        else {
            return (
                <div className="students flex flex-column align-center">
                    <p>Sign in to view this page.</p>
                </div>
            );
        }
    }
};

export default Students;
