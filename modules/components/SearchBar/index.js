import React from 'react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

class SearchBar extends React.Component {

    searchKeyChangeHandler(event) {
        let searchKey = event.target.value;
        this.setState({searchKey: searchKey});
        this.props.onChange(searchKey);
    }

    clearText() {
        this.setState({searchKey: ""});
        this.props.onChange("");
    }

    render() {

        return (
            <div className="flex">
                <TextField
                    hintText={this.props.hintText}
                    value={this.props.searchKey}
                    onChange={this.searchKeyChangeHandler.bind(this)}/>
                <IconButton onClick={this.clearText.bind(this)}>
                    <NavigationClose />
                </IconButton>
            </div>
        );
    }
};

export default SearchBar;
