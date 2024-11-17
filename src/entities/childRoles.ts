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
    CreatedDate: Date;
  
    @UpdateDateColumn()
    UpdatedDate: Date;
  };
  