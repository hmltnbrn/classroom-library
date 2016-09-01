import React from 'react';
import {Link} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {cyan500, white} from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import LibraryBooks from 'material-ui/svg-icons/av/library-books';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import Settings from 'material-ui/svg-icons/action/settings';

import * as libraryService from './../../services/library-service';

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: "",
            pass: "",
            signInOpen: false,
            status: false,
            drawer: false
        }
    }

    handleUserChange(event) {
        this.setState({user: event.target.value});
    }

    handlePassChange(event) {
        this.setState({pass: event.target.value});
    }

    handleKeyDown(event) {
        if (event.keyCode == 13)
            this.signIn();
    }

    openDialog() {
        this.setState({signInOpen: true, user: "", pass: ""});
    }

    closeDialog() {
        this.setState({signInOpen: false, user: "", pass: "", status: false});
    }

    signIn() {
        libraryService.signIn({username: this.state.user, password: this.state.pass})
            .then(data => {
                this.setState({
                    status: data.status,
                }, this.session);
            });
    }

    signOut() {
        libraryService.signOut()
            .then(data => {
                this.setState({
                    status: data.status
                }, this.props.session);
            });
    }

    session() {
        if(this.state.status == false) {
            this.props.session();
            this.setState({signInOpen: false, status: false});
        }
    }

    handleDrawerOpen() {
        this.setState({drawer: true})
    }

    handleDrawerClose() {
        this.setState({drawer: false});
    }

    render() {

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

        const menuItemStyle = {
            padding: 4
        };

        const toolStyle = {
            backgroundColor: cyan500,
            height: 64
        };

        const buttonStyle = {
            color: white
        };

        const titleStyle = {
            color: white,
            fontSize: 24,
            marginLeft: 9
        };

        const leftGroupStyle = {
            alignItems: "center",
            marginLeft: -15
        };

        const rightGroupStyle = {
            alignItems: "center"
        };

        const separatorStyle = {
            top: 0
        };

        return (
            <MuiThemeProvider>
                <div className="header">
                    <Toolbar style={toolStyle}>
                        <ToolbarGroup style={leftGroupStyle}>
                            <IconButton touch={true} onTouchTap={this.handleDrawerOpen.bind(this)}>
                                <NavigationMenu color={white} />
                            </IconButton>
                            <ToolbarTitle text={this.props.pageTitle} style={titleStyle}/>
                        </ToolbarGroup>
                        <ToolbarGroup lastChild={true} style={rightGroupStyle}>
                            {this.props.username != "" ? 
                                <ToolbarTitle text={this.props.username} /> :
                                <span></span>
                            }
                            <ToolbarSeparator style={separatorStyle}/>
                            {this.props.signedIn == false ? 
                                <FlatButton
                                    label="Sign In"
                                    primary={true}
                                    onTouchTap={this.openDialog.bind(this)}
                                    style={buttonStyle}/> : 
                                <FlatButton
                                    label="Sign Out"
                                    primary={true}
                                    onTouchTap={this.signOut.bind(this)}
                                    style={buttonStyle}/>
                            }
                        </ToolbarGroup>
                    </Toolbar>
                    <Drawer
                        docked={false}
                        open={this.state.drawer}
                        onRequestChange={(drawer) => this.setState({drawer})}
                    >
                        <AppBar
                            title="Pages"
                            zDepth={0}
                            iconElementLeft={
                            <IconButton touch={true} onTouchTap={this.handleDrawerClose.bind(this)}>
                                <NavigationMenu color={white} />
                            </IconButton>}/>
                        <MenuItem
                            onTouchTap={this.handleDrawerClose.bind(this)}
                            containerElement={<Link to="/" onlyActiveOnIndex/>}
                            leftIcon={<LibraryBooks/>}
                            style={menuItemStyle}>
                            Library
                        </MenuItem>
                        <MenuItem
                            onTouchTap={this.handleDrawerClose.bind(this)}
                            containerElement={<Link to="/out" activeClassName="active"/>}
                            leftIcon={<CheckCircle/>}
                            style={menuItemStyle}>
                            Checked Out Books
                        </MenuItem>
                        <MenuItem
                            onTouchTap={this.handleDrawerClose.bind(this)}
                            containerElement={<Link to="/students" activeClassName="active"/>}
                            leftIcon={<AccountCircle />}
                            style={menuItemStyle}>
                            Students
                        </MenuItem>
                        {this.props.adminStatus == true ? 
                            <MenuItem
                                onTouchTap={this.handleDrawerClose.bind(this)}
                                containerElement={<Link to="/admin" activeClassName="active"/>}
                                leftIcon={<Settings/>}
                                style={menuItemStyle}>
                                Admin
                            </MenuItem> :
                            <span></span>
                        }
                    </Drawer>
                    <Dialog
                        title="Sign In"
                        modal={false}
                        style={dialogStyle}
                        contentStyle={contentStyle}
                        open={this.state.signInOpen}
                        onRequestClose={this.closeDialog.bind(this)}>
                        <TextField autoFocus
                            hintText="Enter Username"
                            floatingLabelText="Username"
                            errorText={this.state.status}
                            onKeyDown={this.handleKeyDown.bind(this)}
                            onChange={this.handleUserChange.bind(this)}/><br />
                        <TextField
                            hintText="Enter Password"
                            floatingLabelText="Password"
                            type="password"
                            errorText={this.state.status}
                            onKeyDown={this.handleKeyDown.bind(this)}
                            onChange={this.handlePassChange.bind(this)}/><br />
                        <FlatButton
                            label="Sign In"
                            type="submit"
                            primary={true}
                            onTouchTap={this.signIn.bind(this)}/>
                    </Dialog>
                </div>
            </MuiThemeProvider>
        );
    }
};

export default Header;
