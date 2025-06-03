// import { columns } from "@prisma/client";
import { Column } from "src/columns/columns.model";

export class Boards{
    id:number;
    title:string;
    columns?:Column[]
}