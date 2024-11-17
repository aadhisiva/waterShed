import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";


@Entity({ name: "AssignMastersHistory" })
export class AssignMastersHistory {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: null, type: 'nvarchar', length: 100 })
    ListType: string;

    @Column({ default: null, type: 'nvarchar', length: 50 })
    DistrictCode: string;

    @Column({ default: null, type: 'nvarchar', length: 50 })
    TalukCode: string;

    @Column({ default: null, type: 'nvarchar', length: 50 })
    GpCode: string;

    @Column({ default: null, type: 'nvarchar', length: 50 })
    VillageCode: string;

    @Column({ default: null, type: 'nvarchar', length: 10 })
    Type: string;

    @Column({ type: 'int' })
    RoleId: string;

    @Column({ default: null, type: 'nvarchar', length: 12 })
    Mobile: string;

    @Column({ default: null, type: 'nvarchar', length: 100 })
    Name: string;

    @Column({ default: null, type: 'nvarchar', length: 6 })
    Otp: string;

    @Column({ default: null, type: 'nvarchar', length: 50 })
    UserId: string;

    @Column({ default: null, type: 'nvarchar', length: 12 })
    CreatedMobile: string;

    @Column({ default: null, type: 'nvarchar', length: 50 })
    CreatedRole: string;

    @Column({ default: null, type: 'nvarchar', length: 100 })
    History: string;

    @CreateDateColumn()
    CreatedDate: Date;
  
    @UpdateDateColumn()
    UpdatedDate: Date;
};