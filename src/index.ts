import express, {Express} from "express";
import {sequelize} from "./db";
import {createServer, Server as ServerHTTP} from "node:http";
import {Server as ServerSIO} from "socket.io";
import * as config from 'config';


export const AppExpress: Express = express();
export const AppServer: ServerHTTP = createServer(AppExpress);
export const AppSIO: ServerSIO = new ServerSIO(AppServer, config.sio.opts);

AppExpress.use(express.json());
AppExpress.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, PATCH, DELETE, CONNECT, OPTIONS, TRACE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-Auth-Token, Content-Type, Accept");
    next();
});

import './rest/ArticleService';
import './rest/AuthService';
import './rest/AuthUserService';
import './rest/SettingService';
import './rest/AuthRoleService'

sequelize.sync(config.sequelize.sync).finally(async () => {
    AppServer.listen(config.http.port);
});
