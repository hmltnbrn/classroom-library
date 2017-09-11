import React from 'react';
import DocumentTitle from 'react-document-title';
import FlatButton from 'material-ui/FlatButton';

import SearchBar from './../SearchBar';
import Paginator from './../Paginator';
import CheckedOutBook from './CheckedOutBook';

import * as libraryService from './../../services/library-service';

class CheckedOut extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchKey: "",
            books: [],
            total: 0,
            page: 1
        }
    }

    componentDidMount() {
        this.props.setPageTitle("Checked Out Books");
        if (this.props.signedIn === true) this.findStudentsByAllBooks();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.signedIn === true && this.props.signedIn === false) this.findStudentsByAllBooks();
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

        if (this.props.signedIn === true) {
            return (
                <DocumentTitle title="Library | Checked Out">
                    <div className="checked-out">
                        <div className="flex flex-column">
                            <SearchBar searchKey={this.state.searchKey} onChange={this.searchKeyChangeHandler.bind(this)} hintText={"Enter a partial title or student name"}/>
                            <Paginator page={this.state.page} pageSize={this.state.pageSize} total={this.state.total} onPrevious={this.prevPageHandler.bind(this)} onNext={this.nextPageHandler.bind(this)} showTotals={true}/>
                        </div>
                        <div className="flex flex-wrap">
                            {listBooks}
                        </div>
                        <div className="flex justify-center">
                            <Paginator page={this.state.page} pageSize={this.state.pageSize} total={this.state.total} onPrevious={this.prevPageHandler.bind(this)} onNext={this.nextPageHandler.bind(this)} showTotals={false}/>
                        </div>
                    </div>
                </DocumentTitle>
            );
        }
        else {
            return (
                <DocumentTitle title="Library | Checked Out">
                    <div className="checked-out flex flex-column align-center">
                        <p>Sign in to view this page.</p>
                    </div>
                </DocumentTitle>
            );
        }
    }
};

export default CheckedOut;
