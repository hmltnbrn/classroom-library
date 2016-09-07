import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Tabs, Tab} from 'material-ui/Tabs';

import * as libraryService from './../../services/library-service';

class Students extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            students: {}
        }
    }

    componentDidMount() {
        this.findStudents();
        this.props.setPageTitle("Students");
    }

    findStudents() {
        let _ = require('underscore');
        libraryService.findAllStudents({active: "only active + total"})
            .then(data => {
                this.setState({
                    students: _.groupBy(data.students, function (d) {return d.class})
                });
            });
    }
    
    render() {

        function mapObject(object, callback) {
            return Object.keys(object).map(function (key) {
                return callback(key, object[key]);
            });
        }

        const tdStyle = {
            overflowX: "auto",
            overflowY: "hidden",
            textOverflow: "initial"
        };

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
                    <TableRowColumn>{student.name}</TableRowColumn>
                    <TableRowColumn>{student.total_out}</TableRowColumn>
                    <TableRowColumn style={student.books_out.length > 0 ? tdStyle : {}}>{student.books_out.join(" || ")}</TableRowColumn>
                </TableRow>
            ));
            return (
                <Tab
                    label={key}
                    key={key}>
                    <div className="paper-container">
                        <Paper className="students-paper">
                            <Table>
                                <TableHeader
                                    displaySelectAll={false}
                                    adjustForCheckbox={false}>
                                    <TableRow>
                                        <TableHeaderColumn>Name</TableHeaderColumn>
                                        <TableHeaderColumn>Number of Books Out</TableHeaderColumn>
                                        <TableHeaderColumn>Books Out</TableHeaderColumn>
                                    </TableRow>
                                </TableHeader>
                                <TableBody
                                    displayRowCheckbox={false}>
                                    {listStudents}
                                </TableBody>
                            </Table>
                        </Paper>
                    </div>
                </Tab>
            );
        });
        
        return (
            <MuiThemeProvider>
                <div className="students">
                    {this.props.signedIn == false ? 
                        <p className="paper-container">Sign in to view this page.</p> :
                        <Tabs
                            className="tab-container"
                            contentContainerClassName="tab-content"
                            tabItemContainerStyle={tabStyle}
                            inkBarStyle={inkStyle}>
                            {studentsByClass}
                        </Tabs>
                    }
                </div>
            </MuiThemeProvider>
        );
    }
};

export default Students;
