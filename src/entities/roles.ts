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
import { AssignedMasters } from "./assignedMasters";
import { ChildRoles } from "./childRoles";
import { WaterShedData } from "./watershedData";
import { WaterShedDataHistory } from "./watershedDataHistory";
  
  @Entity({ name: "Roles" })
  export class Roles {
  
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: "nvarchar", length: 200 })
    RoleName: string;

    @ManyToOne(() => Departments, dep => dep.Roles)
    @JoinColumn({name: "DepartmentId"})
    DepartmentId: Departments;
      
    @Column({ type: "nvarchar", length: 10, default: null })
    IsMobile: string;

    @OneToMany(() => UserData, user => user.RoleId, {cascade: true, onDelete: 'CASCADE'})
    UserDataFK: UserData[]

    @OneToMany(() => Schemes, sc => sc.RoleId, {cascade: true, onDelete: 'CASCADE'})
    Schemes: Schemes[];

    @OneToMany(() => RolesAccess, ra => ra.RoleId, {cascade: true, onDelete: 'CASCADE'})
    RolesAccess: RolesAccess[];

    @OneToMany(() => WaterShedData, ld => ld.RoleId, {cascade: true, onDelete: 'CASCADE'})
    waterShedDataFK: WaterShedData[];

    @OneToMany(() => WaterShedDataHistory, ld => ld.RoleId, {cascade: true, onDelete: 'CASCADE'})
    waterShedDataHistoryFK: WaterShedDataHistory[];

    @OneToMany(() => AssignedMasters, am => am.RoleId, {cascade: true, onDelete: 'CASCADE'})
    AssignedMasterFK: AssignedMasters[];

    @OneToMany(() => ChildRoles, am => am.RoleId, {cascade: true, onDelete: 'CASCADE'})
    ChildRolesFK: ChildRoles[];

    @CreateDateColumn()
    CreatedDate: Date;
  
    @UpdateDateColumn()
    UpdatedDate: Date;
  };
  