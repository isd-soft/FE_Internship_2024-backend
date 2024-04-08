import {AuthToken} from "../db/models/AuthToken";

export async function expressAuthMiddleware(req: any, res: any, next: any) {
    try {
        const tokenKey = req.header('X-Auth-Token');
        if (!tokenKey) {
            return res.status(401).json({message: 'Access denied. No token provided.'});
        }
        const authToken: AuthToken = await AuthToken.findOne({where: {key: tokenKey}});
        if (!authToken) {
            return res.status(401).json({message: 'Access denied. Illegal token.'});
        }
        req.user = authToken.user;
        next();
    } catch (err) {
        res.status(500).json({message: 'Server error.'});
    }
}