import { Task } from "src/app/models/task.model";

export class DateHelper {
  static format(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('ru', {
      month: 'long',
      day: 'numeric',
    });
  }

  // static sortByDate(date1: Task, date2: Task) {
  //   return new Date(date1.deadline) - new Date(date2.deadline)
  // }
}

export const getDifferenceInDays = (date1: Date, date2: Date): number => {
  if (date1.getMonth() - date2.getMonth() < 0) return 0
  
  const differenceInTime = date2.getTime() - date1.getTime()
  return Math.abs(Math.ceil(differenceInTime / (1000 * 3600 * 24)))
}