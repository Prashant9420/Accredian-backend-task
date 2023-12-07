import mysql from 'mysql2'
import mysqlPromise from 'mysql2/promise.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../middlewares/authToken.js';
// Create a MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: "root",
    password: "password",
    database: 'accredian',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
const poolPromise = mysqlPromise.createPool({
    host: process.env.DB_HOST,
    user: "root",
    password: "password",
    database: 'accredian',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

export const Register = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const [existingUsers] = await poolPromise.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
    }

  pool.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      return res.status(201).json({ message: 'User created successfully'});
    }
  );
};

export const Login = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    try {
      const [rows] = await poolPromise.execute('SELECT * FROM users WHERE email = ?', [email]);
        console.log("hi");
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
      const user = rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
      }
      const token = generateToken(user.id);
      return res.status(200).json({ message: 'User logged in successfully',token:token,user:user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };