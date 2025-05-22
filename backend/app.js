const express = require('express');
const cors = require('cors');
const db = require('./db');
const authRoutes = require('./auth');
const bookRoutes = require('./books');
const { User, Book } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/books', bookRoutes);

db.sync().then(() => {
  app.listen(3000, () => {
    console.log('📘 Backend listo en http://localhost:3000');
  });
});
