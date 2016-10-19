import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';

import * as libraryService from './../../../../services/library-service';

class AddStudent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            class: "",
            snackOpen: false,
            nameStatus: false,
            classStatus: false
        }
    }

    handleNameChange(event) {
        this.setState({name: event.target.value});
    }

    handleClassChange(event) {
        this.setState({class: event.target.value});
    }

    handleKeyDown(event) {
        if (event.keyCode === 13)
            this.handleAddStudent();
    }

    handleAddStudent() {
        this.state.name === "" ? this.setState({nameStatus: "Required field"}) : this.setState({nameStatus: false});
        this.state.class === "" ? this.setState({classStatus: "Required field"}) : this.setState({classStatus: false});

        if (this.state.name !== "" && this.state.class !== "") {
            this.addStudent();
        }
    }

    addStudent() {
        libraryService.addStudent({name: this.state.name, class: this.state.class})
            .then(data => {
                this.setState({
                    nameStatus: data.status,
                    classStatus: false
                }, this.handleAfterInsert)
            });
    }

    handleAfterInsert() {
        if (this.state.nameStatus === false) {
            this.setState({
                name: "",
                class: "",
                snackOpen: true
            }, this.props.findStudents);
        }
    }

    handleClear() {
        this.setState({
            name: "",
            class: "",
            nameStatus: false,
            classStatus: false
        });
    }

    closeSnackbar() {
        this.setState({snackOpen: false});
    }
    
    render() {
        
        return (
            <div>
                <Paper className="admin-paper">
                    <div className="title">Create New Student</div>
                    <div className="flex flex-column align-center">
                        <TextField
                            hintText="Enter Name (e.g., Brian Hamilton)"
                            floatingLabelText="Name *"
                            errorText={this.state.nameStatus}
                            onKeyDown={this.handleKeyDown.bind(this)}
                            value={this.state.name}
                            fullWidth={true}
                            onChange={this.handleNameChange.bind(this)}/>
                        <TextField
                            hintText="Enter Class (e.g., 601)"
                            floatingLabelText="Class *"
                            errorText={this.state.classStatus}
                            onKeyDown={this.handleKeyDown.bind(this)}
                            value={this.state.class}
                            fullWidth={true}
                            onChange={this.handleClassChange.bind(this)}/><br />
                    </div>
                    <div className="flex justify-center">
                        <FlatButton
                            label="Clear"
                            type="submit"
                            primary={true}
                            onTouchTap={this.handleClear.bind(this)}/>
                        <FlatButton
                            label="Add Student"
                            type="submit"
                            primary={true}
                            onTouchTap={this.handleAddStudent.bind(this)}/>
                    </div>
                    <div className="flex justify-start">
                        <p className="required">* required field</p>
                    </div>
                </Paper>
                <Snackbar
                    open={this.state.snackOpen}
                    message="Student added"
                    action="Close"
                    onActionTouchTap={this.closeSnackbar.bind(this)}
                    autoHideDuration={4000}
                    onRequestClose={this.closeSnackbar.bind(this)}/>
            </div>
        );
    }
};

export default AddStudent;
