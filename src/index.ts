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
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

import './rest/ArticleService';
import './rest/AuthService';
import './rest/AuthUserService';
import './rest/SettingService';
import {AuthRole} from "./db/models/AuthRole";

sequelize.sync(config.sequelize.sync).finally(async () => {
    AppServer.listen(config.http.port);
    // await AuthRole.create({role: 'ADMIN', isDefault: false});
    // const roleAdmin: AuthRole = await AuthRole.findOne({where: {role: "ADMIN"}});
    // await roleAdmin.destroy();
    // await AuthRole.bulkCreate([{role: 'USER', isDefault: true}, {role: 'SUPERVISOR', isDefault: false}]);
    // const roleSupervisor: AuthRole = await AuthRole.findOne({where: {role: 'SUPERVISOR'}});
    // await roleSupervisor.update({role: 'SUPERVISOR_UPDATED'});
    // roleSupervisor.role = 'SUPERVISOR_UPDATED_THEN_SAVED';
    // await roleSupervisor.save()
    // await AuthRole.bulkCreate([
    //     {role: "USER_BULK", isDefault: false},
    //     {role: "SUPERVISOR_BULK", isDefault: false}
    // ]);
    // await AuthRole.update({role: 'TEST'}, {where: {isDefault: false}});
    // await AuthRole.destroy({where: {role: "TEST"}});
    // await AuthRole.destroy({where: []}); // Clean up the table
});
