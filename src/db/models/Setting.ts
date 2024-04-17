import {AllowNull, Column, DataType, Default, Model, PrimaryKey, Table, Unique} from "sequelize-typescript";


@Table({
    timestamps: true,
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

    @Default(false)
    @Column(DataType.BOOLEAN)
    isPublic: boolean
}
