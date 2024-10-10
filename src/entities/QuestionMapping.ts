import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Column
  } from "typeorm";
import { Activity } from "./activity";
import { Questions } from "./questions";
  
  @Entity( { name: "QuestionMapping" })
  export class QuestionMapping {
  
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Activity, ac => ac.ActivityToQuestionMappingFK)
    @JoinColumn({name: "ActivityId"})
    ActivityId: Activity;

    @ManyToOne(() => Questions, ac => ac.QuestionIdToQuestionMappingFK)
    @JoinColumn({name: "QuestionId"})
    QuestionId: Questions;

    @Column({type: 'nvarchar', length: 50, default: null})
    TypeOfLand: string;

    @CreateDateColumn()
    CreatedDate: Date;
  
    @UpdateDateColumn()
    UpdatedDate: Date;
  };
  