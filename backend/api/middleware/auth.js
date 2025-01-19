import jwt from "jsonwebtoken";

// Middleware otentikasi
export const verifyToken = (req,res,next) => {
    const authorization = req.headers.authorization;
    if (authorization) {
      if (authorization.startsWith("Bearer ")) {
        const token = authorization.split(" ")[1];
        try {
          req.user = jwt.verify(token, process.env.SECRET_KEY);
          next();
        } catch (error) {
          res.status(401);
          res.send("Token tidak valid.");
        }
      } else {
        res.status(401);
        res.send('Otorisasi tidak valid (harus "Bearer").');
      }
    } else {
      res.status(401);
      res.send("Anda belum login (tidak ada otorisasi).");
    }
  };