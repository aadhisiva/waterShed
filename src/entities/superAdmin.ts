import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  
  @Entity()
  export class superAdmin {
  
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ nullable:true,  type: "nvarchar", length: 500 })
    UserId: string;

    @Column({ nullable:true,  type: "nvarchar", length: 500 })
    UserRole: string;

    @Column({ nullable:true,  type: "nvarchar", length: 500 })
    Name: string;

    @Column({ nullable:true,  type: "nvarchar", length: 500 })
    Mobile: string;

    @Column({ nullable:true,  type: "nvarchar", length: 500 })
    WebOtp: string;

    @Column({ nullable:true,  type: "nvarchar", length: 500 })
    WebToken: string;

    @Column({ nullable:true,  type: "nvarchar", length: 500 })
    WebTokenExpirationTime: string;

    @Column({ nullable:true, type: 'text' })
    WebVersion: string;
  
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
  };
  