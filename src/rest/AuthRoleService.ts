import {AppExpress} from "../index";
import {UserNotFoundError} from "../db/repository/AuthUserRepository";
import {AuthRole} from "../db/models/AuthRole";
import {expressAuthAccessMiddleware, expressAuthMiddleware} from "../services/Middleware";


const accessMiddlewareMixin = [
    expressAuthMiddleware,
    expressAuthAccessMiddleware(['ADMIN'])
];

AppExpress.get('/auth/role/list', accessMiddlewareMixin, async (req, res) => {
    let responseStat: number;
    let responseData: any;
    try {
        const roles = await AuthRole.findAll();
        responseStat = 200;
        responseData = roles.map(r => r.toJSON());
    } catch (e) {
        responseStat = e instanceof UserNotFoundError ? 417 : 500;
        responseData = {message: e.toString()}
    }
    res.status(responseStat);
    res.send(responseData);
});

AppExpress.post('/auth/role/create', accessMiddlewareMixin, async (req, res) => {
    let responseStat: number;
    let responseData: any;
    try {
        const role = await AuthRole.create(req.body);
        responseStat = 200;
        responseData = role.toJSON();
    } catch (e) {
        responseStat = e instanceof UserNotFoundError ? 417 : 500;
        responseData = {message: e.toString()}
    }
    res.status(responseStat);
    res.send(responseData);
});

