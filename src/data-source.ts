import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';

dotenv.config()


export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.MYSQL_HOST || 'localhost',
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'mydatabase',
    port: Number(process.env.MYSQL_PORT) || 3306,
    synchronize: false,
    // logging: process.env.DB_LOGGING === 'true',
    entities: ['src/entities/**/*.ts'],
    subscribers: [],
    migrations: ['src/migrations/*.ts'],
    // migrationsTableName: "custom_migration_table",
})




// import * as path from 'node:path';
// import 'dotenv/config';
// import { DataSource, DataSourceOptions } from 'typeorm';


// export const config: DataSourceOptions = {
//   entities: [path.join(__dirname, './models/*.model.{js,ts}')],
//   migrations: [path.join(__dirname, './migrations/*.{js,ts}')],
//   migrationsTableName: 'workspace_db_migrations',
//   type: 'mysql',
//     host: process.env.MYSQL_HOST || 'localhost',
//     username: process.env.MYSQL_USER || 'root',
//     password: process.env.MYSQL_PASSWORD || '',
//     database: process.env.MYSQL_DATABASE || 'mydatabase',
//     port: Number(process.env.MYSQL_PORT) || 3306,
//   logging: 'all',
//   synchronize: 'test',
//   migrationsRun: 'test',
//   migrationsTransactionMode: 'each',
// };

// export default new DataSource(config);