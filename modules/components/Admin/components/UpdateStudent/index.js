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
            name: "",
            class: "",
            active: false,
            studentId: null,
            snackOpen: false,
            nameStatus: false,
            classStatus: false
        }
    }

    findStudentById() {
        libraryService.findStudentById({studentId: this.state.studentId})
            .then(data => {
                this.setState({
                    name: data.student[0].name,
                    class: data.student[0].class,
                    active: data.student[0].active
                });
            });
    }

    handleUpdateInput(value) {
        this.setState({studentId: value.id});
    }

    handleNewRequest(value) {
        this.setState({studentId: value.id});
    }

    handleNameChange(event) {
        this.setState({name: event.target.value});
    }

    handleClassChange(event) {
        this.setState({class: event.target.value});
    }

    handleCheck(event, checked) {
        this.setState({active: checked});
    }

    handleKeyDown(event) {
        if (event.keyCode === 13)
            this.handleUpdateStudent();
    }

    handleUpdateStudent() {
        this.state.name === "" ? this.setState({nameStatus: "Required field"}) : this.setState({nameStatus: false});
        this.state.class === "" ? this.setState({classStatus: "Required field"}) : this.setState({classStatus: false});

        if (this.state.name !== "" && this.state.class !== "") {
            this.updateStudent();
        }
    }

    updateStudent() {
        libraryService.updateStudent({name: this.state.name, class: this.state.class, active: this.state.active, studentId: this.state.studentId})
            .then(() => {
                this.handleAfterInsert()
            });
    }

    handleAfterInsert() {
        this.refs["autocomplete"].setState({searchText: ""});
        this.setState({
            name: "",
            class: "",
            active: false,
            studentId: null,
            snackOpen: true
        }, this.props.findStudents);
    }

    handleClear() {
        this.refs["autocomplete"].setState({searchText: ""});
        this.setState({
            name: "",
            class: "",
            active: false,
            nameStatus: false,
            classStatus: false,
            studentId: null
        });
    }

    closeSnackbar() {
        this.setState({snackOpen: false});
    }
    
    render() {

        const dataSourceConfig = {
            text: 'name',
            value: 'id'
        };
        
        return (
            <div>
                <Paper className="admin-paper">
                    <div className="title">Update Student</div>
                    <div className="flex flex-column align-center update-textfield">
                        <AutoComplete
                            ref={"autocomplete"}
                            floatingLabelText="Search All Students"
                            hintText="Enter Name (e.g., Brian Hamilton)"
                            filter={AutoComplete.caseInsensitiveFilter}
                            dataSource={this.props.students}
                            dataSourceConfig={dataSourceConfig}
                            maxSearchResults={5}
                            fullWidth={true}
                            onNewRequest={this.handleNewRequest.bind(this)}
                            onUpdateInput={this.handleUpdateInput.bind(this)}/><br />
                        <FlatButton
                            label="Get Student Info"
                            type="submit"
                            primary={true}
                            disabled={this.state.studentId == null ? true : false}
                            onTouchTap={this.findStudentById.bind(this)}/>
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
                    <div>
                        <Checkbox
                            label="Active **"
                            checked={this.state.active}
                            onCheck={this.handleCheck.bind(this)}/><br />
                    </div>
                    <div className="flex justify-center">
                        <FlatButton
                            label="Clear"
                            type="submit"
                            primary={true}
                            onTouchTap={this.handleClear.bind(this)}/>
                        <FlatButton
                            label="Update Student"
                            type="submit"
                            primary={true}
                            onTouchTap={this.handleUpdateStudent.bind(this)}/>
                    </div>
                    <div className="flex justify-start">
                        <p className="required">* required field</p>
                    </div>
                    <div className="flex justify-start">
                        <p className="required">** active students appear on students page and can check books out</p>
                    </div>
                </Paper>
                <Snackbar
                    open={this.state.snackOpen}
                    message="Student updated"
                    action="Close"
                    onActionTouchTap={this.closeSnackbar.bind(this)}
                    autoHideDuration={4000}
                    onRequestClose={this.closeSnackbar.bind(this)}/>
            </div>
        );
    }
};

export default UpdateStudent;
