import axios from "axios"
import type { Task } from '@/types/task';

export const getTasks = async (): Promise<Task[]> => {
    const { data } = await axios.get<Task[]>('/api/tasks');
    return data;
}

export const updateTasksStatus = async (taskId: string, isDone: boolean): Promise<Task> => {
    const { data } = await axios.patch<Task>(`/api/tasks/${taskId}/status`,
        { isDone }
    );
    return data;
};