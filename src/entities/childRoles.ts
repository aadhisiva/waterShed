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
import { Roles } from "./roles";
  
  @Entity({ name: "ChildRoles" })
  export class ChildRoles {
  
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Roles, dep => dep.ChildRolesFK)
    @JoinColumn({name: "RoleId"})
    RoleId: Roles;

    @Column({type: 'int', default: null})
    ChildId: number
  
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
  };
  