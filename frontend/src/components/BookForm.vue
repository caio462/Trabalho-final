<template>
  <div class="formulario-livro">
    <h1>Adicionar um Livro</h1>
    <form @submit.prevent="addBook" class="form-adicionar-livro">
      <input v-model="title" placeholder="Título" class="input-campo" id="input-campo-titulo"/>
      <input v-model="author" placeholder="Autor" class="input-campo" id="input-campo-Autor"/>
      <input v-model="description" placeholder="Descrição" class="input-campo" id="input-campo-Descrição"/>
      <input v-model.number="copies" placeholder="Cópias" type="number" class="input-campo" id="input-campo-Cópias"/>
      <button type="submit" class="botao" id="input-campo-botao">Adicionar Livro</button>
    </form>
    <div v-if="message" class="mensagem">
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      author: '',
      description: '',
      copies: 0,
      message: ''
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
          this.title = '';
          this.author = '';
          this.description = '';
          this.copies = 0;
          
          this.message = 'Livro adicionado com sucesso!';
          setTimeout(() => {
            this.message = '';
          }, 3000);

          this.$emit('bookAdded');
        });
    }
  }
};
</script>

<style scoped>
.formulario-livro {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  height: 400px; /* Definindo uma altura fixa */
  overflow: auto; /* Adicionando rolagem se necessário */
}
.form-adicionar-livro {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.input-campo {
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.botao {
  padding: 10px;
  border: none;
  background-color: #28a745;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
}
.mensagem {
  margin-top: 10px;
  padding: 10px;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  text-align: center;
}
</style>
