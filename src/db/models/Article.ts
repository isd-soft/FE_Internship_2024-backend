import {AllowNull, Column, DataType, Default, Model, NotNull, PrimaryKey, Table, Unique} from "sequelize-typescript";
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
export class Article extends Model<Article> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string;

    @AllowNull(false)
    @NotNull
    @Column(DataType.STRING)
    name: string;

    @AllowNull(false)
    @NotNull
    @Unique
    @Column(DataType.STRING)
    code: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    description: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    imageUrl: string;

    @AllowNull(false)
    @NotNull
    @Default(0)
    @Column(DataType.DECIMAL)
    price: number;

    @AllowNull(false)
    @NotNull
    @Default(0)
    @Column(DataType.INTEGER)
    stock: number;

    @AllowNull(false)
    @NotNull
    @Default(0)
    @Column(DataType.INTEGER)
    rating: number;

    @AllowNull(false)
    @NotNull
    @Default(0)
    @Column(DataType.DECIMAL)
    discount: number;

    @AllowNull(true)
    @Column(DataType.STRING)
    color: string;

    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    isNew: boolean;
}

