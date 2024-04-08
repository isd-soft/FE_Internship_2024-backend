import {
    AllowNull,
    BelongsToMany,
    Column,
    DataType,
    Default,
    HasOne,
    Model,
    NotNull,
    PrimaryKey,
    Table,
    Unique
} from "sequelize-typescript";
import {AuthUserRole} from "./AuthUserRole";
import {AuthToken} from "./AuthToken";
import {BelongsToManyGetAssociationsMixin, BelongsToManySetAssociationsMixin, NonAttribute} from "sequelize";
import {AuthRole} from "./AuthRole";
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
export class AuthUser extends Model<AuthUser> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string;

    @AllowNull(false)
    @NotNull
    @Unique
    @Column({type: DataType.STRING})
    username: string;

    @AllowNull(false)
    @NotNull
    @Column({type: DataType.STRING})
    password: string;

    @AllowNull(false)
    @NotNull
    @Unique
    @Column({type: DataType.STRING})
    email: string;

    @Default(() => '')
    @Column({type: DataType.STRING})
    firstName: string;

    @Default(() => '')
    @Column({type: DataType.STRING})
    lastName: string;

    @Default(() => ({}))
    @Column({type: DataType.JSON})
    meta: any;

    @BelongsToMany(() => AuthRole, () => AuthUserRole)
    declare roles: NonAttribute<AuthRole[]>;

    @HasOne(() => AuthToken)
    token: AuthToken;

    declare getRoles: BelongsToManyGetAssociationsMixin<AuthRole>;
    declare setRoles: BelongsToManySetAssociationsMixin<AuthRole, AuthRole['id']>;

    async toJSON() {
        const json: any = super.toJSON();
        delete json.password;
        json.roles = (await this.getRoles()).map(r => ({id: r.id, role: r.role}));
        return json;
    }
}
