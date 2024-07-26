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
  
  @Entity({ name: "Roles" })
  export class Roles {
  
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: "nvarchar", length: 200 })
    RoleName: string;
  
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
    DepartmentId: Departments

    @OneToMany(() => UserData, user => user.RoleId, {cascade: true, onDelete: 'CASCADE'})
    UserData: UserData[]
  
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
  };
  