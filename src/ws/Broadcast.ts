import {AppSIO} from "../index";
import * as config from 'config';
import {Model} from "sequelize-typescript";


export const DB_HOOKS = {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
}

export async function emitDbHook(instances, event) {
    const instanceTypeMap = {};
    for (const instance of instances) {
        const instanceType = instance.constructor.name
        if (!instanceTypeMap.hasOwnProperty(instanceType)) {
            instanceTypeMap[instanceType] = [];
        }
        instanceTypeMap[instanceType].push(instance);
    }
    for (const instanceType of Object.keys(instanceTypeMap)) {
        await emitEvent(config.ws.channels.dbLiveUpdates,{
            model: instanceType,
            event: event,
            instances: await safeToJSON(instanceTypeMap[instanceType])
        });
    }
}

async function emitEvent(event, data) {
    const sockets = await AppSIO.fetchSockets();
    for (const socket of sockets) {
        socket.emit(event, data);
    }
}

async function safeToJSON(instances: Model[]) {
    const jsonInstances = [];
    for (const instance of instances) {
        let json = instance.toJSON();
        if (json instanceof Promise) {
            json = await json;
        }
        jsonInstances.push(json);
    }
    return jsonInstances;
}
