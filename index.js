import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import db from './src/config/database.js';
import route from './src/routes/index.js';
import bodyParser from "body-parser";
import Users from './src/models/Users.js';


dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.get('/', (req,res) => {
    res.status(200).send("Page coba coba");
});

app.use(cookieParser());
app.use(express.json());
app.use('/api',route);

try {
    await db.authenticate();
    console.log('Database Connected...')
    await Users.sync();
} catch (error) {
    console.error();
    
}

const PORT=process.env.PORT||5000;

app.listen(PORT,()=>{
    console.log(`app is live at ${PORT}`);
});