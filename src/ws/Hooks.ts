import {Model} from "sequelize-typescript";
import {AppSIO} from "../index";

const LIVE_UPDATE_EVENT: string = 'live:entity-hook';


export async function genericEntityNotifierAfterCreate(instance: Model, options: any) {
    console.log('hook', await toJson([instance]));
    AppSIO.send(LIVE_UPDATE_EVENT, {
        model: this.name,
        event: 'AFTER_CREATE',
        fields: options.fields,
        instances: await toJson([instance])
    });
}

export async function genericEntityNotifierAfterDestroy(instance: Model) {
    AppSIO.send(LIVE_UPDATE_EVENT, {
        model: this.name,
        event: 'AFTER_DESTROY',
        instances: await toJson([instance])
    });
}

export async function genericEntityNotifierAfterUpdate(instance: Model, options: any) {
    AppSIO.send(LIVE_UPDATE_EVENT, {
        model: this.name,
        event: 'AFTER_UPDATE',
        fields: options.fields,
        instances: await toJson([instance])
    });
}

export async function genericEntityNotifierAfterBulkCreate(instances: Model[], options: any) {
    AppSIO.send(LIVE_UPDATE_EVENT, {
        model: options.model.name,
        event: 'AFTER_UPDATE',
        fields: options.fields,
        instances: await toJson(instances)
    });
}

export function genericEntityNotifierAfterBulkDestroy(options: any) {
    AppSIO.send(LIVE_UPDATE_EVENT, {
        model: options.model.name,
        event: 'AFTER_BULK_DESTROY',
        fields: options.fields,
        lookup: options.where
    });
}

export function genericEntityNotifierAfterBulkUpdate(options: any) {
    AppSIO.send(LIVE_UPDATE_EVENT, {
        model: options.model.name,
        event: 'AFTER_BULK_UPDATE',
        fields: options.fields,
        lookup: options.where
    });
}

async function toJson(instances: Model[]) {
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
