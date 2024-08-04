import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
  } from "typeorm";
  
  @Entity( { name: "QuestionMapping" })
  export class QuestionMapping {
  
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int" })
    ActivityId: string;
  
    @Column({ type: "int" })
    QuestionId: string;
  
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
  };
  