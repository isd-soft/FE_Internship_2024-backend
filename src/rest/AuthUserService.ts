import {AppExpress, AppSIO} from "../index";
import {createUser, findUserById, updateUser} from "../db/repository/AuthUserRepository";
import {AuthUser} from "../db/models/AuthUser";
import {formatGenericErrorMessage} from "./utils";
import {Op} from "sequelize";
import {authMiddleware} from "./middleware/Auth";
import {DB_HOOKS, emitDbHook} from "../ws/Broadcast";


AppExpress.post('/user/create', authMiddleware(['ADMIN']), async (req, res) => {
    let responseStat: number;
    let responseData: any;
    try {
        const user: AuthUser = await createUser(req.body);
        await emitDbHook([user], DB_HOOKS.CREATE);
        responseStat = 200;
        responseData = await user.toJSON();
    } catch (e) {
        responseStat = 500;
        responseData = {message: formatGenericErrorMessage(e)};
    }
    res.status(responseStat);
    res.send(responseData);
});

AppExpress.get('/user/read/:id', authMiddleware(['ADMIN']), async (req, res) => {
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

AppExpress.get('/user/list', authMiddleware(['ADMIN']), async (req, res) => {
    const responseStat: number = 200;
    const responseData: any = [];
    const users: AuthUser[] = await AuthUser.findAll({order: ['username']});
    for (const user of users) {
        responseData.push((await user.toJSON()));
    }
    res.status(responseStat);
    res.send(responseData);
});

AppExpress.post('/user/update', authMiddleware(['ADMIN']), async (req, res) => {
    let responseStat: number;
    let responseData: any;
    try {
        responseStat = 200;
        responseData = {};
        const user = await updateUser(req.body);
        await emitDbHook([user], DB_HOOKS.CREATE);
    } catch (e) {
        responseStat = 500;
        responseData = {message: formatGenericErrorMessage(e)};
    }
    res.status(responseStat);
    res.send(responseData);
});

AppExpress.delete('/user/delete', authMiddleware(['ADMIN']), async (req, res) => {
    let responseStat: number;
    let responseData: any;
    try {
        const lookup = {
            where: {
                id: {[Op.in]: req.body}
            }
        }
        const users = await AuthUser.findAll(lookup);
        await AuthUser.destroy(lookup);
        await emitDbHook(users, DB_HOOKS.DELETE);
        responseStat = 200;
        responseData = {};
    } catch (e) {
        responseStat = 500;
        responseData = {message: formatGenericErrorMessage(e)};
    }
    res.status(responseStat);
    res.send(responseData);
});
