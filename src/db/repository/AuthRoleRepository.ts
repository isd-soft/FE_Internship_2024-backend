import {Op} from "sequelize";
import {AuthRole} from "../models/AuthRole";

export async function findRolesByIds(authRoleIds: string[]) {
    return await AuthRole.findAll({
        where: {
            id: {
                [Op.in]: authRoleIds
            }
        }
    });
}