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
  
    @Column({ type: "nvarchar", length: 200, default: null })
    District: string;
  
    @Column({ type: "nvarchar", length: 200, default: null })
    Taluk: string;
  
    @Column({ type: "nvarchar", length: 200, default: null })
    Hobli: string;
  
    @Column({ type: "nvarchar", length: 200, default: null })
    Village: string;
  
    @Column({ type: "nvarchar", length: 200, default: null })
    Type: string;

    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
  };
  