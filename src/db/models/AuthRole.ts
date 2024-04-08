import {
    AllowNull,
    BelongsToMany,
    Column,
    DataType,
    Default,
    Model,
    NotNull,
    PrimaryKey,
    Table
} from "sequelize-typescript";
import {AuthUserRole} from "./AuthUserRole";
import {NonAttribute} from "sequelize";
import {AuthUser} from "./AuthUser";
import {
    genericEntityNotifierAfterBulkCreate,
    genericEntityNotifierAfterBulkDestroy,
    genericEntityNotifierAfterBulkUpdate,
    genericEntityNotifierAfterCreate,
    genericEntityNotifierAfterDestroy,
    genericEntityNotifierAfterUpdate
} from "../../ws/Hooks";


@Table({
    timestamps: false,
    hooks: {
        afterCreate: genericEntityNotifierAfterCreate,
        afterDestroy: genericEntityNotifierAfterDestroy,
        afterUpdate: genericEntityNotifierAfterUpdate,
        afterBulkCreate: genericEntityNotifierAfterBulkCreate,
        afterBulkDestroy: genericEntityNotifierAfterBulkDestroy,
        afterBulkUpdate: genericEntityNotifierAfterBulkUpdate
    }
})
export class AuthRole extends Model<AuthRole> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string;

    @AllowNull(false)
    @NotNull
    @Column(DataType.STRING)
    role: string;

    @AllowNull(false)
    @NotNull
    @Default(false)
    @Column(DataType.BOOLEAN)
    isDefault: boolean;

    @BelongsToMany(() => AuthUser, () => AuthUserRole)
    declare users: NonAttribute<AuthUser[]>;
}
