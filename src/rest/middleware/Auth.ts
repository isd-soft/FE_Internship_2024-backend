import {AuthToken} from "../../db/models/AuthToken";
import {AuthUser} from "../../db/models/AuthUser";
import {ValidationError} from "./utils";


export function authMiddleware(allowedRoles: string[] = []) {
    return async (req: any, res: any, next: any) => {
        try {
            await validateToken(req);
            const user = await getAuthUser(req);
            await validateUserRoles(user, allowedRoles);
            next()
        } catch (err) {
            res.status(err.status).json({message: err.message});
        }
    }
}

export async function getAuthUser(req) {
    try {
        const tokenKey = req.header('X-Auth-Token');
        const authToken: AuthToken = await AuthToken.findOne({where: {key: tokenKey}});
        return await AuthUser.findOne({where: {id: authToken.user}});
    } catch (e) {
        return null;
    }
}

export async function validateToken(req) {
    const tokenKey = req.header('X-Auth-Token');
    if (!tokenKey) {
        throw new ValidationError(401, 'Access denied. No token provided.');
    }
}

export async function validateUserRoles(user: AuthUser, allowedRoles: string[]) {
    if (!user) {
        throw new ValidationError(401, 'Cannot map user to request object');
    }
    if (allowedRoles.length === 0) {
        return;
    }
    const roles = await user.getRoles();
    for (const role of roles) {
        if (allowedRoles.indexOf(role.role) !== -1) {
            return;
        }
    }
    throw new ValidationError(403, 'Not allowed');
}
