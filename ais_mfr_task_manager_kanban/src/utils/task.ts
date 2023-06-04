import { Importance } from 'src/app/kanban/enums/importance.enum';
import { TaskComplexity } from 'src/app/kanban/enums/task-complexity.enum';
import { Urgency } from 'src/app/kanban/enums/urgency.enum';
import { Task } from 'src/app/models/task.model';
import {
  importanceCoefficients,
  taskComplexityCoefficients,
  urgencyCoefficients,
} from 'src/data/coefficients';
import { getDifferenceInDays } from './date';
import { TaskStatus } from 'src/app/kanban/enums/task-status.enum';

export const countCoeffiicient = (task: Task): number => {
  if (task.do_before && task.do_before.status !== TaskStatus.DONE) {
    return 0.1
  }
  let dateDiff
  if (task.deadline) {
    dateDiff = getDifferenceInDays(
      new Date(),
      new Date(task.deadline as Date)
    );
  } else {
    dateDiff = 0
  }
  const coeff =
    urgencyCoefficients[
      Object.values(Urgency).indexOf(task.urgency as Urgency)
    ] +
    taskComplexityCoefficients[
      Object.values(TaskComplexity).indexOf(task.complexity as TaskComplexity)
    ] +
    importanceCoefficients[
      Object.values(Importance).indexOf(task.importance as Importance)
    ] 
    
    console.log(coeff + " " + task.title + " d " + dateDiff);
    
    return coeff
};

export const addCoefficientToTask = (allTasks: Task[]) => {
  const coefficients = allTasks.map(task => countCoeffiicient(task))
  const max = Math.max(...coefficients)
  const newCoefficients = coefficients.map(x => x / max)
  allTasks.forEach((task, i) => {
    task.coefficient = newCoefficients[i]
  })
}

export const filterTasks = (tasks: Task[]) => {
  console.log(tasks);
  
  tasks.sort((a, b) => {
    if (a.coefficient && b.coefficient) {
      if (a.coefficient > b.coefficient) return -1
      if (a.coefficient < b.coefficient) return 1
    }
    return 0
  })
  console.log(tasks);
  
}