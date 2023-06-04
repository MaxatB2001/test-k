import { TaskSchema } from "src/schemas/task.schema";

export const sortByPosition = (a: TaskSchema, b: TaskSchema) => {
    if (a.position < b.position) return -1
    if (a.position > b.position) return 1
    return 0
}