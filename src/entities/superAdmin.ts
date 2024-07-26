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
    Name: string;

    @Column({ nullable:true,  type: "nvarchar", length: 500 })
    Mobile: string;

    @Column({ nullable:true,  type: "nvarchar", length: 500 })
    Username: string;

    @Column({ nullable:true,  type: "nvarchar", length: 500 })
    Password: string;
  
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
  };
  