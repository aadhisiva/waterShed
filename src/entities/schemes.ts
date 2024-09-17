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
import { Sectors } from "./sectors";
import { Roles } from "./roles";
  
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

    @OneToMany(() => Sectors, sec => sec.SchemeId, {cascade: true, onDelete: 'CASCADE'})
    sectors: Sectors[];

    @ManyToOne(() => Roles, rl => rl.Schemes)
    @JoinColumn({name: "RoleId"})
    RoleId: Roles;

    @CreateDateColumn()
    CreatedDate: Date;
  
    @UpdateDateColumn()
    UpdatedDate: Date;
  };
  