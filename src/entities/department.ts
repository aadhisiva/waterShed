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
import { RolesAccess } from "./roleAccess";
import { Activity } from "./activity";
import { Sectors } from "./sectors";
import { Roles } from "./roles";
import { Category } from "./category";
  
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

    @OneToMany(() => Activity, role => role.DepartmentId, {cascade: true, onDelete: 'CASCADE'})
    Activity: Activity[];

    @OneToMany(() => Category, role => role.DepartmentId, {cascade: true, onDelete: 'CASCADE'})
    DepToCategoryFK: Category[];

    @CreateDateColumn()
    CreatedDate: Date;
  
    @UpdateDateColumn()
    UpdatedDate: Date;
  };
  