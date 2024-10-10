import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn
  } from "typeorm";
  
  
  @Entity()
  export class webLogs {
  
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ nullable:true, type: 'nvarchar', length: 100 })
    UserId: string;
  
    @Column({ nullable:true, type: 'nvarchar', length: 100 })
    WebPage: string;

    @Column({ nullable:true, type: 'nvarchar', length: 200})
    Message: string;

    @Column({ nullable:true, type: 'text' })
    Request: string;

    @Column({ nullable:true, type: 'text' })
    Response: string;

    @Column({ nullable:true, type: 'nvarchar', length: 200})
    ResponseType: string;

    @CreateDateColumn()
    CreatedDate: Date;
  };
  