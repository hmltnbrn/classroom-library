import React from 'react';
import {Link} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Divider from 'material-ui/Divider';

import moment from "moment";

import * as libraryService from './../../../../services/library-service';

class Student extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            student: {},
            current_books: [],
            history_books: []
        }
    }

    componentDidMount() {
        if (this.props.signedIn === true) {
            this.findStudents();
        }
        else {
            this.props.setPageTitle("Student");
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.signedIn === false && nextProps.signedIn === true) {
            this.findStudents();
        }
        else if (this.props.signedIn === true && nextProps.signedIn === false) {
            this.props.setPageTitle("Student");
        }
    }

    findStudents() {
        libraryService.findStudentHistoryById({studentId: this.props.params.studentId})
            .then(data => {
                this.setState({
                    student: data.student[0],
                    current_books: data.out_books,
                    history_books: data.in_books
                }, this.setTitle);
            });
    }

    setTitle() {
        let title = this.state.student !== undefined ? this.state.student.name + " " + this.state.student.class : 'Student';
        this.props.setPageTitle(title);
    }
    
    render() {

        let listCurrentBooks = this.state.current_books.map(book => {
            let date_out = moment(book.date_out).format('dddd, MMMM D, YYYY');
            return (
                <TableRow key={book.id}>
                    <TableRowColumn>{book.title}</TableRowColumn>
                    <TableRowColumn>{book.level}</TableRowColumn>
                    <TableRowColumn>{date_out}</TableRowColumn>
                </TableRow>
            );
        });

        let listHistoryBooks = this.state.history_books.map(book => {
            let date_out = moment(book.date_out).format('dddd, MMMM D, YYYY');
            let date_in = moment(book.date_in).format('dddd, MMMM D, YYYY');
            return (
                <TableRow key={book.id}>
                    <TableRowColumn>{book.title}</TableRowColumn>
                    <TableRowColumn>{book.level}</TableRowColumn>
                    <TableRowColumn>{date_out}</TableRowColumn>
                    <TableRowColumn>{date_in}</TableRowColumn>
                </TableRow>
            );
        });

        if (this.props.signedIn === true) {
            return (
                <MuiThemeProvider>
                    <div className="students flex flex-column align-center">
                        <div className="student-active" style={this.state.student.active === true ? {color:'#2E7D32'} : {color:'#C62828'}}>
                            {this.state.student.active === true ? "Active" : "Inactive"}
                        </div>
                        <Divider style={{width:'70%',marginBottom:18}}/>
                        <Paper className="student-current-paper">
                            <Table
                                style={{tableLayout:'auto'}}
                                bodyStyle={{overflow:'auto'}}
                            >
                                <TableHeader
                                    displaySelectAll={false}
                                    adjustForCheckbox={false}
                                >
                                    <TableRow>
                                        <TableHeaderColumn
                                            colSpan="7"
                                            style={{textAlign:'center',fontSize:18}}
                                        >
                                            Current Books
                                        </TableHeaderColumn>
                                    </TableRow>
                                </TableHeader>
                                <TableBody
                                    displayRowCheckbox={false}
                                >
                                    <TableRow>
                                        <TableHeaderColumn>Book Title</TableHeaderColumn>
                                        <TableHeaderColumn>Level</TableHeaderColumn>
                                        <TableHeaderColumn>Date Checked Out</TableHeaderColumn>
                                    </TableRow>
                                    {listCurrentBooks}
                                </TableBody>
                            </Table>
                        </Paper>
                        <Paper className="student-history-paper">
                            <Table
                                style={{tableLayout:'auto'}}
                                bodyStyle={{overflow:'auto'}}
                            >
                                <TableHeader
                                    displaySelectAll={false}
                                    adjustForCheckbox={false}
                                >
                                    <TableRow>
                                        <TableHeaderColumn
                                            colSpan="7"
                                            style={{textAlign:'center',fontSize:18}}
                                        >
                                            History
                                        </TableHeaderColumn>
                                    </TableRow>
                                </TableHeader>
                                <TableBody
                                    displayRowCheckbox={false}
                                >
                                    <TableRow>
                                        <TableHeaderColumn>Book Title</TableHeaderColumn>
                                        <TableHeaderColumn>Level</TableHeaderColumn>
                                        <TableHeaderColumn>Date Checked Out</TableHeaderColumn>
                                        <TableHeaderColumn>Date Checked In</TableHeaderColumn>
                                    </TableRow>
                                    {listHistoryBooks}
                                </TableBody>
                            </Table>
                        </Paper>
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

export default Student;
