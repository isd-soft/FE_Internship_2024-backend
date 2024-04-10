import {AppExpress} from "../index";
import {formatGenericErrorMessage} from "./utils";
import {Setting} from "../db/models/Setting";
import {Op} from "sequelize";
import {expressAuthMiddleware} from "../services/Middleware";


AppExpress.get('/setting/list', expressAuthMiddleware, async (req, res) => {
    res.status(200);
    res.send((await Setting.findAll({order: ['name']})).map(a => a.toJSON()));
});

AppExpress.get('/setting/read/:name', expressAuthMiddleware, async (req, res) => {
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

AppExpress.post('/setting/create', expressAuthMiddleware, async (req, res) => {
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

AppExpress.post('/setting/update', expressAuthMiddleware, async (req, res) => {
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

AppExpress.delete('/setting/delete', expressAuthMiddleware, async (req, res) => {
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