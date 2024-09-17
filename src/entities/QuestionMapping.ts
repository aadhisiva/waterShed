import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
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

    @CreateDateColumn()
    CreatedDate: Date;
  
    @UpdateDateColumn()
    UpdatedDate: Date;
  };
  