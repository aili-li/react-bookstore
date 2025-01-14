import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

// AddBook component, addBook function is passed as a prop shorthand
function AddBook({ addBook }) {
  const [open, setOpen] = useState(false);
  const [book, setBook] = useState({ title: '', author: '', year: '', isbn: '', price: '' });

  const inputChanged = (event) => {
    setBook({ ...book, [event.target.name]: event.target.value });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setBook({ title: '', author: '', year: '', isbn: '', price: '' }); // Clear the form fields when closing the modal
    setOpen(false);
  };

  const handleSave = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    addBook(book); // Call the addBook function to pass the book object
    handleClose(); // Close the modal after saving
  };

  return (
    <>
      <Button variant="outlined" onClick={handleOpen}>
        Add book
      </Button>
      <Dialog open={open} onClose={handleClose} PaperProps={{ style: { padding: '20px', borderRadius: '10px' } }}>
        <DialogTitle>New book</DialogTitle>
        <DialogContent>
          <TextField
            name="title"
            value={book.title}
            onChange={inputChanged}
            label="Title"
            fullWidth
            sx={{ marginBottom: 2, marginTop: 2 }}
          />
          <TextField
            name="author"
            value={book.author}
            onChange={inputChanged}
            label="Author"
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            name="year"
            value={book.year}
            onChange={inputChanged}
            label="Year"
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            name="isbn"
            value={book.isbn}
            onChange={inputChanged}
            label="ISBN"
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            name="price"
            value={book.price}
            onChange={inputChanged}
            label="Price"
            fullWidth
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClose} sx={{ marginRight: 1 }}>Cancel</Button>
          <Button color="primary" onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddBook;
