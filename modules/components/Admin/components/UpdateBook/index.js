import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import AutoComplete from 'material-ui/AutoComplete';
import Checkbox from 'material-ui/Checkbox';

import * as libraryService from './../../../../services/library-service';

class UpdateStudent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            author: "",
            genre: "",
            level: "",
            numberIn: "",
            numberOut: "",
            available: false,
            snackOpen: false,
            titleStatus: false,
            authorStatus: false,
            genreStatus: false,
            levelStatus: false,
            numberInStatus: false,
            numberOutStatus: false,
            bookId: null
        }
    }

    findBookById() {
        libraryService.findBookById({bookId: this.state.bookId})
            .then(data => {
                this.setState({
                    title: data.book[0].title,
                    author: data.book[0].author,
                    genre: data.book[0].genre,
                    level: data.book[0].level,
                    numberIn: data.book[0].number_in,
                    numberOut: data.book[0].number_out,
                    available: data.book[0].available
                });
            });
    }

    handleUpdateInput(value) {
        this.setState({
            bookId: value.id
        });
    }

    handleNewRequest(value) {
        this.setState({
            bookId: value.id
        });
    }

    handleTitleChange(event) {
        this.setState({title: event.target.value});
    }

    handleAuthorChange(event) {
        this.setState({author: event.target.value});
    }

    handleGenreChange(event) {
        this.setState({genre: event.target.value});
    }

    handleLevelChange(event) {
        this.setState({level: event.target.value});
    }

    handleNumberInChange(event) {
        this.setState({numberIn: event.target.value});
    }

    handleNumberOutChange(event) {
        this.setState({numberOut: event.target.value});
    }

    handleCheck(event, checked) {
        this.setState({available: checked});
    }

    handleKeyDown(event) {
        if (event.keyCode == 13)
            this.handleUpdateBook();
    }

    handleUpdateBook() {
        this.state.title === "" ? this.setState({titleStatus: "Required field"}) : this.setState({titleStatus: false});
        this.state.author === "" ? this.setState({authorStatus: "Required field"}) : this.setState({authorStatus: false});
        this.state.genre === "" ? this.setState({genreStatus: "Required field"}) : this.setState({genreStatus: false});
        this.state.level === "" ? this.setState({levelStatus: "Required field"}) : this.setState({levelStatus: false});
        Number.isInteger(parseInt(this.state.numberIn)) === false ? this.setState({numberInStatus: "Not a number"}) : this.setState({numberInStatus: false});
        Number.isInteger(parseInt(this.state.numberOut)) === false ? this.setState({numberOutStatus: "Not a number"}) : this.setState({numberOutStatus: false});

        if (this.state.title !== "" && this.state.author !== "" && this.state.genre !== "" && this.state.level !== "" && this.state.numberIn !== "" && Number.isInteger(parseInt(this.state.numberIn)) === true && Number.isInteger(parseInt(this.state.numberOut)) === true) {
            this.updateBook();
        }
    }

    updateBook() {
        var that = this;
        libraryService.updateBook({title: this.state.title, author: this.state.author, genre: this.state.genre, level: this.state.level, numberIn: this.state.numberIn, numberOut: this.state.numberOut, available: this.state.available, bookId: this.state.bookId})
            .then(function() {that.handleAfterInsert()});
    }

    handleAfterInsert() {
        this.refs["autocomplete"].setState({searchText: ""});
        this.setState({title: "", author: "", genre: "", level: "", numberIn: "", numberOut: "", available: false, bookId: null, snackOpen: true}, this.props.findBooks());
    }

    handleClear() {
        this.refs["autocomplete"].setState({searchText: ""});
        this.setState({title: "", author: "", genre: "", level: "", numberIn: "", numberOut: "", available: false, titleStatus: false, authorStatus: false, genreStatus: false, levelStatus: false, numberInStatus: false, numberOutStatus: false, bookId: null});
    }

    closeSnackbar() {
        this.setState({snackOpen: false});
    }
    
    render() {

        const dataSourceConfig = {
            text: 'title',
            value: 'id'
        };
        
        return (
            <Paper className="admin-paper">
                <div className="title">Update Book</div>
                <div className="flex flex-column update-textfield">
                    <AutoComplete
                        ref={"autocomplete"}
                        floatingLabelText="Search Existing Books"
                        hintText="Enter Title (e.g., 1984)"
                        errorText={this.state.searchError}
                        filter={AutoComplete.caseInsensitiveFilter}
                        dataSource={this.props.books}
                        dataSourceConfig={dataSourceConfig}
                        maxSearchResults={5}
                        fullWidth={true}
                        onNewRequest={this.handleNewRequest.bind(this)}
                        onUpdateInput={this.handleUpdateInput.bind(this)}/><br />
                    <FlatButton
                        label="Get Book Info"
                        type="submit"
                        primary={true}
                        disabled={this.state.bookId == null ? true : false}
                        onTouchTap={this.findBookById.bind(this)}/>
                    <TextField
                        hintText="Enter Title (e.g., 1984)"
                        floatingLabelText="Title"
                        errorText={this.state.titleStatus}
                        onKeyDown={this.handleKeyDown.bind(this)}
                        value={this.state.title}
                        fullWidth={true}
                        onChange={this.handleTitleChange.bind(this)}/>
                    <TextField
                        hintText="Enter Author (e.g., George Orwell)"
                        floatingLabelText="Author"
                        errorText={this.state.authorStatus}
                        onKeyDown={this.handleKeyDown.bind(this)}
                        value={this.state.author}
                        fullWidth={true}
                        onChange={this.handleAuthorChange.bind(this)}/>
                    <TextField
                        hintText="Enter Genre (e.g., Classics)"
                        floatingLabelText="Genre"
                        errorText={this.state.genreStatus}
                        onKeyDown={this.handleKeyDown.bind(this)}
                        value={this.state.genre}
                        fullWidth={true}
                        onChange={this.handleGenreChange.bind(this)}/>
                    <TextField
                        hintText="Enter Reading Level (e.g., Z)"
                        floatingLabelText="Reading Level"
                        errorText={this.state.levelStatus}
                        onKeyDown={this.handleKeyDown.bind(this)}
                        value={this.state.level}
                        fullWidth={true}
                        onChange={this.handleLevelChange.bind(this)}/>
                    <TextField
                        hintText="Enter Number of Books (e.g., 2)"
                        floatingLabelText="Number of Books Checked In"
                        type="number"
                        min="0"
                        step="1"
                        errorText={this.state.numberInStatus}
                        onKeyDown={this.handleKeyDown.bind(this)}
                        value={this.state.numberIn}
                        fullWidth={true}
                        onChange={this.handleNumberInChange.bind(this)}/>
                    <TextField
                        hintText="Enter Number of Books (e.g., 2)"
                        floatingLabelText="Number of Books Checked Out"
                        type="number"
                        min="0"
                        step="1"
                        errorText={this.state.numberOutStatus}
                        onKeyDown={this.handleKeyDown.bind(this)}
                        value={this.state.numberOut}
                        fullWidth={true}
                        onChange={this.handleNumberOutChange.bind(this)}/><br />
                </div>
                <div>
                    <Checkbox
                        label="Available"
                        checked={this.state.available}
                        onCheck={this.handleCheck.bind(this)}/><br />
                </div>
                <div className="flex">
                    <FlatButton
                        label="Clear"
                        type="submit"
                        primary={true}
                        onTouchTap={this.handleClear.bind(this)}/>
                    <FlatButton
                        label="Update Book"
                        type="submit"
                        primary={true}
                        onTouchTap={this.handleUpdateBook.bind(this)}/>
                </div>
                <Snackbar
                    open={this.state.snackOpen}
                    message="Book updated"
                    action="Close"
                    onActionTouchTap={this.closeSnackbar.bind(this)}
                    autoHideDuration={4000}
                    onRequestClose={this.closeSnackbar.bind(this)}/>
            </Paper>
        );
    }
};

export default UpdateStudent;
