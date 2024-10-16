import express from "express";
import cors, { CorsOptions } from 'cors';
import helmet from "helmet";


const app = express();


// Cors configs
const options: CorsOptions = {
    origin: '',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: '',
    credentials: true,
  };

app.use(cors(options));
app.use(helmet());
app.use(express.json())


export default app;