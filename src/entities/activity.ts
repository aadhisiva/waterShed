import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
import { Departments } from "./department";
  
  @Entity( { name: "Activity" })
  export class Activity {
  
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Departments, dep => dep.Activity)
    @JoinColumn({name: "DepartmentId"})
    DepartmentId: Departments

    @Column({ type: "nvarchar", length: 200 })
    ActivityName: number;
  
    @Column({ type: "int" })
    ParentId: number;
  
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
  };
  