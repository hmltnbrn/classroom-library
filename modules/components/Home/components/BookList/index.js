import React from 'react';

import BookListItem from './BookListItem';

class BookList extends React.Component {
    
    render() {

        let listBooks = this.props.books.map(book =>
            <BookListItem key={book.id} book={book} students={this.props.students} signedIn={this.props.signedIn} onSearchKeyChange={this.props.onSearchKeyChange}/>
        );
        
        return (
            <div className="flex paper-container">
                {listBooks}
            </div>
        );
    }
};

export default BookList;
