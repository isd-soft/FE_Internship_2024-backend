import {AuthToken} from "../models/AuthToken";
import {randomUUID} from "node:crypto";
import {AuthUser} from "../models/AuthUser";


export async function generateAuthToken(user: any) {
    return await AuthToken.create({
        key: randomUUID(),
        user: user.id
    })
}

export async function deleteAuthToken(user: AuthUser) {
    return 0 < (
        await AuthToken.destroy({
            where: {
                user: user.id
            }
        })
    );
}
