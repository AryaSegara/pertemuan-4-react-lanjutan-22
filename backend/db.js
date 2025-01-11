import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "lanjutan",
    password: "getch21",
    port: 5432,
});

console.log("Connected ke database berhasil");


export default pool;

