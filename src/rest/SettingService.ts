import {AppExpress} from "../index";
import {formatGenericErrorMessage} from "./utils";
import {Setting} from "../db/models/Setting";
import {Op} from "sequelize";
import {expressAuthAccessMiddleware, expressAuthMiddleware} from "../services/Middleware";


const accessMiddlewareMixin = [
    expressAuthMiddleware,
    expressAuthAccessMiddleware(['ADMIN'])
];

AppExpress.get('/setting/list', accessMiddlewareMixin, async (req, res) => {
    res.status(200);
    res.send((await Setting.findAll({order: ['name']})).map(a => a.toJSON()));
});

AppExpress.get('/setting/read/:name', accessMiddlewareMixin, async (req, res) => {
    let responseStat: number;
    let responseData: any;
    try {
        const setting: Setting = await Setting.findOne({where: {name: req.params.name}});
        responseStat = 200;
        responseData = setting.toJSON();
    } catch (e) {
        responseStat = 500;
        responseData = {message: formatGenericErrorMessage(e)};
    }
    res.status(responseStat);
    res.send(responseData);
});

AppExpress.post('/setting/create', accessMiddlewareMixin, async (req, res) => {
    let responseStat: number;
    let responseData: any;
    try {
        const setting: Setting = await Setting.create(req.body)
        responseStat = 200;
        responseData = setting.toJSON();
    } catch (e) {
        responseStat = 500;
        responseData = {message: formatGenericErrorMessage(e)};
    }
    res.status(responseStat);
    res.send(responseData);
});

AppExpress.post('/setting/update', accessMiddlewareMixin, async (req, res) => {
    let responseStat: number;
    let responseData: any;
    try {
        const setting: Setting = await Setting.findOne({where: {name: req.body.name}});
        Object.assign(setting, req.body);
        await setting.save();
        responseStat = 200;
        responseData = setting.toJSON();
    } catch (e) {
        responseStat = 500;
        responseData = {message: formatGenericErrorMessage(e)};
    }
    res.status(responseStat);
    res.send(responseData);
});

AppExpress.delete('/setting/delete', accessMiddlewareMixin, async (req, res) => {
    let responseStat: number;
    let responseData: any;
    try {
        await Setting.destroy({where: {name: {[Op.in]: req.body}}});
        responseStat = 200;
        responseData = null;
    } catch (e) {
        responseStat = 500;
        responseData = {message: formatGenericErrorMessage(e)};
    }
    res.status(responseStat);
    res.send(responseData);
});
