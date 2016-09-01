import React from 'react';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Book from 'material-ui/svg-icons/action/book';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';

import * as libraryService from './../../../../../services/library-service';

class BookListItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checkOutOpen: false,
            checkInOpen: false,
            numberIn: this.props.book.number_in,
            numberOut: this.props.book.number_out,
            studentId: null,
            studentsByBook: [],
            checkOutStatus: ""
        }
    }

    linkHandler(e) {
        this.props.onSearchKeyChange(e.target.innerHTML);
        return false;
    }

    handleCheckOutOpen() {
        this.setState({checkOutOpen: true});
    }

    handleCheckOutClose() {
        this.setState({checkOutOpen: false, studentId: null, checkOutStatus: false});
    }

    handleCheckOutSubmit() {
        let newIn = this.state.numberIn - 1;
        let newOut = this.state.numberOut + 1;
        this.checkOutHandler([this.props.book.id, this.state.studentId, newIn, newOut]);
    }

    checkOutHandler(values) {
        libraryService.checkOutBook({bookId: values[0], studentId: values[1], numberIn: values[2], numberOut: values[3]})
            .then(data => {
                this.setState({
                    checkOutStatus: data.status
                }, this.handleAfterCheckOut);
            });;
    }

    handleAfterCheckOut() {
        if(this.state.checkOutStatus == false) {
            let newIn = this.state.numberIn - 1;
            let newOut = this.state.numberOut + 1;
            this.setState({checkOutOpen: false, studentId: null, numberIn: newIn, numberOut: newOut});
        }
    }

    handleUpdateInput(value) {
        this.setState({
            studentId: value.id
        });
    }

    handleNewRequest(value) {
        this.setState({
            studentId: value.id
        });
    }

    findStudentsByBook() {
        libraryService.findStudentsByBook({bookId: this.props.book.id})
            .then(data => {
                this.setState({
                    studentsByBook: data.studentsByBook
                }, this.handleCheckInOpen);
            });
    }

    handleCheckInOpen() {
        this.setState({checkInOpen: true});
    }

    handleCheckInClose() {
        this.setState({checkInOpen: false, studentId: null});
    }

    handleCheckInSubmit() {
        let newIn = this.state.numberIn + 1;
        let newOut = this.state.numberOut - 1;
        this.checkInHandler([this.props.book.id, this.state.studentId, newIn, newOut]);
        this.setState({checkInOpen: false, studentId: null, numberIn: newIn, numberOut: newOut});
    }

    checkInHandler(values) {
        libraryService.checkInBook({bookId: values[0], studentId: values[1], numberIn: values[2], numberOut: values[3]});
    }

    render() {

        const checkOutModalActions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleCheckOutClose.bind(this)}/>,
            <FlatButton
                label="Submit"
                disabled={this.state.studentId == null ? true : false}
                primary={true}
                onTouchTap={this.handleCheckOutSubmit.bind(this)}/>,
        ];

        const checkInModalActions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleCheckInClose.bind(this)}/>,
            <FlatButton
                label="Submit"
                disabled={this.state.studentId == null ? true : false}
                primary={true}
                onTouchTap={this.handleCheckInSubmit.bind(this)}/>,
        ];

        const authorStyle = {
            fontSize: 15,
            padding: 2,
            textAlign: 'center'
        };

        const genreStyle = {
            fontSize: 13,
            padding: 2,
            textAlign: 'center'
        };

        const totalStyle = {
            fontSize: 14
        };

        const avatarStyle = {
            marginTop: 5,
            marginBottom: 5,
            marginLeft: 0,
            marginRight: 0
        };

        const buttonStyle = {
            margin: 10
        };

        const dataSourceConfig = {
            text: 'name',
            value: 'id'
        };

        let disabledOut = false;
        let disabledIn = false;

        if(this.state.numberIn == 0 || this.props.signedIn == false) 
            disabledOut = true;

        if(this.state.numberOut == 0 || this.props.signedIn == false) 
            disabledIn = true;

        return (
            <Paper className="library-paper">
                <div className="title">{this.props.book.title}</div>
                <div>
                    <List>
                        <ListItem
                            disabled={true}
                            style={authorStyle}
                        >
                            <a href="javascript:void(0)" onClick={this.linkHandler.bind(this)}>{this.props.book.author}</a>
                        </ListItem>
                        <ListItem
                            disabled={true}
                            style={genreStyle}
                        >
                            <a href="javascript:void(0)" onClick={this.linkHandler.bind(this)}>{this.props.book.genre}</a>
                        </ListItem>
                        <ListItem
                            disabled={true}
                            style={genreStyle}>
                            <Avatar>
                                {this.props.book.level}
                            </Avatar>
                        </ListItem>
                    </List>
                    <List className='flex'>
                        <ListItem
                            disabled={true}
                            style={totalStyle}
                            leftAvatar={
                                <Avatar
                                    icon={<Book/>}
                                    size={30}
                                    style={avatarStyle} />
                            }
                        >
                            <div>{this.state.numberIn}</div>
                        </ListItem>
                        <ListItem
                            disabled={true}
                            style={totalStyle}
                            leftAvatar={
                                <Avatar
                                    icon={<CheckCircle/>}
                                    size={30}
                                    style={avatarStyle} />
                            }
                        >
                            <div>{this.state.numberOut}</div>
                        </ListItem>
                    </List>
                </div>
                <div className="flex">
                    <FlatButton
                        label="Check Out"
                        secondary={true}
                        style={buttonStyle}
                        onTouchTap={this.handleCheckOutOpen.bind(this)}
                        disabled={disabledOut}/>
                    <Dialog
                        title={this.props.book.title}
                        actions={checkOutModalActions}
                        modal={true}
                        open={this.state.checkOutOpen}>
                        <p>Choose a name and click submit to check book out.</p>
                        <AutoComplete autoFocus
                            floatingLabelText="Search Students"
                            hintText="Enter Name (e.g., Henry Tudor)"
                            filter={AutoComplete.caseInsensitiveFilter}
                            errorText={this.state.checkOutStatus}
                            dataSource={this.props.students}
                            dataSourceConfig={dataSourceConfig}
                            maxSearchResults={5}
                            onNewRequest={this.handleNewRequest.bind(this)}
                            onUpdateInput={this.handleUpdateInput.bind(this)}/>
                    </Dialog>
                    <FlatButton
                        label="Check In"
                        primary={true}
                        style={buttonStyle}
                        onTouchTap={this.findStudentsByBook.bind(this)}
                        disabled={disabledIn}/>
                    <Dialog
                        title={this.props.book.title}
                        actions={checkInModalActions}
                        modal={true}
                        open={this.state.checkInOpen}>
                        <p>Choose a name and click submit to check book in.</p>
                        <AutoComplete
                            floatingLabelText="Students With Book"
                            hintText="Choose Name (e.g., Henry Tudor)"
                            filter={AutoComplete.caseInsensitiveFilter}
                            openOnFocus={true}
                            dataSource={this.state.studentsByBook}
                            dataSourceConfig={dataSourceConfig}
                            onNewRequest={this.handleNewRequest.bind(this)}
                            onUpdateInput={this.handleUpdateInput.bind(this)}/>
                    </Dialog>
                </div>
            </Paper>
        );
    }
};

export default BookListItem;
