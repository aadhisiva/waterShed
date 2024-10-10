import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
import { Roles } from "./roles";
  
  @Entity( { name: "AssignedMasters" })
  export class AssignedMasters {
  
    @PrimaryGeneratedColumn("uuid")
    UserId: string;

    @Column({ type: "nvarchar", length: 50, default: null })
    DistrictCode: string;

    @Column({ type: "nvarchar", length: 50, default: null })
    TalukCode: string;

    @Column({ type: "nvarchar", length: 50, default: null })
    HobliCode: string;

    @Column({ type: "nvarchar", length: 50, default: null })
    VillageCode: string;

    @Column({ type: "nvarchar", length: 50, default: null })
    Name: string;

    @Column({ type: "nvarchar", length: 15, default: null })
    Mobile: string;

    @Column({ type: "nvarchar", length: 50, default: null })
    Otp: string;
  
    @ManyToOne(() => Roles, lr => lr.AssignedMasterFK)
    @JoinColumn({name: "RoleId"})
    RoleId: Roles;
  
    @Column({ type: "nvarchar", length: 50, default: null })
    ListType: string;
  
    @Column({ type: "nvarchar", length: 50, default: null })
    Type: string;
  
    @Column({ type: "nvarchar", length: 50, default: null })
    Version: string;
  
    @Column({ type: "nvarchar", length: 30, default: null })
    CreatedMobile: string;
  
    @Column({ type: "nvarchar", length: 30, default: null })
    CreatedRole: string;

    @CreateDateColumn()
    CreatedDate: Date;
  
    @UpdateDateColumn()
    UpdatedDate: Date;
  };
  