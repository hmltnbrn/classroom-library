import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

import * as libraryService from './../../../../services/library-service';

class AddUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: "",
            pass: "",
            passConf: "",
            addUserOpen: false,
            snackOpen: false,
            userStatus: false,
            passStatus: false,
            admin: "false"
        }
    }

    handleUserChange(event) {
        this.setState({user: event.target.value});
    }

    handlePassChange(event) {
        this.setState({pass: event.target.value});
    }

    handleConfirmPassChange(event) {
        this.setState({passConf: event.target.value});
    }

    handleAdminCheck(event) {
        this.setState({admin: event.target.value});
    }

    handleKeyDown(event) {
        if (event.keyCode == 13)
            this.openDialog();
    }

    openDialog() {

        this.state.user === "" ? this.setState({userStatus: "Required field"}) : this.setState({userStatus: false});

        if (this.state.pass === "" && this.state.passConf === "") {
            this.setState({passStatus: "Required field"});
        }
        else if (this.state.pass !== this.state.passConf) {
            this.setState({passStatus: "Passwords do not match"})
        }
        else {
            this.setState({passStatus: false});
        }

        if (this.state.user !== "" && this.state.pass !== "" && this.state.passConf !== "" && this.state.pass === this.state.passConf) {
            this.setState({addUserOpen: true, userStatus: false, passStatus: false});
        }
        
    }

    handleRegister() {
        if (this.state.userStatus == false) {
            this.setState({user: "", pass: "", passConf: "", admin: "false", userStatus: false, passStatus: false, snackOpen: true}, this.closeDialog);
        }
        else {
            this.closeDialog();
        }
    }

    closeDialog() {
        this.setState({addUserOpen: false});
    }

    addUser() {
        libraryService.register({username: this.state.user, password: this.state.pass, admin: this.state.admin})
            .then(data => {
                this.setState({userStatus: data.status, passStatus: false}, this.handleRegister)
            });
    }
    
    handleClear() {
        this.setState({user: "", pass: "", passConf: "", admin: "false", userStatus: false, passStatus: false});
    }

    closeSnackbar() {
        this.setState({snackOpen: false});
    }
    
    render() {

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.closeDialog.bind(this)}/>,
            <FlatButton
                label="Yes"
                primary={true}
                onTouchTap={this.addUser.bind(this)}/>,
        ];

        const dialogStyle = {
            textAlign: "center"
        };

        const contentStyle = {
            display: 'inline-block',
            width: 'auto',
            maxWidth: 'none',
            minWidth: 400,
            minHeight: 400
        };
        
        return (
            <Paper className="admin-paper">
                <div className="title">Create New Account</div>
                <div className="flex flex-column add-user-textfield">
                    <TextField
                        hintText="Enter Username"
                        floatingLabelText="Username"
                        errorText={this.state.userStatus}
                        onKeyDown={this.handleKeyDown.bind(this)}
                        value={this.state.user}
                        fullWidth={true}
                        onChange={this.handleUserChange.bind(this)}/>
                    <TextField
                        hintText="Enter Password"
                        floatingLabelText="Password"
                        type="password"
                        errorText={this.state.passStatus}
                        onKeyDown={this.handleKeyDown.bind(this)}
                        value={this.state.pass}
                        fullWidth={true}
                        onChange={this.handlePassChange.bind(this)}/>
                    <TextField
                        hintText="Enter Password"
                        floatingLabelText="Confirm Password"
                        type="password"
                        errorText={this.state.passStatus}
                        onKeyDown={this.handleKeyDown.bind(this)}
                        value={this.state.passConf}
                        fullWidth={true}
                        onChange={this.handleConfirmPassChange.bind(this)}/><br />
                </div>
                <div>
                    <RadioButtonGroup valueSelected={this.state.admin} defaultSelected="false" name="accountType" onChange={this.handleAdminCheck.bind(this)}>
                        <RadioButton
                            value="true"
                            label="Teacher"/>
                        <RadioButton
                            value="false"
                            label="Librarian"/>
                    </RadioButtonGroup><br />
                </div>
                <div className="flex">
                    <FlatButton
                        label="Clear"
                        type="submit"
                        primary={true}
                        onTouchTap={this.handleClear.bind(this)}/>
                    <FlatButton
                        label="Add User"
                        type="submit"
                        primary={true}
                        onTouchTap={this.openDialog.bind(this)}/>
                </div>
                <Dialog
                    actions={actions}
                    modal={false}
                    style={dialogStyle}
                    contentStyle={contentStyle}
                    open={this.state.addUserOpen}
                    onRequestClose={this.closeDialog.bind(this)}
                >
                    Are you sure you want to add user <strong>{this.state.user}</strong> as a <strong>{this.state.admin == 'true' ? "teacher" : "librarian"}</strong>?
                </Dialog>
                <Snackbar
                    open={this.state.snackOpen}
                    message="User created"
                    action="Close"
                    onActionTouchTap={this.closeSnackbar.bind(this)}
                    autoHideDuration={4000}
                    onRequestClose={this.closeSnackbar.bind(this)}/>
            </Paper>
        );
    }
};

export default AddUser;
