import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";


@Entity()
export class Category {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable:true,  type: 'nvarchar', length: 500 })
  CategoryName: string;

  @Column({ nullable:true,  type: 'nvarchar', length: 500 })
  SectorCode: string;

  @Column({ nullable:true,  type: 'nvarchar', length: 500 })
  IsActivity: string;

  @Column({ nullable:true,  type: 'nvarchar', length: 500 })
  IsSubActivity: string;

  @Column({ nullable:true,  type: 'nvarchar', length: 500 })
  ActivityCode: string;

  @Column({ nullable:true,  type: 'nvarchar', length: 500 })
  CategoryCode: string;

  @Column({ nullable:true,  type: 'nvarchar', length: 500 })
  SubActivityCode: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

};
