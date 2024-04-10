import {AppExpress} from "../index";
import {hashPassword} from "../services/AuthService";
import {AuthUser} from "../db/models/AuthUser";
import {createUserSignUp, findUserByUsername, UserNotFoundError} from "../db/repository/AuthUserRepository";
import {deleteAuthToken, generateAuthToken, findOrGenerateAuthToken} from "../db/repository/AuthTokenRepository";
import {formatGenericErrorMessage} from "./utils";
import {AuthToken} from "../db/models/AuthToken";


AppExpress.post('/auth/sign-in', async (req, res) => {
    const username: string = req.body.username;
    const password: string = hashPassword(req.body.password);
    let responseStat: number;
    let responseData: any;
    try {
        const user: AuthUser = await findUserByUsername(username);
        if (user.password !== password) {
            responseStat = 417;
            responseData = {message: 'Incorrect password'};
        } else {
            responseStat = 200;
            responseData = {
                user: await user.toJSON(),
                token: (await findOrGenerateAuthToken(user)).toJSON()
            };
        }
    } catch (e) {
        responseStat = e instanceof UserNotFoundError ? 417 : 500;
        responseData = {message: e.toString()}
    }
    res.status(responseStat);
    res.send(responseData);
});

AppExpress.post('/auth/sign-up', async (req, res) => {
    let responseStat: number;
    let responseData: any;
    try {
        const user: AuthUser = await createUserSignUp(req.body);
        const authToken: AuthToken = await generateAuthToken(user);
        responseStat = 200;
        responseData = {
            user: await user.toJSON(),
            token: authToken.toJSON()
        };
    } catch (e) {
        responseStat = 500;
        responseData = {message: formatGenericErrorMessage(e)};
    }
    res.status(responseStat);
    res.send(responseData);
});

AppExpress.post('/auth/sign-out', async (req, res) => {
    let responseStat: number;
    let responseData: any;
    try {
        const user: AuthUser = await findUserByUsername(req.body.username);
        await deleteAuthToken(user);
        responseStat = 204;
        responseData = null;
    } catch (e) {
        if (e instanceof UserNotFoundError) {
            responseStat = 204;
            responseData = null;
        } else {
            responseStat = 500;
            responseData = {message: e.toString()}
        }
    }
    res.status(responseStat);
    res.send(responseData);
});
