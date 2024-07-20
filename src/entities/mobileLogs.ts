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
  
    @Column({ type: 'text', nullable:true })
    UserId: string;
  
    @Column({ type: 'text', nullable:true })
    Role: string;

    @Column({ type: 'text', nullable:true })
    logMessage: string;

    @Column({type: 'text', nullable:true })
    apiMessage: string;

    @Column({ type:'text', default: null })
    Request: string;

    @Column({ type:'text', default: null })
    Response: string;

    @Column({ type:'text', default: null })
    ResponseType: string;

    @CreateDateColumn()
    createdDate: Date;
  };
  