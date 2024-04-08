import {Sequelize} from 'sequelize-typescript';
import * as conf from './config/config.json';

const settings = conf[process.env.NODE_ENV || 'development']

console.log(__dirname)
export const sequelize = new Sequelize({
    database: settings.database,
    username: settings.username,
    password: settings.password,
    dialect: settings.dialect,
    host: settings.host,
    port: settings.port,
    models: [__dirname + '/models'],
});
