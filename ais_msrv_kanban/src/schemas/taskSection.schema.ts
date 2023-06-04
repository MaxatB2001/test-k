import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TaskSchema } from "./task.schema";

@Entity()
export class TaskSectionSchema {
    
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column({nullable: true})
    creatorId: string

    start: Date

    end: Date
}