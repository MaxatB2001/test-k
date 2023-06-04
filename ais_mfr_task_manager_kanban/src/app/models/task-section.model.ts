import { Task } from "./task.model";

export interface TaskSection {
    id: number;
    title: string;
    tasks: Task[]
}