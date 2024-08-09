import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
  } from "typeorm";
import { Departments } from "./department";
import { Roles } from "./roles";
import { WaterShedData } from "./watershedData";
  
  @Entity( { name: "UserData" })
  export class UserData {
  
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Departments, dep => dep.UserData)
    @JoinColumn({name: "DepartmentId"})
    DepartmentId: Departments

    @ManyToOne(() => Roles, dep => dep.UserData)
    @JoinColumn({name: "RoleId"})
    RoleId: Roles
  
    @Column({ type: "nvarchar", length: 10 })
    Otp: number;
  
    @Column({ type: "nvarchar", length: 13 })
    Mobile: number;
  
    @Column({ type: "nvarchar", length: 200 })
    DistrictCode: number;
  
    @Column({ type: "nvarchar", length: 200 })
    TalukCode: number;
  
    @Column({ type: "nvarchar", length: 200 })
    HobliCode: number;
  
    @Column({ type: "nvarchar", length: 200 })
    VillageCode: number;

    @OneToMany(() => WaterShedData, ws => ws.UserId)
    @JoinColumn({name: "UserId"})
    wateshedData: WaterShedData
  
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
  };
  