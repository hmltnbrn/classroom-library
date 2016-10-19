import React from 'react';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import AutoComplete from 'material-ui/AutoComplete';
import Badge from 'material-ui/Badge';
import Avatar from 'material-ui/Avatar';
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
        this.setState({
            checkOutOpen: false,
            studentId: null,
            checkOutStatus: false
        });
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
        if(this.state.checkOutStatus === false) {
            let newIn = this.state.numberIn - 1;
            let newOut = this.state.numberOut + 1;
            this.setState({
                checkOutOpen: false,
                studentId: null,
                numberIn: newIn,
                numberOut: newOut
            });
        }
    }

    handleUpdateInput(value) {
        this.setState({studentId: value.id});
    }

    handleNewRequest(value) {
        this.setState({studentId: value.id});
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
        this.setState({
            checkInOpen: false,
            studentId: null
        });
    }

    handleCheckInSubmit() {
        let newIn = this.state.numberIn + 1;
        let newOut = this.state.numberOut - 1;
        this.checkInHandler([this.props.book.id, this.state.studentId, newIn, newOut]);
        this.setState({
            checkInOpen: false,
            studentId: null,
            numberIn: newIn,
            numberOut: newOut
        });
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
                disabled={this.state.studentId === null ? true : false}
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
                disabled={this.state.studentId === null ? true : false}
                primary={true}
                onTouchTap={this.handleCheckInSubmit.bind(this)}/>,
        ];

        const dataSourceConfig = {
            text: 'name',
            value: 'id'
        };

        let disabledOut = (this.state.numberIn === 0 || this.props.signedIn === false);
        let disabledIn = (this.state.numberOut === 0 || this.props.signedIn === false);

        return (
            <div>
                <Paper className="library-paper">
                    <div className="title">{this.props.book.title}</div>
                    <div className="flex flex-column align-center details">
                        <div className="author">
                            <a href="javascript:void(0)" onClick={this.linkHandler.bind(this)}>{this.props.book.author}</a>
                        </div>
                        <div className="genre">
                            <a href="javascript:void(0)" onClick={this.linkHandler.bind(this)}>{this.props.book.genre}</a>
                        </div>
                        <Avatar>
                            {this.props.book.level}
                        </Avatar>
                    </div>
                    <div className='flex justify-center'>
                        <Badge
                            badgeContent={this.state.numberIn}
                            badgeStyle={{top: 12, right: 12}}
                            style={{marginRight: 10}}
                        >
                            <IconButton tooltip="Available Books" style={{cursor: "default"}}>
                                <Book color="rgb(188, 188, 188)"/>
                            </IconButton>
                        </Badge>
                        <Badge
                            badgeContent={this.state.numberOut}
                            badgeStyle={{top: 12, right: 12}}
                            style={{marginLeft: 10}}
                        >
                            <IconButton tooltip="Checked Out Books" style={{cursor: "default"}}>
                                <CheckCircle color="rgb(188, 188, 188)"/>
                            </IconButton>
                        </Badge>
                    </div>
                    <div className="flex justify-center">
                        <FlatButton
                            label="Check Out"
                            secondary={true}
                            style={{margin: 10}}
                            onTouchTap={this.handleCheckOutOpen.bind(this)}
                            disabled={disabledOut}/>
                        <FlatButton
                            label="Check In"
                            primary={true}
                            style={{margin: 10}}
                            onTouchTap={this.findStudentsByBook.bind(this)}
                            disabled={disabledIn}/>
                    </div>
                </Paper>
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
        );
    }
};

export default BookListItem;
