import {AllowNull, Column, DataType, Default, Model, PrimaryKey, Table, Unique} from "sequelize-typescript";
import {
    genericEntityNotifierAfterBulkCreate, genericEntityNotifierAfterBulkDestroy, genericEntityNotifierAfterBulkUpdate,
    genericEntityNotifierAfterCreate,
    genericEntityNotifierAfterDestroy,
    genericEntityNotifierAfterUpdate
} from "../../ws/Hooks";


@Table({
    timestamps: true,
    hooks: {
        afterCreate: genericEntityNotifierAfterCreate,
        afterDestroy: genericEntityNotifierAfterDestroy,
        afterUpdate: genericEntityNotifierAfterUpdate,
        afterBulkCreate: genericEntityNotifierAfterBulkCreate,
        afterBulkDestroy: genericEntityNotifierAfterBulkDestroy,
        afterBulkUpdate: genericEntityNotifierAfterBulkUpdate
    }
})
export class Setting extends Model<Setting> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string;

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING)
    name: string;

    @Default(() => ({}))
    @Column(DataType.JSON)
    value: any;
}