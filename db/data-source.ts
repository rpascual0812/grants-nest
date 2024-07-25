import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv';
import * as fs from 'fs';
const env: any = dotenv.parse(fs.readFileSync(`.env`));

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    username: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
    ssl: {
        rejectUnauthorized: false
    }
};

const dataSource = new DataSource(dataSourceOptions);

dataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

export default dataSource;