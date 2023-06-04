import { Importance } from "../kanban/enums/importance.enum";
import { Qualification } from "../kanban/enums/qualification.enum";
import { TaskComplexity } from "../kanban/enums/task-complexity.enum";
import { TaskStatus } from "../kanban/enums/task-status.enum";
import { Urgency } from "../kanban/enums/urgency.enum";

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
    do_after?: Task
    do_before?: Task
}