import React from 'react';
import Paper from 'material-ui/Paper';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';

import * as libraryService from './../../../services/library-service';

class CheckedOutBook extends React.Component {

    render() {

        let listStudents = this.props.book.students.map(student =>
            <ListItem key={student} disabled={true} leftIcon={<AccountCircle />}>{student}</ListItem>
        );

        return (
            <div>
                <Paper className="library-paper">
                    <div className="title">{this.props.book.title}</div>
                    <List>
                        {this.props.signedIn === true ? listStudents : ""}
                    </List>
                </Paper>
            </div>
        );
    }
};

export default CheckedOutBook;
