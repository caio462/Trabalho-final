const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const booksRouter = require('./routes/books');

app.use(cors());
app.use(bodyParser.json());
app.use('/api', booksRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
