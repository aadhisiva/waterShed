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
  
    @Column({ nullable:true, type: 'text' })
    UserId: string;
  
    @Column({ nullable:true, type: 'text' })
    Role: string;

    @Column({ nullable:true, type: 'text'})
    Message: string;

    @Column({ nullable:true, type: 'text' })
    Request: string;

    @Column({ nullable:true, type: 'text' })
    Response: string;

    @Column({ nullable:true, type: 'text'})
    ResponseType: string;

    @CreateDateColumn()
    createdDate: Date;
  };
  