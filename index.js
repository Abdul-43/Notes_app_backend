// index.js
import connectToMongo from './db.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';

dotenv.config();

const app = express();
const port = 8000;

connectToMongo();

app.use(
  cors({
    origin: 'https://stupendous-tapioca-34ca8f.netlify.app',
    methods: ['POST','GET','PUT','DELETE'],
    allowedHeaders: ['Content-Type', 'application/json'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

app.listen(port, () => {
  console.log(`Cloud Note is Ready on port ${port}`);
});
