import { Task } from "src/tasks/tasks.model";

export class Column{
    id:number;
    board_id:number;
    title:string;
    tasks?:Task[]
}