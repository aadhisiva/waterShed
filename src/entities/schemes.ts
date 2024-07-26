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
  
  @Entity( { name: "Schemes" })
  export class Schemes {
  
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Departments, dep => dep.Schemes)
    @JoinColumn({name: "DepartmentId"})
    DepartmentId: Departments
  
    @Column({ type: "nvarchar", length: 500 })
    Description: number;
  
    @Column({ type: "nvarchar", length: 200 })
    SchemeName: number;
  
    @Column({ type: "nvarchar", length: 500 })
    SchemeLogo: number;
  
    @Column({ type: "int" })
    ParentId: number;
  
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
  };
  