import {AllowNull, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table, Unique} from "sequelize-typescript";
import {AuthUser} from "./AuthUser";
import {AuthRole} from "./AuthRole";
import {
    genericEntityNotifierAfterBulkCreate, genericEntityNotifierAfterBulkDestroy, genericEntityNotifierAfterBulkUpdate,
    genericEntityNotifierAfterCreate,
    genericEntityNotifierAfterDestroy,
    genericEntityNotifierAfterUpdate
} from "../../ws/Hooks";


@Table({
    timestamps: true,
    updatedAt: false,
    deletedAt: false,
    hooks: {
        afterCreate: genericEntityNotifierAfterCreate,
        afterDestroy: genericEntityNotifierAfterDestroy,
        afterUpdate: genericEntityNotifierAfterUpdate,
        afterBulkCreate: genericEntityNotifierAfterBulkCreate,
        afterBulkDestroy: genericEntityNotifierAfterBulkDestroy,
        afterBulkUpdate: genericEntityNotifierAfterBulkUpdate
    }
})
export class AuthUserRole extends Model<AuthUserRole> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string;

    @ForeignKey(() => AuthUser)
    @AllowNull(false)
    @Unique('userId-roleId')
    @Column(DataType.STRING)
    userId: string;

    @ForeignKey(() => AuthRole)
    @AllowNull(false)
    @Unique('userId-roleId')
    @Column(DataType.STRING)
    roleId: string;
}
