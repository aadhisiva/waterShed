import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from "typeorm";
import { Schemes } from "./schemes";
import { UserData } from "./userData";
import { Roles } from "./roles";
import { Activity } from "./activity";
import { Sectors } from "./sectors";
  
  @Entity({ name: "Departments"})
  export class Departments {
  
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: "nvarchar", length: 200 })
    DepartmentName: string;

    @OneToMany(() => Schemes, role => role.DepartmentId, {cascade: true, onDelete: 'CASCADE'})
    Schemes: Schemes[];

    @OneToMany(() => Sectors, role => role.DepartmentId, {cascade: true, onDelete: 'CASCADE'})
    Sectors: Sectors[];

    @OneToMany(() => Roles, role => role.DepartmentId, {cascade: true, onDelete: 'CASCADE'})
    Roles: Roles[];

    @OneToMany(() => UserData, role => role.DepartmentId, {cascade: true, onDelete: 'CASCADE'})
    UserData: UserData[];

    @OneToMany(() => Activity, role => role.DepartmentId, {cascade: true, onDelete: 'CASCADE'})
    Activity: Activity[];
  
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
  };
  