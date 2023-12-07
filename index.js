import express from 'express';
import cors from 'cors';
const app = express();
import router from './router/routes.js'
import dotenv from 'dotenv'
dotenv.config()
app.use(express.json())
app.use(cors({
    origin:'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
const PORT = process.env.PORT;

// app.use(require('./router/auth'));

app.get('/', (req, res) => {
    res.send("home");
})
app.use('/auth',router)
app.listen(PORT, () => {
    console.log(`listening server on ${PORT}`)
})