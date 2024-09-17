import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";


@Entity({ name: "UploadImgAndVideo" })
export class UploadImgAndVideo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: null, type: 'nvarchar', length: 1000 })
    UserId: number;

    @Column({ default: null, type: 'nvarchar', length: 1000 })
    ImageName: number;

    @Column({ default: null, type: 'varbinary', length: 'max' })
    ImageData: string;

    @Column({ default: null, type: 'nvarchar', length: 100 })
    RecordType: string;

    @CreateDateColumn()
    CreatedDate: Date;
  
    @UpdateDateColumn()
    UpdatedDate: Date;
};
