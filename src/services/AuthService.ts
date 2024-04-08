import {sha512} from "js-sha512";
import * as config from 'config';


export function hashPassword(plainPassword: string) {
    return sha512.hmac(plainPassword, config.auth.secretKey)
}
