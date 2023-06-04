import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, Index, Tree, TreeChildren, TreeParent, OneToMany, JoinTable, OneToOne } from "typeorm";
import { TaskSectionSchema } from "./taskSection.schema";
import { TaskStatus } from "src/enums/task-status.enum";
import { Importance } from "src/enums/importance.enum";
import { Qualification } from "src/enums/qualification.enum";
import { Urgency } from "src/enums/urgency.enum";
import { TaskComplexity } from "src/enums/task-complexity.enum";
import { UserColumnShema } from "./UserColumn.schema";

@Entity()
@Tree("closure-table")
export class TaskSchema {
    
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column({nullable: true})
    description: string

    @ManyToOne(() => UserColumnShema, (userColumn) => userColumn.tasks, {nullable: true, onDelete: "CASCADE"})
    @JoinColumn({name: 'performerId',  referencedColumnName: "id"})
    performer: UserColumnShema

    @Column()
    position: number

    @Index()
    @Column({nullable: true})
    deadline: Date

    @Column()
    creatorId: string

    @Index()
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" , nullable: true})
    created_at: Date

    @OneToOne(() => TaskSchema, (task) => task.do_before, {nullable: true})
    @JoinColumn()
    do_after: TaskSchema

    @OneToOne(() => TaskSchema, (task) => task.do_after, {nullable: true})
    do_before: TaskSchema

    @Column({
        type: "enum",
        enum: TaskStatus,
        default: TaskStatus.NEW,
    })
    status: TaskStatus

    @Column({
        type: "integer",
        name: "parentId",
        nullable: true
    })
    parentId: number

    @TreeParent({onDelete: "CASCADE"})
    @JoinColumn({
        name: "parentId",
        referencedColumnName: "id"
    })
    parent: TaskSchema | null
    
    @TreeChildren({cascade: true})
    childrens: TaskSchema[]

    @Column({
        type: "enum",
        enum: Importance,
        default: Importance.reputationLoss,
    })
    importance: Importance

    @Column({
        type: "enum",
        enum: Qualification,
        default: Qualification.personal
    })
    qualification: Qualification

    @Column({
        type: "enum",
        enum: Urgency,
        default: Urgency.month
    })
    urgency: Urgency

    @Column({
        type: "enum",
        enum: TaskComplexity,
        default: TaskComplexity.small
    })
    complexity: TaskComplexity

    @Column({type: "timestamp", default: null})
    comeToAppointment: Date

    @Column({type: "timestamp", default: null})
    comeToProcess: Date

    @Column({type: "timestamp", default: null})
    comeToDone: Date
 
    @Column({default: 0})
    timeInProcess: number

    @ManyToOne(type => TaskSchema, task => task.subTask, {nullable: true, onDelete: "CASCADE"})
    @JoinColumn({name: "parentTaskId"})
    parentTask: TaskSchema

    @Column({nullable: true})
    parentTaskId: number | null

    @OneToMany(type => TaskSchema, task => task.parentTask)
    subTask: TaskSchema[]

    @Column("jsonb", {nullable: true})
    files!: Array<{fileUrl: string, fileName: string}>
}
