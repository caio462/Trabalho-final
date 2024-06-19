<template>
  <div class="lista-livros">
    <h1>Livros</h1>
    <input v-model="searchQuery" @input="searchBooks" placeholder="Buscar por título" class="input-busca" id="input-busca"/>
    <ul class="itens-livros">
      <li v-for="book in books" :key="book.id" class="item-livro">
        <div class="detalhes-livro">
          <img :src=book.imageUrl class="imagem"/>
          <span>{{ book.title }} por {{ book.author }} - {{ book.copies }} cópias</span>
          <div class="acoes-livro">
            <button @click="buyBook(book.id)" class="botao" id="bota-compra">Comprar</button>
            <input type="number" v-model.number="copiesToAdd[book.id]" placeholder="Adicionar Cópias" class="input-copias"/>
            <button @click="addCopies(book.id)" class="botao" id="input-copias-adicionar">Adicionar</button>
            <button @click="editBook(book)" class="botao" id="botao-editar">Editar</button>
            <button @click="removeBook(book.id)" class="botao botao-perigo" id="botao-remover">Remover</button>
          </div>
        </div>
      </li>
    </ul>
    <div v-if="editingBook" class="editar-livro">
      <h2>Editar Livro</h2>
      <form @submit.prevent="updateBook" class="form-editar-livro">
        <input v-model="editingBook.title" placeholder="Título" class="input-campo"/>
        <input v-model="editingBook.author" placeholder="Autor" class="input-campo"/>
        <input v-model="editingBook.description" placeholder="Descrição" class="input-campo"/>
        <input type="number" v-model.number="editingBook.copies" placeholder="Cópias" class="input-campo"/>
        <input v-model="editingBook.imageUrl" placeholder="URL da Imagem" class="input-campo"/>
        <button type="submit" class="botao">Atualizar</button>
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
            const updatedBook = this.books.find(book => book.id === id);
            updatedBook.copies += copies;
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
            const index = this.books.findIndex(book => book.id === this.editingBook.id);
            if (index !== -1) {
              this.books.splice(index, 1, this.editingBook);
            }
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

<style scoped>
.lista-livros {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.input-busca {
  display: block;
  margin: 0 auto 20px;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.itens-livros {
  list-style: none;
  padding: 0;
}
.item-livro {
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.detalhes-livro {
  flex-grow: 1;
}
.acoes-livro {
  padding-top: 15px;
  display: flex;
  gap: 10px;
}
.botao {
  padding: 5px 10px;
  border: none;
  background-color: #007BFF;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
}
.botao-perigo {
  background-color: #dc3545;
}
.input-copias {
  width: 200px;
  padding: 5px;
}
.editar-livro {
  margin-top: 20px;
}
.form-editar-livro {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.input-campo {
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
}
.imagem {
  width: 30%;
  height: 30%;
  padding: 2%;
}

</style>
