<template>
    <div>
      <h1>Add a Book</h1>
      <form @submit.prevent="addBook">
        <input v-model="title" placeholder="Title" />
        <input v-model="author" placeholder="Author" />
        <input v-model="description" placeholder="Description" />
        <input v-model.number="copies" placeholder="Copies" type="number" />
        <button type="submit">Add Book</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        title: '',
        author: '',
        description: '',
        copies: 0
      };
    },
    methods: {
      addBook() {
        fetch('http://localhost:3000/api/books', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: this.title,
            author: this.author,
            description: this.description,
            copies: this.copies
          })
        }).then(response => response.json())
          .then(data => {
            console.log('Book added:', data);
            
            this.title = '';
            this.author = '';
            this.description = '';
            this.copies = 0;
            
            this.$emit('bookAdded');
          });
      }
    }
  };
  </script>
  