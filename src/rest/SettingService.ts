import {AppExpress} from "../index";
import {formatGenericErrorMessage} from "./utils";
import {Setting} from "../db/models/Setting";
import {Op} from "sequelize";
import {authMiddleware} from "./middleware/Auth";
import {settingAccessLevelMiddleware} from "./middleware/Settings";
import {DB_HOOKS, emitDbHook} from "../ws/Broadcast";


AppExpress.get('/setting/list', authMiddleware(['ADMIN']), async (req, res) => {
    res.status(200);
    res.send((await Setting.findAll({order: ['name']})).map(a => a.toJSON()));
});

AppExpress.get('/setting/read/:name', settingAccessLevelMiddleware(['ADMIN']), async (req, res) => {
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

AppExpress.post('/setting/create', authMiddleware(['ADMIN']), async (req, res) => {
    let responseStat: number;
    let responseData: any;
    try {
        const setting: Setting = await Setting.create(req.body)
        await emitDbHook([setting], DB_HOOKS.CREATE);
        responseStat = 200;
        responseData = setting.toJSON();
    } catch (e) {
        responseStat = 500;
        responseData = {message: formatGenericErrorMessage(e)};
    }
    res.status(responseStat);
    res.send(responseData);
});

AppExpress.post('/setting/update', authMiddleware(['ADMIN']), async (req, res) => {
    let responseStat: number;
    let responseData: any;
    try {
        const setting: Setting = await Setting.findOne({where: {name: req.body.name}});
        Object.assign(setting, req.body);
        await setting.save();
        await emitDbHook([setting], DB_HOOKS.UPDATE);
        responseStat = 200;
        responseData = setting.toJSON();
    } catch (e) {
        responseStat = 500;
        responseData = {message: formatGenericErrorMessage(e)};
    }
    res.status(responseStat);
    res.send(responseData);
});

AppExpress.delete('/setting/delete', authMiddleware(['ADMIN']), async (req, res) => {
    let responseStat: number;
    let responseData: any;
    try {
        const lookup = {where: {name: {[Op.in]: req.body}}};
        const settings = Setting.findAll(lookup);
        await Setting.destroy(lookup);
        await emitDbHook(settings, DB_HOOKS.DELETE);
        responseStat = 200;
        responseData = null;
    } catch (e) {
        responseStat = 500;
        responseData = {message: formatGenericErrorMessage(e)};
    }
    res.status(responseStat);
    res.send(responseData);
});
