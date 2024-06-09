<template>
    <div>
      <h1>Books</h1>
      <input v-model="searchQuery" @input="searchBooks" placeholder="Search by title" />
      <ul>
        <li v-for="book in books" :key="book.id">
          {{ book.title }} by {{ book.author }} - {{ book.copies }} copies
          <button @click="buyBook(book.id)">Buy</button>
          <input type="number" v-model.number="copiesToAdd[book.id]" placeholder="Add Copies" />
          <button @click="addCopies(book.id)">Add</button>
          <button @click="editBook(book)">Edit</button>
          <button @click="removeBook(book.id)">Remove</button>
        </li>
      </ul>
      <div v-if="editingBook">
        <h2>Edit Book</h2>
        <form @submit.prevent="updateBook">
          <input v-model="editingBook.title" placeholder="Title" />
          <input v-model="editingBook.author" placeholder="Author" />
          <input v-model="editingBook.description" placeholder="Description" />
          <input v-model.number="editingBook.copies" placeholder="Copies" type="number" />
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        books: [],
        searchQuery: '',
        copiesToAdd: {},
        editingBook: null
      };
    },
    created() {
      this.fetchBooks();
    },
    methods: {
      fetchBooks() {
        fetch('http://localhost:3000/api/books')
          .then(response => response.json())
          .then(data => {
            this.books = data.books;
          });
      },
      searchBooks() {
        if (this.searchQuery.trim() === '') {
          this.fetchBooks();
        } else {
          fetch(`http://localhost:3000/api/books/search/${this.searchQuery}`)
            .then(response => response.json())
            .then(data => {
              this.books = data.books;
            });
        }
      },
      buyBook(id) {
        fetch(`http://localhost:3000/api/books/${id}/buy`, {
          method: 'POST'
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              this.books = this.books.map(book => {
                if (book.id === id) {
                  book.copies -= 1;
                }
                return book;
              });
            }
          });
      },
      addCopies(id) {
        const copies = this.copiesToAdd[id];
        fetch(`http://localhost:3000/api/books/${id}/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ copies })
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              this.books = this.books.map(book => {
                if (book.id === id) {
                  book.copies += copies;
                }
                return book;
              });
              this.copiesToAdd[id] = 0;
            }
          });
      },
      editBook(book) {
        this.editingBook = { ...book };
      },
      updateBook() {
        fetch(`http://localhost:3000/api/books/${this.editingBook.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.editingBook)
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              this.books = this.books.map(book => {
                if (book.id === this.editingBook.id) {
                  return this.editingBook;
                }
                return book;
              });
              this.editingBook = null;
            }
          });
      },
      removeBook(id) {
        fetch(`http://localhost:3000/api/books/${id}`, {
          method: 'DELETE'
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              this.books = this.books.filter(book => book.id !== id);
            }
          });
      }
    }
  };
  </script>
  