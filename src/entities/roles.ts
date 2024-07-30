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
  
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
  };
  