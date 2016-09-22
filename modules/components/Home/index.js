import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import SearchBar from './../SearchBar';
import Paginator from './../Paginator';
import BookList from './components/BookList';

import * as libraryService from './../../services/library-service';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchKey: "",
            books: [],
            students: [],
            total: 0,
            page: 1
        }
    }

    componentDidMount() {
        this.props.setPageTitle("Library");
        this.findBooks();
        this.findStudents();
    }

    findBooks() {
        libraryService.findAllBooks({search: this.state.searchKey, page: this.state.page})
            .then(data => {
                this.setState({
                    books: data.books,
                    page: data.page,
                    pageSize: data.pageSize,
                    total: data.total
                });
            });
    }

    findStudents() {
        libraryService.findAllStudents({active: "only active"})
            .then(data => {
                this.setState({
                    students: data.students
                });
            });
    }

    searchKeyChangeHandler(searchKey) {
        this.setState({
            searchKey: searchKey,
            page: 1
        }, this.findBooks);
    }

    nextPageHandler() {
        let p = this.state.page + 1;
        this.setState({
            page: p
        }, this.findBooks);
    }

    prevPageHandler() {
        let p = this.state.page - 1;
        this.setState({
            page: p
        }, this.findBooks);
    }

    render() {

        return (
            <MuiThemeProvider>
                <div className="home">
                    <div className="flex flex-column">
                        <SearchBar searchKey={this.state.searchKey} onChange={this.searchKeyChangeHandler.bind(this)} hintText={"Enter a partial title, author, or genre"}/>
                        <Paginator page={this.state.page} pageSize={this.state.pageSize} total={this.state.total} onPrevious={this.prevPageHandler.bind(this)} onNext={this.nextPageHandler.bind(this)} showTotals={true}/>
                    </div>
                    <BookList books={this.state.books} students={this.state.students} total={this.state.total} signedIn={this.props.signedIn} onSearchKeyChange={this.searchKeyChangeHandler.bind(this)}/>
                    <div className="flex">
                        <Paginator page={this.state.page} pageSize={this.state.pageSize} total={this.state.total} onPrevious={this.prevPageHandler.bind(this)} onNext={this.nextPageHandler.bind(this)} showTotals={false}/>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
};

export default Home;
