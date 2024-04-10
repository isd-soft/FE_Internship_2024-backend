import {AuthToken} from "../db/models/AuthToken";
import {AuthUser} from "../db/models/AuthUser";


export function authMiddleware(allowedRoles: string[] = []) {
    return async (req: any, res: any, next: any) => {
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
            if (!req.user) {
                return res.stat(401).json({message: 'Cannot map user to request object'});
            }
            if (allowedRoles.length === 0) {
                return next();
            }
            const roles = await req.user.getRoles();
            for (const role of roles) {
                if (allowedRoles.indexOf(role.role) !== -1) {
                    return next();
                }
            }
            return res.stat(401).json({message: 'Not allowed'});
        } catch (err) {
            return res.status(500).json({message: 'Server error.'});
        }
    }
}
