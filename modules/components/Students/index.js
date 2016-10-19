import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import {Table, TableBody, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
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
        libraryService.findAllStudents({active: "only active + books"})
            .then(data => {
                this.setState({
                    students: _.groupBy(data.students, function (d) {return d.class})
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
                    <TableRowColumn>{student.name}</TableRowColumn>
                    <TableRowColumn>{student.total_out}</TableRowColumn>
                    <TableRowColumn>{student.books_out.join(" || ")}</TableRowColumn>
                </TableRow>
            ));
            return (
                <Tab
                    label={key}
                    key={key}>
                    <div className="flex paper-container">
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
        
        return (
            <MuiThemeProvider>
                <div className="students">
                    {this.props.signedIn === false ? 
                        <p className="flex paper-container">Sign in to view this page.</p> :
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
