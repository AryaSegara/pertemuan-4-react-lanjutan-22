import express from "express";
import cors from "cors";
import pool from "./db.js";

const app =  express();

// middlewares
app.use(cors({
    origin: "http://localhost:5173" // Izinkan akses dari frontend
}));  

app.use(express.json());

// Endpoint GET all users
app.get('/api/users', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM users');
      res.json(result.rows)
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// Endpoint POST a new user
app.post('/api/users', async (req, res) => {
    const { name, email } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
        [name, email]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

app.listen(3000, () =>{
    console.log("Server berjalan di port 3000");
})