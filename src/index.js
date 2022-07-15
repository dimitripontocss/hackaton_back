import express,{json} from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from "./databases/mongo.js";
import router from './routes/router.js';

dotenv.config();

const app = express();

app.use([json(),cors()]);

connectDatabase();

app.use(router);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Servidor online na porta:", process.env.PORT)
});