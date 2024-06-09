const express = require("express");
const router = express.Router();
const db = require("../database/db.js");

router.get("/books", (req, res) => {
    db.all("SELECT * FROM books", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json({ books: rows });
    });
});

router.post("/books", (req, res) => {
    const { title, author, description, copies } = req.body;
    db.run("INSERT INTO books (title, author, description, copies) VALUES (?, ?, ?, ?)", [title, author, description, copies], function(err){
    if (err) {
        res.status(400).json({ error: err.message });
        return;
    }
        res.status(200).json({ id: this.lastID });
    });
});

router.post('/books/:id/buy', (req, res) => {
  const { id } = req.params;
  db.run('UPDATE books SET copies = copies - 1 WHERE id = ? AND copies > 0', [id], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Book not found or no copies available' });
      return;
    }
    res.json({ success: true });
  });
});

router.post('/books/:id/add', (req, res) => {
    const { id } = req.params;
    const { copies } = req.body;
    db.run('UPDATE books SET copies = copies + ? WHERE id = ?', [copies, id], function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(200).json({ success: true });
    });
});

router.get('/books/search/:title', (req, res) => {
    const { title } = req.params;
    db.all('SELECT * FROM books WHERE title LIKE ?', [`%${title}%`], (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(200).json({ books: rows });
    });
});
  
router.put('/books/:id', (req, res) => {
    const { id } = req.params;
    const { title, author, description, copies } = req.body;
    db.run('UPDATE books SET title = ?, author = ?, description = ?, copies = ? WHERE id = ?', [title, author, description, copies, id], function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(200).json({ success: true });
    });
});

router.delete('/books/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM books WHERE id = ?', [id], function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(200).json({ success: true });
    });
  });
  
module.exports = router;