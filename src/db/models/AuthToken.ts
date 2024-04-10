import {
    AllowNull, BelongsTo,
    Column,
    CreatedAt,
    DataType,
    Default, ForeignKey,
    HasOne,
    Model,
    NotNull,
    PrimaryKey,
    Table,
    Unique
} from "sequelize-typescript";
import {AuthUser} from "./AuthUser";


@Table({
    timestamps: true,
    createdAt: true,
    updatedAt: false,
    deletedAt: false,
})
export class AuthToken extends Model<AuthToken> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string;

    @AllowNull(false)
    @Unique
    @NotNull
    @Column(DataType.STRING)
    key: string;

    @CreatedAt
    creationDate: Date;

    @ForeignKey(() => AuthUser)
    user: string;
}
