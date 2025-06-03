import { SubTask } from "./sub_tasks/sub_tasks.model";

export class Task{
    id:number;
    status_id:number;
    title:string;
    description:string;

    subtasks?:SubTask[];
    

}