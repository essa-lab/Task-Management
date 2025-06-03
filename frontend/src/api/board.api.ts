import api from './axios';
import { Column } from '../app/types';

export const fetchBoards = async () => {
  const { data } = await api.get('/boards');
  return data;
};

export const fetchBoardData = async (boardId: number = 1) => {
  const { data } = await api.get(`/boards/${boardId}`);
  return data;
};

export const createBoard = async (data: { title: string; column: Column[] }) => {
  const response = await api.post('/boards', {
    title: data.title,
    columns: data.column,
  });
  return response.data;
};

export const updateBoard = async ({
  boardId,
  data,
}: {
  boardId: number;
  data: { title: string; column: Column[] };
}) => {
  const response = await api.put(`/boards/${boardId}`, {
    title: data.title,
    columns: data.column,
  });
  return response.data;
};

export const deleteBoard = async (boardId: number) => {
  const { data } = await api.delete(`/boards/${boardId}`);
  return data;
};

export const addColumn = async ({
  boardId,
  data,
}: {
  boardId: number;
  data: { title: string };
}) => {
  const response = await api.post(`/boards/${boardId}/columns`, {
    title: data.title,
  });
  return response.data;
};
