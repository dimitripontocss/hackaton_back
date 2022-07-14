import express,{json} from "express";
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use([json(),cors()]);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Servidor online na porta:", process.env.PORT)
});