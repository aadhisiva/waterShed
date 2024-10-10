import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn
  } from "typeorm";
  
  
  @Entity()
  export class MobileLogs {
  
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'nvarchar', length: 100, nullable:true })
    UserId: string;
  
    @Column({ type: 'nvarchar', length: 200, nullable:true })
    logMessage: string;

    @Column({ type:'text', default: null })
    Request: string;

    @Column({ type:'text', default: null })
    Response: string;

    @Column({ type:'nvarchar', length: 200, default: null })
    ResponseType: string;

    @CreateDateColumn()
    CreatedDate: Date;
  };
  