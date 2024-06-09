<template>
    <div>
      <BookList ref="bookList"/>
      <BookForm @bookAdded="refreshBooks"/>
    </div>
  </template>
  
  <script>
  import BookList from '../components/BookList.vue';
  import BookForm from '../components/BookForm.vue';
  
  export default {
    components: {
      BookList,
      BookForm
    },
    methods: {
      refreshBooks() {
        this.$refs.bookList.fetchBooks();
      }
    }
  };
  </script>
  