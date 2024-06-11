<template>
  <div class="home">
    <div class="layout">
      <BookForm @bookAdded="refreshBooks" class="componente-esquerda"/>
      <BookList ref="bookList" class="componente-direita"/>
    </div>
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

<style scoped>

.home {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.layout {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  max-width: 1200px;
}

.componente-esquerda {
  flex: 1;
  max-width: 25%;
}

.componente-direita {
  flex: 3;
  max-width: 75%;
}

@media (max-width: 768px) {
  .layout {
    flex-direction: column;
    align-items: center;
  }

  .componente-esquerda,
  .componente-direita {
    max-width: 100%;
  }
}
</style>
