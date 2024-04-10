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
    if (!user.id) {
        return false;
    }
    return 0 < (
        await AuthToken.destroy({
            where: {
                user: user.id
            }
        })
    );
}

export async function findOrGenerateAuthToken(user: AuthUser) {
    let token: AuthToken = await AuthToken.findOne({where: {user: user.id}});
    if (token === null) {
        token = await generateAuthToken(user);
    }
    return token;
}
