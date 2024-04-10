import {AppExpress} from "../index";
import {createUser, findUserById, updateUser} from "../db/repository/AuthUserRepository";
import {AuthUser} from "../db/models/AuthUser";
import {formatGenericErrorMessage} from "./utils";
import {Op} from "sequelize";
import {expressAuthAccessMiddleware, expressAuthMiddleware} from "../services/Middleware";


const accessMiddlewareMixin = [
    expressAuthMiddleware,
    expressAuthAccessMiddleware(['ADMIN'])
];

AppExpress.post('/user/create', accessMiddlewareMixin, async (req, res) => {
    let responseStat: number;
    let responseData: any;
    try {
        const user: AuthUser = await createUser(req.body);
        responseStat = 200;
        responseData = await user.toJSON();
    } catch (e) {
        responseStat = 500;
        responseData = {message: formatGenericErrorMessage(e)};
    }
    res.status(responseStat);
    res.send(responseData);
});

AppExpress.get('/user/read/:id', expressAuthMiddleware, async (req, res) => {
    let responseStat: number;
    let responseData: any;
    try {
        const user: AuthUser = await findUserById(req.params.id);
        responseStat = 200;
        responseData = await user.toJSON();
    } catch (e) {
        responseStat = 500;
        responseData = {message: formatGenericErrorMessage(e)};
    }
    res.status(responseStat);
    res.send(responseData);
});

AppExpress.get('/user/list', expressAuthMiddleware, async (req, res) => {
    const responseStat: number = 200;
    const responseData: any = [];
    const users: AuthUser[] = await AuthUser.findAll({order: ['username']});
    for (const user of users) {
        responseData.push((await user.toJSON()));
    }
    res.status(responseStat);
    res.send(responseData);
});

AppExpress.post('/user/update', accessMiddlewareMixin, async (req, res) => {
    let responseStat: number;
    let responseData: any;
    try {
        responseStat = 200;
        responseData = {};
        await updateUser(req.body);
    } catch (e) {
        responseStat = 500;
        responseData = {message: formatGenericErrorMessage(e)};
    }
    res.status(responseStat);
    res.send(responseData);
});

AppExpress.delete('/user/delete', accessMiddlewareMixin, async (req, res) => {
    let responseStat: number;
    let responseData: any;
    try {
        responseStat = 200;
        responseData = {};
        await AuthUser.destroy({
            where: {
                id: {[Op.in]: req.body}
            }
        })
    } catch (e) {
        responseStat = 500;
        responseData = {message: formatGenericErrorMessage(e)};
    }
    res.status(responseStat);
    res.send(responseData);
});
