// import express from "express";
// import cors from "cors";
// import connection from "./database.js";
// import jwt from "jsonwebtoken";

// import { verifyToken } from "./middleware/auth.js";

// const app =  express();
// const PORT = process.env.SERVER_PORT || 3000;

// // middlewares
// app.use(
//     cors({
//         origin: process.env.BASE_URL, // Izinkan akses dari frontend
//         credentials: true,
//     })
// );  

// app.use(express.json());

// // Endpoint POST Register
// app.post('/api/register', async (req, res) => {
//   const { gmail,username, password} = req.body;
//   try {
//     const result = await connection.query(
//       'INSERT INTO users (gmail,username, password) VALUES ($1, $2, $3) RETURNING *',
//       [gmail, username,password]
//     );
//     res.json(result.rows[0]);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Endpoint POST Login
// app.post("/api/login", async (req, res) => {
//   const result = await connection.query("SELECT * FROM users WHERE username = $1", [
//     req.body.username,
//   ]);

//   if (result.rows.length > 0) {
//     const user = result.rows[0];
//     // Verifikasi password secara langsung tanpa hash
//     if (user.password === req.body.password) {
//       const token = jwt.sign(user, process.env.SECRET_KEY);
//       res.send({
//         token,
//         message: "Login berhasil.",
//       });
//     } else {
//       res.send("Kata sandi salah.");
//     }
//   } else {
//     res.send(
//       Pengguna dengan nama pengguna ${req.body.username} tidak ditemukan.
//     );
//   }
// });

// // Endpoint: Protected Route
// app.get('/api/profile', verifyToken, async (req, res) => {
//     try {
//         // Ambil username dari token yang sudah diverifikasi oleh middleware
//         const { username } = req.user;

//         // Query database untuk mendapatkan gmail dan username
//       const result = await connection.query('SELECT gmail, username FROM users WHERE username = $1', [username]);
//         if (result.rows.length === 0) {
//             return res.status(404).json({ message: 'User tidak ditemukan!' });
//         }
//         // Kirim response dengan data user
//         res.json({
//             message: 'Access granted!',
//             user: result.rows[0], // { gmail, username }
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Error profile', error });
//     }
// });



// // Endpoint GET all users
// app.get('/api/users', async (req, res) => {
//     try {
//       const result = await connection.query('SELECT * FROM users');
//       res.json(result.rows)
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
// });



// app.listen(PORT, () =>{
//     console.log("Server berjalan di port 3000");
// })

// export default app;






import express from "express";
import cors from "cors";
import connection from "./database.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import cookieParser from "cookie-parser";
import { verifyToken } from "./middleware/auth.js";

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// Middleware
app.use(
  cors({
    origin: process.env.BASE_URL, // Izinkan akses dari frontend
    credentials: true, // Izinkan pengiriman cookies
  })
);
app.use(express.json());
app.use(cookieParser());

// Endpoint POST Register
app.post("/api/register", async (req, res) => {
  const { gmail, username, password } = req.body;
  try {
    // Hash password menggunakan Argon2
    const hashedPassword = await argon2.hash(password);

    // Simpan pengguna ke database
    const result = await connection.query(
      "INSERT INTO users (gmail, username, password) VALUES ($1, $2, $3) RETURNING *",
      [gmail, username, hashedPassword]
    );
    res.status(201).json({ message: "Registrasi berhasil!", user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint POST Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await connection.query("SELECT * FROM users WHERE username = $1", [username]);

    if (result.rows.length > 0) {
      const user = result.rows[0];

      // Verifikasi password menggunakan Argon2
      const cekHashing = await argon2.verify(user.password, password);
      if (cekHashing) {
        // Generate token
        const token = jwt.sign(user, process.env.SECRET_KEY);

        res.json({ message: "Login berhasil!", token:token });
      } else {
        res.status(401).json({ message: "Kata sandi salah." });
      }
    } else {
      res.status(404).json({ message: `Pengguna dengan nama ${username} tidak ditemukan.` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint Protected Route
app.get("/api/profile", verifyToken, async (req, res) => {
  try {
    const { username } = req.user;

    const result = await connection.query("SELECT gmail, username FROM users WHERE username = $1", [username]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan!" });
    }

    res.json({
      message: "Access granted!",
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Error profile", error });
  }
});

// Endpoint GET All Users
app.get("/api/users", async (req, res) => {
  try {
    const result = await connection.query("SELECT gmail, username FROM users");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout Endpoint
app.post("/api/logout", (req, res) => {
  res.clearCookie("token"); // Hapus token dari cookies
  res.json({ message: "Logout berhasil!" });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});

export default app;
