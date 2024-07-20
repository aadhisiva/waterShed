import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
  } from "typeorm";
  
  
  @Entity()
  export class Versions {
  
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ default: '',  type: "nvarchar", length: 10 })
    Version: string;

    @Column({ default: '',  type: "nvarchar", length: 10 })
    WebVersion: string;

    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
  };
  