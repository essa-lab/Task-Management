export interface Task {
  id: number;
  title: string;
  description: string;
  tasks? : SubTasks[];
  status_id:number;
  doneSubTasks: number;
  totalSubTasks: number;
}
export interface SubTasks {
  id?: number;
  title: string;
  is_done?: boolean;
  
  doneSubTasks?: number;
  totalSubTasks?: number;
}

export interface Column {
  id?: number;
  title: string;
  tasks?: Task[];
}

export interface Board {
  id: number;
  title: string;
  columns?: Column[];
}