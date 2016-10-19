import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';

import SearchBar from './../SearchBar';
import Paginator from './../Paginator';
import CheckedOutBook from './CheckedOutBook';

import * as libraryService from './../../services/library-service';

class CheckedOut extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            books: [],
            searchKey: "",
            total: 0,
            page: 1
        }
    }

    componentDidMount() {
        this.props.setPageTitle("Checked Out Books");
        this.findStudentsByAllBooks();
    }

    findStudentsByAllBooks() {
        libraryService.findStudentsByAllBooks({search: this.state.searchKey, page: this.state.page, signedIn: this.props.signedIn})
            .then(data => {
                this.setState({
                    books: data.books,
                    page: data.page,
                    pageSize: data.pageSize,
                    total: data.total
                });
            });
    }

    searchKeyChangeHandler(searchKey) {
        this.setState({
            searchKey: searchKey,
            page: 1
        }, this.findStudentsByAllBooks);
    }

    nextPageHandler() {
        let p = this.state.page + 1;
        this.setState({
            page: p
        }, this.findStudentsByAllBooks);
    }

    prevPageHandler() {
        let p = this.state.page - 1;
        this.setState({
            page: p
        }, this.findStudentsByAllBooks);
    }
    
    render() {

        let listBooks = this.state.books.map(book =>
            <CheckedOutBook key={book.book_id} book={book} signedIn={this.props.signedIn}/>
        );
        
        return (
            <MuiThemeProvider>
                <div className="checked-out">
                    <div className="flex flex-column">
                        <SearchBar searchKey={this.state.searchKey} onChange={this.searchKeyChangeHandler.bind(this)} hintText={this.props.signedIn === true ? "Enter a partial title or student name" : "Enter a partial title"}/>
                        <Paginator page={this.state.page} pageSize={this.state.pageSize} total={this.state.total} onPrevious={this.prevPageHandler.bind(this)} onNext={this.nextPageHandler.bind(this)} showTotals={true}/>
                    </div>
                    <div className="flex paper-container">
                        {listBooks}
                    </div>
                    <div className="flex justify-center">
                        <Paginator page={this.state.page} pageSize={this.state.pageSize} total={this.state.total} onPrevious={this.prevPageHandler.bind(this)} onNext={this.nextPageHandler.bind(this)} showTotals={false}/>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
};

export default CheckedOut;
