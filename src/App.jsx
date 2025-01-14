import { useState, useRef, useEffect } from 'react';
import './App.css';
import { AgGridReact } from 'ag-grid-react';
import { ClientSideRowModelModule } from 'ag-grid-community'; // Import the Client Side Row Model to fix error in the console
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AddBook from './components/AddBook';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

// Storing the Firebase Realtime Database URL in a variable, just for demonstration purposes for the course
const firebaseUrl = "https://fir-bookstore-534ac-default-rtdb.europe-west1.firebasedatabase.app/books.json";

function App() {

  // State variables
  const [books, setBooks] = useState([]);
  const gridRef = useRef(null);

  // Fetch books from Firebase Realtime Database when the component mounts
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(firebaseUrl);
        const data = await response.json();
        const booksList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setBooks(booksList);
      } catch (error) {
        console.error("Error fetching books: ", error);
      }
    };
    fetchBooks();
  }, []);

  // Column definitions for the ag-Grid
  const columnDefs = [
    { field: 'title', sortable: true, filter: true, suppressMovable: true, flex: 2 },
    { field: 'author', sortable: true, filter: true, suppressMovable: true, flex: 2 },
    { field: 'year', sortable: true, filter: true, suppressMovable: true, flex: 1 },
    { field: 'isbn', sortable: true, filter: true, suppressMovable: true, flex: 2 },
    { field: 'price', sortable: true, filter: true, suppressMovable: true, flex: 1 },
    {
      field: 'delete',
      cellRenderer: params => (
        <IconButton
          size="small"
          color="error"
          onClick={() => deleteBook(params.data.id)}
        >
          <DeleteIcon />
        </IconButton>
      )
    }
  ];

  // Function to add a new book
  const addBook = async (book) => {
    if (book.title && book.author && book.year && book.isbn && book.price) {
      const newBook = { ...book };
      try {
        // Send the new book to Firebase
        const response = await fetch(firebaseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newBook),
        });

        if (response.ok) {
          // After adding, fetch the updated list
          const addedBook = await response.json();
          setBooks(prevBooks => [
            ...prevBooks,
            { id: addedBook.name, ...newBook }
          ]);
        } else {
          alert('Error adding book');
        }
      } catch (error) {
        console.error("Error adding book: ", error);
      }
    } else {
      alert('Please fill in all fields');
    }
  };

  // Function to delete a book by id
  const deleteBook = async (id) => {
    try {
      const url = firebaseUrl.replace('.json', `/${id}.json`); // Delete book by id
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBooks(books.filter(book => book.id !== id));
      } else {
        alert('Error deleting book');
      }
    } catch (error) {
      console.error("Error deleting book: ", error);
    }
  };

  return (
    <div className="App">
      <AppBar position="static" className="app-bar">
        <Toolbar>
          <Typography variant="h5" className="app-title">
            Bookstore
          </Typography>
        </Toolbar>
      </AppBar>
      <AddBook addBook={addBook} />
      <div className="grid-container">
        <div className="grid-wrapper ag-theme-material">
          <AgGridReact
            ref={gridRef}
            rowData={books}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={5}
            animateRows={true}
            modules={[ClientSideRowModelModule]}
            getRowId={(params) => params.data.id}
            domLayout="autoHeight"
            rowHeight={50}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
