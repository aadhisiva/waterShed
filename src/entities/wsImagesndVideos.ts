import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";


@Entity({ name: "WatershedImgAndVideo" })
export class WatershedImgAndVideo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: null, type: 'nvarchar', length: 100 })
    SubmissionId: string;

    @Column({ default: null, type: 'nvarchar', length: 100 })
    UserId: string;

    @Column({ default: null, type: 'nvarchar', length: 200 })
    Url: string;

    @Column({ default: null, type: 'nvarchar', length: 100 })
    RecordType: string;

    @Column({ default: null, type: 'nvarchar', length: 100 })
    Latitude: string;

    @Column({ default: null, type: 'nvarchar', length: 100 })
    Longitude: string;

    @Column({ default: null, type: 'nvarchar', length: 100 })
    StatusOfWork: string;

    @CreateDateColumn()
    CreatedDate: Date;
  
    @UpdateDateColumn()
    UpdatedDate: Date;
};
