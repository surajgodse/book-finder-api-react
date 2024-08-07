import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function BookList() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
          params: {
            q: 'a', // Generic query to fetch a diverse set of books
            key: process.env.REACT_APP_GOOGLE_BOOKS_API_KEY,
          },
        });
        setBooks(response.data.items || []);
      } catch (error) {
        console.error('There was an error fetching the books!', error);
        toast.error('There was an error fetching the books!');
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
        params: {
          q: query,
          key: process.env.REACT_APP_GOOGLE_BOOKS_API_KEY,
        },
      });
      if (response.data.items && response.data.items.length > 0) {
        setBooks(response.data.items);
      } else {
        toast.error('No books found');
        setBooks([]);
      }
    } catch (error) {
      console.error('There was an error fetching the books!', error);
      toast.error('There was an error fetching the books!');
    }
  };

  return (
    <div className="content">
      <h1>BookVerse</h1>
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="book-list">
        {books.map((book) => (
          <div
            key={book.id}
            className="book"
            onClick={() => window.open(book.volumeInfo.infoLink, '_blank')}
          >
            <img
              src={
                book.volumeInfo.imageLinks?.thumbnail ||
                'https://via.placeholder.com/150'
              }
              alt={book.volumeInfo.title}
            />
            <div className="book-info">
              <h3>{book.volumeInfo.title}</h3>
              <p>₹{book.saleInfo.retailPrice?.amount || 'Not available'}</p>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
}

export default BookList;
