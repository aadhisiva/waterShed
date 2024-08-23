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
import { UserData } from "./userData";
import { Schemes } from "./schemes";
import { RolesAccess } from "./roleAccess";
import { loginData } from "./loginData";
import { AssignedMasters } from "./assignedMasters";
  
  @Entity({ name: "Roles" })
  export class Roles {
  
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: "nvarchar", length: 200 })
    RoleName: string;

    @ManyToOne(() => Departments, dep => dep.Roles)
    @JoinColumn({name: "DepartmentId"})
    DepartmentId: Departments;

    @OneToMany(() => UserData, user => user.RoleId, {cascade: true, onDelete: 'CASCADE'})
    UserData: UserData[]

    @OneToMany(() => Schemes, sc => sc.RoleId, {cascade: true, onDelete: 'CASCADE'})
    Schemes: Schemes[];

    @OneToMany(() => RolesAccess, ra => ra.RoleId, {cascade: true, onDelete: 'CASCADE'})
    RolesAccess: RolesAccess[];

    @OneToMany(() => loginData, ld => ld.RoleId, {cascade: true, onDelete: 'CASCADE'})
    loginData: loginData[];

    @OneToMany(() => AssignedMasters, am => am.RoleId, {cascade: true, onDelete: 'CASCADE'})
    AssignedMasterFK: AssignedMasters[];
  
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
  };
  