import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
  } from "typeorm";
import { Departments } from "./department";
import { Roles } from "./roles";

  
  @Entity({ name: "RolesAccess" })
  export class RolesAccess {
  
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => Roles, dep => dep.RolesAccess)
    @JoinColumn({name: "RoleId"})
    RoleId: Roles;
  
    @Column({ type: "nvarchar", length: 200 })
    District: string;
  
    @Column({ type: "nvarchar", length: 200 })
    Taluk: string;
  
    @Column({ type: "nvarchar", length: 200 })
    Hobli: string;
  
    @Column({ type: "nvarchar", length: 200 })
    Village: string;

    @ManyToOne(() => Departments, dep => dep.Roles)
    @JoinColumn({name: "DepartmentId"})
    DepartmentId: Departments;

    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
  };
  