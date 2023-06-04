import { Task } from './task.model';

export interface UserColumnModel {
  id: number;

  assignId: string;

  performerId: string;

  assignKeycloackUser: { firstName: string; lastName: string; id: string };

  performerKeycloackUser: { firstName: string; lastName: string; id: string };

  tasks: Task[];

  newTasks: Task[];
  doneTasks: Task[];
  processTasks: Task[];
  isTaskExpanded?: boolean
}
