import {AllowNull, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table, Unique} from "sequelize-typescript";
import {AuthUser} from "./AuthUser";
import {AuthRole} from "./AuthRole";


@Table({
    timestamps: true,
    updatedAt: false,
    deletedAt: false,
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
