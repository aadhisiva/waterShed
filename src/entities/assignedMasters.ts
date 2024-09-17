import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
import { Departments } from "./department";
import { Sectors } from "./sectors";
import { Roles } from "./roles";
  
  @Entity( { name: "AssignedMasters" })
  export class AssignedMasters {
  
    @PrimaryGeneratedColumn()
    id: number;

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
  
    // @Column({ type: "nvarchar", length: 50, default: null })
    // RoleId: string;
  
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
    UserId: string;
  
    @Column({ type: "nvarchar", length: 30, default: null })
    CreatedMobile: string;
  
    @Column({ type: "nvarchar", length: 30, default: null })
    CreatedRole: string;
  
    @Column({ type: "nvarchar", length: 30, default: null })
    CreatedName: string;

    @CreateDateColumn()
    CreatedDate: Date;
  
    @UpdateDateColumn()
    UpdatedDate: Date;
  };
  