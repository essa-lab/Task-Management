import api from './axios';
import { SubTasks } from '../app/types';

export const addTask = async (data: {
  description: string;
  status_id: number;
  title: string;
  subTasks: SubTasks[];
}) => {
  const response = await api.post('/tasks', {
    description: data.description,
    status_id: data.status_id,
    title: data.title,
    sub_tasks: data.subTasks,
  });
  return response.data;
};

export const updateTask = async ({
  taskId,
  data,
}: {
  taskId: number;
  data: {
    description: string;
    status_id: number;
    title: string;
    subTasks: SubTasks[];
  };
}) => {
  const response = await api.put(`/tasks/${taskId}`, {
    description: data.description,
    status_id: data.status_id,
    title: data.title,
    sub_tasks: data.subTasks,
  });
  return response.data;
};

export const deleteTask = async (taskId: number | undefined) => {
  const { data } = await api.delete(`/tasks/${taskId}`);
  return data;
};

export const updateTaskStatus = async ({
  taskId,
  statusId,
}: {
  taskId: number;
  statusId: number;
}) => {
  const response = await api.put(`/tasks-status/${taskId}`, {
    status_id: statusId,
  });

  return response.data;
};

export const toggleSubtaskStatus = async ({
  subtaskId,
  isDone,
}: {
  subtaskId: number|undefined;
  isDone: boolean;
}) => {
  const response = await api.put(`/sub-tasks-status/${subtaskId}`, {
    is_done: isDone,
  });

  return response.data;
};