import React from 'react';
import {Link} from 'react-router';
import {blue500, white} from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import LibraryBooks from 'material-ui/svg-icons/av/library-books';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import Group from 'material-ui/svg-icons/social/group';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import Settings from 'material-ui/svg-icons/action/settings';

import { browserHistory } from 'react-router';

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
        if (event.keyCode === 13)
            this.signIn();
    }

    openDialog() {
        this.setState({
            signInOpen: true,
            user: "",
            pass: ""
        });
    }

    closeDialog() {
        this.setState({
            signInOpen: false,
            user: "",
            pass: "",
            status: false
        });
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
        if(this.state.status === false) {
            this.props.session();
            this.setState({
                signInOpen: false,
                status: false
            });
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
            minWidth: 400
        };

        const menuItemStyle = {
            padding: 4
        };

        const toolStyle = {
            backgroundColor: blue500,
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
            top: 0,
            backgroundColor: white
        };

        return (
            <div className="header">
                <Toolbar style={toolStyle}>
                    <ToolbarGroup style={leftGroupStyle}>
                        <IconButton touch={true} onTouchTap={this.handleDrawerOpen.bind(this)}>
                            <NavigationMenu color={white} />
                        </IconButton>
                        <ToolbarTitle text={this.props.pageTitle} style={titleStyle}/>
                    </ToolbarGroup>
                    <ToolbarGroup lastChild={true} style={rightGroupStyle}>
                        <ToolbarSeparator style={separatorStyle}/>
                        {this.props.signedIn == false ? 
                            <FlatButton
                                label="Sign In"
                                primary={true}
                                onTouchTap={this.openDialog.bind(this)}
                                style={buttonStyle}/> : 
                            <IconMenu
                                iconButtonElement={<IconButton><AccountCircle color={white}/></IconButton>}
                                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                style={{marginLeft: 15, marginRight: 15}}
                            >
                                <MenuItem primaryText={this.props.username} disabled={true} style={{cursor: 'auto'}}/>
                                <Divider />
                                {this.props.adminStatus === true ? 
                                    <MenuItem primaryText="Admin" onTouchTap={()=>{browserHistory.push('/admin')}} /> :
                                    <MenuItem></MenuItem>
                                }
                                <MenuItem primaryText="Sign Out" onTouchTap={this.signOut.bind(this)} />
                            </IconMenu>
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
                    {this.props.signedIn === true ?
                        <MenuItem
                            onTouchTap={this.handleDrawerClose.bind(this)}
                            containerElement={<Link to="/out" activeClassName="active"/>}
                            leftIcon={<CheckCircle/>}
                            style={menuItemStyle}>
                            Checked Out Books
                        </MenuItem> :
                        <span></span>
                    }
                    {this.props.signedIn === true ?
                        <MenuItem
                            onTouchTap={this.handleDrawerClose.bind(this)}
                            containerElement={<Link to="/students" activeClassName="active"/>}
                            leftIcon={<Group />}
                            style={menuItemStyle}>
                            Students
                        </MenuItem> :
                        <span></span>
                    }
                </Drawer>
                <Dialog
                    modal={false}
                    style={dialogStyle}
                    contentStyle={contentStyle}
                    open={this.state.signInOpen}
                    autoScrollBodyContent={true}
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
        );
    }
};

export default Header;
