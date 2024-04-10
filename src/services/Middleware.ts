import {AuthToken} from "../db/models/AuthToken";
import {AuthUser} from "../db/models/AuthUser";


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
        req.user = await AuthUser.findOne({where: {id: authToken.user}});
        next();
    } catch (err) {
        res.status(500).json({message: 'Server error.'});
    }
}

export function expressAuthAccessMiddleware(allowedRoles: string[]) {
    return async function (req: any, res: any, next: any) {
        try {
            if (req.user) {
                const roles = await req.user.getRoles();
                for (const role of roles) {
                    if (allowedRoles.indexOf(role.role) !== -1) {
                        next();
                    }
                }
                res.stat(401).json({message: 'Not allowed'});
            } else {
                res.stat(401).json({message: 'Cannot map user to request object'});
            }
        } catch (e) {
            res.status(500).json({message: 'Server error.'});
        }
    }
}
