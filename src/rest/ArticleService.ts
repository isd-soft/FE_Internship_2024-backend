import {AppExpress} from "../index";
import {formatGenericErrorMessage} from "./utils";
import {Article} from "../db/models/Article";
import {ArticleNotFound, findArticle} from "../db/repository/ArticleRepository";
import {Op} from "sequelize";
import {authMiddleware} from "./middleware/Auth";
import {DB_HOOKS, emitDbHook} from "../ws/Broadcast";


AppExpress.get('/article/list', async (req, res) => {
    res.status(200);
    res.send((await Article.findAll({order: ['name']})).map(a => a.toJSON()));
});

AppExpress.get('/article/read/:id', async (req, res) => {
    let responseStat: number;
    let responseData: any;
    try {
        const article: Article = await findArticle(req.params.id);
        responseStat = 200;
        responseData = article.toJSON();
    } catch (e) {
        responseStat = e instanceof ArticleNotFound ? 417 : 500;
        responseData = {message: formatGenericErrorMessage(e)};
    }
    res.status(responseStat);
    res.send(responseData);
});

AppExpress.post('/article/create', authMiddleware(['ADMIN']), async (req, res) => {
    let responseStat: number;
    let responseData: any;
    try {
        const article: Article = await Article.create(req.body);
        await emitDbHook([article], DB_HOOKS.CREATE);
        responseStat = 200;
        responseData = article.toJSON();
    } catch (e) {
        responseStat = 500;
        responseData = {message: formatGenericErrorMessage(e)};
    }
    res.status(responseStat);
    res.send(responseData);
});

AppExpress.post('/article/update', authMiddleware(['ADMIN']), async (req, res) => {
    let responseStat: number;
    let responseData: any;
    try {
        const article: Article = await findArticle(req.body.id);
        Object.assign(article, req.body);
        await article.save();
        await emitDbHook([article], DB_HOOKS.UPDATE);
        responseStat = 200;
        responseData = article.toJSON();
    } catch (e) {
        responseStat = e instanceof ArticleNotFound ? 417 : 500;
        responseData = {message: formatGenericErrorMessage(e)};
    }
    res.status(responseStat);
    res.send(responseData);
});

AppExpress.delete('/article/delete', authMiddleware(['ADMIN']), async (req, res) => {
    let responseStat: number;
    let responseData: any;
    try {
        const lookup = {
            where: {
                id: {[Op.in]: req.body}
            }
        }
        const articles = await Article.findAll(lookup)
        await Article.destroy(lookup);
        await emitDbHook(articles, DB_HOOKS.DELETE);
        responseStat = 200;
        responseData = articles.map(a => a.toJSON());
    } catch (e) {
        responseStat = 500;
        responseData = {message: formatGenericErrorMessage(e)};
    }
    res.status(responseStat);
    res.send(responseData);
});
