import React from 'react';

import BookListItem from './BookListItem';

class BookList extends React.Component {
    
    render() {

        //remove container div to make each book paper the same size
        let listBooks = this.props.books.map(book =>
            <div key={book.id}>
                <BookListItem book={book} students={this.props.students} signedIn={this.props.signedIn} onSearchKeyChange={this.props.onSearchKeyChange}/>
            </div>
        );
        
        return (
            <div className="paper-container">
                {listBooks}
            </div>
        );
    }
};

export default BookList;
