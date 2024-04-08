import {Model} from "sequelize-typescript";
import {AppSIO} from "../index";

const LIVE_UPDATE_EVENT: string = 'live:entity-hook';


export function genericEntityNotifierAfterCreate(instance: Model, options: any) {
    AppSIO.send(LIVE_UPDATE_EVENT, {
        model: this.name,
        event: 'AFTER_CREATE',
        fields: options.fields,
        instances: [instance.toJSON()]
    });
}

export function genericEntityNotifierAfterDestroy(instance: Model) {
    AppSIO.send(LIVE_UPDATE_EVENT, {
        model: this.name,
        event: 'AFTER_DESTROY',
        instances: [instance.toJSON()]
    });
}

export function genericEntityNotifierAfterUpdate(instance: Model, options: any) {
    AppSIO.send(LIVE_UPDATE_EVENT, {
        model: this.name,
        event: 'AFTER_UPDATE',
        fields: options.fields,
        instances: [instance.toJSON()]
    });
}

export function genericEntityNotifierAfterBulkCreate(instances: Model[], options: any) {
    AppSIO.send(LIVE_UPDATE_EVENT, {
        model: options.model.name,
        event: 'AFTER_UPDATE',
        fields: options.fields,
        instances: instances.map(instance => instance.toJSON())
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
