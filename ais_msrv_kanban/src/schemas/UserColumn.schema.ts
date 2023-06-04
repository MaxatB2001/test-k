import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TaskSchema } from "./task.schema";

@Entity()
export class UserColumnShema {
    
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    assignId: string

    @Column()
    performerId: string

    @Column("jsonb", {nullable: true})
    assignKeycloackUser: object

    @Column("jsonb", {nullable: true})
    performerKeycloackUser: object

    @OneToMany(() => TaskSchema, (task) => task.performer)
    tasks: TaskSchema[]

    newTasks: TaskSchema[]
    processTasks: TaskSchema[]
    doneTasks: TaskSchema[]
    isTaskExpanded?: boolean = false
}