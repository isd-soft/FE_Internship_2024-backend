import {Setting} from "../../db/models/Setting";
import {getAuthUser} from "./Auth";
import {AuthUser} from "../../db/models/AuthUser";
import {ValidationError} from "./utils";


export function settingAccessLevelMiddleware(allowedRoles: string[] = []) {
    return async (req, res, next) => {
        try {
            const setting = await Setting.findOne({where: {name: req.params.name}});
            const user = await getAuthUser(req);
            await validateSettingReadAccessLevel(user, setting, allowedRoles);
            next()
        } catch (err) {
            res.status(err.status).json({message: err.message});
        }
    };
}

export async function validateSettingReadAccessLevel(user: AuthUser, setting: Setting, allowedRoles: string[] = []) {
    if (!setting) {
        throw new ValidationError(404, 'Setting does not exist');
    }
    if (setting.isPublic) {
        return;
    }
    if (!user) {
        throw new ValidationError(406, 'Anonymous identity not allowed')
    }
    const userRoles = await user.getRoles();
    for (const role of userRoles) {
        if (allowedRoles.indexOf(role.role) !== -1) {
            return;
        }
    }
    throw new ValidationError(401, `User ${user.username} is not allowed to access setting ${setting.name}`);
}
