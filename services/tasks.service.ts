
import type { Task } from "@/types/task";
import { api } from "./api";


export const getTasks = async (): Promise<Task[]> => {
    const { data } = await api.get("/tasks");
    return data;
};

export const updateTaskStatus = async (
    taskId: string,
    isDone: boolean
): Promise<Task> => {
    const { data } = await api.patch<Task>(
        `/tasks/${taskId}/status`,
        { isDone }
    );
    return data;
};
export const createTask = async (
    payload: { name: string; date: string }
): Promise<Task> => {
    const { data } = await api.post<Task>("/tasks", payload);
    return data;
};