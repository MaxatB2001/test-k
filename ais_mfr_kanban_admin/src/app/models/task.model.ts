import { Importance } from "../enums/importance.enum";
import { Qualification } from "../enums/qualification.enum";
import { TaskComplexity } from "../enums/task-complexity.enum";
import { TaskStatus } from "../enums/task-status.enum";
import { Urgency } from "../enums/urgency.enum";

export interface Task {
    id?: number;
    title: string;
    deadline?: Date;
    description?: string;
    created_at?: Date;
    status?: TaskStatus
    parent?: Task;
    childrens?: Task[]
    importance?: Importance
    qualification?: Qualification
    urgency?: Urgency
    complexity?: TaskComplexity
    coefficient?: number
    comeToAppointment?: Date
    comeToProcess?: Date
    comeToDone?: Date
    timeInProcess?: number
    performer?: {id: number}
    do_after?: Task
    do_before?: Task
    subTask?: Task[] 
    parentTask?: Task | null
    files?: Array<{fileUrl: string, fileName: string}>
}