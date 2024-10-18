import * as mysql2 from 'mysql2';
import app from './app';
import { AppDataSource } from './data-source';
import { error } from 'console';


const start = async () => {
    await AppDataSource.initialize()
    console.log('Database connection initialized successfully');
    app.listen(process.env.PORT || 3000, () => {console.log("app start")})
}


start();
