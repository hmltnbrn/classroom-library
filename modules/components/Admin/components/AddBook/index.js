import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';

import * as libraryService from './../../../../services/library-service';

class AddBook extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            author: "",
            genre: "",
            level: "",
            numberIn: "",
            snackOpen: false,
            titleStatus: false,
            authorStatus: false,
            genreStatus: false,
            levelStatus: false,
            numberInStatus: false
        }
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

    handleKeyDown(event) {
        if (event.keyCode == 13)
            this.handleAddBook();
    }

    handleAddBook() {
        this.state.title === "" ? this.setState({titleStatus: "Required field"}) : this.setState({titleStatus: false});
        this.state.author === "" ? this.setState({authorStatus: "Required field"}) : this.setState({authorStatus: false});
        this.state.genre === "" ? this.setState({genreStatus: "Required field"}) : this.setState({genreStatus: false});
        this.state.level === "" ? this.setState({levelStatus: "Required field"}) : this.setState({levelStatus: false});
        
        if(Number.isInteger(parseInt(this.state.numberIn)) === false) {
            this.setState({numberInStatus: "Not a number"});
        }
        else if (parseInt(this.state.numberIn) === 0) {
            this.setState({numberInStatus: "Cannot be zero"});
        }
        else {
            this.setState({numberInStatus: false});
        }

        if (this.state.title !== "" && this.state.author !== "" && this.state.genre !== "" && this.state.level !== "" && this.state.numberIn !== "" && Number.isInteger(parseInt(this.state.numberIn)) === true && parseInt(this.state.numberIn) !== 0) {
            this.addBook();
        }
    }

    addBook() {
        libraryService.addBook({title: this.state.title, author: this.state.author, genre: this.state.genre, level: this.state.level, numberIn: this.state.numberIn})
            .then(data => {
                this.setState({titleStatus: data.status, authorStatus: false, genreStatus: false, levelStatus: false, numberInStatus: false}, this.handleAfterInsert)
            });
    }

    handleAfterInsert() {
        if (this.state.titleStatus == false) {
            this.setState({title: "", author: "", genre: "", level: "", numberIn: "", snackOpen: true}, this.props.findBooks());
        }
    }

    handleClear() {
        this.setState({title: "", author: "", genre: "", level: "", numberIn: "", titleStatus: false, authorStatus: false, genreStatus: false, levelStatus: false, numberInStatus: false});
    }

    closeSnackbar() {
        this.setState({snackOpen: false});
    }
    
    render() {
        
        return (
            <Paper className="admin-paper">
                <div className="title">Create New Book</div>
                <div className="flex flex-column">
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
                        floatingLabelText="Number of Books"
                        type="number"
                        min="0"
                        step="1" 
                        errorText={this.state.numberInStatus}
                        onKeyDown={this.handleKeyDown.bind(this)}
                        value={this.state.numberIn}
                        fullWidth={true}
                        onChange={this.handleNumberInChange.bind(this)}/><br />
                </div>
                <div className="flex">
                    <FlatButton
                        label="Clear"
                        type="submit"
                        primary={true}
                        onTouchTap={this.handleClear.bind(this)}/>
                    <FlatButton
                        label="Add Book"
                        type="submit"
                        primary={true}
                        onTouchTap={this.handleAddBook.bind(this)}/>
                </div>
                <Snackbar
                    open={this.state.snackOpen}
                    message="Book added"
                    action="Close"
                    onActionTouchTap={this.closeSnackbar.bind(this)}
                    autoHideDuration={4000}
                    onRequestClose={this.closeSnackbar.bind(this)}/>
            </Paper>
        );
    }
};

export default AddBook;
